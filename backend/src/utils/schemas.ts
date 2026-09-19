import { z } from 'zod';

// ==========================================
// 1. Task Schemas (Existing)
// ==========================================
export const createTaskSchema = z.object({
  title: z.string().trim().min(3, "Title must be at least 3 characters long")
});

// ==========================================
// 2. User Schemas
// ==========================================

// Base rules for reusability
const usernameRule = z.string()
  .trim()
  .min(3, "Username must be at least 3 characters long")
  .max(30, "Username cannot exceed 30 characters")
  .regex(/^[a-zA-Z0-9_]+$/, "Username can only contain letters, numbers, and underscores");

const passwordRule = z.string()
  .min(8, "Password must be at least 8 characters long")
  .max(100, "Password is too long");

// User Registration Schema
export const registerUserSchema = z.object({
  firstName: z.string().min(1, "First name is required"),
  lastName: z.string().min(1, "Last name is required"),
  email: z.string().trim().email("Please provide a valid email address"),
  password: passwordRule,
  confirmPassword: z.string()
}).refine((data) => data.password === data.confirmPassword, {
  message: "Passwords do not match",
  path: ["confirmPassword"] // Points the error specificially to the confirmPassword field
});

// User Login Schema
export const loginUserSchema = z.object({
  email: z.string().trim().email("Please provide a valid email address"),
  password: z.string().min(1, "Password is required") // Don't give away length rules on login
});

// Update Profile Schema (Allows changing username or email, both optional)
export const updateUserProfileSchema = z.object({
  username: usernameRule.optional(),
  email: z.string().trim().email("Please provide a valid email address").optional(),
}).refine((data) => Object.keys(data).length > 0, {
  message: "At least one field must be provided to update profile"
});

// Update Password Schema
export const updatePasswordSchema = z.object({
  currentPassword: z.string().min(1, "Current password is required"),
  newPassword: passwordRule
}).refine((data) => data.currentPassword !== data.newPassword, {
  message: "New password must be different from current password",
  path: ["newPassword"]
});

// ==========================================
// 3. TypeScript Type Inferences
// ==========================================
export type RegisterUserInput = z.infer<typeof registerUserSchema>;
export type LoginUserInput = z.infer<typeof loginUserSchema>;
export type UpdateUserProfileInput = z.infer<typeof updateUserProfileSchema>;
