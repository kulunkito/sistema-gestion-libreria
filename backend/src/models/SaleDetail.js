
import { DataTypes } from "sequelize";
import sequelize from "../config/database.js";

const SaleDetail = sequelize.define("SaleDetail", {
  id: {
    type: DataTypes.INTEGER.UNSIGNED,
    primaryKey: true,
    autoIncrement: true
  },
  saleId: {
    type: DataTypes.INTEGER.UNSIGNED,
    allowNull: false,
    field: "sale_id"
  },
  productId: {
    type: DataTypes.INTEGER.UNSIGNED,
    allowNull: false,
    field: "product_id"
  },
  quantity: {
    type: DataTypes.INTEGER.UNSIGNED,
    allowNull: false,
    validate: { min: 1 }
  },
  unitPrice: {
    type: DataTypes.DECIMAL(12, 2),
    allowNull: false,
    field: "unit_price"
  },
  subtotal: {
    type: DataTypes.DECIMAL(12, 2),
    allowNull: false
  }
}, {
  tableName: "sale_details"
});

export default SaleDetail;
