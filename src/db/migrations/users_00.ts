import KNEX from "knex";

export async function up(instance: KNEX) {
  return instance.schema.createTable("users", (table) => {
    table.increments("id").primary();

    table.string("role").defaultTo("user");
    table.boolean("deleted").defaultTo(false);
    table.boolean("deletedByAdmin").defaultTo(false);

    table.string("name").notNullable();
    table.string("username").notNullable();
    table.string("email").notNullable();
    table.string("password").notNullable();
    table.string("passwordRecuperation").defaultTo(null);
    table.string("passwordExpiresIn").defaultTo(null);
  });
}

export async function down(instance: KNEX) {
  return instance.schema.dropTable("users");
}
