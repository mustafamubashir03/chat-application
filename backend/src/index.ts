import { createBullBoard } from '@bull-board/api';
import { BullAdapter } from '@bull-board/api/bullAdapter.js';
import { ExpressAdapter } from '@bull-board/express';
import cors from 'cors';
import express, { Express } from 'express';
import connectDB from './config/dbConfig.js';
import { PORT } from './config/serverConfig.js';
import apiRouter from './routes/apiRouter.js';
import { mailQueue } from './queues/mailQueue.js';
import { createServer } from 'http';
import { Server } from 'socket.io';
import MessageSocketHandler from './controllers/messageSocketController.js';
import ChannelSocketHandler from './controllers/channelSocketController.js';
import { verifyEmailController } from './controllers/workspaceController.js';
import { videoCallRoomHandler } from './controllers/videoCallRoomController.js';
import { ExpressPeerServer } from 'peer';

const app: Express = express();
const server = createServer(app);
const peerApp = express();
const peerHttpServer = createServer(peerApp);
// ---- Socket.IO ----
const io = new Server(server, {
  path: '/socket.io',
  cors: {
    origin: '*',
    methods: ['GET', 'POST', 'PUT', 'DELETE'],
    credentials: true
  }
});


// ---- Bull Board ----
const serverAdapter = new ExpressAdapter();
createBullBoard({
  queues: [new BullAdapter(mailQueue)],
  serverAdapter,
});
app.use('/ui', serverAdapter.getRouter());

// ---- Middlewares ----
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// ---- Routes ----
app.use('/api', apiRouter);
app.get('/health', (_req, res) => res.json({ status: 'ok' }));
app.get('/verify/:token', verifyEmailController);

// ---- Socket.IO handlers ----
io.on('connection', (socket) => {
  console.log('client connected :', socket.id);
  MessageSocketHandler(io, socket);
  ChannelSocketHandler(io, socket);
  videoCallRoomHandler(io, socket);
});

// ---- Start server ----

const peerServer = ExpressPeerServer(peerHttpServer, {
  path: '/peer',
  allow_discovery: true,
});

app.use('/peerjs', peerServer);

peerServer.on('connection', (client) => {
  console.log('🟢 Peer connected', client.getId());
});

peerServer.on('disconnect', (client) => {
  console.log('🔴 Peer disconnected', client.getId());
});

server.listen(PORT, async () => {
    console.log('🔥 Server running at', PORT);
    await connectDB();
  });


peerHttpServer.listen(3001, () => {
    console.log('🟢 PeerJS running on 3001');
  });