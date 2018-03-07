// const { MongoClient } = require('mongodb');
const { MongoClient, ObjectID } = require('mongodb');

MongoClient.connect('mongodb://localhost:27017/TodoApp', (err, client) => {
  if (err) {
    return console.log('Unable to connect to Mongodb server');
  }
  console.log('Connected to Mongodb server');
  const db = client.db('TodoApp');
  // findOneAndUpdate(filter, update, options)
  // Update operators --> $set, $inc, $max etc
  db
    .collection('Users')
    .findOneAndUpdate(
      {
        _id: new ObjectID('5a9f8714c7ef2a101424955c'),
      },
      {
        $inc: {
          age: 2,
        },
        // $set: {
        //   age: 33,
        // },
      },
      {
        returnOriginal: false,
      }
    )
    .then(
      (result) => {
        console.log('Updating Todos');
        console.log(result);
      },
      (err) => {
        console.log('Unable to fetch and update todos', err);
      }
    );

  client.close();
});
