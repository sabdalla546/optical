import sequelize from "../config/database";
import User from "./user";
import Role from "./role";
import Permission from "./permission";
import RolePermission from "./rolePermission";
import UserRole from "./userRole";
import RefreshToken from "./refreshToken";
import BlacklistedToken from "./blacklistedToken";
import Address from "./address";
import Branch from "./branch";
import UserBranch from "./userBranch";
import Product from "./product";
import Frame from "./frame";
import Lens from "./lens";
import Accessory from "./accessory";
import Bag from "./bag";
import Stock from "./stock";
import StockMovement from "./stockMovement";
// Associations
// User <-> Role (through user_roles)
User.belongsToMany(Role, {
  through: UserRole,
  foreignKey: "userId",
  as: "roles",
});
Role.belongsToMany(User, {
  through: UserRole,
  foreignKey: "roleId",
  as: "users",
});

// Role <-> Permission
Role.belongsToMany(Permission, {
  through: RolePermission,
  foreignKey: "roleId",
  as: "permissions",
});
Permission.belongsToMany(Role, {
  through: RolePermission,
  foreignKey: "permissionId",
  as: "roles",
});

// Refresh tokens
RefreshToken.belongsTo(User, { foreignKey: "userId" });
User.hasMany(RefreshToken, { foreignKey: "userId", as: "refreshTokens" });

// Address <-> Branch
Branch.belongsTo(Address, { foreignKey: "address_id", as: "address" });
Address.hasMany(Branch, { foreignKey: "address_id", as: "branches" });

// Optional user branch membership
User.belongsToMany(Branch, {
  through: UserBranch,
  foreignKey: "userId",
  as: "branches",
});
Branch.belongsToMany(User, {
  through: UserBranch,
  foreignKey: "branchId",
  as: "users",
});

UserRole.belongsTo(User, { foreignKey: "userId", as: "user" });
UserRole.belongsTo(Role, { foreignKey: "roleId", as: "role" });
User.hasMany(UserRole, { foreignKey: "userId", as: "userRoles" });
Role.hasMany(UserRole, { foreignKey: "roleId", as: "roleAssignments" });

Product.hasOne(Frame, { foreignKey: "productId", as: "frame" });
Frame.belongsTo(Product, { foreignKey: "productId" });

Product.hasOne(Lens, { foreignKey: "productId", as: "lens" });
Lens.belongsTo(Product, { foreignKey: "productId" });

Product.hasOne(Accessory, { foreignKey: "productId", as: "accessory" });
Accessory.belongsTo(Product, { foreignKey: "productId" });

Product.hasOne(Bag, { foreignKey: "productId", as: "bag" });
Bag.belongsTo(Product, { foreignKey: "productId" });

// stock relations
Stock.belongsTo(Product, { foreignKey: "productId", as: "product" });
Stock.belongsTo(Branch, { foreignKey: "branchId", as: "branch" });
Product.hasMany(Stock, { foreignKey: "productId", as: "stocks" });
Branch.hasMany(Stock, { foreignKey: "branchId", as: "stocks" });

// stock movement relations
StockMovement.belongsTo(Stock, { foreignKey: "stockId", as: "stock" });
StockMovement.belongsTo(Product, { foreignKey: "productId", as: "product" });
StockMovement.belongsTo(Branch, { foreignKey: "branchId", as: "branch" });
// Export everything
export {
  sequelize,
  User,
  Role,
  Permission,
  RolePermission,
  UserRole,
  RefreshToken,
  BlacklistedToken,
  Address,
  Branch,
  UserBranch,
  Product,
  Frame,
  Lens,
  Accessory,
  Bag,
};
