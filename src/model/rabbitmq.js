import dotenv from 'dotenv';
import amqp from 'amqplib';

dotenv.config();

const RABBIT_MQ_HOST = process.env.RABBIT_MQ_HOST;
const RABBIT_MQ_PORT = process.env.RABBIT_MQ_PORT;
const RABBIT_MQ_USERNAME = process.env.RABBIT_MQ_USERNAME;
const RABBIT_MQ_PASSWORD = process.env.RABBIT_MQ_PASSWORD;

class RabbitMq {
    connection = null;
    channel = null;
    consumerCallback = null

    async createConnection() {
        this.connection = await amqp.connect(`amqp://${RABBIT_MQ_USERNAME}:${RABBIT_MQ_PASSWORD}@${RABBIT_MQ_HOST}:${RABBIT_MQ_PORT}`);
        this.connection.on("error", err => {
            console.error("amqp connection error", err);
            this.connection = null;
            this.channel = null;
            throw err;
        });
        this.connection.on("close", err => {
            console.log("amqp connection close");
            this.connection = null;
            this.channel = null;
        });
    }

    async closeConnection() {
        if (this.connection !== null) {
            if (this.channel !== null) await this.closeChannel();
            await this.connection.close();
            this.connection = null;
        }
    }

    async createChannel() {
        if (this.connection === null) {
            throw new Error("amqp connection error");
        }
        
        if (this.channel === null) {
            this.channel = await this.connection.createChannel();
        }

        this.channel.on("error", err => {
            console.error("amqp channel error", err);
            this.channel = null;
            throw err;
        });

        this.channel.on("close", err => {
            console.log("amqp channel closed");
            this.channel = null;
        });
    }

    async closeChannel() {
        if(this.channel !== null) {
            await this.channel.close();
            this.channel = null;
        }
    }

    async assertExchange(type, exchange) {
        if (this.connection === null || this.channel === null) {
            throw new Error("amqp assertExchange error");
        }
        await this.channel.assertExchange(exchange, type, {
            durable: false
        });
    }

    async assertAndBindQueue(exchange, queue, key = "") {
        console.log('key ==========', key);
        console.log('queue ==========', queue);
        if (this.connection === null || this.channel === null) {
            throw new Error("amqp assertAndBindQueue error");
        }

        await this.channel.assertQueue(queue, { autoDelete: true });
        await this.channel.bindQueue(queue, exchange, key);
        await this.channel.consume("", msg => {
            if (msg !== null) {
                const message = msg.content.toString();
                console.log(`[Consumer]==================================Exchange: ${exchange}, queue: ${queue}, message: ${message}`);
                if (this.consumerCallback) this.consumerCallback(message);
                this.channel.ack(msg);
            }
        });
    }

    async publish(exchange, key, message) {
        if (this.connection === null || this.channel === null) {
            throw new Error("amqp publish error");
        }
        const publishReturn = await this.channel.publish(exchange, key, Buffer.from(message));
        console.log(`[Publish]==================================Message: ${message}, Success:" ${publishReturn}`);
    }

    async setConsumerCallback(cb) {
        this.consumerCallback = cb
    }
}

export default RabbitMq;