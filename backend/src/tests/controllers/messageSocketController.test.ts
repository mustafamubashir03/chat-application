// @ts-nocheck

import { jest } from '@jest/globals';
import mongoose from 'mongoose';

const authorId = new mongoose.Types.ObjectId();
const messageId = new mongoose.Types.ObjectId();

const createMessageService = jest.fn(async (input) => ({ _id: messageId, ...input }));
const findByIdMock = jest.fn();

await jest.unstable_mockModule('../../services/messageService.js', () => ({
  createMessageService
}));
await jest.unstable_mockModule('../../schema/message.js', () => ({
  default: { findById: findByIdMock }
}));

const messageHandlers = (await import('../../controllers/messageSocketController.js')).default;
const { createMessageService: serviceMock } = await import('../../services/messageService.js');

const makeSocket = () => {
  const handlers = {};
  return {
    on: (event, handler) => {
      handlers[event] = handler;
    },
    handlers
  };
};

const makeIo = () => {
  const emit = jest.fn();
  return { to: jest.fn(() => ({ emit })) };
};

const populatedDoc = {
  _id: messageId,
  messageBody: 'hello',
  image: 'https://res.cloudinary.com/demo/img.png',
  messageType: 'image',
  channelId: 'room-1',
  senderId: { _id: authorId, username: 'alice', email: 'a@b.com' }
};

describe('messageSocketController (newMessage)', () => {
  beforeEach(() => {
    jest.clearAllMocks();
    findByIdMock.mockReturnValue({
      populate: jest.fn(async () => populatedDoc)
    });
  });

  test('persists payload, broadcasts populated doc to the room, and acks success', async () => {
    const socket = makeSocket();
    const io = makeIo();
    await messageHandlers(io, socket);

    const cb = jest.fn();
    const payload = {
      channelId: 'room-1',
      senderId: authorId.toString(),
      messageBody: 'hello',
      image: 'https://res.cloudinary.com/demo/img.png'
    };

    await socket.handlers['newMessage'](payload, cb);

    expect(serviceMock).toHaveBeenCalledWith(payload);
    expect(io.to).toHaveBeenCalledWith('room-1');
    expect(io.to('room-1').emit).toHaveBeenCalledWith('newMessageRecieved', populatedDoc);
    expect(cb).toHaveBeenCalledWith(
      expect.objectContaining({ success: true, message: 'Successfully created the message' })
    );
  });

  test('carries media metadata (audio) untouched into the service', async () => {
    const socket = makeSocket();
    const io = makeIo();
    await messageHandlers(io, socket);

    const cb = jest.fn();
    const payload = {
      channelId: 'room-1',
      senderId: authorId.toString(),
      messageBody: '',
      messageType: 'audio',
      mediaUrl: 'https://res.cloudinary.com/demo/a.mp3',
      mediaPublicId: 'voice/abc',
      mediaMimeType: 'audio/webm',
      mediaDuration: 3.5
    };

    await socket.handlers['newMessage'](payload, cb);

    expect(serviceMock).toHaveBeenCalledWith(payload);
    expect(cb).toHaveBeenCalledWith(expect.objectContaining({ success: true }));
  });

  test('rejects an invalid senderId without creating or broadcasting', async () => {
    const socket = makeSocket();
    const io = makeIo();
    await messageHandlers(io, socket);

    const cb = jest.fn();
    await socket.handlers['newMessage']({ channelId: 'room-1', senderId: 'not-an-object-id' }, cb);

    expect(serviceMock).not.toHaveBeenCalled();
    expect(io.to).not.toHaveBeenCalled();
    expect(cb).toHaveBeenCalledWith({ success: false, message: 'Invalid sender id', data: null });
  });

  test('acks failure and does not broadcast when the store throws', async () => {
    serviceMock.mockRejectedValueOnce(new Error('db down'));

    const socket = makeSocket();
    const io = makeIo();
    await messageHandlers(io, socket);

    const cb = jest.fn();
    await socket.handlers['newMessage'](
      { channelId: 'room-1', senderId: authorId.toString(), messageBody: 'x' },
      cb
    );

    expect(io.to).not.toHaveBeenCalled();
    expect(cb).toHaveBeenCalledWith({ success: false, message: 'db down', data: null });
  });
});