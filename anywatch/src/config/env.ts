import dotenv from "dotenv";
import { parse } from "pg-connection-string";

dotenv.config();

// Fonction pour récupérer une variable d'environnement et s'assurer qu'elle est définie
function getEnvVariable(key: string): string {
  const value = process.env[key];
  if (!value) {
    console.error(
      `❌ ERREUR: La variable d'environnement ${key} n'est pas définie.`
    );
    process.exit(1);
  }
  return value;
}

const dbConfig = parse(getEnvVariable("DATABASE_URL"));

export const config = {
  jwtSecret: getEnvVariable("JWT_SECRET"),
  port: process.env.PORT || 3000,
  db_host: dbConfig.host,
  db_port: dbConfig.port,
  db_user: dbConfig.user,
  db_password: dbConfig.password,
  db_name: dbConfig.database,
  database_url: getEnvVariable("DATABASE_URL"),
};
