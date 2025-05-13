import express from 'express';
import {
  createWorkspaceController,
  deleteWorkspaceController,
  getWorkspaceByIdController,
  getWorkspacesUserisMemberOfController
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
router.delete('/:workspaceId', isAuthenticated, deleteWorkspaceController);

export default router;
