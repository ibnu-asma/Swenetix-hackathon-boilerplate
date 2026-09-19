import mongoose from "mongoose";
import dotenv from "dotenv";
import bcrypt from "bcryptjs";
import { User } from "../models/User";

dotenv.config();

const seedUsers = async () => {
  try {
    // 1. Connect to MongoDB
    const mongoUri = process.env.MONGO_URI ?? "mongodb://localhost:27017/library_db";
    await mongoose.connect(mongoUri);
    console.log("🌱 Connected to MongoDB for seeding...");

    // 2. Clear existing users to avoid duplicate key errors
    await User.deleteMany({});
    console.log("🧹 Cleared existing users from the database.");

    // 3. Generate a common hashed password for easy testing
    const hashedPassword = await bcrypt.hash("LibraryPass123!", 10);

    const usersToSeed = [
      // 1 Librarian (Admin)
      {
        firstName: "Chief",
        lastName: "Librarian",
        email: "librarian@library.com",
        password: hashedPassword,
        role: "librarian",
        profileImage: "https://dicebear.com",
      },
      // 10 Normal Users (Members)
      {
        firstName: "John",
        lastName: "Doe",
        email: "john.doe@example.com",
        password: hashedPassword,
        role: "member",
        profileImage: "https://dicebear.com",
      },
      {
        firstName: "Jane",
        lastName: "Smith",
        email: "jane.smith@example.com",
        password: hashedPassword,
        role: "member",
        profileImage: "https://dicebear.com",
      },
      {
        firstName: "Michael",
        lastName: "Johnson",
        email: "michael.j@example.com",
        password: hashedPassword,
        role: "member",
        profileImage: "https://dicebear.com",
      },
      {
        firstName: "Emily",
        lastName: "Davis",
        email: "emily.d@example.com",
        password: hashedPassword,
        role: "member",
        profileImage: "https://dicebear.com",
      },
      {
        firstName: "David",
        lastName: "Brown",
        email: "david.b@example.com",
        password: hashedPassword,
        role: "member",
        profileImage: "https://dicebear.com",
      },
      {
        firstName: "Sarah",
        lastName: "Miller",
        email: "sarah.m@example.com",
        password: hashedPassword,
        role: "member",
        profileImage: "https://dicebear.com",
      },
      {
        firstName: "James",
        lastName: "Wilson",
        email: "james.w@example.com",
        password: hashedPassword,
        role: "member",
        profileImage: "https://dicebear.com",
      },
      {
        firstName: "Jessica",
        lastName: "Moore",
        email: "jessica.m@example.com",
        password: hashedPassword,
        role: "member",
        profileImage: "https://dicebear.com",
      },
      {
        firstName: "Robert",
        lastName: "Taylor",
        email: "robert.t@example.com",
        password: hashedPassword,
        role: "member",
        profileImage: "https://dicebear.com",
      },
      {
        firstName: "Amanda",
        lastName: "Anderson",
        email: "amanda.a@example.com",
        password: hashedPassword,
        role: "member",
        profileImage: "https://dicebear.com",
      },
    ];

    // 4. Insert all seed data
    await User.insertMany(usersToSeed);
    console.log("✅ Database successfully populated with seed users!");
    
    // 5. Exit process cleanly
    await mongoose.disconnect();
    process.exit(0);
  } catch (error) {
    console.error("❌ Seeding failed:", error);
    process.exit(1);
  }
};

seedUsers();
