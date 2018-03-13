const mongoose = require('mongoose');

mongoose.Promise = global.Promise;

// mongoose.connect('mongodb://localhost:27017/TodoApp');
mongoose.connect('mongodb://admin:admin@ds213199.mlab.com:13199/todo-app');

module.exports = {
  mongoose,
};
