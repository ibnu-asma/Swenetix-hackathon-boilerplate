import { Request, Response } from "express";
import {
  createBorrowing,
  returnBorrowing,
  getCurrentBorrowings,
  getBorrowingHistory,
  renewBorrowing,
} from "../services/borrow.service";

export const borrowBook = async (
  req: Request,
  res: Response
): Promise<void> => {
  try {
    const { userId, bookId } = req.body;

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

export const getCurrentBorrowingsHandler = async (
  req: Request,
  res: Response
): Promise<void> => {
  try {
    const userId = (req as any).user?.id;
    
    if (!userId) {
      res.status(401).json({ message: "Unauthorized" });
      return;
    }

    const borrowings = await getCurrentBorrowings(userId);
    res.status(200).json(borrowings);
  } catch (error) {
    console.error("Get current borrowings error:", error);
    res.status(500).json({
      message: "Failed to fetch current borrowings",
    });
  }
};

export const getBorrowingHistoryHandler = async (
  req: Request,
  res: Response
): Promise<void> => {
  try {
    const userId = (req as any).user?.id;
    const page = parseInt(req.query.page as string) || 1;
    const limit = parseInt(req.query.limit as string) || 10;
    
    if (!userId) {
      res.status(401).json({ message: "Unauthorized" });
      return;
    }

    const history = await getBorrowingHistory(userId, page, limit);
    res.status(200).json(history);
  } catch (error) {
    console.error("Get borrowing history error:", error);
    res.status(500).json({
      message: "Failed to fetch borrowing history",
    });
  }
};

export const renewBookHandler = async (
  req: Request,
  res: Response
): Promise<void> => {
  try {
    const { id } = req.params;
    const userId = (req as any).user?.id;
    
    if (!userId) {
      res.status(401).json({ message: "Unauthorized" });
      return;
    }

    const borrowing = await renewBorrowing(id, userId);
    res.status(200).json({
      success: true,
      message: "Book renewed successfully",
      borrowing,
    });
  } catch (error) {
    console.error("Renew book error:", error);
    const message =
      error instanceof Error
        ? error.message
        : "Failed to renew book";

    res.status(400).json({
      success: false,
      message,
    });
  }
};