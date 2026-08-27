import crypto from 'crypto';
import mongoose from 'mongoose';
import { StatusCodes } from 'http-status-codes';
import Invitation from '../schema/invitation.js';
import workspaceRepository from '../repository/workspaceRespository.js';
import userRepository from '../repository/userRepository.js';
import { ClientError } from '../utils/ObjectResponse.js';
import { isUserPartOfWorkspace } from './workspaceService.js';

const hashToken = (rawToken: string): string => {
  return crypto.createHash('sha256').update(rawToken).digest('hex');
};

export const createInvitationService = async (
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
      explanation: 'Only workspace members can create invitations',
      status: StatusCodes.UNAUTHORIZED
    });
  }

  const token = crypto.randomBytes(24).toString('hex');
  const tokenHash = hashToken(token);
  const expiresAt = new Date(Date.now() + 48 * 60 * 60 * 1000); // 48 hours

  await Invitation.create({
    token,
    tokenHash,
    workspaceId,
    createdBy: userId,
    expiresAt
  });

  return { token, workspaceId, expiresAt };
};

export const getInvitationByTokenService = async (token: string) => {
  const tokenHash = hashToken(token);
  let invitation = await Invitation.findOne({ tokenHash })
    .populate('workspaceId', 'name description members')
    .populate('createdBy', 'username avatar email');

  if (!invitation) {
    // Fallback query for legacy unhashed tokens
    invitation = await Invitation.findOne({ token })
      .populate('workspaceId', 'name description members')
      .populate('createdBy', 'username avatar email');
  }

  if (!invitation) {
    throw new ClientError({
      message: 'Invitation not found',
      explanation: 'The invitation link is invalid',
      status: StatusCodes.NOT_FOUND
    });
  }

  const isExpired = new Date() > invitation.expiresAt;
  return {
    invitation,
    isValid: !isExpired,
    isExpired,
    isUsed: invitation.isUsed
  };
};

export const acceptInvitationService = async (
  token: string,
  userId: mongoose.Types.ObjectId
) => {
  const tokenHash = hashToken(token);
  let invitation = await Invitation.findOne({ tokenHash });
  if (!invitation) {
    invitation = await Invitation.findOne({ token });
  }

  if (!invitation) {
    throw new ClientError({
      message: 'Invitation not found',
      explanation: 'The invitation link is invalid',
      status: StatusCodes.NOT_FOUND
    });
  }

  if (new Date() > invitation.expiresAt) {
    throw new ClientError({
      message: 'Invitation expired',
      explanation: 'This invitation link has expired',
      status: StatusCodes.BAD_REQUEST
    });
  }

  const isValidUser = await userRepository.getDocById(userId);
  if (!isValidUser) {
    throw new ClientError({
      message: 'User not found',
      explanation: 'No valid user found',
      status: StatusCodes.NOT_FOUND
    });
  }

  const workspace = await workspaceRepository.getDocById(invitation.workspaceId);
  if (!workspace) {
    throw new ClientError({
      message: 'Workspace not found',
      explanation: 'Associated workspace no longer exists',
      status: StatusCodes.NOT_FOUND
    });
  }

  // Idempotent member addition
  const isAlreadyMember = isUserPartOfWorkspace(userId, workspace);
  let updatedWorkspace = workspace;
  if (!isAlreadyMember) {
    updatedWorkspace = await workspaceRepository.addMemberToWorkspace(
      userId,
      invitation.workspaceId,
      'member'
    );
  }

  invitation.isUsed = true;
  invitation.usedBy = userId;
  await invitation.save();

  return updatedWorkspace;
};
