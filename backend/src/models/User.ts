import mongoose from "mongoose";
import bcrypt from "bcryptjs";

const userSchema = new mongoose.Schema(
  {
    firstName: {
      type: String,
      required: true,
      trim: true,
    },
    lastName: {
        type: String,
      required: true,
      trim: true,
    },
    email: {
      type: String,
      required: true,
      unique: true,
      trim: true,
      lowercase: true,
    },

    password: {
      type: String,
      required: true,
    },

    profileImage: {
      type: String,
      trim: true,
    },

    role: {
      type: String,
      enum: ["member", "librarian"],
      default: "member",
    },

    memberId: {
      type: String,
      trim: true,
    },

    tier: {
      type: String,
      default: "Standard Member",
    },

    faculty: {
      type: String,
      trim: true,
    },

    cardStatus: {
      type: String,
      default: "Active",
    },

    currentLoans: {
      type: Number,
      default: 0,
    },

    fines: {
      type: Number,
      default: 0,
    },
  },
  {
    timestamps: true,
  }
);

// Hash password before saving
userSchema.pre("save", async function (next) {
  if (!this.isModified("password")) return next();

  this.password = await bcrypt.hash(this.password, 10);

  next();
});

export const User = mongoose.model("User", userSchema);