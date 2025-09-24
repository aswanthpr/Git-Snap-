import { DataTypes, Model, Optional } from "sequelize";
import { User } from "./user.model";
import { sequelize } from "../configs/sequelize.config";

// Attributes for Friend
interface FriendAttributes {
  id: number;
  userId: number;                 
  username: string;              
  avatarUrl?: string;      
  githubUrl?: string;      
  createdAt?: Date;
  updatedAt?: Date;
}

interface FriendCreationAttributes extends Optional<FriendAttributes, "id" | "avatarUrl" | "githubUrl" | "createdAt" | "updatedAt"> {}

export class Friend extends Model<FriendAttributes, FriendCreationAttributes> implements FriendAttributes {
  public id!: number;
  public userId!: number;
  public username!: string;
  public avatarUrl?: string;
  public githubUrl?: string;

  public readonly createdAt!: Date;
  public readonly updatedAt!: Date;
}

Friend.init(
  {
    id: { type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true },
    userId: { type: DataTypes.INTEGER, allowNull: false },
    username: { type: DataTypes.STRING, allowNull: false },
    avatarUrl: { type: DataTypes.STRING },
    githubUrl: { type: DataTypes.STRING },
  },
  {
    sequelize,
    tableName: "friends",
    timestamps: true, 
    indexes: [
      { unique: true, fields: ["userId", "username"]  },
    ],
  }
);

// Associations
Friend.belongsTo(User, { as: "user", foreignKey: "userId" });
User.hasMany(Friend, { as: "friends", foreignKey: "userId" });
