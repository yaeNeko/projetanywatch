import { Client } from "pg";
import { config } from "./env";

const client = new Client({
	host: config.db_host,
	port: config.db_port as number,
	user: config.db_user,
	password: config.db_password,
	database: config.db_name,
});

client
	.connect()
	.then(() => console.log("Connecté à PostgreSQL"))
	.catch((err: Error) => console.error("Erreur de connexion à PostgreSQL", err));

export default client;
