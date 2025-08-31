import express from 'express';

import userRouter from './userRouter';
import workspaceRouter from './workspaceRouter';
import channelRouter from './channelRouter';
const router = express.Router();

router.use('/user', userRouter);
router.use('/workspace', workspaceRouter);
router.use('/channel', channelRouter);

export default router;
