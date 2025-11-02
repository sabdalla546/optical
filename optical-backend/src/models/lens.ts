import { Model, DataTypes } from "sequelize";
import sequelize from "../config/database";

class Lens extends Model {
  public productId!: number;
  public lensType?: string | null;
  public signalType?: string | null; // e.g. "+,+"
  public mensDiameter?: number | null;
  public sphFrom?: number | null;
  public sphTo?: number | null;
  public companyId?: number | null;
  public lensCode?: string | null;
}

Lens.init(
  {
    productId: { type: DataTypes.BIGINT.UNSIGNED, primaryKey: true },
    lensType: { type: DataTypes.STRING, allowNull: true },
    signalType: { type: DataTypes.STRING, allowNull: true },
    mensDiameter: { type: DataTypes.INTEGER.UNSIGNED, allowNull: true },
    sphFrom: { type: DataTypes.DECIMAL(8, 3), allowNull: true },
    sphTo: { type: DataTypes.DECIMAL(8, 3), allowNull: true },
    companyId: { type: DataTypes.BIGINT.UNSIGNED, allowNull: true },
    lensCode: { type: DataTypes.STRING, allowNull: true },
  },
  { sequelize, tableName: "lenses", timestamps: false }
);

export default Lens;
