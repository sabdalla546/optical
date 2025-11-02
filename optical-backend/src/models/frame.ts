import { Model, DataTypes } from "sequelize";
import sequelize from "../config/database";

class Frame extends Model {
  public productId!: number;
  public frameType?: string | null;
  public color?: string | null;
  public size?: string | null;
  public image?: string | null;
}

Frame.init(
  {
    productId: { type: DataTypes.BIGINT.UNSIGNED, primaryKey: true },
    frameType: { type: DataTypes.STRING, allowNull: true },
    color: { type: DataTypes.STRING, allowNull: true },
    size: { type: DataTypes.STRING, allowNull: true },
    image: { type: DataTypes.STRING, allowNull: true },
  },
  { sequelize, tableName: "frames", timestamps: false }
);

export default Frame;
