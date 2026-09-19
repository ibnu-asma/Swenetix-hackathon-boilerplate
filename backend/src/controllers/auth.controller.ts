import { Request, Response } from "express";
import jwt from "jsonwebtoken";
import bcrypt from "bcryptjs";
import { User } from "../models/User";

// Explicit interface for your database document structure
interface IUserDoc {
  _id: any;
  firstName: string;
  lastName: string;
  email: string;
  role: "member" | "librarian";
  profileImage?: string;
}

// 1. Updated helper function to accept only what it needs for the JWT payload
const generateToken = (user: { _id: any; role: "member" | "librarian" }): string => {
  return jwt.sign(
    { id: user._id, role: user.role },
    process.env.JWT_SECRET || "super_secret_hackathon_key",
    { expiresIn: "1d" }
  );
};

// 2. Register Handler
export const registerHandler = async (req: Request, res: Response): Promise<Response | void> => {
  try {
    const { firstName, lastName, email, password, role, profileImage } = req.body;

    // Proactive check before hitting the database
    const existingUser = await User.findOne({ email: email.toLowerCase() });
    if (existingUser) {
      return res.status(400).json({ 
        success: false, 
        message: "Registration failed: A user with this email already exists." 
      });
    }

    // Insert new user record into MongoDB
    const user = await User.create({
      firstName,
      lastName,
      email: email.toLowerCase(), // Normalize emails to lowercase
      password,
      role,
      profileImage,
    });

    // Safely cast the Mongoose document to our interface layout
    const userObj = user.toObject() as IUserDoc;

    // Generate token by passing only the payload parameters
    const token = generateToken({
      _id: userObj._id,
      role: userObj.role
    });

    return res.status(201).json({
      success: true,
      token,
      role: userObj.role,
      user: {
        firstName: userObj.firstName,
        lastName: userObj.lastName,
        email: userObj.email,
        role: userObj.role,
        profileImage: userObj.profileImage,
      }
    });

  } catch (error: any) {
    console.error("❌ Registration Error:", error);
    
    // Catch explicit MongoDB duplicate key index codes
    if (error.code === 11000) {
      return res.status(400).json({ 
        success: false, 
        message: "Registration failed: A user with this email already exists." 
      });
    }

    return res.status(400).json({ 
      success: false, 
      message: error.message || "An unexpected error occurred." 
    });
  }
};

// 3. Login Handler
export const loginHandler = async (req: Request, res: Response): Promise<Response | void> => {
  try {
    const { email, password } = req.body;
    const user = await User.findOne({ email: email.toLowerCase() });

    if (!user || !(await bcrypt.compare(password, user.password))) {
      return res.status(401).json({ success: false, message: "Invalid credentials" });
    }

    const userObj = user.toObject() as IUserDoc;

    return res.status(200).json({
      success: true,
      token: generateToken({ _id: userObj._id, role: userObj.role }),
      role: userObj.role,
      user: {
        firstName: userObj.firstName,
        lastName: userObj.lastName,
        email: userObj.email,
        role: userObj.role
      }
    });
  } catch (error: any) {
    return res.status(500).json({ success: false, message: error.message });
  }
};

// 4. Logout Handler
export const logoutHandler = async (_req: Request, res: Response): Promise<Response | void> => {
  try {
    res.clearCookie("token");
    return res.status(200).json({
      success: true,
      message: "Logged out successfully. Please remove your token from client storage.",
    });
  } catch (error: any) {
    return res.status(500).json({ success: false, message: error.message });
  }
};
