const { MongoClient } = require('mongodb');
// const { MongoClient, ObjectID } = require('mongodb');

MongoClient.connect('mongodb://localhost:27017/TodoApp', (err, client) => {
  if (err) {
    return console.log('Unable to connect to Mongodb server');
  }
  console.log('Connected to Mongodb server');
  const db = client.db('TodoApp');
  // db.collection('Todos').insertOne(
  //   {
  //     text: 'Something to do',
  //     completed: false,
  //   },
  //   (err, result) => {
  //     if (err) {
  //       return console.log('Unable to insert todo', err);
  //     }
  //     console.log(result.ops);
  //   }
  // );
  db.collection('Users').insertOne(
    {
      name: 'Lois G',
      age: 38,
      location: 'Quahog',
    },
    (err, result) => {
      if (err) {
        return console.log('Unable to insert user', err);
      }
      console.log(result.ops); // Array of documents that were created
    }
  );
  client.close();
});
