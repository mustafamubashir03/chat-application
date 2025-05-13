"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.updateWorkspaceSchema = exports.createWorkspaceSchema = exports.userSchemaSignInZod = exports.userSchemaSignUpZod = exports.userSchemaOptionalZod = exports.userSchemaReqZod = void 0;
const zod_1 = __importDefault(require("zod"));
exports.userSchemaReqZod = zod_1.default.object({
    username: zod_1.default.string(),
    password: zod_1.default.string(),
    email: zod_1.default.string().email()
});
exports.userSchemaOptionalZod = zod_1.default.object({
    username: zod_1.default.string().optional(),
    password: zod_1.default.string().optional(),
    email: zod_1.default.string().email().optional(),
    avatar: zod_1.default.string().optional()
});
exports.userSchemaSignUpZod = exports.userSchemaReqZod;
exports.userSchemaSignInZod = zod_1.default.object({
    password: zod_1.default.string(),
    email: zod_1.default.string().email(),
});
exports.createWorkspaceSchema = zod_1.default.object({
    name: zod_1.default.string()
});
exports.updateWorkspaceSchema = exports.createWorkspaceSchema;
