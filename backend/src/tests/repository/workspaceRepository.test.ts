// @ts-nocheck
import { jest } from '@jest/globals';
import mongoose from 'mongoose';

// Mock schemas and dependent repositories using unstable_mockModule
await jest.unstable_mockModule("../../schema/workspace.js", () => ({
    default: {
        create: jest.fn(),
        findOne: jest.fn(),
        findById: jest.fn(),
        find: jest.fn()
    }
}));

await jest.unstable_mockModule("../../schema/user.js", () => ({
    default: {
        findById: jest.fn()
    }
}));

await jest.unstable_mockModule("../../repository/channelRepository.js", () => ({
    default: {
        createDoc: jest.fn()
    }
}));

// Dynamic imports
const Workspace = (await import("../../schema/workspace.js")).default;
const User = (await import("../../schema/user.js")).default;
const channelRepository = (await import("../../repository/channelRepository.js")).default;
const workspaceRepository = (await import("../../repository/workspaceRespository.js")).default;

describe("workspaceRepository", () => {
    afterEach(() => {
        jest.clearAllMocks();
    });

    test("should create a new workspace", async () => {
        const data = { name: "test-workspace", joinCode: "123456" };
        const mockWorkspace = { ...data, _id: new mongoose.Types.ObjectId() };
        
        jest.mocked(Workspace.create).mockResolvedValue(mockWorkspace as any);
        
        const result = await workspaceRepository.createDoc(data as any);
        
        expect(result.name).toBe(data.name);
    });

    test("should get workspace by name", async () => {
        const name = "test-workspace";
        const mockWorkspace = { name, _id: new mongoose.Types.ObjectId() };
        
        jest.mocked(Workspace.findOne).mockResolvedValue(mockWorkspace as any);
        
        const result = await workspaceRepository.getWorkspaceByname(name);
        
        expect(result.name).toBe(name);
    });

    test("should throw error if workspace by name not found", async () => {
        jest.mocked(Workspace.findOne).mockResolvedValue(null as any);
        
        await expect(workspaceRepository.getWorkspaceByname("non-existent"))
            .rejects.toThrow("Workspace does not exist");
    });

    test("should get workspace with channel details", async () => {
        const workspaceId = new mongoose.Types.ObjectId();
        const mockWorkspace = {
            _id: workspaceId,
            name: "test-workspace",
            channels: [{ name: "ch1" }],
            members: [{ memberId: { username: "user1" } }]
        };

        const populate2 = jest.fn().mockResolvedValue(mockWorkspace);
        const populate1 = jest.fn().mockReturnValue({ populate: populate2 });
        
        jest.mocked(Workspace.findById).mockReturnValue({ populate: populate1 } as any);

        const result = await workspaceRepository.getWorkspaceWithChannelDetails(workspaceId);

        expect(result._id).toBe(workspaceId);
    });

    test("should get workspace by join code", async () => {
        const joinCode = "123456";
        const mockWorkspace = { joinCode, _id: new mongoose.Types.ObjectId() };
        
        jest.mocked(Workspace.findOne).mockResolvedValue(mockWorkspace as any);
        
        const result = await workspaceRepository.getWokspaceByJoinCode(joinCode);
        
        expect(result.joinCode).toBe(joinCode);
    });

    test("should add member to workspace", async () => {
        const memberId = new mongoose.Types.ObjectId();
        const workspaceId = new mongoose.Types.ObjectId();
        const role = "member";
        
        const mockWorkspace = {
            _id: workspaceId,
            members: [],
            save: jest.fn().mockResolvedValue(true)
        };
        
        jest.mocked(Workspace.findById).mockResolvedValue(mockWorkspace as any);
        jest.mocked(User.findById).mockResolvedValue({ _id: memberId } as any);
        
        const result = await workspaceRepository.addMemberToWorkspace(memberId, workspaceId, role);
        
        expect(mockWorkspace.members).toContainEqual({ memberId, role });
        expect(result._id).toBe(workspaceId);
    });

    test("should throw error if adding duplicate member", async () => {
        const memberId = new mongoose.Types.ObjectId();
        const workspaceId = new mongoose.Types.ObjectId();
        
        const mockWorkspace = {
            _id: workspaceId,
            members: [{ memberId }]
        };
        
        jest.mocked(Workspace.findById).mockResolvedValue(mockWorkspace as any);
        jest.mocked(User.findById).mockResolvedValue({ _id: memberId } as any);
        
        await expect(workspaceRepository.addMemberToWorkspace(memberId, workspaceId, "member"))
            .rejects.toThrow("Invalid data from client");
    });

    test("should add channel to workspace", async () => {
        const workspaceId = new mongoose.Types.ObjectId();
        const channelName = "new-channel";
        const mockChannel = { _id: new mongoose.Types.ObjectId(), name: channelName };
        
        const mockWorkspace = {
            _id: workspaceId,
            channels: [],
            save: jest.fn().mockResolvedValue(true),
        };
        
        jest.mocked(Workspace.findById).mockReturnValue({
            populate: jest.fn().mockResolvedValue(mockWorkspace)
        } as any);
        
        jest.mocked(channelRepository.createDoc).mockResolvedValue(mockChannel as any);
        
        const result = await workspaceRepository.addChannelToWorkspace(workspaceId, channelName);
        
        expect(mockWorkspace.channels).toContain(mockChannel);
    });

    test("should fetch all workspaces by member id", async () => {
        const memberId = new mongoose.Types.ObjectId();
        const mockWorkspaces = [{ name: "ws1" }, { name: "ws2" }];
        
        jest.mocked(Workspace.find).mockReturnValue({
            populate: jest.fn().mockResolvedValue(mockWorkspaces)
        } as any);
        
        const result = await workspaceRepository.fetchAllWorkspacesByMemberId(memberId);
        
        expect(result).toEqual(mockWorkspaces);
    });
});
