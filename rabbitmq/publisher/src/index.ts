import express, { Request, Response } from 'express';
import dotenv from 'dotenv';
import { Producer } from './publisher';

dotenv.config();
const port = process.env.PORT ?? 3030;

const createApp = async () => {
  const app = express();
  // Global middlewares
  // express.json is built-in middleware function that parses incoming request bodies containing JSON payloads and makes the parsed data available under req body.
  app.use(express.json());

  const p = new Producer();

  app.get('/', (_req: Request, res: Response) => {
    res.send('Welcome to RabbitMQ amqp-client project!');
  });

  app.post('/log', async (req: Request, res: Response) => {
    const { logType, message } = req.body;
    await p.publishMessage(logType, message);
    res.send('Posted log message');
  });

  app.listen(port, () => {
    console.log(`Server running at http://localhost:${port}`);
  });
};

createApp();
