import express from "express";
import cors from "cors";

const app = express();
const port = 8000;

app.use(cors());
app.use(express.json());

const users = {
  users_list: [
    {
      id: "xyz789",
      name: "Charlie",
      job: "Janitor",
    },
    {
      id: "abc123",
      name: "Mac",
      job: "Bouncer",
    },
    {
      id: "ppp222",
      name: "Mac",
      job: "Professor",
    },
    {
      id: "yat999",
      name: "Dee",
      job: "Aspring actress",
    },
    {
      id: "zap555",
      name: "Dennis",
      job: "Bartender",
    },
  ],
};

const findUserByName = (name) => {
  return users["users_list"].filter((user) => user["name"] === name);
};

const findUserById = (id) => {
  return users["users_list"].find((user) => user["id"] === id);
};

const findUserIndex = (id) => {
  return users["users_list"].findIndex((user) => user["id"] === id);
};

const findUsersByNameAndJob = (name, job) => {
  return users.users_list.filter(
    (user) => user.name === name && user.job === job,
  );
};

const addUser = (user) => {
  users["users_list"].push(user);
  return user;
};

app.get("/", (req, res) => {
  res.send("Hello World!");
});

app.get("/users", (req, res) => {
  const name = req.query.name;
  if (name != undefined) {
    let result = findUserByName(name);
    result = { users_list: result };
    res.send(result);
  } else {
    res.send(users);
  }
});

app.get("/users/search", (req, res) => {
  const name = req.query.name;
  const job = req.query.job;
  let result = findUsersByNameAndJob(name, job);

  if (result.length == 0) {
    res.status(404).send("No matching users found");
  } else {
    res.status(200).send(result);
  }
});

app.get("/users/:id", (req, res) => {
  const id = req.params["id"]; //or req.params.id
  let result = findUserById(id);
  if (result === undefined) {
    res.status(404).send("Resource not found.");
  } else {
    res.send(result);
  }
});

app.post("/users", (req, res) => {
  const userToAdd = req.body;
  if (!userToAdd | !userToAdd.name | !userToAdd.job) {
    res.status(404).send("Cannot add empty user");
  }
  const user = addUser(userToAdd);
  if (user == userToAdd) {
    res.status(201).send();
  } else {
    res.status(404).send("Unable to add user");
  }
});

app.delete("/users/:id", (req, res) => {
  const id = req.params["id"];
  const index = findUserIndex(id);

  if (index == -1) {
    res.status(404).send("User not found");
  } else {
    users.users_list.splice(index, 1);
    res.status(204).send();
  }
});

app.listen(port, () => {
  console.log(`Example app listening at http://localhost:${port}`);
});
