const connectDatabase = require('./database/connection.js');
const express = require('express');
const { postUser, getUser, getUserToken, deleteUser } = require('./controllers/user.controller.js');

const app = express();
app.use(express.json());

app.post('/api/users', postUser);

app.get('/api/users/:id', getUser);

app.get('/api/users/:id/token', getUserToken);

app.delete('/api/users/:id', deleteUser);

app.get('/api/healthCheck', (req, res) => {
  res.status(200).send({ msg: "Server live!" })
})

app.listen(9090, () => {
  console.log('Server started on port 9090');
  connectDatabase();
})
