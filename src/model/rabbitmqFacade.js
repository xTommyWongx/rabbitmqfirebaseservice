import RabbitMq from "./rabbitmq";

class RabbitMqFacade {
    rabbitMq = new RabbitMq();

    async publish(type, exchange, key = "", message) {
        await this.rabbitMq.createConnection();
        await this.rabbitMq.createChannel();
        await this.rabbitMq.assertExchange(type, exchange);
        await this.rabbitMq.publish(exchange, key, message);
        await this.rabbitMq.closeConnection();
    }

    async consume(type, exchange, queue, key, callback) {
        key = key || "";
        this.rabbitMq.setConsumerCallback(callback);
        await this.rabbitMq.createConnection();
        await this.rabbitMq.createChannel();
        await this.rabbitMq.assertExchange(type, exchange);
        await this.rabbitMq.assertAndBindQueue(exchange, queue, key);
    }
}

export default RabbitMqFacade;