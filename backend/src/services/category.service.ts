import Category from "../models/Catagory";

export interface createCategoryParams {
    name: string;
}

export const createCategory = async (data: createCategoryParams) => {
    const { name } = data;

    const category = await Category.create({
        name,
    });

    return category;
}

export const deleteCategory = async (id: string) => {
    const category = await Category.findByIdAndDelete(id);
    return category;
}

export const updateCategory = async (id: string, data: createCategoryParams) => {
    const category = await Category.findByIdAndUpdate(id, data, { new: true });
    return category;
}

export const getCategory = async (id: string) => {
    const category = await Category.findById(id);
    return category;
}

export const getAllCategories = async () => {
    const categories = await Category.find();
    return categories;
}