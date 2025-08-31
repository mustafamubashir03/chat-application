import nodemailer from 'nodemailer';
import dotenv from 'dotenv';
dotenv.config();

export const MAIL_PASSWORD = process.env.MAIL_PASSWORD;
export const MAIL_ID = process.env.MAIL_ID;

export const transporter = nodemailer.createTransport({
  host: 'smtp.gmail.com',
  port: 587,
  secure: false, // use false for STARTTLS; true for SSL on port 465
  auth: {
    user: MAIL_ID,
    pass: MAIL_PASSWORD
  }
});
