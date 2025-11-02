import { Model, DataTypes, Optional } from "sequelize";
import sequelize from "../config/database";

interface BlacklistedTokenAttributes {
  id: number;
  jti: string; // unique token identifier (JWT ID)
  expires_at: Date;
}

type CreationAttributes = Optional<BlacklistedTokenAttributes, "id">;

class BlacklistedToken
  extends Model<BlacklistedTokenAttributes, CreationAttributes>
  implements BlacklistedTokenAttributes
{
  public id!: number;
  public jti!: string;
  public expires_at!: Date;
}

BlacklistedToken.init(
  {
    id: {
      type: DataTypes.BIGINT.UNSIGNED,
      autoIncrement: true,
      primaryKey: true,
    },
    jti: { type: DataTypes.STRING, allowNull: false, unique: true },
    expires_at: { type: DataTypes.DATE, allowNull: false },
  },
  {
    sequelize,
    tableName: "blacklisted_tokens",
    timestamps: true,
  }
);

export default BlacklistedToken;
