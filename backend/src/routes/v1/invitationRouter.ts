import express from 'express';
import {
  acceptInvitationController,
  createInvitationController,
  getInvitationByTokenController
} from '../../controllers/invitationController.js';
import { isAuthenticated } from '../../middlewares/isAuthenticated.js';

const invitationRouter = express.Router();

invitationRouter.post('/', isAuthenticated, createInvitationController);
invitationRouter.get('/:token', isAuthenticated, getInvitationByTokenController);
invitationRouter.post('/:token/accept', isAuthenticated, acceptInvitationController);

export default invitationRouter;
