
import { DataTypes } from "sequelize";
import sequelize from "../config/database.js";

const Product = sequelize.define("Product", {
  id: {
    type: DataTypes.INTEGER.UNSIGNED,
    primaryKey: true,
    autoIncrement: true
  },
  categoryId: {
    type: DataTypes.INTEGER.UNSIGNED,
    allowNull: false,
    field: "category_id"
  },
  sku: {
    type: DataTypes.STRING(50),
    allowNull: false,
    unique: true
  },
  barcode: {
    type: DataTypes.STRING(100),
    unique: true,
    allowNull: true
  },
  name: {
    type: DataTypes.STRING(150),
    allowNull: false
  },
  description: DataTypes.TEXT,
  purchasePrice: {
    type: DataTypes.DECIMAL(12, 2),
    allowNull: false,
    field: "purchase_price",
    validate: { min: 0 }
  },
  salePrice: {
    type: DataTypes.DECIMAL(12, 2),
    allowNull: false,
    field: "sale_price",
    validate: { min: 0.01 }
  },
  stock: {
    type: DataTypes.INTEGER.UNSIGNED,
    defaultValue: 0,
    validate: { min: 0 }
  },
  minStock: {
    type: DataTypes.INTEGER.UNSIGNED,
    defaultValue: 0,
    field: "min_stock"
  },
  isActive: {
    type: DataTypes.BOOLEAN,
    defaultValue: true,
    field: "is_active"
  }
}, {
  tableName: "products"
});

export default Product;
