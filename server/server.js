const express = require('express');
const bodyParser = require('body-parser');

const { mongoose } = require('./db/mongoose');
const { Todo } = require('./models/todo');
const { User } = require('./models/user');

const port = 3000;

const app = express();
app.use(bodyParser.json());

app.post('/todos', (req, res) => {
  const { text } = req.body;
  const todo = new Todo({ text });
  todo.save().then(
    (doc) => {
      res.send(doc);
    },
    (e) => {
      res.status(400).send(e);
    }
  );
});

app.listen(port, () => {
  console.log(`Server started at port ${port}`);
});
