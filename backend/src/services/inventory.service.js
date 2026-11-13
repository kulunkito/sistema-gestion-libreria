import { Op } from "sequelize";
import sequelize from "../config/database.js";
import { Product, StockMovement, Supplier, User } from "../models/index.js";

function httpError(message, status) {
  return Object.assign(new Error(message), { status });
}

function pagination(page, limit, defaultLimit) {
  const currentPage = Math.max(1, Math.floor(Number(page) || 1));
  const pageSize = Math.min(100, Math.max(1, Math.floor(Number(limit) || defaultLimit)));
  return { page: currentPage, limit: pageSize, offset: (currentPage - 1) * pageSize };
}

function paginated(result, paging) {
  return {
    items: result.rows,
    pagination: {
      page: paging.page,
      limit: paging.limit,
      total: result.count,
      totalPages: Math.ceil(result.count / paging.limit)
    }
  };
}

export async function listInventory({ page = 1, limit = 50 } = {}) {
  const paging = pagination(page, limit, 50);
  const result = await Product.findAndCountAll({
    attributes: ["id", "sku", "name", "stock", "minStock"],
    where: { isActive: true },
    limit: paging.limit,
    offset: paging.offset,
    order: [["name", "ASC"]]
  });
  return paginated(result, paging);
}

export async function listLowStock({ page = 1, limit = 50 } = {}) {
  const paging = pagination(page, limit, 50);
  const result = await Product.findAndCountAll({
    where: {
      isActive: true,
      stock: { [Op.lte]: sequelize.col("min_stock") }
    },
    limit: paging.limit,
    offset: paging.offset,
    order: [["stock", "ASC"], ["name", "ASC"]]
  });
  return paginated(result, paging);
}

export async function listMovements({ page = 1, limit = 50 } = {}) {
  const paging = pagination(page, limit, 50);
  const result = await StockMovement.findAndCountAll({
    include: [
      { model: Product, as: "product", attributes: ["id", "sku", "name"] },
      { model: User, as: "user", attributes: ["id", "name"] },
      { model: Supplier, as: "supplier", attributes: ["id", "name"] }
    ],
    limit: paging.limit,
    offset: paging.offset,
    order: [["createdAt", "DESC"]]
  });

  return paginated(result, paging);
}

export async function createMovement(data, userId) {
  return sequelize.transaction(async transaction => {
    const product = await Product.findByPk(data.productId, {
      transaction,
      lock: transaction.LOCK.UPDATE
    });
    if (!product || !product.isActive) {
      throw httpError("Producto inexistente o inactivo", 404);
    }

    if (data.supplierId) {
      const supplier = await Supplier.findByPk(data.supplierId, { transaction });
      if (!supplier || !supplier.isActive) {
        throw httpError("Proveedor inexistente o inactivo", 422);
      }
    }

    let nextStock = product.stock;
    let movementQuantity = data.quantity;
    if (data.type === "IN") nextStock += data.quantity;
    if (data.type === "OUT") nextStock -= data.quantity;
    if (data.type === "ADJUSTMENT") {
      nextStock = data.quantity;
      movementQuantity = Math.abs(nextStock - product.stock);
      if (movementQuantity === 0) {
        throw httpError("El stock ya tiene ese valor", 422);
      }
    }
    if (nextStock < 0) throw httpError("Stock insuficiente", 409);
    if (nextStock > 4294967295) {
      throw httpError("El stock supera el máximo permitido", 422);
    }

    await product.update({ stock: nextStock }, { transaction });
    const movement = await StockMovement.create({
      productId: product.id,
      userId,
      supplierId: data.supplierId || null,
      type: data.type,
      quantity: movementQuantity,
      reason: data.reason
    }, { transaction });

    return { movement, product };
  });
}
