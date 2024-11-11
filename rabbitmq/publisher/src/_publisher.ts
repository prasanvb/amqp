import { AMQPClient, AMQPChannel } from '@cloudamqp/amqp-client';
import { config } from './config';

export const createChannel = async () => {
  try {
    const connection = new AMQPClient(config.rabbitMQ.url);
    await connection.connect();
    const channel = await connection.channel();
    await channel.exchangeDeclare(config.rabbitMQ.exchangeName, 'direct');

    console.log(
      '✅ Connection over Channel established, Exchange declared and Queue created',
    );

    return channel;
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
  } catch (e: any) {
    console.error('ERROR', e);
    e.connection.close();
    setTimeout(createChannel, 5000); // will try to reconnect in 5s
    return undefined;
  }
};

export const publishMessage = async (
  ch: AMQPChannel,
  routingKey: string,
  message: string,
) => {
  const sanitizedMessage = Buffer.from(
    JSON.stringify({
      logType: routingKey,
      message: message,
      timeStamp: new Date(),
    }),
  );

  if (ch) {
    await ch.basicPublish(
      config.rabbitMQ.exchangeName,
      routingKey,
      sanitizedMessage,
    );
  }

  console.log(
    `ExchangeName: ${config.rabbitMQ.exchangeName}, QueueName: ${routingKey}, Message: ${message}`,
  );
};

// NOTE: Can used for debugging
// setInterval(() => {
//   publishMessage('info', `pubMsg ${new Date().toLocaleString()}`);
// }, 3000);
