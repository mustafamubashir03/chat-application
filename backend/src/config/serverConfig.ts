import dotenv from 'dotenv';
dotenv.config();

export const PORT: number | string = process.env.PORT || 3000;
export const NODE_ENV: string = process.env.NODE_ENV || 'development';
export const DEV_DB_URL: string = process.env.DEV_DB_URL!;
export const PROD_DB_URL: string = process.env.PROD_DB_URL!;
