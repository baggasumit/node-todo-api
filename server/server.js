const express = require('express');
const bodyParser = require('body-parser');
const { ObjectID } = require('mongodb');

require('./config/config');
const { Todo } = require('./models/todo');
const { mongoose } = require('./db/mongoose'); // eslint-disable-line no-unused-vars
const { User } = require('./models/user');
const { pick } = require('./utils/utils');
const { authenticate } = require('./middleware/authenticate');

const port = process.env.PORT;

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

app.patch('/todos/:id', (req, res) => {
  const { id } = req.params;
  // console.log('body: ', req.body);
  if (!ObjectID.isValid(id)) {
    return res.status(404).send({});
  }

  let updateTodo = pick(req.body, ['text', 'completed']);

  if (
    typeof updateTodo.completed === 'boolean' &&
    updateTodo.completed === true
  ) {
    updateTodo.completedAt = new Date().getTime();
  } else if (updateTodo.completed === false) {
    updateTodo.completedAt = null;
  }

  Todo.findByIdAndUpdate(
    id,
    {
      $set: updateTodo,
    },
    {
      new: true,
    }
  ).then(
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

app.post('/users', (req, res) => {
  const { email, password } = req.body;
  const user = new User({ email, password });
  user
    .save()
    .then(() => {
      return user.generateAuthToken();
    })
    .then((token) => {
      res.header('x-auth', token).send(user);
    })
    .catch((e) => {
      res.status(400).send(e);
    });
});

app.post('/users/login', (req, res) => {
  const { email, password } = req.body;

  User.findByCredentials(email, password)
    .then((user) => {
      return user.generateAuthToken().then((token) => {
        res.header('x-auth', token).send(user);
      });
    })
    .catch((e) => {
      res.status(401).send(`Error in authentication: ${e}`);
    });
});

app.get('/users/me', authenticate, (req, res) => {
  res.send(req.user);
});

app.listen(port, () => {
  console.log(`Server started at port ${port}`);
  console.log('NODE_ENV: ', process.env.NODE_ENV);
});

module.exports = {
  app,
};
