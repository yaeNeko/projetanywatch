import { Pool, QueryResult, QueryError } from "pg";

const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
  ssl: {
    rejectUnauthorized: false, // Désactive la vérification SSL
  },
});

pool.query("SELECT NOW()", (err: QueryError, res: QueryResult) => {
  if (err) {
    console.error(err);
  } else {
    console.log(res.rows);
  }
});
