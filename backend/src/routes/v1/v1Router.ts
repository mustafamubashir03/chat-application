import express from 'express';

import userRouter from './userRouter';
import workspaceRouter from './workspaceRouter';
import channelRouter from './channelRouter';
import memberRouter from './memberRouter';
import messageRouter from './messageRouter';
const router = express.Router();

router.use('/user', userRouter);
router.use('/workspace', workspaceRouter);
router.use('/channel', channelRouter);
router.use('/member', memberRouter);
router.use('/messages', messageRouter);

export default router;
