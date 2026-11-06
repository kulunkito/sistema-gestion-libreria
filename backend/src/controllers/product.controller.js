
import * as productService from "../services/product.service.js";

export async function list(req, res, next) {
  try {
    const result = await productService.getProducts(req.query);

    res.json({
      success: true,
      data: result.items,
      pagination: result.pagination
    });
  } catch (error) {
    next(error);
  }
}

export async function getById(req, res, next) {
  try {
    const product = await productService.getProductById(req.params.id);

    res.json({ success: true, data: product });
  } catch (error) {
    next(error);
  }
}

export async function create(req, res, next) {
  try {
    const product = await productService.createProduct(req.validatedBody);

    res.status(201).json({
      success: true,
      data: product,
      message: "Producto creado correctamente"
    });
  } catch (error) {
    next(error);
  }
}

export async function update(req, res, next) {
  try {
    const product = await productService.updateProduct(
      req.params.id,
      req.body
    );

    res.json({ success: true, data: product });
  } catch (error) {
    next(error);
  }
}

export async function deactivate(req, res, next) {
  try {
    const product = await productService.deactivateProduct(req.params.id);

    res.json({
      success: true,
      data: product,
      message: "Producto desactivado"
    });
  } catch (error) {
    next(error);
  }
}
