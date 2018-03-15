const { Todo } = require('../server/models/todo');
const { mongoose } = require('../server/db/mongoose'); // eslint-disable-line no-unused-vars

const id = '5aa39bb4e209999756534457';

Todo.find({
  _id: id,
}).then((todos) => {
  console.log('todos', todos);
});

Todo.findOne({
  _id: id,
}).then((todo) => {
  console.log('todo', todo);
});

Todo.findById(id)
  .then((todo) => {
    if (!todo) {
      return console.log('Unable to find todo');
    }
    console.log('todo by id', todo);
  })
  .catch((e) => {
    console.log(e.name);
  });
