/*import { Model, DataTypes } from "sequelize";
import { sequelize } from "../config/database";

class User extends Model {
  public id!: number;
  public name!: string;
  public phone!: string;
  public email?: string;
  public password_hash!: string;
  public is_active!: boolean;
}

User.init(
  {
    id: {
      type: DataTypes.BIGINT.UNSIGNED,
      autoIncrement: true,
      primaryKey: true,
    },
    name: { type: DataTypes.STRING, allowNull: false },
    phone: { type: DataTypes.STRING, allowNull: false },
    email: { type: DataTypes.STRING, allowNull: true, unique: true },
    password_hash: { type: DataTypes.STRING, allowNull: false },
    is_active: { type: DataTypes.BOOLEAN, defaultValue: true },
  },
  { sequelize, tableName: "users", timestamps: true }
);

export default User;
*/
// example: src/models/user.ts
import { Model, DataTypes } from "sequelize";
import sequelize from "../config/database";

class User extends Model {
  public id!: number;
  public name!: string;
  public phone!: string;
  public email?: string;
  public password_hash!: string;
  public is_active!: boolean;
}

User.init(
  {
    id: {
      type: DataTypes.BIGINT.UNSIGNED,
      autoIncrement: true,
      primaryKey: true,
    },
    name: { type: DataTypes.STRING, allowNull: false },
    phone: { type: DataTypes.STRING, allowNull: false },
    email: { type: DataTypes.STRING, unique: true, allowNull: true },
    password_hash: { type: DataTypes.STRING, allowNull: false },
    is_active: { type: DataTypes.BOOLEAN, defaultValue: true },
  },
  { sequelize, tableName: "users" }
);

export default User;
