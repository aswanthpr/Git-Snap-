import { DataTypes, Model, Optional } from "sequelize";
import { User } from "./user.model";
import { sequelize } from "../configs/sequelize.config";

interface RepositoryAttributes {
  id: number;
  repoId: number;
  name: string;
  description?: string;
  htmlUrl: string;
  language?: string;
  stargazers: number;
  userId: number;
}

interface RepositoryCreationAttributes extends Optional<RepositoryAttributes, "id"> {}

export class Repository extends Model<RepositoryAttributes, RepositoryCreationAttributes>
  implements RepositoryAttributes {
  public id!: number;
  public repoId!: number;
  public name!: string;
  public description?: string;
  public htmlUrl!: string;
  public language?: string;
  public stargazers!: number;
  public userId!: number;
}

Repository.init(
  {
    id: { type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true },
    repoId: { type: DataTypes.INTEGER, unique: true, allowNull: false },
    name: { type: DataTypes.STRING, allowNull: false },
    description: DataTypes.STRING,
    htmlUrl: { type: DataTypes.STRING, allowNull: false },
    language: DataTypes.STRING,
    stargazers: { type: DataTypes.INTEGER, defaultValue: 0 },
    userId: { type: DataTypes.INTEGER, allowNull: false },
  },
  { sequelize, tableName: "repositories" }
);

// Association
Repository.belongsTo(User, { foreignKey: "userId" });
User.hasMany(Repository, { foreignKey: "userId" });
