import { AMQPClient, AMQPMessage } from "@cloudamqp/amqp-client";
import { config } from "../../config";

export const createChannel = async () => {
  try {
    const connection = new AMQPClient(config.rabbitMQ.url);
    await connection.connect();
    const channel = await connection.channel();
    await channel.exchangeDeclare(config.rabbitMQ.exchangeName, "direct");

    const q = await channel.queueDeclare("infoQueue");

    channel.queueBind(q.name, config.rabbitMQ.exchangeName, "info");

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
