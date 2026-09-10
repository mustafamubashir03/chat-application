// @ts-nocheck

import { jest } from '@jest/globals';
import mongoose from 'mongoose';

const findMock = jest.fn();
findMock.mockReturnValue({
  sort: jest.fn().mockReturnThis(),
  skip: jest.fn().mockReturnThis(),
  limit: jest.fn().mockReturnThis(),
  populate: jest.fn().mockResolvedValue([])
});

await jest.unstable_mockModule('../../schema/message.js', () => ({
  default: {
    find: findMock
  }
}));

const Message = (await import('../../schema/message.js')).default;
const messageRepository = (await import('../../repository/messageRepository.js')).default;

describe('messageRepository.getPaginatedMessages', () => {
  const HEX = '507f1f77bcf86cd799439011';

  beforeEach(() => {
    findMock.mockClear();
  });

  test('matches BOTH legacy ObjectId and new string channel ids', async () => {
    await messageRepository.getPaginatedMessages({ channelId: HEX }, 1, 50);

    const filter = findMock.mock.calls[0][0];
    expect(filter.channelId).toBeUndefined();
    expect(filter.$or).toHaveLength(2);
    expect(filter.$or[0]).toEqual({ channelId: HEX });
    expect(filter.$or[1].channelId).toBeInstanceOf(mongoose.Types.ObjectId);
    expect(filter.$or[1].channelId.toString()).toBe(HEX);
  });

  test('matches only the raw string for DM-style (non ObjectId) ids', async () => {
    await messageRepository.getPaginatedMessages({ channelId: 'abc_def' }, 1, 50);

    const filter = findMock.mock.calls[0][0];
    expect(filter.$or).toHaveLength(1);
    expect(filter.$or[0]).toEqual({ channelId: 'abc_def' });
  });

  test('preserves other filters and passes pagination', async () => {
    const workspaceId = new mongoose.Types.ObjectId();
    await messageRepository.getPaginatedMessages({ channelId: HEX, workspaceId }, 2, 25);

    const filter = findMock.mock.calls[0][0];
    expect(filter.workspaceId).toEqual(workspaceId);
    expect(filter.$or).toHaveLength(2);
  });

  test('returns the populated result from the chain', async () => {
    const docs = [{ _id: new mongoose.Types.ObjectId(), messageBody: 'hello' }];
    findMock.mockReturnValueOnce({
      sort: jest.fn().mockReturnThis(),
      skip: jest.fn().mockReturnThis(),
      limit: jest.fn().mockReturnThis(),
      populate: jest.fn().mockResolvedValue(docs)
    });

    const result = await messageRepository.getPaginatedMessages({ channelId: HEX }, 1, 10);
    expect(result).toEqual(docs);
  });
});