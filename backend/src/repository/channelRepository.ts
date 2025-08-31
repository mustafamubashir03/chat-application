import mongoose from 'mongoose';
import Channel from '../schema/channel';
import crudRepository from './crudRepository';

const channelRepository = {
  ...crudRepository<any>(Channel),
  getChannelWithWorkspaceDetails: async function (
    channelId: mongoose.Types.ObjectId
  ) {
    const channel = await Channel.findById(channelId).populate('workspaceId');
    return channel;
  }
};

export default channelRepository;
