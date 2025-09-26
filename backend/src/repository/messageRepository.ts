import crudRepository from './crudRepository';
import Message from '../schema/message';
import mongoose from 'mongoose';

const messageRepository = {
  ...crudRepository<any>(Message),
  getPaginatedMessages: async (
    messageParams: any,
    page: number,
    limit: number
  ) => {
    try {
      // Convert channelId to ObjectId if it's a string
      if (messageParams.channelId && typeof messageParams.channelId === 'string') {
        messageParams.channelId = new mongoose.Types.ObjectId(messageParams.channelId);
      }

      const messages = await Message.find(messageParams)
        .sort({ createdAt: -1 })
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
