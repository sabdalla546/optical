import { Model, DataTypes } from "sequelize";
import sequelize from "../config/database";

class UserRole extends Model {}

UserRole.init(
  {
    userId: { type: DataTypes.BIGINT.UNSIGNED, primaryKey: true },
    roleId: { type: DataTypes.INTEGER.UNSIGNED, primaryKey: true },
    branchId: { type: DataTypes.BIGINT.UNSIGNED, allowNull: true },
  },
  { sequelize, tableName: "user_roles", timestamps: true }
);

export default UserRole;
