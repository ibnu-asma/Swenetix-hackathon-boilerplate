import { Request, Response } from "express";
import * as bookService from "../services/books.service";

export const createBook = async (req: Request, res: Response) => {
    try {
        const book = await bookService.createBook(req.body);
        res.status(201).json({
            success: true,
            message: "Book created successfully",
            data: book,
        });
    } catch (error) {
        res.status(400).json({
            success: false,
            message: error instanceof Error ? error.message : "Failed to create book",
        });
    }
};

export const getBooks = async (req: Request, res: Response) => {
    try {
        const { search, category } = req.query;
        const page = Number(req.query.page) || 1;
        const limit = Number(req.query.limit) || 10;

        const result = await bookService.getBooks({
            search: search as string | undefined,
            category: category as string | undefined,
            page,
            limit,
        });

        res.status(200).json({
            success: true,
            data: result.books,
            pagination: result.pagination,
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: error instanceof Error ? error.message : "Failed to fetch books",
        });
    }
};

export const getBookById = async (req: Request, res: Response) => {
    try {
        const book = await bookService.getBookById(req.params.id);
        res.status(200).json({
            success: true,
            data: book,
        });
    } catch (error) {
        res.status(404).json({
            success: false,
            message: error instanceof Error ? error.message : "Failed to fetch book",
        });
    }
};

export const updateBook = async (req: Request, res: Response) => {
    try {
        const book = await bookService.updateBook(
            req.params.id,
            req.body,
        );

        res.status(200).json({
            success: true,
            message: "Book updated successfully",
            data: book,
        });
    } catch (error) {
        res.status(404).json({
            success: false,
            message: error instanceof Error ? error.message : "Failed to update book",
        });
    }
};

export const deleteBook = async (req: Request, res: Response) => {
    try {
        const result = await bookService.deleteBook(req.params.id);
        res.status(200).json({
            success: true,
            ...result,
        });
    } catch (error) {
        res.status(404).json({
            success: false,
            message: error instanceof Error ? error.message : "Failed to delete book",
        });
    }
};
