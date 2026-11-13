import bcrypt from "bcrypt";
import { Op } from "sequelize";
import { Role, User } from "../models/index.js";

function httpError(message, status) {
  return Object.assign(new Error(message), { status });
}

function pagination(page, limit) {
  const currentPage = Math.max(1, Math.floor(Number(page) || 1));
  const pageSize = Math.min(100, Math.max(1, Math.floor(Number(limit) || 20)));
  return { page: currentPage, limit: pageSize, offset: (currentPage - 1) * pageSize };
}

function publicUser(user) {
  const data = user.get({ plain: true });
  delete data.passwordHash;
  return data;
}

export async function listUsers({ page, limit, search = "" }) {
  const paging = pagination(page, limit);
  const where = search ? {
    [Op.or]: [
      { name: { [Op.like]: `%${search}%` } },
      { email: { [Op.like]: `%${search}%` } }
    ]
  } : {};
  const result = await User.findAndCountAll({
    where,
    include: [{ model: Role, as: "role", attributes: ["id", "name"] }],
    limit: paging.limit,
    offset: paging.offset,
    order: [["name", "ASC"]]
  });
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

export async function listRoles() {
  return Role.findAll({ order: [["name", "ASC"]] });
}

async function ensureRole(roleId) {
  if (!await Role.findByPk(roleId)) {
    throw httpError("Rol inexistente", 422);
  }
}

async function ensureAnotherActiveAdmin(user) {
  const activeAdmins = await User.count({
    where: {
      roleId: user.roleId,
      isActive: true,
      id: { [Op.ne]: user.id }
    }
  });
  if (activeAdmins === 0) {
    throw httpError("Debe quedar al menos un administrador activo", 409);
  }
}

export async function createUser(data) {
  await ensureRole(data.roleId);
  const user = await User.create({
    name: data.name,
    email: data.email,
    roleId: data.roleId,
    passwordHash: await bcrypt.hash(data.password, Number(process.env.BCRYPT_ROUNDS || 12))
  });
  return publicUser(user);
}

export async function updateUser(id, data) {
  const user = await User.findByPk(id, {
    include: [{ model: Role, as: "role", attributes: ["id", "name"] }]
  });
  if (!user) throw httpError("Usuario no encontrado", 404);
  if (data.roleId) {
    const role = await Role.findByPk(data.roleId);
    if (!role) throw httpError("Rol inexistente", 422);
    if (user.isActive && user.role?.name === "ADMIN" && role.name !== "ADMIN") {
      await ensureAnotherActiveAdmin(user);
    }
  }

  const updates = { ...data };
  if (updates.password) {
    updates.passwordHash = await bcrypt.hash(
      updates.password,
      Number(process.env.BCRYPT_ROUNDS || 12)
    );
    delete updates.password;
  }
  await user.update(updates);
  const updatedUser = await user.reload({
    include: [{ model: Role, as: "role", attributes: ["id", "name"] }]
  });
  return publicUser(updatedUser);
}

export async function setUserStatus(id, isActive, currentUserId) {
  const user = await User.findByPk(id, {
    include: [{ model: Role, as: "role", attributes: ["id", "name"] }]
  });
  if (!user) throw httpError("Usuario no encontrado", 404);
  if (!isActive && user.id === currentUserId) {
    throw httpError("No puedes desactivar tu propio usuario", 409);
  }
  if (!isActive && user.isActive && user.role?.name === "ADMIN") {
    await ensureAnotherActiveAdmin(user);
  }
  await user.update({ isActive });
  return publicUser(user);
}
