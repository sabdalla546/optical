import { Model, DataTypes } from "sequelize";
import sequelize from "../config/database";

class Accessory extends Model {
  public productId!: number;
  public name?: string | null;
  public image?: string | null;
}

Accessory.init(
  {
    productId: { type: DataTypes.BIGINT.UNSIGNED, primaryKey: true },
    name: { type: DataTypes.STRING, allowNull: true },
    image: { type: DataTypes.STRING, allowNull: true },
  },
  { sequelize, tableName: "accessories", timestamps: false }
);

export default Accessory;
