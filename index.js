import express from 'express';
import dotenv from 'dotenv';
import * as Knex from 'knex';
import axios from 'axios';

import initApp from './src/utils/initApp';
import initRouter from './src/utils/initRouter';
import RabbitMqFacade from './src/model/rabbitmqFacade';
import KnexConfig from './knexfile';


//RABBIT_MQ_HOST=rabbitmq
//"start": "nodemon --exec \"babel-node\" index.js"
// "start": "nodemon --exec \"npm run migrate && babel-node\" index.js",
// "start": "nodemon -L index.js --exec \"babel-node\" index.js"

dotenv.config();
const app = express();
const NODE_ENV = process.env.NODE_ENV || 'development';
const PORT = process.env.PORT || 3001;

const dbConfig = KnexConfig[NODE_ENV];
const knexInstance = Knex.knex(dbConfig);

// ==================================init app
initApp(app);
initRouter(app);


// ==================================consume notification.fcm
const rabbitMqFacade = new RabbitMqFacade();
rabbitMqFacade.consume(
    "topic", 
    "notification_fcm", 
    "notification_fcm", 
    "notification.fcm", 
    async message => {
        const msg = JSON.parse(message);
        
        if (msg !== null) {
            let allFieldValid = true;
            const fieldValidate = ["identifier", "type", "deviceId", "text"];
            fieldValidate.forEach(el => {
                if (allFieldValid && !msg.hasOwnProperty(el) || typeof msg[el] !== "string") {
                    allFieldValid = false;
                }
            });

            if (!allFieldValid) return;

            // ==================================send firebase notification
            try {
                const fcmResponse = await axios({
                    url: "https://fcm.googleapis.com/fcm/send",
                    method: "post",
                    data: JSON.stringify({
                        to: "",
                        data: { title: "Incoming message", body: "text" }
                    }),
                    headers: {
                        "Content-Type": "application/json",
                        Authorization: `key=${process.env.FIREBASE_TOKEN}`
                    }
                })

                if (fcmResponse.status === 200) {
                    console.log('[FCM https status]==================================: ', fcmResponse.status);

                    // ==================================store data to database
                    let recordId = -1;
                    try {
                        recordId = await knexInstance.insert({ identifier: "fcm-msg-a1beff5ac" }).into('fcm_job');
                    } catch (err) {
                        console.error("[Database] insert record error: ==================================", err);
                    }
    
                    const q = await knexInstance.select("*").from("fcm_job").where("id", recordId);
                    const dbData = q[0];
    
                    // ==================================publish notification.done
                    if (dbData) {
                        const messageDone = { identifier: dbData.identifier, deliverAt: dbData.deliverAt };
                        const publishDoneMqFacade = new RabbitMqFacade();
                        publishDoneMqFacade.publish("topic", "notification_done", "notification.done", JSON.stringify(messageDone));
                    }
                } else {
                    throw new Error("[Firebase]: Can not publish notification!");
                }

            } catch (err) {
                console.log('[FCM Consume Error]========================================', err);
            }
        }
    }
);

app.listen(PORT, () => {
    console.log(`listening on port ${PORT}`);
});
