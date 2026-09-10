// @ts-nocheck

import { jest } from '@jest/globals';
import mongoose from 'mongoose';

const messages = [
  { _id: new mongoose.Types.ObjectId(), messageBody: 'first' },
  { _id: new mongoose.Types.ObjectId(), messageBody: 'second' }
];

const getMessageService = jest.fn(async () => messages);

await jest.unstable_mockModule('../../services/messageService.js', () => ({
  getMessageService
}));

const { getMessagesController } = await import('../../controllers/messageController.js');

const makeRes = () => {
  const state = { statusCode: null, body: null };
  return {
    state,
    status: (code) => ({
      json: (body) => {
        state.statusCode = code;
        state.body = body;
      }
    }),
    json: (body) => {
      state.body = body;
    }
  };
};

describe('getMessagesController (history read)', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  test('returns the stored messages array with default page 1 / limit 60', async () => {
    const req = { params: { channelId: '507f1f77bcf86cd799439011' }, query: {} };
    const res = makeRes();

    await getMessagesController(req, res);

    expect(res.state.body).toBe(messages);
    expect(getMessageService).toHaveBeenCalledWith(
      { channelId: '507f1f77bcf86cd799439011' },
      1,
      60
    );
  });

  test('coerces page=0 to page 1 (matches repository (page-1)*limit formula)', async () => {
    const req = { params: { channelId: 'abc' }, query: { page: '0' } };
    const res = makeRes();

    await getMessagesController(req, res);

    expect(getMessageService).toHaveBeenCalledWith({ channelId: 'abc' }, 1, 60);
    expect(res.state.statusCode).toBe(200);
  });

  test('passes through explicit page and limit', async () => {
    const req = { params: { channelId: 'abc' }, query: { page: '2', limit: '25' } };
    const res = makeRes();

    await getMessagesController(req, res);

    expect(getMessageService).toHaveBeenCalledWith({ channelId: 'abc' }, 2, 25);
  });

  test('maps a Mongoose cast error to 400', async () => {
    getMessageService.mockRejectedValueOnce(
      new mongoose.Error.CastError('ObjectId', 'nope', 'channelId')
    );
    const req = { params: { channelId: 'nope' }, query: {} };
    const res = makeRes();

    await getMessagesController(req, res);

    expect(res.state.statusCode).toBe(400);
  });

  test('maps an error carrying statusCode to that status', async () => {
    const WithStatus = class extends Error {
      statusCode;
      constructor(...args) {
        super(...args);
        this.statusCode = 403;
      }
    };
    getMessageService.mockRejectedValueOnce(new WithStatus('Forbidden'));
    const req = { params: { channelId: 'abc' }, query: {} };
    const res = makeRes();

    await getMessagesController(req, res);

    expect(res.state.statusCode).toBe(403);
  });
});