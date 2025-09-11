import { Server } from "http";
import { createMessageService } from "../services/messageService";
import { NEW_MESSAGE_EVENT } from "../utils/eventConstant";
import { Socket } from "socket.io";


export default function messageHandlers(io:Server,socket:Socket){
    socket.on(NEW_MESSAGE_EVENT,createMessageHandler)
}

async function createMessageHandler(data:any, cb:any){
    const messageResponse = await createMessageService(data);
    cb({
        success:true,
        message:"Successfully created the message",
        data:messageResponse
    })

}
