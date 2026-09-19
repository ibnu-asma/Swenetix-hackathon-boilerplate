import { Router } from "express";
import { createCategoryController, deleteCategoryController, getAllCategoriesController, getCategoryController, updateCategoryController } from "../controllers/category.controller";

const router = Router(); 

router.post("/",  createCategoryController);
router.delete("/:id", deleteCategoryController);
router.put("/:id",  updateCategoryController);
router.get("/:id", getCategoryController);
router.get("/", getAllCategoriesController);

export default router; 