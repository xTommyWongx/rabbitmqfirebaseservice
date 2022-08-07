import { Router } from 'express';
import { responseJsonHandler, errorHandler } from '../utils/handlers';
import RabbitMqFacade from '../model/rabbitmqFacade';

export default class NotificationRouter {
    constructor (rabbitMqFacade) {
        this.rabbitMqFacade = rabbitMqFacade;
    }

    router () {
        const router = Router();
        router.get('/fcm', this.traggerNotificationFcm);
        return router;
    }

    traggerNotificationFcm = async (req, res, next) => {
        try {
            const message = {
                identifier: "fcm-msg-a1beff5ac",
                type: "device",
                deviceId: "deviceId",
                text: "Notification message"
            };
            const stringify = JSON.stringify(message);
            const rabbitMqFacade = new RabbitMqFacade();
            await rabbitMqFacade.publish("topic", "notification_fcm", "notification.fcm", stringify);

            return res
                .status(200)
                .json(responseJsonHandler(true, 'success'));
        } catch (err) {
            return next(errorHandler(500, err.message));
        }
    };
}
