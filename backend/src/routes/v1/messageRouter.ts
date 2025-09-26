import express from 'express';

import { getMessagesController } from '../../controllers/messageController';
import { isAuthenticated } from '../../middlewares/isAuthenticated';

const router = express.Router();

router.get('/:channelId', isAuthenticated, getMessagesController);

export default router;
