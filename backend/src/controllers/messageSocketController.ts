
import { createMessageService } from "../services/messageService";
import { NEW_MESSAGE_EVENT, NEW_MESSAGE_RECIEVED_EVENT } from "../utils/eventConstant";
import { Socket } from "socket.io";


export default function messageHandlers(io:any,socket:Socket){
    socket.on(NEW_MESSAGE_EVENT,async function createMessageHandler(data:any, cb:any){
        const messageResponse = await createMessageService(data);
        const channelId = data.channelId
        // socket.broadcast.emit(NEW_MESSAGE_RECIEVED_EVENT,messageResponse)
        io.to(channelId).emit(NEW_MESSAGE_RECIEVED_EVENT,messageResponse)
        cb({
            success:true,
            message:"Successfully created the message",
            data:messageResponse
        })
    
    })
}


