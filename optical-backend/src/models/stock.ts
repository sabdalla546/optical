import { Model, DataTypes } from "sequelize";
import sequelize from "../config/database";

class Stock extends Model {
  public id!: number;
  public branchId!: number;
  public productId!: number;
  public quantity!: number;
  public avgCost!: number; // average cost per unit
  public lastCost?: number | null;
}

Stock.init(
  {
    id: {
      type: DataTypes.BIGINT.UNSIGNED,
      autoIncrement: true,
      primaryKey: true,
    },
    branchId: { type: DataTypes.BIGINT.UNSIGNED, allowNull: false },
    productId: { type: DataTypes.BIGINT.UNSIGNED, allowNull: false },
    quantity: { type: DataTypes.INTEGER, allowNull: false, defaultValue: 0 },
    avgCost: {
      type: DataTypes.DECIMAL(12, 4),
      allowNull: false,
      defaultValue: 0,
    },
    lastCost: { type: DataTypes.DECIMAL(12, 4), allowNull: true },
  },
  { sequelize, tableName: "stocks", timestamps: true, underscored: true }
);

export default Stock;
