import express from 'express';
import { createWorkspaceController } from '../../controllers/workspaceController';
import { validator } from '../../middlewares/validator';
import { isAuthenticated } from '../../middlewares/isAuthenticated';
import { createWorkspaceSchema } from '@itz____mmm/common';
const router = express.Router();

router.post(
  '/workspace',
  isAuthenticated,
  validator(createWorkspaceSchema),
  createWorkspaceController
);
