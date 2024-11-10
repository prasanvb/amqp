import { AMQPClient, AMQPChannel } from '@cloudamqp/amqp-client';
import { rabbitMq } from './config';

//step 1: Connect to the rabbitmq server
//step 2: Create a new channel on that connection
//step 3: Create the exchange
//step 4: Publish the message to the exchange with a routing

let ch: AMQPChannel | undefined;

const createChannel = async () => {
  try {
    const connection = new AMQPClient(rabbitMq.url);
    await connection.connect();
    const channel = await connection.channel();
    await channel.exchangeDeclare(rabbitMq.exchangeName, 'direct');
    await channel.queue(rabbitMq.infoQName, { durable: false });

    console.log(
      '[✅] Connection over channel established, exchange declared and queue created',
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

export const publishMessage = async (routingKey: string, message: string) => {
  if (!ch) {
    ch = await createChannel();
  }

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

setInterval(() => {
  publishMessage('info', `pubMsg ${new Date().toLocaleString()}`);
}, 3000);
