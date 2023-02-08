const connection = require("../config/connection");
const Users = require("../models/User");
const { getRandomName, getRandomUserName, getEmail } = require("./data");

// Start the seeding runtime timer
console.time("seeding");

// Creates a connection to mongodb
connection.once("open", async () => {
  // Delete the entries in the collection
  await Users.deleteMany({});

  // Empty arrays for randomly generated users
  const users = [];

  for (let i = 0; i < 10; i++) {
    const userName = getRandomUserName();
    const newUser = {
      username: userName,
      email: getEmail(userName),
    };
    users.push(newUser);
  }

  // Wait for the users to be inserted into the database
  await Users.collection.insertMany(users);

  console.table(users);
  console.timeEnd("seeding complete 🌱");
  process.exit(0);
});
