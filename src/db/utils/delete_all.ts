import db from "../connection";

async function deleteAll() {
  await db("users").del();
  console.log("deleted all the users");
  process.exit();
}

for (let i of process.argv) {
  if (i === "--delete-all") {
    deleteAll();
  }
}
