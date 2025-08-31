import express from 'express';
import { isAuthenticated } from '../../middlewares/isAuthenticated';
import {
  getChannelByIdController,
  getChannelWithWorkspaceDetailsController
} from '../../controllers/channelController';

const router = express.Router();

router.get('/:channelId', isAuthenticated, getChannelByIdController);
router.get(
  '/:channelId/workspaceDetails',
  isAuthenticated,
  getChannelWithWorkspaceDetailsController
);

export default router;
