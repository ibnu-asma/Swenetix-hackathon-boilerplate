import { Request, Response } from "express";
import {
  createBorrowing,
  returnBorrowing,
  getAllBorrowings,
} from "../services/borrow.service";

export const borrowBook = async (
  req: Request,
  res: Response
): Promise<void> => {
  try {
    const userId = req.body.userId || req.body.memberId;
    const bookId = req.body.bookId;

    if (!userId || !bookId) {
      res.status(400).json({
        message: "userId and bookId are required",
      });
      return;
    }

    const borrowing = await createBorrowing({
      userId,
      bookId,
    });

    res.status(201).json({
      message: "Book borrowed successfully",
      borrowing,
    });
  } catch (error) {
    console.error("Borrow book error:", error);

    const message =
      error instanceof Error
        ? error.message
        : "Failed to borrow book";

    res.status(400).json({
      message,
    });
  }
};

export const returnBook = async (
  req: Request,
  res: Response
): Promise<void> => {
  try {
    const { id } = req.params;

    const borrowing = await returnBorrowing(id);

    res.status(200).json({
      message: "Book returned successfully",
      borrowing,
    });
  } catch (error) {
    console.error("Return book error:", error);

    const message =
      error instanceof Error
        ? error.message
        : "Failed to return book";

    res.status(400).json({
      message,
    });
  }
};

export const getAllBorrowingsController = async (
  _req: Request,
  res: Response
): Promise<void> => {
  try {
    const borrowings = await getAllBorrowings();
    res.status(200).json({
      success: true,
      data: borrowings,
    });
  } catch (error) {
    console.error("Get all borrowings error:", error);
    res.status(500).json({
      success: false,
      message: error instanceof Error ? error.message : "Failed to fetch borrowings",
    });
  }
};