import express from 'express';

import userRouter from './userRouter';
import workspaceRouter from './workspaceRouter';
import channelRouter from './channelRouter';
import memberRouter from './memberRouter';
const router = express.Router();

router.use('/user', userRouter);
router.use('/workspace', workspaceRouter);
router.use('/channel', channelRouter);
router.use('/member', memberRouter);

export default router;
