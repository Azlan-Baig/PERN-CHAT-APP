import jwt, { JwtPayload } from "jsonwebtoken";
import { Request, Response, NextFunction } from "express";
import primsa from "../db/prisma.js";

interface DecodedToken extends JwtPayload {
  userid: string;
}
declare global {
  namespace Express {
    export interface Request {
      user: {
        id: string;
      };
    }
  }
}
const protectedme = async (req: Request, res: Response, next: NextFunction) => {
  try {
    console.log(req.cookies);
    const token = req.cookies.jwt;
    if (!token) {
      return res
        .status(401)
        .json({ error: "Unauthorized - No token provided" });
    }
    const decoded = jwt.verify(token, process.env.JWT_SECRET!) as DecodedToken;
    console.log("Decoded token:", decoded);

    if (!decoded) {
      return res.status(401).json({ error: "Unauthorized - Invalid token." });
    }

    const user = await primsa.user.findUnique({
      where: { id: decoded.userId },
      select: { id: true, username: true, fullName: true, profilePic: true },
    });
    if (!user) {
      return res.status(404).json({ error: "User not found" });
    }

    req.user = user;
    next();
  } catch (error: any) {
    console.log("Error in protectRoute middleware", error.message);
    res.status(500).json({ error: "Internal Server Error" });
  }
};

export default protectedme;
