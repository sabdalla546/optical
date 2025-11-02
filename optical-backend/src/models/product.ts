import { Model, DataTypes } from "sequelize";
import sequelize from "../config/database";

class Product extends Model {
  public id!: number;
  public sku!: string;
  public name!: string;
  public type!: "frame" | "lens" | "accessory" | "bag";
  public brandId?: number | null;
  public companyId?: number | null;
  public defaultCost?: number | null; // optional baseline cost
  // timestamps provided via Sequelize
}

Product.init(
  {
    id: {
      type: DataTypes.BIGINT.UNSIGNED,
      autoIncrement: true,
      primaryKey: true,
    },
    sku: { type: DataTypes.STRING, allowNull: false, unique: true },
    name: { type: DataTypes.STRING, allowNull: false },
    type: {
      type: DataTypes.ENUM("frame", "lens", "accessory", "bag"),
      allowNull: false,
    },
    brandId: { type: DataTypes.BIGINT.UNSIGNED, allowNull: true },
    companyId: { type: DataTypes.BIGINT.UNSIGNED, allowNull: true },
    defaultCost: { type: DataTypes.DECIMAL(12, 2), allowNull: true },
  },
  { sequelize, tableName: "products", timestamps: true }
);

export default Product;
