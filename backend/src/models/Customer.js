
import { DataTypes } from "sequelize";
import sequelize from "../config/database.js";

const Customer = sequelize.define("Customer", {
  id: {
    type: DataTypes.INTEGER.UNSIGNED,
    primaryKey: true,
    autoIncrement: true
  },
  name: {
    type: DataTypes.STRING(150),
    allowNull: false
  },
  documentNumber: {
    type: DataTypes.STRING(30),
    field: "document_number"
  },
  email: DataTypes.STRING(150),
  phone: DataTypes.STRING(30),
  address: DataTypes.STRING(255),
  isActive: {
    type: DataTypes.BOOLEAN,
    defaultValue: true,
    field: "is_active"
  }
}, {
  tableName: "customers"
});

export default Customer;
