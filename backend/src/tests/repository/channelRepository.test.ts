// @ts-nocheck

import { jest } from '@jest/globals';
import mongoose from 'mongoose';


await jest.unstable_mockModule("../../schema/channel.js", () => ({
    default: {
        create: jest.fn(),
        findById: jest.fn(),
        find: jest.fn(),
        findByIdAndUpdate: jest.fn(),
        findByIdAndDelete: jest.fn()
    }
}));


const Channel = (await import("../../schema/channel.js")).default;
const channelRepository = (await import("../../repository/channelRepository.js")).default;

describe("channelRepository", () => {

    test("should create a new channel", async () => {
        const workspaceId = new mongoose.Types.ObjectId();
        const data = {
            name: "workspace",
            workspaceId: workspaceId.toString()
        };
        const mockChannel = {
            ...data,
            _id: new mongoose.Types.ObjectId()
        };

        jest.mocked(Channel.create).mockResolvedValue(mockChannel as any);

        const result = await channelRepository.createDoc(data as any);

        expect(result.name).toBe(data.name);
    });

    test("should get channels with workspace details", async () => {
        const channelId = new mongoose.Types.ObjectId();
        const mockData = {
            _id: channelId,
            workspaceId: { name: "workspace-name" }
        };

        jest.mocked(Channel.findById).mockReturnValue({
            populate: jest.fn().mockResolvedValue(mockData)
        } as any);

        const result = await channelRepository.getChannelWithWorkspaceDetails(channelId);

        expect(result?.workspaceId?.name).toBe("workspace-name");
    });

    test("should get channel by id", async () => {
        const channelId = new mongoose.Types.ObjectId();
        jest.mocked(Channel.findById).mockResolvedValue({ _id: channelId } as any);

        const result = await channelRepository.getDocById(channelId);

        expect(result?._id).toBe(channelId);
    });

    test("should get all channels", async () => {
        jest.mocked(Channel.find).mockResolvedValue([{ name: "ch1" }] as any);

        const result = await channelRepository.getDocs();

        expect(result.length).toBe(1);
    });

    test("should update channel", async () => {
        const channelId = new mongoose.Types.ObjectId();
        const updateData = { name: "updated" };

        jest.mocked(Channel.findByIdAndUpdate).mockResolvedValue({ _id: channelId, ...updateData } as any);

        const result = await channelRepository.updateDoc(channelId, updateData);

        expect(result?.name).toBe("updated");
    });

    test("should delete channel", async () => {
        const channelId = new mongoose.Types.ObjectId();
        jest.mocked(Channel.findByIdAndDelete).mockResolvedValue({ _id: channelId } as any);

        const result = await channelRepository.deleteDoc(channelId);

        expect(result?._id).toBe(channelId);
    });
});