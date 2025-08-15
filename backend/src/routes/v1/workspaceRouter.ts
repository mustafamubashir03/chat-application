import express from 'express';
import {
  addChannelToWorkspaceController,
  addMemberToWorkspaceController,
  createWorkspaceController,
  deleteWorkspaceController,
  getWokspaceByJoinCodeController,
  getWorkspaceByIdController,
  getWorkspacesUserisMemberOfController,
  updateWorkspaceController
} from '../../controllers/workspaceController';
import { validator } from '../../middlewares/validator';
import { isAuthenticated } from '../../middlewares/isAuthenticated';
import { createWorkspaceSchema } from '@itz____mmm/common';

const router = express.Router();

router.post(
  '/',
  isAuthenticated,
  validator(createWorkspaceSchema),
  createWorkspaceController
);

router.get('/', isAuthenticated, getWorkspacesUserisMemberOfController);
router.get('/:workspaceId', isAuthenticated, getWorkspaceByIdController);
router.get('/join/:joinCode', isAuthenticated, getWokspaceByJoinCodeController);
router.put('/:workspaceId', isAuthenticated, updateWorkspaceController);
router.post(
  '/:workspaceId/members',
  isAuthenticated,
  addMemberToWorkspaceController
);
router.post(
  '/:workspaceId/channels',
  isAuthenticated,
  addChannelToWorkspaceController
);
router.delete('/:workspaceId', isAuthenticated, deleteWorkspaceController);

export default router;
