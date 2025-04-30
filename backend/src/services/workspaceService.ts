import workspaceRepository from '../repository/workspaceRespository';
import { v4 as uuidv4 } from 'uuid';

export const createWorkspaceService = async (workspaceData: any) => {
  const joinCode = uuidv4().substring(0, 6);
  const response = await workspaceRepository.createDoc({
    name: workspaceData.name,
    descripion: workspaceData.descripion,
    joinCode
  });
  await workspaceRepository.addMemberToWorkspace(
    workspaceData.owner,
    response._id,
    'admin'
  );
  const channelAddedWorkspace = await workspaceRepository.addChannelToWorkspace(
    response._id,
    'general'
  );
  return channelAddedWorkspace;
};
