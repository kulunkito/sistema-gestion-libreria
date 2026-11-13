
import Role from "./Role.js";
import User from "./User.js";
import Category from "./Category.js";
import Product from "./Product.js";
import Customer from "./Customer.js";
import Supplier from "./Supplier.js";
import Sale from "./Sale.js";
import SaleDetail from "./SaleDetail.js";
import Payment from "./Payment.js";
import StockMovement from "./StockMovement.js";

Role.hasMany(User, { foreignKey: "roleId", as: "users" });
User.belongsTo(Role, { foreignKey: "roleId", as: "role" });

Category.hasMany(Product, { foreignKey: "categoryId", as: "products" });
Product.belongsTo(Category, { foreignKey: "categoryId", as: "category" });

User.hasMany(Sale, { foreignKey: "userId", as: "sales" });
Sale.belongsTo(User, { foreignKey: "userId", as: "user" });
User.hasMany(Sale, { foreignKey: "cancelledBy", as: "cancelledSales" });
Sale.belongsTo(User, { foreignKey: "cancelledBy", as: "canceller" });

Customer.hasMany(Sale, { foreignKey: "customerId", as: "sales" });
Sale.belongsTo(Customer, { foreignKey: "customerId", as: "customer" });

Sale.hasMany(SaleDetail, { foreignKey: "saleId", as: "items" });
SaleDetail.belongsTo(Sale, { foreignKey: "saleId", as: "sale" });

Product.hasMany(SaleDetail, { foreignKey: "productId", as: "saleDetails" });
SaleDetail.belongsTo(Product, { foreignKey: "productId", as: "product" });

Sale.hasMany(Payment, { foreignKey: "saleId", as: "payments" });
Payment.belongsTo(Sale, { foreignKey: "saleId", as: "sale" });

Product.hasMany(StockMovement, { foreignKey: "productId", as: "movements" });
StockMovement.belongsTo(Product, { foreignKey: "productId", as: "product" });

User.hasMany(StockMovement, { foreignKey: "userId", as: "stockMovements" });
StockMovement.belongsTo(User, { foreignKey: "userId", as: "user" });

Supplier.hasMany(StockMovement, { foreignKey: "supplierId", as: "movements" });
StockMovement.belongsTo(Supplier, { foreignKey: "supplierId", as: "supplier" });

export {
  Role,
  User,
  Category,
  Product,
  Customer,
  Supplier,
  Sale,
  SaleDetail,
  Payment,
  StockMovement
};
