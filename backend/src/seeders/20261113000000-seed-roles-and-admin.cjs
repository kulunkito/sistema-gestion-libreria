"use strict";

const bcrypt = require("bcrypt");

module.exports = {
  async up(queryInterface) {
    const [existingRoles] = await queryInterface.sequelize.query(
      "SELECT id, name FROM roles"
    );
    const names = new Set(existingRoles.map(role => role.name));
    const now = new Date();
    const roles = [
      { name: "ADMIN", description: "Administración del sistema" },
      { name: "SELLER", description: "Registro y consulta de ventas" }
    ].filter(role => !names.has(role.name));

    if (roles.length) {
      await queryInterface.bulkInsert("roles", roles.map(role => ({
        ...role,
        created_at: now,
        updated_at: now
      })));
    }

    const adminEmail = process.env.ADMIN_EMAIL;
    const [existingAdmins] = await queryInterface.sequelize.query(
      "SELECT id, role_id FROM users WHERE email = ?",
      { replacements: [adminEmail || ""] }
    );

    const [adminRole] = await queryInterface.sequelize.query(
      "SELECT id FROM roles WHERE name = 'ADMIN' LIMIT 1"
    );
    if (existingAdmins.length) {
      if (existingAdmins[0].role_id !== adminRole[0].id) {
        throw new Error("ADMIN_EMAIL ya pertenece a un usuario que no tiene rol ADMIN.");
      }
      return;
    }

    if (!adminEmail || !process.env.ADMIN_PASSWORD || !process.env.ADMIN_NAME) {
      throw new Error("Configure ADMIN_NAME, ADMIN_EMAIL y ADMIN_PASSWORD antes de ejecutar db:seed.");
    }
    if (process.env.ADMIN_PASSWORD.length < 8 || process.env.ADMIN_PASSWORD.length > 72) {
      throw new Error("ADMIN_PASSWORD debe tener entre 8 y 72 caracteres.");
    }

    await queryInterface.bulkInsert("users", [{
      role_id: adminRole[0].id,
      name: process.env.ADMIN_NAME,
      email: adminEmail,
      password_hash: await bcrypt.hash(
        process.env.ADMIN_PASSWORD,
        Number(process.env.BCRYPT_ROUNDS || 12)
      ),
      is_active: true,
      created_at: now,
      updated_at: now
    }]);
  },

  async down() {
    // Keep bootstrap roles and administrator to avoid removing live access on seed rollback.
  }
};
