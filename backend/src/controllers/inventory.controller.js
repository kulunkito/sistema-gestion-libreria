import * as inventoryService from "../services/inventory.service.js";

export async function list(req, res, next) {
  try {
    const result = await inventoryService.listInventory(req.query);
    res.json({ success: true, data: result.items, pagination: result.pagination });
  } catch (error) {
    next(error);
  }
}

export async function lowStock(req, res, next) {
  try {
    const result = await inventoryService.listLowStock(req.query);
    res.json({ success: true, data: result.items, pagination: result.pagination });
  } catch (error) {
    next(error);
  }
}

export async function movements(req, res, next) {
  try {
    const result = await inventoryService.listMovements(req.query);
    res.json({ success: true, data: result.items, pagination: result.pagination });
  } catch (error) {
    next(error);
  }
}

export async function createMovement(req, res, next) {
  try {
    const result = await inventoryService.createMovement(req.validatedBody, req.user.id);
    res.status(201).json({ success: true, data: result, message: "Movimiento registrado" });
  } catch (error) {
    next(error);
  }
}
