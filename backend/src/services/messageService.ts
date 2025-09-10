import messageRepository from "../repository/messageRepository"


export const getMessageService = async(messageParams:any,page:number,limit:number)=>{
    const messages = await messageRepository.getPaginatedMessages(
        messageParams,
        page,
        limit
    )
    return messages
}