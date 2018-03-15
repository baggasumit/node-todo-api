const express = require('express');
const bodyParser = require('body-parser');
const { ObjectID } = require('mongodb');

const { Todo } = require('./models/todo');
const { mongoose } = require('./db/mongoose'); // eslint-disable-line no-unused-vars
// const { User } = require('./models/user');

const port = process.env.PORT || 3000;

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

app.get('/todos', (req, res) => {
  Todo.find().then(
    (todos) => {
      res.send({ todos });
    },
    (e) => {
      res.status(400).send(e);
    }
  );
});

app.get('/todos/:id', (req, res) => {
  const { id } = req.params;
  if (!ObjectID.isValid(id)) {
    return res.status(404).send({});
  }
  Todo.findById(id).then(
    (todo) => {
      if (!todo) {
        return res.status(404).send({});
      }
      res.send({ todo });
    },
    (e) => {
      res.status(400).send(e);
    }
  );
});

app.delete('/todos/:id', (req, res) => {
  const { id } = req.params;
  if (!ObjectID.isValid(id)) {
    return res.status(404).send({});
  }
  Todo.findByIdAndRemove(id).then(
    (todo) => {
      if (!todo) {
        return res.status(404).send({});
      }
      res.send({ todo });
    },
    (e) => {
      res.status(400).send(e);
    }
  );
});

app.listen(port, () => {
  console.log(`Server started at port ${port}`);
  console.log('NODE_ENV: ', process.env.NODE_ENV);
});

module.exports = {
  app,
};
