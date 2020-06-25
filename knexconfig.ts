import path from "path";

module.exports = {
  client: "pg",
  connection: {
    filename: path.resolve(__dirname, "src", "db", "connection.ts"),
  },
  migrations: {
    directory: path.resolve(__dirname, "src", "db", "migrations"),
  },
  seeds: {
    directory: path.resolve(__dirname, "src", "db", "seeds"),
  },
  useNullAsDefault: true,
};
