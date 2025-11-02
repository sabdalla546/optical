import { Model, DataTypes } from "sequelize";
import sequelize from "../config/database";

class Address extends Model {
  public id!: number;
  public governorate!: string;
  public area!: string;
  public street?: string | null;
}

Address.init(
  {
    id: {
      type: DataTypes.BIGINT.UNSIGNED,
      autoIncrement: true,
      primaryKey: true,
    },
    governorate: { type: DataTypes.STRING, allowNull: false },
    area: { type: DataTypes.STRING, allowNull: false },
    street: { type: DataTypes.STRING, allowNull: true },
  },
  {
    sequelize,
    tableName: "addresses",
    timestamps: true,
  }
);

export default Address;
