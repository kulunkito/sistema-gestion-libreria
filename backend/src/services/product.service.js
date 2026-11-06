
import { Op } from "sequelize";
import { Category, Product } from "../models/index.js";

export async function getProducts({ page = 1, limit = 10, search, categoryId }) {
  const safePage = Math.max(1, Number(page));
  const safeLimit = Math.min(100, Math.max(1, Number(limit)));

  const where = {};

  if (search) {
    where[Op.or] = [
      { name: { [Op.like]: `%${search}%` } },
      { sku: { [Op.like]: `%${search}%` } }
    ];
  }

  if (categoryId) where.categoryId = categoryId;

  const result = await Product.findAndCountAll({
    where,
    include: [{
      model: Category,
      as: "category",
      attributes: ["id", "name"]
    }],
    limit: safeLimit,
    offset: (safePage - 1) * safeLimit,
    order: [["name", "ASC"]]
  });

  return {
    items: result.rows,
    pagination: {
      page: safePage,
      limit: safeLimit,
      total: result.count,
      totalPages: Math.ceil(result.count / safeLimit)
    }
  };
}

export async function getProductById(id) {
  const product = await Product.findByPk(id, {
    include: [{ model: Category, as: "category" }]
  });

  if (!product) {
    throw Object.assign(new Error("Producto no encontrado"), {
      status: 404
    });
  }

  return product;
}

export async function createProduct(data) {
  const category = await Category.findByPk(data.categoryId);

  if (!category || !category.isActive) {
    throw Object.assign(new Error("Categoría inexistente o inactiva"), {
      status: 422
    });
  }

  return Product.create(data);
}

export async function updateProduct(id, data) {
  const product = await getProductById(id);
  await product.update(data);
  return product;
}

export async function deactivateProduct(id) {
  const product = await getProductById(id);
  await product.update({ isActive: false });
  return product;
}
