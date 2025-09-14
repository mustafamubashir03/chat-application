
import { Socket } from "socket.io";
import { JOIN_CHANNEL } from "../utils/eventConstant";

export default function messageHandlers(io:any,socket:Socket){
    socket.on(JOIN_CHANNEL, async function joinChannelHandler(data,cb){
        const roomId = data.channelId
        console.log(`${socket.id} has joined channel: ${roomId}`)
        socket.join(roomId);
        cb({
            success:true,
            message:"Successfully joined the channel",
            data:roomId
        })
    })

}