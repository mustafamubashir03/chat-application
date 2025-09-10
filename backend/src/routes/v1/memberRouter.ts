import express from 'express';

import { isMemberPartOfWorkspaceController } from '../../controllers/memberController';
import { isAuthenticated } from '../../middlewares/isAuthenticated';

const router = express.Router();

router.get(
  '/workspace/:workspaceId',
  isAuthenticated,
  isMemberPartOfWorkspaceController
);

export default router;
