import express from 'express';
import { isAuthenticated } from '../../middlewares/isAuthenticated.js';
import {
  getChannelByIdController,
  getChannelWithWorkspaceDetailsController
} from '../../controllers/channelController.js';

const router = express.Router();

router.get('/:channelId', isAuthenticated, getChannelByIdController);
router.get(
  '/:channelId/workspaceDetails',
  isAuthenticated,
  getChannelWithWorkspaceDetailsController
);

export default router;
