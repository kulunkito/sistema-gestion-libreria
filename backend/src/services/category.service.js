
import { Category } from "../models/index.js";

export async function listCategories({ page = 1, limit = 20 } = {}, user) {
  const currentPage = Math.max(1, Math.floor(Number(page) || 1));
  const pageSize = Math.min(100, Math.max(1, Math.floor(Number(limit) || 20)));
  const result = await Category.findAndCountAll({
    where: user?.role === "ADMIN" ? {} : { isActive: true },
    limit: pageSize,
    offset: (currentPage - 1) * pageSize,
    order: [["name", "ASC"]]
  });
  return {
    items: result.rows,
    pagination: {
      page: currentPage,
      limit: pageSize,
      total: result.count,
      totalPages: Math.ceil(result.count / pageSize)
    }
  };
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

export async function setCategoryStatus(id, isActive) {
  const category = await Category.findByPk(id);
  if (!category) {
    throw Object.assign(new Error("Categoría no encontrada"), { status: 404 });
  }
  await category.update({ isActive });
  return category;
}
