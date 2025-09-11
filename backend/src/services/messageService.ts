import messageRepository from '../repository/messageRepository';

export const getMessageService = async (
  messageParams: any,
  page: number,
  limit: number
) => {
  const messages = await messageRepository.getPaginatedMessages(
    messageParams,
    page,
    limit
  );
  return messages;
};


export const createMessageService = async(message:any)=>{
    const newMessage = await messageRepository.createDoc(message)
    return newMessage
}
