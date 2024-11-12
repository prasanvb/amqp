# Rabbitmq

- Install and run rabbitmq using docker
  `docker run -it --rm --name rabbitmq -p 5672:5672 -p 15672:15672 rabbitmq:4.0-management`
- Access rabbitmq management `http://localhost:15672/#/`
  - username/password - `guest`

## amqplib

- Exchange Name, Routing key, binding key patterns are case sensitive
- [publisher file](rabbitmq/publisher/src/publisher.ts)
- [consumer file](rabbitmq/info-consumer/src/consumer.ts)
- 3 Microservices created with a separate connection, separate channel

  - 1 exchange created
  - 2 consumer queues created
  - 3 binding keys created

- Acknowledgement

  - `{ noAck: false }` - An ack(nowledgement) is sent back by the consumer to tell RabbitMQ that a particular message has been received, processed and that RabbitMQ is free to delete it. A configurable timeout (30 minutes by default) is enforced on consumer delivery acknowledgement.
  - `channel.ack(msg)` send a proper acknowledgment, once we're done with a task.

- Durability

  - If a message is not acknowledged it still persists in the queue even if you restart the queue
  - `{durable: true}` we need to make sure that the queue will survive a RabbitMQ node restart. In order to do so, we need to declare it as durable
  - To mark our messages as persistent on the producer by using the `persistent` option
    `channel.sendToQueue(queue, Buffer.from(msg), {persistent: true})`

- Message dispatch

  - We can have 2 consumers instances consuming messages from the same queue. Then by default, RabbitMQ will send each message to the next consumer, in sequence. On average every consumer will get the same number of messages. This way of distributing messages is called round-robin algorithm.
  - Fair dispatch: RabbitMQ just dispatches a message when the message enters the queue in round-robin fashion. It doesn't look at the number of unacknowledged messages for a consumer. It just blindly dispatches every n-th message to the n-th consumer.
  - `channel.prefetch(1)` RabbitMQ don't dispatch a new message to a worker until it has processed and acknowledged the previous one. Instead, it will dispatch it to the next worker that is not still busy. NOTE: If all the workers are busy, your queue can fill up. You will want to keep an eye on that, and maybe add more workers, or have some other strategy.

- RabbitMQ queue size

  - `x-max-length`: This setting limits the maximum number of messages in the queue. When the limit is reached, the oldest messages are discarded to make room for new ones, depending on the configured overflow strategy.

  ```javascript
  channel.assertQueue("myQueue", { "x-max-length": 1000 });
  ```

  - `x-max-length-bytes`: This option limits the total size of all messages in a queue in bytes. Similar to x-max-length, older messages are removed once the size limit is reached.
  - Memory and Disk Alarms: RabbitMQ has built-in memory and disk alarms that can pause message ingress to prevent memory overflow if resources are low.
  - Message TTL (Time to Live): You can set a TTL for messages to automatically remove them after a certain amount of time, which indirectly limits queue growth.

## cloudamqp/amqp-client

- [amqp-client example](rabbitmq/publisher/src/_publisher.ts)
