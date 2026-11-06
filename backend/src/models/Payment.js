
import { DataTypes } from "sequelize";
import sequelize from "../config/database.js";

const Payment = sequelize.define("Payment", {
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
  method: {
    type: DataTypes.ENUM(
      "CASH",
      "DEBIT_CARD",
      "CREDIT_CARD",
      "TRANSFER"
    ),
    allowNull: false
  },
  amount: {
    type: DataTypes.DECIMAL(12, 2),
    allowNull: false,
    validate: { min: 0.01 }
  }
}, {
  tableName: "payments"
});

export default Payment;
