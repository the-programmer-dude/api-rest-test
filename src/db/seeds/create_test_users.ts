import Knex from "knex";

export async function seed(instance: Knex) {
  const users = await instance("users");
  await instance("users").insert([
    {
      name: "test",
      username: "test",
      email: "test@test.com",
      password: "$2a$10$Sk4VVHJD8CAVqxkhGUCDX.pPAfA0niLh1.M3KhXjeB5RF8A86nFjm", //123456782
      role: "admin",
      deleted: false,
      deletedByAdmin: false,
      passwordRecuperation: null,
      passwordExpiresIn: null,
    },
    {
      name: "test2",
      username: "test2",
      email: "test2@test.com",
      password: "$2b$10$jQoU7KTlZ0cvsSpaJlW1ge9vexD.udJ3yWqcr0ZuXA0PdiuAPcXtu", //ulisses123
      role: "user",
      deleted: false,
      deletedByAdmin: false,
      passwordRecuperation: null,
      passwordExpiresIn: null,
    },
  ]);
}
