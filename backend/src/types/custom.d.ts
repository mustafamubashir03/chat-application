import { Request } from "express";
import { ObjectId } from "mongoose";

declare module "express-serve-static-core" {
  interface Request {
    user?: {
      id: ObjectId;
      email?: string; // Add other fields if needed
    };
  }
}
