import crudRepository from './crudRepository';
import Message from '../schema/message';

const messageRepository = {
  ...crudRepository<any>(Message),
  getPaginatedMessages: async (
    messageParams: any,
    page: number,
    limit: number
  ) => {
    try {
      const messages = await Message.find(messageParams)
        .sort({ createdAt: -1 })
        .skip((page - 1) * limit)
        .limit(limit)
        .populate('senderId', 'username email avatar');
      return messages;
    } catch (error) {}
  }
};

export default messageRepository;
