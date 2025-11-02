import dotenv from "dotenv";
import { Sequelize } from "sequelize";

// Load environment variables from .env file
dotenv.config({ path: "./.env" });

// Extract variables
const DBName = process.env.DB_DATABASE;
const DBUsername = process.env.DB_USERNAME;
const DBPassword = process.env.DB_PASSWORD;
const DBHost = process.env.DB_HOST;

// Validate environment setup
if (!DBName || !DBUsername || !DBHost) {
  throw new Error(
    "❌ Database credentials missing. Please check your .env file."
  );
}

// Create Sequelize instance
const sequelize = new Sequelize(DBName, DBUsername, DBPassword, {
  host: DBHost,
  dialect: "mysql",
  logging: process.env.NODE_ENV === "development" ? console.log : false,
  timezone: "+03:00", // example: Egypt/Kuwait timezone (GMT+3)
  dialectOptions: {
    charset: "utf8mb4",
  },
  define: {
    freezeTableName: true, // Prevents plural table names
    timestamps: true, // Adds createdAt/updatedAt
    underscored: true, // snake_case in DB columns
    charset: "utf8mb4",
    collate: "utf8mb4_unicode_ci",
  },
});

// Verify connection
(async () => {
  try {
    await sequelize.authenticate();
    console.log("✅ Database connected successfully");
  } catch (error) {
    console.error("❌ Database connection failed:", error);
  }
})();

export default sequelize;
