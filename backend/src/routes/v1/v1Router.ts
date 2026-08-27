import express from 'express';

import userRouter from './userRouter.js';
import workspaceRouter from './workspaceRouter.js';
import channelRouter from './channelRouter.js';
import memberRouter from './memberRouter.js';
import messageRouter from './messageRouter.js';
import invitationRouter from './invitationRouter.js';
const router = express.Router();

router.use('/user', userRouter);
router.use('/workspace', workspaceRouter);
router.use('/channel', channelRouter);
router.use('/member', memberRouter);
router.use('/messages', messageRouter);
router.use('/invitations', invitationRouter);

export default router;
