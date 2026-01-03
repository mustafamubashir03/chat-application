import { createBullBoard } from '@bull-board/api';
import { BullAdapter } from '@bull-board/api/bullAdapter';
import { ExpressAdapter } from '@bull-board/express';
import cors from 'cors';
import express, { Express } from 'express';
import connectDB from './config/dbConfig';
import { PORT } from './config/serverConfig';
import apiRouter from './routes/apiRouter';
import { mailQueue } from './queues/mailQueue';
import { createServer } from 'http';
import { Server } from 'socket.io';
import MessageSocketHandler from './controllers/messageSocketController';
import ChannelSocketHandler from './controllers/channelSocketController';
import { verifyEmailController } from './controllers/workspaceController';

const app: Express = express();
const server = createServer(app);
const io = new Server(server, {
  cors: {
    origin: '*',
    methods: ['GET', 'POST', 'PUT', 'DELETE'],
    credentials: true
  }
});

const serverAdapter = new ExpressAdapter();
createBullBoard({
  queues: [new BullAdapter(mailQueue)],
  serverAdapter
});
app.use(cors());
app.use('/ui', serverAdapter.getRouter());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.use('/api', apiRouter);
app.get('/health', (_req, res) => {
  res.status(200).json({ status: 'ok' });
});
app.get('/verify/:token', verifyEmailController);

io.on('connection', (socket) => {
  console.log('client connected :', socket.id);
  MessageSocketHandler(io, socket);
  ChannelSocketHandler(io, socket);
});

server.listen(PORT, async () => {
  console.log('Server has been started at ', PORT);
  connectDB();
});
