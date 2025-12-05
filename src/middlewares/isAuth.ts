import { Request, Response, NextFunction } from "express";
import admin from "../firebase/firebase";


export interface AuthRequest extends Request {
  user?: admin.auth.DecodedIdToken;
}

export const verifyToken = async (
  req: AuthRequest,
  res: Response,
  next: NextFunction
) => {
  const token = req.cookies.Authorization;

  if (!token) {
    return res.status(401).json({ message: "Brak tokena" });
  }

  try {
    const decodedToken = await admin.auth().verifyIdToken(token);
    req.user = decodedToken;
    return next();
  } catch (err) {
    return res.status(403).json({ message: "Nieprawidłowy token" });
  }
};
