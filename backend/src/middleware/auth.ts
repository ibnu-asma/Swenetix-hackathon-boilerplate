import { Request, Response, NextFunction } from 'express';
import jwt from 'jsonwebtoken';

// 1. Extend the Express Request type to include the custom 'user' property
export interface CustomRequest extends Request {
  user?: {
    id: string;
    role: string;
    // Add other JWT payload properties here if needed
  } | jwt.JwtPayload; // Supports standard decoded JWT objects
}

// 2. Checks if the user is logged in at all
export const verifyToken = (req: CustomRequest, res: Response, next: NextFunction): void | Response => {
  const token = req.headers.authorization?.split(' ')[1];
  
  if (!token) {
    return res.status(401).json({ success: false, message: "Access Denied: No token provided" });
  }

  try {
  // Use 'as jwt.JwtPayload' to assert that the decoded token is an object
  const decoded = jwt.verify(token, process.env.JWT_SECRET || 'super_secret_hackathon_key') as jwt.JwtPayload;
  
  req.user = decoded; // Fixes TS2322: TypeScript now knows it's an object, not a string
  next();
} catch (error) {
  return res.status(401).json({ success: false, message: "Access Denied: Invalid token" });
}

};

// 3. Checks if the logged-in user is an ADMIN
export const requireAdmin = (req: CustomRequest, res: Response, next: NextFunction): void | Response => {
  // Use optional chaining (?.) because req.user could technically be undefined if middleware order is broken
  if (req.user && typeof req.user !== 'string' && req.user.role !== 'librarian') {
    return res.status(403).json({ success: false, message: "Forbidden: You must be an Admin to do this." });
  }
  next();
};
