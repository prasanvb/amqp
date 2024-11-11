export const config = {
  rabbitMQ: {
    url: "amqp://localhost",
    cloudUrl: "amqps://texrbwqc:1ZsnVcNUr5Ivwk2EcJ0Bc13rO0B1A3xj@jackal.rmq.cloudamqp.com/texrbwqc",
    exchangeName: "logExchange",
    infoBindingKey: "info",
    infoQueueName: "InfoQueue",
    warningAndErrorQueueName: "WarningAndErrorsQueue",
    warningBindingKey: "warning",
    errorBindingKey: "error",
  },
};
