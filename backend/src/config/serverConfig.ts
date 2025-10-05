import dotenv from 'dotenv';
dotenv.config();

export const PORT: number | string = process.env.PORT || 4000;
export const NODE_ENV: string = process.env.NODE_ENV || 'development';
export const DEV_DB_URL: string = process.env.DEV_DB_URL!;
export const PROD_DB_URL: string = process.env.PROD_DB_URL!;
export const JWT_SECRET: string = process.env.JWT_SECRET!;
export const JWT_EXPIRY: any = process.env.JWT_EXPIRY || '1d';
