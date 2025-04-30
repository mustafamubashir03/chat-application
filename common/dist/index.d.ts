import z from "zod";
export declare const userSchemaReqZod: z.ZodObject<{
    username: z.ZodString;
    password: z.ZodString;
    email: z.ZodString;
}, "strip", z.ZodTypeAny, {
    username: string;
    password: string;
    email: string;
}, {
    username: string;
    password: string;
    email: string;
}>;
export declare const userSchemaOptionalZod: z.ZodObject<{
    username: z.ZodOptional<z.ZodString>;
    password: z.ZodOptional<z.ZodString>;
    email: z.ZodOptional<z.ZodString>;
    avatar: z.ZodOptional<z.ZodString>;
}, "strip", z.ZodTypeAny, {
    username?: string | undefined;
    password?: string | undefined;
    email?: string | undefined;
    avatar?: string | undefined;
}, {
    username?: string | undefined;
    password?: string | undefined;
    email?: string | undefined;
    avatar?: string | undefined;
}>;
export declare const userSchemaSignUpZod: z.ZodObject<{
    username: z.ZodString;
    password: z.ZodString;
    email: z.ZodString;
}, "strip", z.ZodTypeAny, {
    username: string;
    password: string;
    email: string;
}, {
    username: string;
    password: string;
    email: string;
}>;
export declare const userSchemaSignInZod: z.ZodObject<{
    password: z.ZodString;
    email: z.ZodString;
}, "strip", z.ZodTypeAny, {
    password: string;
    email: string;
}, {
    password: string;
    email: string;
}>;
export declare const createWorkspaceSchema: z.ZodObject<{
    name: z.ZodString;
}, "strip", z.ZodTypeAny, {
    name: string;
}, {
    name: string;
}>;
export type UserReqType = z.infer<typeof userSchemaReqZod>;
export type UserOptionalType = z.infer<typeof userSchemaOptionalZod>;
export type UserSignUpType = z.infer<typeof userSchemaSignUpZod>;
export type UserSignInType = z.infer<typeof userSchemaSignInZod>;
export type CreateWorkspaceType = z.infer<typeof createWorkspaceSchema>;
