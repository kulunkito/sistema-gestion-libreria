"use strict";

module.exports = {
  async up(queryInterface, Sequelize) {
    const { DataTypes } = Sequelize;

    await queryInterface.createTable("roles", {
      id: { type: DataTypes.INTEGER.UNSIGNED, primaryKey: true, autoIncrement: true, allowNull: false },
      name: { type: DataTypes.STRING(50), allowNull: false, unique: true },
      description: { type: DataTypes.STRING(255), allowNull: true },
      created_at: { type: DataTypes.DATE, allowNull: false },
      updated_at: { type: DataTypes.DATE, allowNull: false }
    });

    await queryInterface.createTable("users", {
      id: { type: DataTypes.INTEGER.UNSIGNED, primaryKey: true, autoIncrement: true, allowNull: false },
      role_id: {
        type: DataTypes.INTEGER.UNSIGNED,
        allowNull: false,
        references: { model: "roles", key: "id" },
        onUpdate: "CASCADE",
        onDelete: "RESTRICT"
      },
      name: { type: DataTypes.STRING(120), allowNull: false },
      email: { type: DataTypes.STRING(150), allowNull: false, unique: true },
      password_hash: { type: DataTypes.STRING(255), allowNull: false },
      is_active: { type: DataTypes.BOOLEAN, allowNull: false, defaultValue: true },
      created_at: { type: DataTypes.DATE, allowNull: false },
      updated_at: { type: DataTypes.DATE, allowNull: false }
    });

    await queryInterface.createTable("categories", {
      id: { type: DataTypes.INTEGER.UNSIGNED, primaryKey: true, autoIncrement: true, allowNull: false },
      name: { type: DataTypes.STRING(100), allowNull: false, unique: true },
      description: { type: DataTypes.STRING(255), allowNull: true },
      is_active: { type: DataTypes.BOOLEAN, allowNull: false, defaultValue: true },
      created_at: { type: DataTypes.DATE, allowNull: false },
      updated_at: { type: DataTypes.DATE, allowNull: false }
    });

    await queryInterface.createTable("customers", {
      id: { type: DataTypes.INTEGER.UNSIGNED, primaryKey: true, autoIncrement: true, allowNull: false },
      name: { type: DataTypes.STRING(150), allowNull: false },
      document_number: { type: DataTypes.STRING(30), allowNull: true },
      email: { type: DataTypes.STRING(150), allowNull: true },
      phone: { type: DataTypes.STRING(30), allowNull: true },
      address: { type: DataTypes.STRING(255), allowNull: true },
      is_active: { type: DataTypes.BOOLEAN, allowNull: false, defaultValue: true },
      created_at: { type: DataTypes.DATE, allowNull: false },
      updated_at: { type: DataTypes.DATE, allowNull: false }
    });

    await queryInterface.createTable("suppliers", {
      id: { type: DataTypes.INTEGER.UNSIGNED, primaryKey: true, autoIncrement: true, allowNull: false },
      name: { type: DataTypes.STRING(150), allowNull: false },
      tax_id: { type: DataTypes.STRING(20), allowNull: true },
      email: { type: DataTypes.STRING(150), allowNull: true },
      phone: { type: DataTypes.STRING(30), allowNull: true },
      address: { type: DataTypes.STRING(255), allowNull: true },
      is_active: { type: DataTypes.BOOLEAN, allowNull: false, defaultValue: true },
      created_at: { type: DataTypes.DATE, allowNull: false },
      updated_at: { type: DataTypes.DATE, allowNull: false }
    });

    await queryInterface.createTable("products", {
      id: { type: DataTypes.INTEGER.UNSIGNED, primaryKey: true, autoIncrement: true, allowNull: false },
      category_id: {
        type: DataTypes.INTEGER.UNSIGNED,
        allowNull: false,
        references: { model: "categories", key: "id" },
        onUpdate: "CASCADE",
        onDelete: "RESTRICT"
      },
      sku: { type: DataTypes.STRING(50), allowNull: false, unique: true },
      barcode: { type: DataTypes.STRING(100), allowNull: true, unique: true },
      name: { type: DataTypes.STRING(150), allowNull: false },
      description: { type: DataTypes.TEXT, allowNull: true },
      purchase_price: { type: DataTypes.DECIMAL(12, 2), allowNull: false },
      sale_price: { type: DataTypes.DECIMAL(12, 2), allowNull: false },
      stock: { type: DataTypes.INTEGER.UNSIGNED, allowNull: false, defaultValue: 0 },
      min_stock: { type: DataTypes.INTEGER.UNSIGNED, allowNull: false, defaultValue: 0 },
      is_active: { type: DataTypes.BOOLEAN, allowNull: false, defaultValue: true },
      created_at: { type: DataTypes.DATE, allowNull: false },
      updated_at: { type: DataTypes.DATE, allowNull: false }
    });

    await queryInterface.createTable("sales", {
      id: { type: DataTypes.INTEGER.UNSIGNED, primaryKey: true, autoIncrement: true, allowNull: false },
      user_id: {
        type: DataTypes.INTEGER.UNSIGNED,
        allowNull: false,
        references: { model: "users", key: "id" },
        onUpdate: "CASCADE",
        onDelete: "RESTRICT"
      },
      customer_id: {
        type: DataTypes.INTEGER.UNSIGNED,
        allowNull: true,
        references: { model: "customers", key: "id" },
        onUpdate: "CASCADE",
        onDelete: "SET NULL"
      },
      total: { type: DataTypes.DECIMAL(12, 2), allowNull: false },
      status: { type: DataTypes.ENUM("COMPLETED", "CANCELLED"), allowNull: false, defaultValue: "COMPLETED" },
      cancelled_at: { type: DataTypes.DATE, allowNull: true },
      cancelled_by: {
        type: DataTypes.INTEGER.UNSIGNED,
        allowNull: true,
        references: { model: "users", key: "id" },
        onUpdate: "CASCADE",
        onDelete: "SET NULL"
      },
      cancellation_reason: { type: DataTypes.STRING(255), allowNull: true },
      created_at: { type: DataTypes.DATE, allowNull: false },
      updated_at: { type: DataTypes.DATE, allowNull: false }
    });

    await queryInterface.createTable("sale_details", {
      id: { type: DataTypes.INTEGER.UNSIGNED, primaryKey: true, autoIncrement: true, allowNull: false },
      sale_id: {
        type: DataTypes.INTEGER.UNSIGNED,
        allowNull: false,
        references: { model: "sales", key: "id" },
        onUpdate: "CASCADE",
        onDelete: "RESTRICT"
      },
      product_id: {
        type: DataTypes.INTEGER.UNSIGNED,
        allowNull: false,
        references: { model: "products", key: "id" },
        onUpdate: "CASCADE",
        onDelete: "RESTRICT"
      },
      quantity: { type: DataTypes.INTEGER.UNSIGNED, allowNull: false },
      unit_price: { type: DataTypes.DECIMAL(12, 2), allowNull: false },
      subtotal: { type: DataTypes.DECIMAL(12, 2), allowNull: false },
      created_at: { type: DataTypes.DATE, allowNull: false },
      updated_at: { type: DataTypes.DATE, allowNull: false }
    });

    await queryInterface.createTable("payments", {
      id: { type: DataTypes.INTEGER.UNSIGNED, primaryKey: true, autoIncrement: true, allowNull: false },
      sale_id: {
        type: DataTypes.INTEGER.UNSIGNED,
        allowNull: false,
        references: { model: "sales", key: "id" },
        onUpdate: "CASCADE",
        onDelete: "RESTRICT"
      },
      method: { type: DataTypes.ENUM("CASH", "DEBIT_CARD", "CREDIT_CARD", "TRANSFER"), allowNull: false },
      amount: { type: DataTypes.DECIMAL(12, 2), allowNull: false },
      created_at: { type: DataTypes.DATE, allowNull: false },
      updated_at: { type: DataTypes.DATE, allowNull: false }
    });

    await queryInterface.createTable("stock_movements", {
      id: { type: DataTypes.INTEGER.UNSIGNED, primaryKey: true, autoIncrement: true, allowNull: false },
      product_id: {
        type: DataTypes.INTEGER.UNSIGNED,
        allowNull: false,
        references: { model: "products", key: "id" },
        onUpdate: "CASCADE",
        onDelete: "RESTRICT"
      },
      user_id: {
        type: DataTypes.INTEGER.UNSIGNED,
        allowNull: false,
        references: { model: "users", key: "id" },
        onUpdate: "CASCADE",
        onDelete: "RESTRICT"
      },
      supplier_id: {
        type: DataTypes.INTEGER.UNSIGNED,
        allowNull: true,
        references: { model: "suppliers", key: "id" },
        onUpdate: "CASCADE",
        onDelete: "SET NULL"
      },
      type: { type: DataTypes.ENUM("IN", "OUT", "ADJUSTMENT"), allowNull: false },
      quantity: { type: DataTypes.INTEGER.UNSIGNED, allowNull: false },
      reason: { type: DataTypes.STRING(255), allowNull: true },
      reference_type: { type: DataTypes.STRING(30), allowNull: true },
      reference_id: { type: DataTypes.INTEGER.UNSIGNED, allowNull: true },
      created_at: { type: DataTypes.DATE, allowNull: false },
      updated_at: { type: DataTypes.DATE, allowNull: false }
    });

    await queryInterface.addIndex("sales", ["created_at"]);
    await queryInterface.addIndex("sale_details", ["product_id"]);
    await queryInterface.addIndex("stock_movements", ["product_id", "created_at"]);
    await queryInterface.addIndex("stock_movements", ["created_at"]);
  },

  async down(queryInterface) {
    await queryInterface.dropTable("stock_movements");
    await queryInterface.dropTable("payments");
    await queryInterface.dropTable("sale_details");
    await queryInterface.dropTable("sales");
    await queryInterface.dropTable("products");
    await queryInterface.dropTable("suppliers");
    await queryInterface.dropTable("customers");
    await queryInterface.dropTable("categories");
    await queryInterface.dropTable("users");
    await queryInterface.dropTable("roles");
  }
};
