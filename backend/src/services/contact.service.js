import { Op } from "sequelize";
import { Customer, Supplier } from "../models/index.js";

const models = { customers: Customer, suppliers: Supplier };

function httpError(message, status) {
  return Object.assign(new Error(message), { status });
}

function pagination(page, limit) {
  const currentPage = Math.max(1, Math.floor(Number(page) || 1));
  const pageSize = Math.min(100, Math.max(1, Math.floor(Number(limit) || 20)));
  return { page: currentPage, limit: pageSize, offset: (currentPage - 1) * pageSize };
}

export async function listContacts(type, { page, limit, search = "" } = {}, user) {
  const Model = models[type];
  const paging = pagination(page, limit);
  const result = await Model.findAndCountAll({
    where: {
      ...(user?.role === "ADMIN" ? {} : { isActive: true }),
      ...(search ? { name: { [Op.like]: `%${search}%` } } : {})
    },
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

export async function createContact(type, data) {
  return models[type].create(data);
}

export async function updateContact(type, id, data) {
  const contact = await models[type].findByPk(id);
  if (!contact) throw httpError("Registro no encontrado", 404);
  await contact.update(data);
  return contact;
}

export async function setContactStatus(type, id, isActive) {
  const contact = await models[type].findByPk(id);
  if (!contact) throw httpError("Registro no encontrado", 404);
  await contact.update({ isActive });
  return contact;
}
