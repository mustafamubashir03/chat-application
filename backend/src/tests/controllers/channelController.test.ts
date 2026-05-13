// @ts-nocheck

import { jest } from '@jest/globals';
import { StatusCodes } from 'http-status-codes';


await jest.unstable_mockModule("../../services/channelService.js", () => ({
    getChannelByIdService: jest.fn(),
    getChannelWithWorkspaceDetailsService: jest.fn()
}));

// Now import the controller and the mocked service
const { getChannelByIdController, getChannelWithWorkspaceDetailsController } = await import("../../controllers/channelController.js");
const channelService = await import("../../services/channelService.js");

describe("channelController", () => {
    let mockReq: any;
    let mockRes: any;

    beforeEach(() => {
        mockReq = {
            params: { channelId: "507f1f77bcf86cd799439011" },
            user: "507f1f77bcf86cd799439012"
        };
        mockRes = {
            status: jest.fn().mockReturnThis(),
            json: jest.fn().mockReturnThis()
        };
        jest.clearAllMocks();
    });

    test("getChannelByIdController should return channel and 200 status", async () => {
        const mockChannel = { _id: mockReq.params.channelId, name: "test-channel" };
        (channelService.getChannelByIdService as jest.Mock).mockResolvedValue(mockChannel);

        await getChannelByIdController(mockReq, mockRes);

        expect(mockRes.status).toHaveBeenCalledWith(StatusCodes.OK);
        expect(mockRes.json).toHaveBeenCalledWith(mockChannel);
    });

    test("getChannelByIdController should handle errors", async () => {
        const error = { statusCode: StatusCodes.NOT_FOUND, message: "Not found" };
        (channelService.getChannelByIdService as jest.Mock).mockRejectedValue(error);

        await getChannelByIdController(mockReq, mockRes);

        expect(mockRes.status).toHaveBeenCalledWith(StatusCodes.NOT_FOUND);
    });

    test("getChannelWithWorkspaceDetailsController should return channel details and 200 status", async () => {
        const mockChannelDetails = { _id: mockReq.params.channelId, name: "test-channel", workspaceId: {} };
        (channelService.getChannelWithWorkspaceDetailsService as jest.Mock).mockResolvedValue(mockChannelDetails);

        await getChannelWithWorkspaceDetailsController(mockReq, mockRes);

        expect(mockRes.status).toHaveBeenCalledWith(StatusCodes.OK);
        expect(mockRes.json).toHaveBeenCalledWith(mockChannelDetails);
    });

    test("getChannelWithWorkspaceDetailsController should handle errors", async () => {
        const error = { statusCode: StatusCodes.UNAUTHORIZED, message: "Unauthorized" };
        (channelService.getChannelWithWorkspaceDetailsService as jest.Mock).mockRejectedValue(error);

        await getChannelWithWorkspaceDetailsController(mockReq, mockRes);

        expect(mockRes.status).toHaveBeenCalledWith(StatusCodes.UNAUTHORIZED);
    });
});
