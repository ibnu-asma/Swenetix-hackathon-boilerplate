import { Schema, model, Document, Types } from "mongoose";

export interface IBorrowing extends Document {
  userId: Types.ObjectId;
  bookId: Types.ObjectId;
  borrowedAt: Date;
  dueDate: Date;
  returnDate?: Date | null;
  status: "BORROWED" | "RETURNED" | "OVERDUE";
  createdAt: Date;
  updatedAt: Date;
}

const borrowingSchema = new Schema<IBorrowing>(
  {
    userId: {
      type: Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },

    bookId: {
      type: Schema.Types.ObjectId,
      ref: "Book",
      required: true,
    },

    borrowedAt: {
      type: Date,
      default: Date.now,
    },

    dueDate: {
      type: Date,
      required: true,
    },

    returnDate: {
      type: Date,
      default: null,
    },

    status: {
      type: String,
      enum: ["BORROWED", "RETURNED", "OVERDUE"],
      default: "BORROWED",
    },
  },
  {
    timestamps: true,
  }
);

export default model<IBorrowing>("Borrowing", borrowingSchema);