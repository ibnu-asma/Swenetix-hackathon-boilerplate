import { Response } from 'express';
import { User } from '../models/User';
import { CustomRequest } from '../middleware/auth'; // Adjust this path to wherever your verifyToken file is

type UserDocument = InstanceType<typeof User>;

// 1. Get Logged-in User Profile Handler
export const getProfileHandler = async (req: CustomRequest, res: Response): Promise<Response | void> => {
  try {
    // req.user.id is attached by the verifyToken middleware
    const userId = req.user?.id;
    
    if (!userId) {
      return res.status(401).json({ success: false, message: "Unauthorized: User payload missing" });
    }

    // Find user by ID and omit the password from the returned object
    const user = await User.findById(userId).select('-password');
    
    if (!user) {
      return res.status(404).json({ success: false, message: "User not found" });
    }

    return res.status(200).json({ success: true, data: user });
  } catch (error: any) {
    return res.status(500).json({ success: false, message: error.message });
  }
};


// 2. Get All Users Handler (Admin Only)
export const getAllUsersHandler = async (_req: CustomRequest, res: Response): Promise<Response | void> => {
  try {
    // Find all users and omit their passwords
    const users: UserDocument[] = await User.find({}).select('-password');
    
    return res.status(200).json({ success: true, count: users.length, data: users });
  } catch (error: any) {
    return res.status(500).json({ success: false, message: error.message });
  }
};

