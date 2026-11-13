import { Op } from "sequelize";
import sequelize from "../config/database.js";
import {
  Customer,
  Payment,
  Product,
  Sale,
  SaleDetail,
  StockMovement,
  User
} from "../models/index.js";

const MAX_TOTAL_CENTS = 999999999999;

function toCents(value) {
  return Math.round(Number(value) * 100);
}

function fromCents(value) {
  return (value / 100).toFixed(2);
}

function httpError(message, status) {
  return Object.assign(new Error(message), { status });
}

function saleIncludes() {
  return [
    { model: User, as: "user", attributes: ["id", "name", "email"] },
    { model: Customer, as: "customer", attributes: ["id", "name"] },
    {
      model: SaleDetail,
      as: "items",
      include: [{ model: Product, as: "product", attributes: ["id", "sku", "name"] }]
    },
    { model: Payment, as: "payments" }
  ];
}

export async function createSale(data, userId) {
  const paymentTotalCents = data.payments.reduce(
    (total, payment) => total + toCents(payment.amount),
    0
  );
  const quantities = new Map();

  for (const item of data.items) {
    quantities.set(item.productId, (quantities.get(item.productId) || 0) + item.quantity);
  }

  return sequelize.transaction(async transaction => {
    if (data.customerId) {
      const customer = await Customer.findByPk(data.customerId, { transaction });
      if (!customer || !customer.isActive) {
        throw httpError("Cliente inexistente o inactivo", 422);
      }
    }

    const products = await Product.findAll({
      where: { id: { [Op.in]: [...quantities.keys()] } },
      transaction,
      lock: transaction.LOCK.UPDATE
    });
    const productsById = new Map(products.map(product => [product.id, product]));
    let totalCents = 0;
    const details = [];

    for (const [productId, quantity] of quantities) {
      const product = productsById.get(productId);
      if (!product || !product.isActive) {
        throw httpError(`Producto ${productId} inexistente o inactivo`, 422);
      }
      if (product.stock < quantity) {
        throw httpError(`Stock insuficiente para ${product.name}`, 409);
      }

      const unitPriceCents = toCents(product.salePrice);
      const subtotalCents = unitPriceCents * quantity;
      totalCents += subtotalCents;
      if (totalCents > MAX_TOTAL_CENTS) {
        throw httpError("El total de la venta supera el máximo permitido", 422);
      }
      details.push({
        product,
        quantity,
        unitPrice: fromCents(unitPriceCents),
        subtotal: fromCents(subtotalCents)
      });
    }

    if (paymentTotalCents !== totalCents) {
      throw httpError("La suma de los pagos debe coincidir con el total de la venta", 422);
    }

    const sale = await Sale.create({
      userId,
      customerId: data.customerId || null,
      total: fromCents(totalCents),
      status: "COMPLETED"
    }, { transaction });

    await SaleDetail.bulkCreate(details.map(detail => ({
      saleId: sale.id,
      productId: detail.product.id,
      quantity: detail.quantity,
      unitPrice: detail.unitPrice,
      subtotal: detail.subtotal
    })), { transaction });

    await Payment.bulkCreate(data.payments.map(payment => ({
      saleId: sale.id,
      method: payment.method,
      amount: fromCents(toCents(payment.amount))
    })), { transaction });

    for (const detail of details) {
      await detail.product.update({
        stock: detail.product.stock - detail.quantity
      }, { transaction });
      await StockMovement.create({
        productId: detail.product.id,
        userId,
        type: "OUT",
        quantity: detail.quantity,
        reason: `Venta #${sale.id}`,
        referenceType: "SALE",
        referenceId: sale.id
      }, { transaction });
    }

    return Sale.findByPk(sale.id, { include: saleIncludes(), transaction });
  });
}

export async function listSales({ page = 1, limit = 20, from, to }, user) {
  const safePage = Math.max(1, Math.floor(Number(page) || 1));
  const safeLimit = Math.min(100, Math.max(1, Math.floor(Number(limit) || 20)));
  const where = {};

  if (from || to) {
    where.createdAt = {};
    if (from) where.createdAt[Op.gte] = new Date(`${from}T00:00:00`);
    if (to) where.createdAt[Op.lt] = new Date(new Date(`${to}T00:00:00`).getTime() + 86400000);
  }
  if (user.role !== "ADMIN") where.userId = user.id;

  const result = await Sale.findAndCountAll({
    where,
    include: [
      { model: User, as: "user", attributes: ["id", "name"] },
      { model: Customer, as: "customer", attributes: ["id", "name"] }
    ],
    limit: safeLimit,
    offset: (safePage - 1) * safeLimit,
    order: [["createdAt", "DESC"]],
    distinct: true
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

export async function getSaleById(id, user) {
  const sale = await Sale.findByPk(id, { include: saleIncludes() });
  if (!sale || (user.role !== "ADMIN" && sale.userId !== user.id)) {
    throw httpError("Venta no encontrada", 404);
  }
  return sale;
}

export async function cancelSale(id, reason, userId) {
  return sequelize.transaction(async transaction => {
    const sale = await Sale.findByPk(id, {
      transaction,
      lock: transaction.LOCK.UPDATE
    });
    if (!sale) throw httpError("Venta no encontrada", 404);
    if (sale.status === "CANCELLED") {
      throw httpError("La venta ya fue cancelada", 409);
    }

    const details = await SaleDetail.findAll({
      where: { saleId: sale.id },
      transaction
    });
    const products = await Product.findAll({
      where: { id: { [Op.in]: details.map(detail => detail.productId) } },
      transaction,
      lock: transaction.LOCK.UPDATE
    });
    const productsById = new Map(products.map(product => [product.id, product]));

    for (const detail of details) {
      const product = productsById.get(detail.productId);
      if (!product) throw httpError("No se pudo restaurar un producto de la venta", 409);
      if (product.stock + detail.quantity > 4294967295) {
        throw httpError("No se pudo restaurar el stock por superar el máximo permitido", 409);
      }
      await product.update({
        stock: product.stock + detail.quantity
      }, { transaction });
      await StockMovement.create({
        productId: product.id,
        userId,
        type: "IN",
        quantity: detail.quantity,
        reason: `Cancelación de venta #${sale.id}: ${reason}`,
        referenceType: "SALE_CANCELLATION",
        referenceId: sale.id
      }, { transaction });
    }

    await sale.update({
      status: "CANCELLED",
      cancelledAt: new Date(),
      cancelledBy: userId,
      cancellationReason: reason
    }, { transaction });

    return Sale.findByPk(sale.id, { include: saleIncludes(), transaction });
  });
}
