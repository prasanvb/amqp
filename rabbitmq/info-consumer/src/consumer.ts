import amqp from "amqplib";
import { config } from "./config";

//step 1 : Connect to the rabbitmq server
//step 2 : Create a new channel
//step 3 : Create the exchange
//step 4 : Create the queue
//step 5 : Bind the queue to the exchange
//step 6 : Consume messages from the queue

const exchangeName = config.rabbitMQ.exchangeName;

async function consumeMessages() {
  const connection = await amqp.connect(config.rabbitMQ.url);
  const channel = await connection.createChannel();

  console.log("✅ Connection over Channel established - Consumer");

  await channel.assertExchange(exchangeName, "direct");

  const q = await channel.assertQueue("InfoQueue");

  await channel.bindQueue(q.queue, exchangeName, "Info");

  channel.consume(q.queue, (msg) => {
    if (msg) {
      const data = JSON.parse(msg.content.toString());
      console.log(data);
      channel.ack(msg);
    }
  });
}

consumeMessages();
