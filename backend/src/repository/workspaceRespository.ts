import mongoose from 'mongoose';
import Workspace from '../schema/workspace';
import crudRepository from './crudRepository';
import User from '../schema/user';
import { ClientError } from '../utils/ObjectResponse';
import { StatusCodes } from 'http-status-codes';
import channelRepository from './channelRepository';

const workspaceRepository = {
  ...crudRepository<any>(Workspace),
  getWorkspaceByname: async (name: string) => {
    const workspace = await Workspace.findOne({ name });
    if (!workspace) {
      throw new ClientError({
        message: 'Workspace does not exist',
        explanation: 'No such workspace exist',
        status: StatusCodes.NOT_FOUND
      });
    }
    return workspace;
  },
  getWorkspaceWithChannelDetails: async (id: mongoose.Types.ObjectId) => {
    const workspace = await Workspace.findById(id).populate('channels').populate({path:"members.memberId",select:"username email avatar"});
    if (!workspace) {
      throw new ClientError({
        message: 'Workspace does not exist',
        explanation: 'No such workspace exist',
        status: StatusCodes.NOT_FOUND
      });
    }
    return workspace;
  },
  getWokspaceByJoinCode: async (joinCode: string) => {
    const workspace = await Workspace.findOne({ joinCode });
    if (!workspace) {
      throw new ClientError({
        message: 'Workspace does not exist',
        explanation: 'No such workspace exist',
        status: StatusCodes.NOT_FOUND
      });
    }
    return workspace;
  },
  addMemberToWorkspace: async (
    memberId: mongoose.Types.ObjectId,
    workspaceId: mongoose.Types.ObjectId,
    role: string
  ) => {
    const workspace = await Workspace.findById(workspaceId);
    if (!workspace) {
      throw new ClientError({
        message: 'Invalid data from client',
        explanation: 'No such workspace exist',
        status: StatusCodes.NOT_FOUND
      });
    }

    const isValidUser = await User.findById(memberId);
    if (!isValidUser) {
      throw new ClientError({
        message: 'Invalid data from client',
        explanation: 'User is not present',
        status: StatusCodes.NOT_FOUND
      });
    }
    const isMemberAlreadyPresent = workspace.members.find(
      (member) => member.memberId === memberId
    );
    if (isMemberAlreadyPresent) {
      throw new ClientError({
        message: 'Invalid data from client',
        explanation: 'Member is already present',
        status: StatusCodes.FORBIDDEN
      });
    }
    workspace.members.push({ memberId, role });
    await workspace.save();
    return workspace;
  },
  addChannelToWorkspace: async (
    workspaceId: mongoose.Types.ObjectId,
    channelName: string
  ) => {
    const workspace =
      await Workspace.findById(workspaceId).populate('channels');
    if (!workspace) {
      throw new ClientError({
        message: 'Invalid data from client',
        explanation: 'No such workspace exist',
        status: StatusCodes.NOT_FOUND
      });
    }
    const channelAlreadyPresent = workspace.channels.find(
      //@ts-ignore
      (channel) => channel.name === channelName
    );
    if (channelAlreadyPresent) {
      throw new ClientError({
        message: 'Invalid data from client',
        explanation: 'Channel already present',
        status: StatusCodes.NOT_FOUND
      });
    }
    const channel = await channelRepository.createDoc({
      name: channelName,
      workspaceId
    });
    workspace.channels.push(channel);
    await workspace.save();
    return workspace;
  },
  fetchAllWorkspacesByMemberId: async (id: mongoose.Types.ObjectId) => {
    const workspaces = Workspace.find({ 'members.memberId': id }).populate(
      'members.memberId',
      'username email avatar'
    );
    return workspaces;
  }
};

export default workspaceRepository;
