import { createBullBoard } from '@bull-board/api';
import { BullAdapter } from '@bull-board/api/bullAdapter';
import { ExpressAdapter } from '@bull-board/express';
import express, { Express } from 'express';
import connectDB from './config/dbConfig';
import { PORT } from './config/serverConfig';
import apiRouter from './routes/apiRouter';
import { mailQueue } from './queues/mailQueue';

const app: Express = express();
const serverAdapter = new ExpressAdapter();
createBullBoard({
  queues: [new BullAdapter(mailQueue)],
  serverAdapter
});
app.use('/ui', serverAdapter.getRouter());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.use('/api', apiRouter);

app.listen(PORT, async () => {
  console.log('Server has been started at ', PORT);
  connectDB();
});
