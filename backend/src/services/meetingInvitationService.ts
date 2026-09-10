import crypto from 'crypto';
import mongoose from 'mongoose';
import { StatusCodes } from 'http-status-codes';
import workspaceRepository from '../repository/workspaceRespository.js';
import { ClientError } from '../utils/ObjectResponse.js';
import { isUserPartOfWorkspace } from './workspaceService.js';
import { MEETING_INVITE_SECRET } from '../config/serverConfig.js';
import { getActiveMeetingByWorkspaceId } from '../controllers/videoCallRoomController.js';

const MEETING_INVITE_TTL_MS = 60 * 60 * 1000; // 1 hour

const signToken = (workspaceId: string): string => {
  const payload = {
    workspaceId,
    exp: Date.now() + MEETING_INVITE_TTL_MS
  };
  const base = Buffer.from(JSON.stringify(payload)).toString('base64url');
  const signature = crypto
    .createHmac('sha256', MEETING_INVITE_SECRET)
    .update(base)
    .digest('hex');
  return `${base}.${signature}`;
};

const verifyToken = (token: string): string | null => {
  const [base, signature] = token.split('.');
  if (!base || !signature) return null;

  const expected = crypto
    .createHmac('sha256', MEETING_INVITE_SECRET)
    .update(base)
    .digest('hex');

  const signatureMatches =
    expected.length === signature.length &&
    crypto.timingSafeEqual(Buffer.from(expected), Buffer.from(signature));

  if (!signatureMatches) return null;

  try {
    const payload = JSON.parse(Buffer.from(base, 'base64url').toString()) as {
      workspaceId?: string;
      exp?: number;
    };
    if (!payload.workspaceId || !payload.exp || Date.now() > payload.exp) return null;
    return payload.workspaceId;
  } catch {
    return null;
  }
};

const serializeMeeting = (meeting: any) =>
  meeting
    ? {
        ...meeting,
        participants: { ...meeting.participants }
      }
    : null;

export const createMeetingInvitationService = async (
  workspaceId: mongoose.Types.ObjectId,
  userId: mongoose.Types.ObjectId
) => {
  const workspace = await workspaceRepository.getDocById(workspaceId);
  if (!workspace) {
    throw new ClientError({
      message: 'Workspace not found',
      explanation: 'No workspace exists with the provided ID',
      status: StatusCodes.NOT_FOUND
    });
  }

  const isMember = isUserPartOfWorkspace(userId, workspace);
  if (!isMember) {
    throw new ClientError({
      message: 'Unauthorized',
      explanation: 'Only workspace members can invite others to a meeting',
      status: StatusCodes.UNAUTHORIZED
    });
  }

  const workspaceKey = workspaceId.toString();
  const meeting = getActiveMeetingByWorkspaceId(workspaceKey);
  if (!meeting) {
    throw new ClientError({
      message: 'No active meeting',
      explanation: 'There is no active meeting in this workspace right now',
      status: StatusCodes.BAD_REQUEST
    });
  }

  const token = signToken(workspaceKey);
  return {
    token,
    workspaceId: workspaceKey,
    meeting: serializeMeeting(meeting)
  };
};

export const getMeetingInvitationByTokenService = async (
  token: string,
  userId: mongoose.Types.ObjectId
) => {
  const workspaceId = verifyToken(token);
  if (!workspaceId || !mongoose.Types.ObjectId.isValid(workspaceId)) {
    throw new ClientError({
      message: 'Meeting invitation invalid',
      explanation: 'The meeting invite link is invalid or has expired',
      status: StatusCodes.BAD_REQUEST
    });
  }

  const workspace = await workspaceRepository.getDocById(
    new mongoose.Types.ObjectId(workspaceId)
  );
  if (!workspace) {
    throw new ClientError({
      message: 'Workspace not found',
      explanation: 'Associated workspace no longer exists',
      status: StatusCodes.NOT_FOUND
    });
  }

  const meeting = getActiveMeetingByWorkspaceId(workspaceId);

  return {
    workspaceId,
    workspaceName: workspace.name,
    isMember: !!isUserPartOfWorkspace(userId, workspace),
    isActiveMeeting: !!meeting,
    meeting: serializeMeeting(meeting),
    expiresAt: null
  };
};