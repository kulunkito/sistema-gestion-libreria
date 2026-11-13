import * as contactService from "../services/contact.service.js";

function createContactController(type) {
  return {
    async list(req, res, next) {
      try {
        const result = await contactService.listContacts(type, req.query, req.user);
        res.json({ success: true, data: result.items, pagination: result.pagination });
      } catch (error) {
        next(error);
      }
    },
    async create(req, res, next) {
      try {
        const contact = await contactService.createContact(type, req.validatedBody);
        res.status(201).json({ success: true, data: contact });
      } catch (error) {
        next(error);
      }
    },
    async update(req, res, next) {
      try {
        const contact = await contactService.updateContact(type, req.params.id, req.validatedBody);
        res.json({ success: true, data: contact });
      } catch (error) {
        next(error);
      }
    },
    async deactivate(req, res, next) {
      try {
        const contact = await contactService.setContactStatus(
          type,
          req.params.id,
          req.validatedBody.isActive
        );
        res.json({ success: true, data: contact });
      } catch (error) {
        next(error);
      }
    }
  };
}

export const customersController = createContactController("customers");
export const suppliersController = createContactController("suppliers");
