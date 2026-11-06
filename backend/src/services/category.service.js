
import { Category } from "../models/index.js";

export async function listCategories() {
  return Category.findAll({
    where: { isActive: true },
    order: [["name", "ASC"]]
  });
}

export async function createCategory(data) {
  return Category.create(data);
}

export async function updateCategory(id, data) {
  const category = await Category.findByPk(id);

  if (!category) {
    throw Object.assign(new Error("Categoría no encontrada"), {
      status: 404
    });
  }

  await category.update(data);
  return category;
}
