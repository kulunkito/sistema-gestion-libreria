
import { DataTypes } from "sequelize";
import sequelize from "../config/database.js";

const Sale = sequelize.define("Sale", {
  id: {
    type: DataTypes.INTEGER.UNSIGNED,
    primaryKey: true,
    autoIncrement: true
  },
  userId: {
    type: DataTypes.INTEGER.UNSIGNED,
    allowNull: false,
    field: "user_id"
  },
  customerId: {
    type: DataTypes.INTEGER.UNSIGNED,
    allowNull: true,
    field: "customer_id"
  },
  total: {
    type: DataTypes.DECIMAL(12, 2),
    allowNull: false,
    defaultValue: 0
  },
  status: {
    type: DataTypes.ENUM("COMPLETED", "CANCELLED"),
    defaultValue: "COMPLETED"
  },
  cancelledAt: {
    type: DataTypes.DATE,
    allowNull: true,
    field: "cancelled_at"
  },
  cancelledBy: {
    type: DataTypes.INTEGER.UNSIGNED,
    allowNull: true,
    field: "cancelled_by"
  },
  cancellationReason: {
    type: DataTypes.STRING(255),
    allowNull: true,
    field: "cancellation_reason"
  }
}, {
  tableName: "sales"
});

export default Sale;
