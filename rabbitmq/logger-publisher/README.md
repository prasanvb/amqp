# Rabbitmq

- Install and run rabbitmq using docker
  `docker run -it --rm --name rabbitmq -p 5672:5672 -p 15672:15672 rabbitmq:4.0-management`
  - `docker run` This command initiates the creation and running of a new container from a specified Docker image.
  - `-it`
    `-i` (interactive): Keeps standard input open, allowing you to interact with the container if necessary.
    `-t` (tty): Allocates a pseudo-TTY, which is useful for command-line interactions in the container.
    Together, -it makes it possible to interact with the RabbitMQ container’s command line if needed, which is helpful for troubleshooting.
  - `--rm` This flag tells Docker to automatically remove the container when it stops. This keeps your environment clean by preventing leftover containers.
  - `--name rabbitmq` This flag assigns the container a specific name—in this case, rabbitmq. This makes it easier to manage and refer to the container later, as opposed to using a randomly generated name.
  - `-p 5672:5672 -p 15672:15672`
    `-p 5672:5672` Maps the default RabbitMQ message broker port (5672) from the container to the host. This port is used by clients to send and receive messages from RabbitMQ.
    `-p 15672:15672` Maps the RabbitMQ Management UI port (15672) from the container to the host. The Management UI allows you to monitor and manage RabbitMQ through a web interface.
  - `rabbitmq:4.0-management`
    `rabbitmq` is the name of the Docker image. `4.0-management` is the image tag, which specifies a particular version (4.0) of RabbitMQ that includes the Management plugin. The management version includes the web-based management interface.
- Access rabbitmq management `http://localhost:15672/#/`
  - username/password - `guest`

## cloudamqp/amqp-client

- [example](rabbitmq/publisher/src/_publisher.ts)

## amqplib

- [example](rabbitmq/publisher/src/publisher.ts)
