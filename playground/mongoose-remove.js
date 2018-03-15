const { Todo } = require('../server/models/todo');
const { mongoose } = require('../server/db/mongoose'); // eslint-disable-line no-unused-vars

const id = '5aa8152d03b4c54643eb8927';

Todo.remove({}).then((result) => {
  console.log('Res: ', result);
});

// Todo.findOneAndRemove({ _id: id });

Todo.findByIdAndRemove(id).then((todo) => {
  console.log('Todo: ', todo);
});
