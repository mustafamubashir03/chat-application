import express, { Express } from 'express';

import connectDB from './config/dbConfig';
import { PORT } from './config/serverConfig';
import apiRouter from './routes/apiRouter';
import { transporter } from './config/mailConfig';

const app: Express = express();

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.use('/api', apiRouter);

app.listen(PORT, async () => {
  console.log('Server has been started at ', PORT);
  connectDB();
});
