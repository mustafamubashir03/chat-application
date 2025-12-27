import mongoose, { ObjectId } from 'mongoose';

export interface MessageI extends Document {
  messageBody: string;
  image?: string;
  channelId: ObjectId;
  workspaceId: ObjectId;
  senderId: ObjectId;
}

const messageSchema = new mongoose.Schema({
  messageBody: {
    type: String,
    required: [true, 'message body is required']
  },
  image: {
    type: String
  },
  channelId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Channel',
    required: [true, 'Channel id is required']
  },
  workspaceId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Workspace'
  },
  senderId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: [true, 'Sender id is required']
  }
},{
  timestamps:true
});

const Message = mongoose.model<MessageI>('Message', messageSchema);
export default Message;
