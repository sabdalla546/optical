import { Model, DataTypes } from "sequelize";
import sequelize from "../config/database";

class Permission extends Model {
  public id!: number;
  public name!: string;
}

Permission.init(
  {
    id: {
      type: DataTypes.INTEGER.UNSIGNED,
      autoIncrement: true,
      primaryKey: true,
    },
    name: { type: DataTypes.STRING, allowNull: false, unique: true },
  },
  { sequelize, tableName: "permissions", timestamps: true }
);

export default Permission;
