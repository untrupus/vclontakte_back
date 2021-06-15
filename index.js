const express = require("express");
const app = express();
const mongoose = require("mongoose");
const users = require("./app/users");
const posts = require("./app/posts");
const groups = require("./app/groups");
const friends = require("./app/friends");
const cors = require('cors');
const config = require("./config");
const port = 8000;
app.use(cors());
app.use(express.json());
app.use(express.static('public'));

const options = {
  useNewUrlParser: true,
  useUnifiedTopology: true,
  useFindAndModify: false
};

const run = async () => {
  await mongoose.connect(config.db.url + "/" + config.db.name, options);

  app.use("/users", users);
  app.use("/posts", posts);
  app.use("/groups", groups);
  app.use("/friends", friends);

  console.log("Connected");
  app.listen(port, () => {
    console.log(`Server started on ${port} port!`);
  });
};

run().catch(console.error);