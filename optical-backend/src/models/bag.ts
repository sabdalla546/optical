import { Model, DataTypes } from "sequelize";
import sequelize from "../config/database";

class Bag extends Model {
  public productId!: number;
  public name?: string | null;
  public image?: string | null;
}

Bag.init(
  {
    productId: { type: DataTypes.BIGINT.UNSIGNED, primaryKey: true },
    name: { type: DataTypes.STRING, allowNull: true },
    image: { type: DataTypes.STRING, allowNull: true },
  },
  { sequelize, tableName: "bags", timestamps: false }
);

export default Bag;
