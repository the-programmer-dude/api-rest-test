import knex from "knex";
import path from "path";
import dotenv from "dotenv";

dotenv.config();

const config = knex({
  client: "pg",
  version: "12.3",
  connection: `postgresql://ulisses:${process.env.DB_PASSWORD}@127.0.0.1/ulisses`,
  migrations: {
    directory: path.resolve(__dirname, "migrations"),
  },
  seeds: {
    directory: path.resolve(__dirname, "seeds"),
  },
  useNullAsDefault: true,
});

export default config;
