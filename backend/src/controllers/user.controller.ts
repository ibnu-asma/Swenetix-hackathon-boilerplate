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


// Librarian: Create a Member account directly
export const librarianAddMemberHandler = async (req: CustomRequest, res: Response): Promise<Response | void> => {
  try {
    const { firstName, lastName, email, role, profileImage } = req.body;

    // 1. Double check for existing user
    const existingUser = await User.findOne({ email: email.toLowerCase() });
    if (existingUser) {
      return res.status(400).json({ 
        success: false, 
        message: "Management Error: A user with this email address is already registered." 
      });
    }

    // 2. Set an initial fallback temporary password since the Librarian is onboarding them
    const tempPassword = "TemporaryPassword123!";
    
    // 3. Insert record into database (forced to lowerCase emails)
    const newMember = await User.create({
      firstName,
      lastName,
      email: email.toLowerCase(),
      password: tempPassword, // Hashed automatically by mongoose model pre-save hook!
      role: role || "member", // Defaults to member if unspecified
      profileImage
    });

    return res.status(201).json({
      success: true,
      message: "New member account provisioned successfully by librarian.",
      data: {
        id: newMember._id,
        firstName: newMember.firstName,
        lastName: newMember.lastName,
        email: newMember.email,
        role: newMember.role,
        temporaryPassword: tempPassword // Output it once so the librarian can give it to the user
      }
    });

  } catch (error: any) {
    return res.status(500).json({ success: false, message: error.message });
  }
};



// Librarian: Get explicit details of any specific user by ID
export const getUserByIdHandler = async (req: CustomRequest, res: Response): Promise<Response | void> => {
  try {
    const { id } = req.params;

    // Validate if the ID is a valid MongoDB ObjectId structure before querying
    if (!id.match(/^[0-9a-fA-F]{24}$/)) {
      return res.status(400).json({ success: false, message: "Invalid User ID format" });
    }

    // Find the user and exclude their password
    const targetUser = await User.findById(id).select('-password');

    if (!targetUser) {
      return res.status(404).json({ success: false, message: "User not found" });
    }

    return res.status(200).json({ success: true, data: targetUser });
  } catch (error: any) {
    return res.status(500).json({ success: false, message: error.message });
  }
};


// Librarian: Delete a specific user by ID
export const deleteUserHandler = async (req: CustomRequest, res: Response): Promise<Response | void> => {
  try {
    const { id } = req.params;

    // Validate MongoDB ObjectId format
    if (!id.match(/^[0-9a-fA-F]{24}\$/)) {
      return res.status(400).json({ success: false, message: "Invalid User ID format" });
    }

    // Prohibit librarians from accidentally deleting themselves
    if (req.user?.id === id) {
      return res.status(400).json({ success: false, message: "Management Error: You cannot delete your own account." });
    }

    // Find and delete the user
    const deletedUser = await User.findByIdAndDelete(id);

    if (!deletedUser) {
      return res.status(404).json({ success: false, message: "User not found" });
    }

    return res.status(200).json({ 
      success: true, 
      message: `User account associated with ${deletedUser.email} has been successfully deleted.` 
    });
  } catch (error: any) {
    return res.status(500).json({ success: false, message: error.message });
  }
};



// User: Update own profile details
export const updateProfileHandler = async (req: CustomRequest, res: Response): Promise<Response | void> => {
  try {
    const userId = req.user?.id;
    if (!userId) {
      return res.status(401).json({ success: false, message: "Unauthorized: User payload missing" });
    }

    // Extract only fields a user is allowed to change
    const { firstName, lastName, profileImage: imageUrl } = req.body;
    
    // Check if a new file was uploaded via multer, otherwise fall back to the body url string
    const profileImage = req.file ? `/uploads/${req.file.filename}` : imageUrl;

    // Create an update object dynamically based on what was sent
    const updateData: Record<string, any> = {};
    if (firstName) updateData.firstName = firstName;
    if (lastName) updateData.lastName = lastName;
    if (profileImage) updateData.profileImage = profileImage;

    // Perform the update and return the freshly updated document (excluding password)
    const updatedUser = await User.findByIdAndUpdate(
      userId,
      { $set: updateData },
      { new: true, runValidators: true }
    ).select('-password');

    if (!updatedUser) {
      return res.status(404).json({ success: false, message: "User not found" });
    }

    return res.status(200).json({
      success: true,
      message: "Profile updated successfully",
      data: updatedUser
    });
  } catch (error: any) {
    return res.status(500).json({ success: false, message: error.message });
  }
};

