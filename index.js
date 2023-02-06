require("dotenv").config();

try {
  if (!process.env.MONGO_URI) 
    throw new Error("MONGO_URI env is not set");
  if (!process.env.JWT_SECRET) 
    throw new Error("JWT_SECRET env is not set");
} catch (error) {
  console.error(error.message);
  process.exit(1);
}

const express = require("express");
const locationsController = require("./src/locations/locations.controller");
const usersController = require("./src/users/users.controller");
const mongoose = require("mongoose");
const bodyParser = require("body-parser");
require("./src/authentication/local.strategy");
require("./src/authentication/jwt.strategy");
const passport = require("passport");
const cors = require('cors');

const app = express();

const port = process.env.API_PORT || 3000;

app.use(bodyParser.json());
app.use(cors());

// Protect all /locations route with JWT Authentication
app.use(
  "/locations",
  passport.authenticate("jwt", { session: false }),
  locationsController
);
app.use("/users", usersController);

app.get("/", (req, res) => res.status(200).json({ message: "Hello World !" }));

async function main() {
  await mongoose.connect(process.env.MONGO_URI);
  console.log("Connected to Mongo Database");
  app.listen(port, () => {
    console.log(
      `API listening on port ${port}, visit http://localhost:${port}/`
    );
  });
}

main();
