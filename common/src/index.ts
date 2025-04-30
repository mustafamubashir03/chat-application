import z from "zod"

export const userSchemaReqZod = z.object({
    username:z.string(),
    password:z.string(),
    email:z.string().email()
})
export const userSchemaOptionalZod = z.object({
    username:z.string().optional(),
    password:z.string().optional(),
    email:z.string().email().optional(),
    avatar:z.string().optional()
})

export const userSchemaSignUpZod = userSchemaReqZod;

export const userSchemaSignInZod = z.object({
    password:z.string(),
    email:z.string().email(),
})

export const createWorkspaceSchema = z.object({
    name:z.string()
})

export type UserReqType = z.infer<typeof userSchemaReqZod>
export type UserOptionalType = z.infer<typeof userSchemaOptionalZod>
export type UserSignUpType = z.infer<typeof userSchemaSignUpZod>
export type UserSignInType = z.infer<typeof userSchemaSignInZod>
export type CreateWorkspaceType = z.infer<typeof createWorkspaceSchema>