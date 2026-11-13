
import * as service from "../services/category.service.js";

export async function list(req, res, next) {
  try {
    const result = await service.listCategories(req.query, req.user);
    res.json({ success: true, data: result.items, pagination: result.pagination });
  } catch (error) {
    next(error);
  }
}

export async function create(req, res, next) {
  try {
    const data = await service.createCategory(req.body);
    res.status(201).json({ success: true, data });
  } catch (error) {
    next(error);
  }
}

export async function update(req, res, next) {
  try {
    const data = await service.updateCategory(req.params.id, req.body);
    res.json({ success: true, data });
  } catch (error) {
    next(error);
  }
}

export async function deactivate(req, res, next) {
  try {
    const data = await service.setCategoryStatus(req.params.id, req.validatedBody.isActive);
    res.json({ success: true, data });
  } catch (error) {
    next(error);
  }
}
