import express, { Request, Response } from 'express';
import dotenv from 'dotenv';
import { createChannel, publishMessage } from './publisher';

dotenv.config();

const app = express();
const port = process.env.PORT ?? 3030;

// Global middlewares
// express.json is built-in middleware function that parses incoming request bodies containing JSON payloads and makes the parsed data available under req body.
app.use(express.json());

const createApp = async () => {
  try {
    const ch = await createChannel();

    if (ch) {
      app.get('/', (_req: Request, res: Response) => {
        res.send('Welcome to RabbitMQ amqp-client project!');
      });

      app.post('/log', async (req: Request, res: Response) => {
        const { logType, message } = req.body;
        await publishMessage(ch, logType, message);
        res.send('Posted log message');
      });

      app.listen(port, () => {
        console.log(`Server running at http://localhost:${port}`);
      });
    } else {
      console.log('Unable establish connection and create channel');
    }
  } catch (e) {
    console.log(e);
  }
};

createApp();
