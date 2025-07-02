import cookieSession from "cookie-session";
import { Request , Response , NextFunction } from "express";
import  jwt , { Jwt , JwtPayload } from "jsonwebtoken";

const JWT_SECRET = process.env.JWT_SECRET;

if(!JWT_SECRET){
    throw new Error("JWT_SECRET is not defined in env");
}

//ectends Request interface to include 'user'

interface AuthRequest extends Request{
    user?:{
        userId: string,
        email:string,
        iat?:number;
        exp?:number;
    };
}

export const authMiddleware = (req: AuthRequest , res: Response , next: NextFunction): any =>{
    try {
      const authHeader = req.headers.authorization;
      if(!authHeader || !authHeader.startsWith("Bearer ")){
        res.status(401).json({error:"No token provided"});
        return;
      }

      const token = authHeader.split(" ")[1];

      // verify token 
      const decoded = jwt.verify(token , JWT_SECRET) as JwtPayload;
        console.log(decoded);
       req.user = {
         userId: decoded.userId as string,
         email : decoded.email as string,
         iat: decoded.iat,
         exp: decoded.exp, 
       }
      next();
    }
    catch (error){
     console.error("JWT validation error:", error);
     res.status(500).json({error:"Invalid or Expired token "});
    }
};