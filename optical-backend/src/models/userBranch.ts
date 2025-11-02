import { Model, DataTypes } from "sequelize";
import sequelize from "../config/database";

class UserBranch extends Model {
  public userId!: number;
  public branchId!: number;
  public role?: string | null; // optional role label on membership (not required if using user_roles)
}

UserBranch.init(
  {
    userId: { type: DataTypes.BIGINT.UNSIGNED, primaryKey: true },
    branchId: { type: DataTypes.BIGINT.UNSIGNED, primaryKey: true },
    role: { type: DataTypes.STRING, allowNull: true },
  },
  {
    sequelize,
    tableName: "user_branches",
    timestamps: true,
  }
);

export default UserBranch;
