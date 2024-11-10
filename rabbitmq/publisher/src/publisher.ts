import { AMQPClient, AMQPChannel } from '@cloudamqp/amqp-client';
import { rabbitMq } from './config';

//step 1: Connect to the rabbitmq server
//step 2: Create a new channel on that connection
//step 3: Create the exchange
//step 4: Publish the message to the exchange with a routing

export const createChannel = async () => {
  try {
    const connection = new AMQPClient(rabbitMq.url);
    await connection.connect();
    const channel = await connection.channel();
    await channel.exchangeDeclare(rabbitMq.exchangeName, 'direct');

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
    await ch.basicPublish(rabbitMq.exchangeName, routingKey, sanitizedMessage);
  }

  console.log(
    `ExchangeName: ${rabbitMq.exchangeName}, QueueName: ${routingKey}, Message: ${message}`,
  );
};

// NOTE: Can used for debugging
// setInterval(() => {
//   publishMessage('info', `pubMsg ${new Date().toLocaleString()}`);
// }, 3000);
