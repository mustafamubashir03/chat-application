import dotenv from "dotenv"
dotenv.config()

export const REDIS_URL: string = process.env.REDIS_URL!;
export const REDIS_PORT: number | string = process.env.REDIS_PORT!;