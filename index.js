// Library
const express = require("express");

// Files
const Users = require("./data/db.js");

const server = express();

server.use(express.json());

// Sanity Check
server.get("/", (req, res) => {
  res.send("First backend project");
});

// Post
server.post("/api/users", (req, res) => {
  const userInfo = req.body;
  if (userInfo.name && userInfo.bio) {
    Users.insert(userInfo)
      .then(result => {
        res.status(201).json(result);
      })
      .catch(error => {
        res
          .send(500)
          .json({
            error: "There was an error while saving the user to the database"
          });
      });
  } else
    res
      .status(400)
      .json({ errorMessage: "Please provide name and bio for the user." });
});

// Get
server.get("/api/users", (req, res) => {
  Users.find()
    .then(users => {
      res.status(200).json(users);
    })
    .catch(error => {
      res
        .status(500)
        .json({ error: "The users information could not be retrieved." });
    });
});

// Get ID
server.get('/api/users/:id', (req, res) => {
  Users.findById(req.params.id)
    .then(user => {
      if (user) {
        res.status(200).json(user);
      } else {
        res
          .status(404)
          .json({ message: 'The user with the specified ID does not exist.' });
      }
    })
    .catch(() => {
      res
        .status(500)
        .json({ errorMessage: 'The user information could not be retrieved.' });
    });
});


// Update
server.put("/api/users/:id", (req, res) => {
  const { id } = req.params;
  const changes = req.body;

  Users.update(id, changes)
    .then(updated => {
      if (updated) {
        res.status(200).json(updated);
      } else {
        res.status(404).json({ message: "user not found" });
      }
    })
    .catch(error => {
      res.status(500).json({ message: "error updating hub" });
    });
});


// Delete
server.delete("/api/users/:id", (req, res) => {
  const userId = req.params.id;
  Users.remove(userId)
    .then(user => {
      if (user && user > 0) {
        res.status(200).json({
          message: 'the user was deleted.',
        });
      } else {
        res
          .status(404)
          .json({ message: 'The user with the specified ID does not exist.' });
      }
    })
    .catch(() => {
      res.status(500).json({ errorMessage: 'The user could not be removed' });
    });
});


server.listen(8000, () => console.log("running on 8000"));
