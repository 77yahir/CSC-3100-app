import express from "express";
import cors from "cors";
import userService from "./services/user-service.js";

const { addUser, getUsers, findUserById, removeUser } = userService;

const app = express();
const port = 8000;

app.use(cors());
app.use(express.json());

app.get("/", (req, res) => {
  res.send("Hello World!");
});

app.get("/users", (req, res) => {
  const name = req.query.name;
  const job = req.query.job;

  getUsers(name, job)
    .then((users) => {
      res.send(users);
    })
    .catch((err) => {
      res.send("Could not find request user");
      console.log(err);
    });
});

app.get("/users/:id", (req, res) => {
  const id = req.params.id; //or req.params.id

  const promise = findUserById(id);
  promise
    .then((user) => {
      if (!user) {
        return res.status(404).send("User not found");
      }
      res.send(user);
    })
    .catch((err) => {
      res.status(404).send("Could not find requested user by id");
      console.log(err);
    });
});

app.post("/users", (req, res) => {
  const userToAdd = req.body;

  if (!userToAdd || !userToAdd.name || !userToAdd.job) {
    return res.status(404).send("Cannot add empty user");
  }

  addUser(userToAdd)
    .then((createdUser) => {
      res.status(201).send(createdUser);
    })
    .catch((err) => {
      res.status(404).send("Unable to add user");
      console.log(err);
    });
});

app.delete("/users/:id", (req, res) => {
  const id = req.params.id;

  const promise = removeUser(id);
  promise
    .then((deletedUser) => {
      if (!deletedUser) {
        return res.status(404).send("User not found");
      }
      res.status(204).send();
    })
    .catch((err) => {
      res.status(404).send("Unable to delete user");
      console.log(err);
    });
});

app.listen(port, () => {
  console.log(`Example app listening at http://localhost:${port}`);
});
