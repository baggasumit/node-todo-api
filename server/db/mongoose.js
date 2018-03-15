const mongoose = require('mongoose');

mongoose.Promise = global.Promise;

const mongoUrlLocal = 'mongodb://localhost:27017/TodoApp';
const mongoUrlProd = 'mongodb://admin:admin@ds213199.mlab.com:13199/todo-app';

const mongoUrl = process.env.NODE_ENV ? mongoUrlProd : mongoUrlLocal;

mongoose.connect(mongoUrl);

module.exports = {
  mongoose,
};
