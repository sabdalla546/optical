import { Model, DataTypes } from "sequelize";
import sequelize from "../config/database";
import Address from "./address";

class Branch extends Model {
  public id!: number;
  public name!: string;
  public phone?: string | null;
  public address_id?: number | null;
  public address_text?: string | null;
  public created_by?: number | null;
}

Branch.init(
  {
    id: {
      type: DataTypes.BIGINT.UNSIGNED,
      autoIncrement: true,
      primaryKey: true,
    },
    name: { type: DataTypes.STRING, allowNull: false },
    phone: { type: DataTypes.STRING, allowNull: true },
    address_id: { type: DataTypes.BIGINT.UNSIGNED, allowNull: true },
    address_text: { type: DataTypes.TEXT, allowNull: true },
    created_by: { type: DataTypes.BIGINT.UNSIGNED, allowNull: true },
  },
  {
    sequelize,
    tableName: "branches",
    timestamps: true,
  }
);

// Association note: do NOT call belongsTo here if index manages associations, but ok to declare

export default Branch;
