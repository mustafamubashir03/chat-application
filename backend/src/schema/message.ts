import mongoose, { ObjectId } from 'mongoose';

export interface MessageI extends Document {
  messageBody: string;
  image?: string;
  audio?: string;
  messageType: 'text' | 'audio' | 'image' | 'file';
  mediaUrl?: string | null;
  mediaPublicId?: string | null;
  mediaMimeType?: string | null;
  mediaDuration?: number | null;
  channelId: string;
  workspaceId: ObjectId;
  senderId: ObjectId;
}

const messageSchema = new mongoose.Schema(
  {
    messageBody: {
      type: String,
      default: ''
    },
    image: {
      type: String
    },
    audio: {
      type: String
    },
    messageType: {
      type: String,
      enum: ['text', 'audio', 'image', 'file'],
      default: 'text'
    },
    mediaUrl: {
      type: String,
      default: null
    },
    mediaPublicId: {
      type: String,
      default: null
    },
    mediaMimeType: {
      type: String,
      default: null
    },
    mediaDuration: {
      type: Number,
      default: null
    },
    channelId: {
      type: String,
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
  },
  {
    timestamps: true
  }
);

messageSchema.pre<import('mongoose').HydratedDocument<MessageI>>(
  'validate',
  function (next) {
    const isMedia = ['audio', 'image', 'file'].includes(this.messageType);
    if (isMedia && !this.mediaUrl) {
      next(
        new Error(
          `mediaUrl is required for ${this.messageType} messages`
        )
      );
      return;
    }
    if (
      this.mediaDuration !== null &&
      this.mediaDuration !== undefined &&
      (Number.isNaN(Number(this.mediaDuration)) || Number(this.mediaDuration) < 0)
    ) {
      next(new Error('mediaDuration must be a non-negative number'));
      return;
    }
    next();
  }
);

const Message = mongoose.model<MessageI>('Message', messageSchema);

export default Message;
