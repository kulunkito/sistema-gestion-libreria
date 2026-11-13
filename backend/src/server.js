
import "dotenv/config";
import app from "./app.js";
import sequelize from "./config/database.js";
import "./models/index.js";

const PORT = process.env.PORT || 3000;

async function startServer() {
  try {
    if (!process.env.JWT_SECRET
      || process.env.JWT_SECRET.includes("replace_with")
      || process.env.JWT_SECRET.length < 32) {
      throw new Error("JWT_SECRET debe configurarse con al menos 32 caracteres aleatorios.");
    }
    if (!process.env.FRONTEND_URL) {
      throw new Error("FRONTEND_URL debe configurarse para limitar CORS.");
    }
    await sequelize.authenticate();
    console.log("MySQL conectado correctamente.");

    app.listen(PORT, () => {
      console.log(`Servidor ejecutándose en http://localhost:${PORT}`);
    });
  } catch (error) {
    console.error("Error al iniciar el servidor:", error.message);
    process.exit(1);
  }
}

startServer();
