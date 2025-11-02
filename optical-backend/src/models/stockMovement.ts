import { Model, DataTypes } from "sequelize";
import sequelize from "../config/database";

class StockMovement extends Model {
  public id!: number;
  public stockId!: number | null;
  public branchId!: number;
  public productId!: number;
  public change!: number; // positive or negative
  public cost?: number | null; // cost per unit for this movement
  public type!: string; // 'receive' | 'adjust' | 'transfer_in' | 'transfer_out' | 'sale'
  public reference?: string | null;
  public createdBy?: number | null;
}

StockMovement.init(
  {
    id: {
      type: DataTypes.BIGINT.UNSIGNED,
      autoIncrement: true,
      primaryKey: true,
    },
    stockId: { type: DataTypes.BIGINT.UNSIGNED, allowNull: true },
    branchId: { type: DataTypes.BIGINT.UNSIGNED, allowNull: false },
    productId: { type: DataTypes.BIGINT.UNSIGNED, allowNull: false },
    change: { type: DataTypes.INTEGER, allowNull: false },
    cost: { type: DataTypes.DECIMAL(12, 4), allowNull: true },
    type: { type: DataTypes.STRING, allowNull: false },
    reference: { type: DataTypes.STRING, allowNull: true },
    createdBy: { type: DataTypes.BIGINT.UNSIGNED, allowNull: true },
  },
  {
    sequelize,
    tableName: "stock_movements",
    timestamps: true,
    underscored: true,
  }
);

export default StockMovement;
