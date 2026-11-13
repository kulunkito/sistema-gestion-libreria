import * as saleService from "../services/sale.service.js";

export async function list(req, res, next) {
  try {
    const result = await saleService.listSales(req.query, req.user);
    res.json({ success: true, data: result.items, pagination: result.pagination });
  } catch (error) {
    next(error);
  }
}

export async function getById(req, res, next) {
  try {
    const sale = await saleService.getSaleById(req.params.id, req.user);
    res.json({ success: true, data: sale });
  } catch (error) {
    next(error);
  }
}

export async function create(req, res, next) {
  try {
    const sale = await saleService.createSale(req.validatedBody, req.user.id);
    res.status(201).json({ success: true, data: sale, message: "Venta registrada" });
  } catch (error) {
    next(error);
  }
}

export async function cancel(req, res, next) {
  try {
    const sale = await saleService.cancelSale(
      req.params.id,
      req.validatedBody.reason,
      req.user.id
    );
    res.json({ success: true, data: sale, message: "Venta cancelada" });
  } catch (error) {
    next(error);
  }
}
