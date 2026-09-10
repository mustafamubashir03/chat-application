import express from 'express';
import {
  createMeetingInvitationController,
  getMeetingInvitationByTokenController
} from '../../controllers/meetingController.js';
import { isAuthenticated } from '../../middlewares/isAuthenticated.js';

const meetingRouter = express.Router();

meetingRouter.post('/invite', isAuthenticated, createMeetingInvitationController);
meetingRouter.get('/:token', isAuthenticated, getMeetingInvitationByTokenController);

export default meetingRouter;