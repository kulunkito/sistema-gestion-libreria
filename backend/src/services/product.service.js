
import { Op } from "sequelize";
import sequelize from "../config/database.js";
import { Category, Product, StockMovement } from "../models/index.js";

export async function getProducts({ page = 1, limit = 10, search, categoryId }, user) {
  const parsedPage = Number(page);
  const parsedLimit = Number(limit);
  const safePage = Number.isFinite(parsedPage) ? Math.max(1, Math.floor(parsedPage)) : 1;
  const safeLimit = Number.isFinite(parsedLimit)
    ? Math.min(100, Math.max(1, Math.floor(parsedLimit)))
    : 10;

  const where = {};
  if (user?.role !== "ADMIN") where.isActive = true;

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

export async function getProductById(id, user) {
  const product = await Product.findByPk(id, {
    include: [{ model: Category, as: "category" }]
  });

  if (!product || (user?.role !== "ADMIN" && !product.isActive)) {
    throw Object.assign(new Error("Producto no encontrado"), {
      status: 404
    });
  }

  return product;
}

export async function createProduct(data, userId) {
  return sequelize.transaction(async transaction => {
    const category = await Category.findByPk(data.categoryId, { transaction });
    if (!category || !category.isActive) {
      throw Object.assign(new Error("Categoría inexistente o inactiva"), {
        status: 422
      });
    }

    const initialStock = data.stock || 0;
    const product = await Product.create({ ...data, stock: 0 }, { transaction });
    if (initialStock > 0) {
      await product.update({ stock: initialStock }, { transaction });
      await StockMovement.create({
        productId: product.id,
        userId,
        type: "IN",
        quantity: initialStock,
        reason: "Stock inicial del producto"
      }, { transaction });
    }
    return product;
  });
}

export async function updateProduct(id, data) {
  const product = await getProductById(id, { role: "ADMIN" });
  if (data.categoryId) {
    const category = await Category.findByPk(data.categoryId);
    if (!category || !category.isActive) {
      throw Object.assign(new Error("Categoría inexistente o inactiva"), {
        status: 422
      });
    }
  }
  await product.update(data);
  return product;
}

export async function setProductStatus(id, isActive) {
  const product = await getProductById(id, { role: "ADMIN" });
  await product.update({ isActive });
  return product;
}
