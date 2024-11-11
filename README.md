# Rabbitmq

- Install and run rabbitmq using docker
  `docker run -it --rm --name rabbitmq -p 5672:5672 -p 15672:15672 rabbitmq:4.0-management`
- Access rabbitmq management `http://localhost:15672/#/`
  - username/password - `guest`

## cloudamqp/amqp-client

- [example](rabbitmq/publisher/src/_publisher.ts)

## amqplib

- Exchange Name, Routing key, binding key patterns are case sensitive
- [publisher file](rabbitmq/publisher/src/publisher.ts)
- [consumer file](rabbitmq/info-consumer/src/consumer.ts)
  - `channel.ack(msg)` When a message is acknowledged it is considered resolved and deleted from the queue
  - If a message is not acknowledged it still persists in the queue even if you restart the queue
- 3 Microservices created with a separate connection, separate channel
  - 1 exchange created
  - 2 consumer queues created
  - 3 binding keys created
