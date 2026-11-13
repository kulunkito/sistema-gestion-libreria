
import * as productService from "../services/product.service.js";

export async function list(req, res, next) {
  try {
    const result = await productService.getProducts(req.query, req.user);

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
    const product = await productService.getProductById(req.params.id, req.user);

    res.json({ success: true, data: product });
  } catch (error) {
    next(error);
  }
}

export async function create(req, res, next) {
  try {
    const product = await productService.createProduct(req.validatedBody, req.user.id);

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
      req.validatedBody
    );

    res.json({ success: true, data: product });
  } catch (error) {
    next(error);
  }
}

export async function setStatus(req, res, next) {
  try {
    const product = await productService.setProductStatus(
      req.params.id,
      req.validatedBody.isActive
    );

    res.json({
      success: true,
      data: product,
      message: "Estado del producto actualizado"
    });
  } catch (error) {
    next(error);
  }
}
