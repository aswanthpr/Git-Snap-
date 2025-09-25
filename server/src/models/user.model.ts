import { DataTypes, Model, Optional } from "sequelize";
import { sequelize } from "../configs/sequelize.config";

interface UserAttributes {
  id: number;
  githubId: number;
  username: string;
  avatarUrl?: string;
  location?: string;
  blog?: string;
  bio?: string;
  publicRepos: number;
  publicGists: number;
  followers: number;
  following: number;
  createdAt: Date;
  deletedAt?: Date;
}

interface UserCreationAttributes extends Optional<UserAttributes, "id" | "deletedAt"> {}

export class User extends Model<UserAttributes, UserCreationAttributes>
  implements UserAttributes {
  public id!: number;
  public githubId!: number;
  public username!: string;
  public avatarUrl?: string;
  public location?: string;
  public blog?: string;
  public bio?: string;
  public publicRepos!: number;
  public publicGists!: number;
  public followers!: number;
  public following!: number;
  public createdAt!: Date;
  public deletedAt?: Date;
}

User.init(
  {
    id: { type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true },
    githubId: { type: DataTypes.INTEGER, unique: true, allowNull: false },
    username: { type: DataTypes.STRING, unique: true, allowNull: false },
    avatarUrl: {type: DataTypes.STRING(500)},
    location: DataTypes.STRING,
    blog: DataTypes.STRING,
    bio: DataTypes.TEXT,
    publicRepos: { type: DataTypes.INTEGER, defaultValue: 0 },
    publicGists: { type: DataTypes.INTEGER, defaultValue: 0 },
    followers: { type: DataTypes.INTEGER, defaultValue: 0 },
    following: { type: DataTypes.INTEGER, defaultValue: 0 },
    createdAt: { type: DataTypes.DATE, defaultValue: DataTypes.NOW },
    deletedAt: DataTypes.DATE,
  },
  { sequelize, tableName: "users", paranoid: true }
);
