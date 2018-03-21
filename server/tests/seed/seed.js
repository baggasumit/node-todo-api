const { ObjectID } = require('mongodb');
const jwt = require('jsonwebtoken');

const { Todo } = require('../../models/todo');
const { User } = require('../../models/user');

const userOneId = new ObjectID();
const userTwoId = new ObjectID();
const users = [
  {
    _id: userOneId,
    email: 'sumit@bagga.com',
    password: 'userOnePass',
    tokens: [
      {
        access: 'auth',
        token: jwt
          .sign({ _id: userOneId, access: 'auth' }, 'abc123')
          .toString(),
      },
    ],
  },
  {
    _id: userTwoId,
    email: 'rohit@bagga.com',
    password: 'userTwoPass',
  },
];

const todos = [
  {
    _id: new ObjectID(),
    text: 'First todo',
  },
  {
    _id: new ObjectID(),
    text: 'Second todo',
  },
];

const populateTodos = (done) => {
  Todo.remove({})
    .then(() => {
      return Todo.insertMany(todos);
    })
    .then(() => done())
    .catch((e) => {
      console.log(e);
    });
};

const populateUsers = (done) => {
  User.remove({})
    .then(() => {
      const userOne = new User(users[0]).save();
      const userTwo = new User(users[1]).save();
      return Promise.all([userOne, userTwo]);
    })
    .then(() => done())
    .catch((e) => {
      console.log(e);
    });
};

module.exports = {
  todos,
  users,
  populateTodos,
  populateUsers,
};