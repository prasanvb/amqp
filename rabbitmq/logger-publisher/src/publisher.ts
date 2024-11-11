import { config } from '../../config';
import amqp from 'amqplib';

//step 1 : Connect to the rabbitmq server
//step 2 : Create a new channel on that connection
//step 3 : Create the exchange
//step 4 : Publish the message to the exchange with a routing key

const exchangeName = config.rabbitMQ.exchangeName;

export class Producer {
  channel: amqp.Channel | undefined;

  async createChannel() {
    const connection = await amqp.connect(config.rabbitMQ.url);
    this.channel = await connection.createChannel();
    console.log(
      '✅ Connection over Channel established - logger-publisher-microservice',
    );
  }

  async publishMessage(routingKey: string, message: string) {
    const logDetails = {
      logType: routingKey,
      message: message,
      dateTime: new Date(),
    };

    if (!this.channel) {
      await this.createChannel();
    }

    if (this.channel) {
      await this.channel.assertExchange(exchangeName, 'direct');
      await this.channel.publish(
        exchangeName,
        routingKey,
        Buffer.from(JSON.stringify(logDetails)),
      );

      console.log(
        `ExchangeName: ${exchangeName}, QueueName: ${routingKey}, Message: ${message}`,
      );
    }
  }
}

// NOTE: Can used for debugging

// const p = new Producer();
// setInterval(() => {
//   p.publishMessage('info', `pubMsg ${new Date().toLocaleString()}`);
// }, 3000);
