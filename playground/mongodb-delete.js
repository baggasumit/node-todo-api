const { MongoClient } = require('mongodb');
// const { MongoClient, ObjectID } = require('mongodb');

MongoClient.connect('mongodb://localhost:27017/TodoApp', (err, client) => {
  if (err) {
    return console.log('Unable to connect to Mongodb server');
  }
  console.log('Connected to Mongodb server');
  const db = client.db('TodoApp');
  db
    .collection('Todos')
    .deleteMany({
      completed: true,
    })
    .then(
      (result) => {
        console.log('Deleting Todos');
        console.log(result);
      },
      (err) => {
        console.log('Unable to fetch todos', err);
      }
    );

  // .deleteOne is similar

  // .findOneAndDelete returns the deleted document in result callback
  client.close();
});
