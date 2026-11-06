
import { DataTypes } from "sequelize";
import sequelize from "../config/database.js";

const StockMovement = sequelize.define("StockMovement", {
  id: {
    type: DataTypes.INTEGER.UNSIGNED,
    primaryKey: true,
    autoIncrement: true
  },
  productId: {
    type: DataTypes.INTEGER.UNSIGNED,
    allowNull: false,
    field: "product_id"
  },
  userId: {
    type: DataTypes.INTEGER.UNSIGNED,
    allowNull: false,
    field: "user_id"
  },
  supplierId: {
    type: DataTypes.INTEGER.UNSIGNED,
    allowNull: true,
    field: "supplier_id"
  },
  type: {
    type: DataTypes.ENUM("IN", "OUT", "ADJUSTMENT"),
    allowNull: false
  },
  quantity: {
    type: DataTypes.INTEGER.UNSIGNED,
    allowNull: false,
    validate: { min: 1 }
  },
  reason: DataTypes.STRING(255),
  referenceType: {
    type: DataTypes.STRING(30),
    field: "reference_type"
  },
  referenceId: {
    type: DataTypes.INTEGER.UNSIGNED,
    field: "reference_id"
  }
}, {
  tableName: "stock_movements"
});

export default StockMovement;
