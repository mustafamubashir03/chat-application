import jwt from "jsonwebtoken"
import { JWT_SECRET } from "../config/serverConfig"
import { Request,Response,NextFunction } from "express"
import { StatusCodes } from "http-status-codes";
import { customErrorResponse, internalServerErrorResponse } from "../utils/ObjectResponse";
import userRepository from "../repository/userRepository";



export  const isAuthenticated = async(req:Request,res:Response,next:NextFunction)=>{
    try{
        const token = req.headers.token;
        if(!token){
            return res.status(StatusCodes.FORBIDDEN).json({message:"No token provided"})
        }
        const response = jwt.verify(token as string,JWT_SECRET) as {id:string,email:string}
        if(response){
            const user = await userRepository.getDocById(response.id)
            req.user = user.id;
            next()
        }else{
            return res.status(StatusCodes.FORBIDDEN).json({message:"Invalid token"})
        }

    }catch(error:any){
        if(error.name === "JsonWebTokenError"){
            return res.status(StatusCodes.FORBIDDEN).json({message:"Invalid token"})
        }
            if (error.statusCode) {
              res.status(error.statusCode).json(customErrorResponse(error));
            }
            res
              .status(StatusCodes.INTERNAL_SERVER_ERROR)
              .json(internalServerErrorResponse(error));
          }
    }


