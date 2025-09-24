import { Sequelize } from "sequelize";
import "dotenv/config"

const {DATABASE_URL} = process?.env

 export const sequelize = new Sequelize(DATABASE_URL as string, {
  dialect: "postgres",
  protocol: "postgres",
  logging: false,
  dialectOptions: {
    ssl: {
      require: true,
      rejectUnauthorized: false
    },
  },
});
 
export async function initDB() {
  try {
    await sequelize.authenticate(); 
     console.log("Connection to PostgreSQL established successfully");
    // Sync models (create tables if they don't exist)
    await sequelize.sync({ alter: true });
  } catch (err) {
    console.error("❌ DB connection failed", err);
  }
}