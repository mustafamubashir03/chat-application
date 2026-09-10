import mongoose from 'mongoose';
import crudRepository from './crudRepository.js';
import Message from '../schema/message.js';

const messageRepository = {
  ...crudRepository<any>(Message),
  getPaginatedMessages: async (
    messageParams: any,
    page: number,
    limit: number
  ) => {
    try {
      // `channelId` was historically stored as a BSON ObjectId (old schema) and is
      // now stored as a String. Match BOTH forms so previously sent messages are
      // still returned after the schema change.
      const query: any = { ...messageParams };
      const rawChannelId = messageParams?.channelId
        ? String(messageParams.channelId)
        : undefined;
      if (rawChannelId) {
        delete query.channelId;
        query.$or = [{ channelId: rawChannelId }];
        if (mongoose.Types.ObjectId.isValid(rawChannelId)) {
          query.$or.push({
            channelId: new mongoose.Types.ObjectId(rawChannelId)
          });
        }
      }

      const messages = await Message.find(query)
        .sort({ createdAt: 1 })
        .skip((page - 1) * limit)
        .limit(limit)
        .populate('senderId', 'username email avatar');

      return messages;
    } catch (error) {
      console.log(error);
      throw error; // Re-throw the error so it can be handled by the calling code
    }
  }
};

export default messageRepository;
