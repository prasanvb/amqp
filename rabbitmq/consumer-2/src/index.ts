import { AMQPClient, AMQPMessage } from "@cloudamqp/amqp-client";
import { rabbitMq } from "./config";

//step 1: Connect to the rabbitmq server
//step 2: Create a new channel on that connection
//step 3: Create the exchange
//step 4: Publish the message to the exchange with a routing

export const createChannel = async () => {
  try {
    const connection = new AMQPClient(rabbitMq.url);
    await connection.connect();
    const channel = await connection.channel();
    await channel.exchangeDeclare(rabbitMq.exchangeName, "direct");

    const q = await channel.queueDeclare("infoQueue");

    channel.queueBind(q.name, rabbitMq.exchangeName, "info");

    console.log("✅ Connection over Channel established");

    await channel.basicConsume(q.name, { noAck: false }, (msg: AMQPMessage) => {
      console.log(msg?.bodyString());
      msg.ack();
    });

    // eslint-disable-next-line @typescript-eslint/no-explicit-any
  } catch (e: any) {
    console.error("ERROR", e);
  }
};

createChannel();
