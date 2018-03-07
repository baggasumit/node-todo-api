// const { MongoClient } = require('mongodb');
const { MongoClient, ObjectID } = require('mongodb');

MongoClient.connect('mongodb://localhost:27017/TodoApp', (err, client) => {
  if (err) {
    return console.log('Unable to connect to Mongodb server');
  }
  console.log('Connected to Mongodb server');
  const db = client.db('TodoApp');
  db
    .collection('Todos')
    .find({
      _id: new ObjectID('5a9f885c05ed291049f1e345'),
    })
    .toArray()
    .then(
      (docs) => {
        console.log('Todos');
        console.log(docs);
      },
      (err) => {
        console.log('Unable to fetch todos', err);
      }
    );
  client.close();
});
