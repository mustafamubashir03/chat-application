// @ts-nocheck

import mongoose from 'mongoose';
import Message from '../../schema/message.js';

const base = {
  channelId: '507f1f77bcf86cd799439011',
  senderId: new mongoose.Types.ObjectId()
};

describe('message schema validation', () => {
  test('audio message without mediaUrl is rejected', async () => {
    const doc = new Message({ ...base, messageType: 'audio', messageBody: '' });
    await expect(doc.validate()).rejects.toThrow(/mediaUrl is required/);
  });

  test('audio message with mediaUrl validates', async () => {
    const doc = new Message({
      ...base,
      messageType: 'audio',
      mediaUrl: 'https://res.cloudinary.com/demo/audio.mp3',
      mediaDuration: 3.2
    });
    await expect(doc.validate()).resolves.toBeUndefined();
  });

  test('text message needs no mediaUrl', async () => {
    const doc = new Message({ ...base, messageType: 'text', messageBody: 'hi' });
    await expect(doc.validate()).resolves.toBeUndefined();
  });

  test('negative mediaDuration is rejected', async () => {
    const doc = new Message({
      ...base,
      messageType: 'audio',
      mediaUrl: 'https://res.cloudinary.com/demo/audio.mp3',
      mediaDuration: -1
    });
    await expect(doc.validate()).rejects.toThrow(/non-negative/);
  });

  test('legacy image-only message (no messageType) still validates', async () => {
    const doc = new Message({
      ...base,
      image: 'https://res.cloudinary.com/demo/photo.png'
    });
    await expect(doc.validate()).resolves.toBeUndefined();
  });
});