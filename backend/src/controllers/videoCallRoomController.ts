import { Server, Socket } from 'socket.io';
import { GET_USERS, JOIN_VIDEO_CALL, USER_JOINED } from '../utils/eventConstant.js';

interface JoinParams {
  roomId: string;
  peerId: string;
}


// In-memory room store (OK for now)
const rooms: Record<string,Set<string>> = {};



export const videoCallRoomHandler = (io: Server, socket: Socket) => {
  const createRoom = (data:JoinParams, cb?:any)=>{
    const roomId = String(data.roomId)
    const peerId = String(data.peerId)
    if(!rooms[roomId]){
      rooms[roomId] = new Set()
    }
    rooms[roomId].add(peerId)
    socket.join(roomId);
    console.log(rooms)
    socket.data.roomId = roomId
    socket.data.peerId = peerId
    socket.emit("room-created",roomId, Array.from(rooms[roomId]))
    console.log("room created with roomId",roomId)
    cb?.(
      {
        success:true,
        message:"Room has been created",
        data:roomId
      }
    )

  }
  const joinedRoom = (data:JoinParams)=>{
    const roomId = String(data.roomId);
    const peerId = String(data.peerId);
    if(!rooms[roomId]){
      return
    }
    rooms[roomId].add(peerId)
    socket.join(roomId)
    console.log("New user has joined room",roomId,"with peer Id",peerId)
    socket.data.roomId = roomId
    socket.data.peerId = peerId
    console.log("joinedRoom called",rooms,roomId,peerId)
    socket.emit(GET_USERS,{
      roomId,
      participants: Array.from(rooms[roomId])
    })   
  }
  socket.on("create-room",createRoom)
  socket.on("joined-room",joinedRoom)
  socket.on("ready",(data:JoinParams)=>{
    const roomId = data.roomId
    const peerId = data.peerId
    if (socket.data.roomId !== roomId) return

    socket.to(roomId).emit(USER_JOINED, { peerId })
  })
 socket.on('disconnect',()=>{
  const {roomId, peerId} = socket.data as {roomId?:string, peerId?:string}
  if (!roomId || !peerId) return
  const room = rooms[roomId]
  if (!room) return
  room.delete(peerId)
  socket.to(roomId).emit("user-left",{peerId})
  console.log("peer left: ", peerId)
 })
}
