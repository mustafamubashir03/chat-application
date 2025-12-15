import express from 'express';
import {
  addChannelToWorkspaceController,
  addMemberToWorkspaceController,
  createWorkspaceController,
  deleteWorkspaceController,
  getWokspaceByJoinCodeController,
  getWorkspaceByIdController,
  getWorkspacesUserisMemberOfController,
  joinWorkspaceController,
  resetJoinCodeController,
  updateWorkspaceController
} from '../../controllers/workspaceController';
import { validator } from '../../middlewares/validator';
import { isAuthenticated } from '../../middlewares/isAuthenticated';
import {
  addChannelToWorkspaceSchema,
  addMemberToWorkspaceSchema,
  createWorkspaceSchema,
  updateWorkspaceSchema
} from '@itz____mmm/common';

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
router.put(
  '/:workspaceId',
  isAuthenticated,
  validator(updateWorkspaceSchema),
  updateWorkspaceController
);
router.put(
  '/:workspaceId/joinCode/reset',
  isAuthenticated,
  resetJoinCodeController
);
router.post(
  '/:workspaceId/members',
  isAuthenticated,
  validator(addMemberToWorkspaceSchema),
  addMemberToWorkspaceController
);
router.post('/:workspaceId/join', isAuthenticated, joinWorkspaceController);
router.post(
  '/:workspaceId/channels',
  isAuthenticated,
  validator(addChannelToWorkspaceSchema),
  addChannelToWorkspaceController
);
router.delete('/:workspaceId', isAuthenticated, deleteWorkspaceController);

export default router;
