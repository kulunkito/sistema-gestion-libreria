import * as userService from "../services/user.service.js";

export async function list(req, res, next) {
  try {
    const result = await userService.listUsers(req.query);
    res.json({ success: true, data: result.items, pagination: result.pagination });
  } catch (error) {
    next(error);
  }
}

export async function roles(req, res, next) {
  try {
    res.json({ success: true, data: await userService.listRoles() });
  } catch (error) {
    next(error);
  }
}

export async function create(req, res, next) {
  try {
    const user = await userService.createUser(req.validatedBody);
    res.status(201).json({ success: true, data: user, message: "Usuario creado" });
  } catch (error) {
    next(error);
  }
}

export async function update(req, res, next) {
  try {
    const user = await userService.updateUser(req.params.id, req.validatedBody);
    res.json({ success: true, data: user });
  } catch (error) {
    next(error);
  }
}

export async function setStatus(req, res, next) {
  try {
    const user = await userService.setUserStatus(
      req.params.id,
      req.validatedBody.isActive,
      req.user.id
    );
    res.json({ success: true, data: user });
  } catch (error) {
    next(error);
  }
}
