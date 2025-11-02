import { Model, DataTypes } from "sequelize";
import sequelize from "../config/database";

class Role extends Model {
  public id!: number;
  public name!: string;
  public description?: string;
}

Role.init(
  {
    id: {
      type: DataTypes.INTEGER.UNSIGNED,
      autoIncrement: true,
      primaryKey: true,
    },
    name: { type: DataTypes.STRING, allowNull: false, unique: true },
    description: { type: DataTypes.TEXT, allowNull: true },
  },
  { sequelize, tableName: "roles", timestamps: true }
);

export default Role;
