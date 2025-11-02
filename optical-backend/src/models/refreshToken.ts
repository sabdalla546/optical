import { Model, DataTypes, Optional } from "sequelize";
import sequelize from "../config/database";

interface RefreshTokenAttributes {
  id: number;
  token_hash: string;
  userId: number;
  expires_at: Date;
  revoked: boolean;
  device_info?: string;
}

type RefreshTokenCreationAttributes = Optional<
  RefreshTokenAttributes,
  "id" | "revoked" | "device_info"
>;

class RefreshToken
  extends Model<RefreshTokenAttributes, RefreshTokenCreationAttributes>
  implements RefreshTokenAttributes
{
  public id!: number;
  public token_hash!: string;
  public userId!: number;
  public expires_at!: Date;
  public revoked!: boolean;
  public device_info?: string;
}

RefreshToken.init(
  {
    id: {
      type: DataTypes.BIGINT.UNSIGNED,
      autoIncrement: true,
      primaryKey: true,
    },
    token_hash: { type: DataTypes.STRING, allowNull: false },
    userId: { type: DataTypes.BIGINT.UNSIGNED, allowNull: false },
    expires_at: { type: DataTypes.DATE, allowNull: false },
    revoked: { type: DataTypes.BOOLEAN, defaultValue: false },
    device_info: { type: DataTypes.STRING, allowNull: true },
  },
  { sequelize, tableName: "refresh_tokens", timestamps: true }
);

export default RefreshToken;
