import express from 'express';

import userRouter from './userRouter';
import workspaceRouter from './workspaceRouter';
const router = express.Router();

router.use('/user', userRouter);
router.use('/workspace', workspaceRouter);

export default router;
