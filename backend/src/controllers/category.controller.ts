import { createCategory, getCategory, updateCategory, deleteCategory, getAllCategories } from "../services/category.service";
import { Request, Response } from "express";

export const createCategoryController = async (req: Request, res: Response) => {
    try {
        const { name } = req.body;
        const category = await createCategory({ name });
        res.status(201).json({
            success: true,
            message: "Category created successfully",
            data: category,
        });
    } catch (error) {
        res.status(400).json({
            success: false,
            message: error instanceof Error ? error.message : "Failed to create category",
        });
    }
};

export const deleteCategoryController = async (req: Request, res: Response) => {
    try {
        const { id } = req.params;
        const category = await deleteCategory(id);
        res.status(200).json({
            success: true,
            message: "Category deleted successfully",
            data: category,
        });
    } catch (error) {
        res.status(404).json({
            success: false,
            message: error instanceof Error ? error.message : "Failed to delete category",
        });
    }
};

export const updateCategoryController = async (req: Request, res: Response) => {
    try {
        const { id } = req.params;
        const { name } = req.body;
        const category = await updateCategory(id, { name });
        res.status(200).json({
            success: true,
            message: "Category updated successfully",
            data: category,
        });
    } catch (error) {
        res.status(404).json({
            success: false,
            message: error instanceof Error ? error.message : "Failed to update category",
        });
    }
};

export const getCategoryController = async (req: Request, res: Response) => {
    try {
        const { id } = req.params;
        const category = await getCategory(id);
        res.status(200).json({
            success: true,
            data: category,
        });
    } catch (error) {
        res.status(404).json({
            success: false,
            message: error instanceof Error ? error.message : "Failed to fetch category",
        });
    }
};

export const getAllCategoriesController = async (_req: Request, res: Response) => {
    try {
        const categories = await getAllCategories();
        res.status(200).json({
            success: true,
            data: categories,
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: error instanceof Error ? error.message : "Failed to fetch categories",
        });
    }
};