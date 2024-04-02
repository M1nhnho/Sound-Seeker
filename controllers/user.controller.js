const { saveUser, fetchUser, fetchUserToken, removeUser } = require("../models/user.model.js");

function postUser(req, res) {
  saveUser(req.body)
    .then((user) => {
      res.status(201).send({ user });
    })
    .catch((err) => {
      console.log(err);
    })
}

function getUser(req, res) {
  const {id} = req.params
  fetchUser(id).then((user) => {
    res.status(200).send({ user });
  })
}

function getUserToken(req, res) {
  const {id} = req.params
  fetchUserToken(id).then((token) => {
    res.status(200).send({ token });
  })
}

function deleteUser(req, res) {
  const {id} = req.params
  removeUser(id).then(() => {
    res.status(204).send();
  })
}

module.exports = { postUser, getUser, getUserToken, deleteUser };