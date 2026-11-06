
import { DataTypes } from "sequelize";
import sequelize from "../config/database.js";

const Supplier = sequelize.define("Supplier", {
  id: {
    type: DataTypes.INTEGER.UNSIGNED,
    primaryKey: true,
    autoIncrement: true
  },
  name: {
    type: DataTypes.STRING(150),
    allowNull: false
  },
  taxId: {
    type: DataTypes.STRING(20),
    field: "tax_id"
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
  tableName: "suppliers"
});

export default Supplier;
