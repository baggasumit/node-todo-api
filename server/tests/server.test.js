const expect = require('expect');
const request = require('supertest');
const { ObjectID } = require('mongodb');

const { app } = require('../server');
const { Todo } = require('../models/todo');
const { User } = require('../models/user');
const { todos, users, populateTodos, populateUsers } = require('./seed/seed');

beforeEach(populateUsers);
beforeEach(populateTodos);

describe('POST /todos', () => {
  const token = users[0].tokens[0].token;
  it('should create a new todo', (done) => {
    const text = 'Test todo text';

    request(app)
      .post('/todos')
      .set('x-auth', token)
      .send({ text })
      .expect(200)
      .expect((res) => {
        expect(res.body.text).toBe(text);
      })
      .end((err) => {
        // (err, res)
        if (err) {
          return done(err);
        }

        Todo.find({ text })
          .then((todos) => {
            expect(todos.length).toBe(1);
            expect(todos[0].text).toBe(text);
            done();
          })
          .catch((e) => done(e));
      });
  });
  it('should not create todo with invalid body data', (done) => {
    request(app)
      .post('/todos')
      .set('x-auth', token)
      .send({})
      .expect(400)
      .end((err) => {
        // (err, res)
        if (err) {
          return done(err);
        }

        Todo.find()
          .then((todos) => {
            expect(todos.length).toBe(2);
            done();
          })
          .catch((e) => done(e));
      });
  });
});

describe('GET /todos', () => {
  const token = users[0].tokens[0].token;
  it('should get all todos', (done) => {
    request(app)
      .get('/todos')
      .set('x-auth', token)
      .expect(200)
      .expect((res) => {
        expect(res.body.todos.length).toBe(1);
      })
      .end(done);
  });
});

describe('GET /todos/:id', () => {
  const token = users[0].tokens[0].token;
  it('should return todo doc', (done) => {
    request(app)
      .get(`/todos/${todos[0]._id.toHexString()}`)
      .set('x-auth', token)
      .expect(200)
      .expect((res) => {
        expect(res.body.todo.text).toBe(todos[0].text);
      })
      .end(done);
  });

  it('should not return todo doc created by other user', (done) => {
    request(app)
      .get(`/todos/${todos[1]._id.toHexString()}`)
      .set('x-auth', token)
      .expect(404)
      .end(done);
  });

  it('should return 404 if todo not found', (done) => {
    const dummyId = new ObjectID().toHexString();
    request(app)
      .get(`/todos/${dummyId}`)
      .set('x-auth', token)
      .expect(404)
      .end(done);
  });

  it('should return 404 for non-object ids', (done) => {
    request(app)
      .get(`/todos/123`)
      .set('x-auth', token)
      .expect(404)
      .end(done);
  });
});

describe('DELETE /todos/:id', () => {
  const token = users[1].tokens[0].token;
  it('should remove a todo', (done) => {
    const hexId = todos[1]._id.toHexString();
    request(app)
      .delete(`/todos/${hexId}`)
      .set('x-auth', token)
      .expect(200)
      .expect((res) => {
        expect(res.body.todo._id.toBe(hexId));
      })
      .end((err) => {
        if (err) {
          return done();
        }
        Todo.findById(hexId)
          .then((todo) => {
            expect(todo).toBeFalsy();
            done();
          })
          .catch((e) => done(e));
      });
  });

  it('should not remove a todo created by other user', (done) => {
    const hexId = todos[0]._id.toHexString();
    request(app)
      .delete(`/todos/${hexId}`)
      .set('x-auth', token)
      .expect(404)
      .end((err) => {
        if (err) {
          return done();
        }
        Todo.findById(hexId)
          .then((todo) => {
            expect(todo).toBeTruthy();
            done();
          })
          .catch((e) => done(e));
      });
  });

  it('should return 404 if todo not found', (done) => {
    const dummyId = new ObjectID().toHexString();
    request(app)
      .delete(`/todos/${dummyId}`)
      .set('x-auth', token)
      .expect(404)
      .end(done);
  });

  it('should return 404 for non-object ids', (done) => {
    request(app)
      .delete(`/todos/123`)
      .set('x-auth', token)
      .expect(404)
      .end(done);
  });
});

describe('PATCH /todos/:id', () => {
  it('should update the todo', (done) => {
    const hexId = todos[0]._id.toHexString();
    const token = users[0].tokens[0].token;
    request(app)
      .patch(`/todos/${hexId}`)
      .set('x-auth', token)
      .send({
        text: 'Updated text 1',
        completed: true,
      })
      .expect(200)
      .expect((res) => {
        expect(res.body.todo.text).toBe('Updated text 1');
        expect(res.body.todo.completed).toBe(true);
        expect(typeof res.body.todo.completedAt).toBe('number');
      })
      .end(done);
  });

  it('should not update the todo created by other user', (done) => {
    const hexId = todos[0]._id.toHexString();
    const token = users[1].tokens[0].token;
    request(app)
      .patch(`/todos/${hexId}`)
      .set('x-auth', token)
      .send({
        text: 'Updated text 1',
        completed: true,
      })
      .expect(404)
      .end(done);
  });

  it('should clear completedAt when item not completed', (done) => {
    const hexId = todos[1]._id.toHexString();
    const token = users[1].tokens[0].token;
    request(app)
      .patch(`/todos/${hexId}`)
      .set('x-auth', token)
      .send({
        text: 'Updated text 2',
        completed: false,
      })
      .expect(200)
      .expect((res) => {
        expect(res.body.todo.text).toBe('Updated text 2');
        expect(res.body.todo.completed).toBe(false);
        expect(res.body.todo.completedAt).toBeFalsy();
      })
      .end(done);
  });
});

describe('GET /users/me', () => {
  it('should return user if authenticated', (done) => {
    request(app)
      .get('/users/me')
      .set('x-auth', users[0].tokens[0].token)
      .expect(200)
      .expect((res) => {
        expect(res.body._id).toBe(users[0]._id.toHexString());
        expect(res.body.email).toBe(users[0].email);
      })
      .end(done);
  });

  it('should return 401 if not authenticated', (done) => {
    request(app)
      .get('/users/me')
      .expect(401)
      .expect((res) => {
        expect(res.body.name).toBe('JsonWebTokenError');
      })
      .end(done);
  });
});

describe('POST /users', () => {
  it('should create a new user', (done) => {
    const email = 'petergriffin@spooner.street';
    const password = 'randomchars';

    request(app)
      .post('/users')
      .send({ email, password })
      .expect(200)
      .expect((res) => {
        expect(res.headers['x-auth']).toBeTruthy();
        expect(res.body._id).toBeTruthy();
        expect(res.body.email).toBe(email);
      })
      .end((err) => {
        // (err, res)
        if (err) {
          return done(err);
        }

        User.findOne({ email })
          .then((user) => {
            expect(user).toBeTruthy();
            expect(user.email).toBe(email);
            expect(user.password).not.toBe(password);
            done();
          })
          .catch((e) => done(e));
      });
  });

  it('should not create user if email is in use', (done) => {
    const email = 'sumit@bagga.com';
    const password = 'randomchars2';

    request(app)
      .post('/users')
      .send({ email, password })
      .expect(400)
      .end(done);
  });

  it('should return validation errors if request invalid', (done) => {
    const email = 'petergriffinspooner.street';
    const password = 'randomchars3';

    request(app)
      .post('/users')
      .send({ email, password })
      .expect(400)
      .end(done);
  });
});

describe('POST /users/login', () => {
  it('should login user and return auth token', (done) => {
    const email = users[0].email;
    const password = users[0].password;

    request(app)
      .post('/users/login')
      .send({ email, password })
      .expect(200)
      .expect((res) => {
        expect(res.headers['x-auth']).toBeTruthy();
        expect(res.body._id).toBeTruthy();
        expect(res.body.email).toBe(email);
      })
      .end((err, res) => {
        if (err) {
          return done(err);
        }

        User.findById(users[0]._id)
          .then((user) => {
            // toObject converts mongoose documment to JS Object
            expect(user.toObject().tokens[0]).toMatchObject({
              access: 'auth',
              token: res.headers['x-auth'],
            });
            done();
          })
          .catch((e) => done(e));
      });
  });

  it('should reject invalid login', (done) => {
    const email = users[1].email;
    const password = users[1].password + 'xx';

    request(app)
      .post('/users/login')
      .send({ email, password })
      .expect(401)
      .expect((res) => {
        expect(res.headers['x-auth']).toBeFalsy();
      })
      .end((err) => {
        // (err, res)
        if (err) {
          return done(err);
        }

        User.findById(users[1]._id)
          .then((user) => {
            // No tokens present already in the DB
            expect(user.tokens.length).toBe(1);
            done();
          })
          .catch((e) => done(e));
      });
  });
});

describe('DELETE /users/me/token', () => {
  it('should remove auth token on logout', (done) => {
    const token = users[0].tokens[0].token;
    request(app)
      .delete('/users/me/token')
      .set('x-auth', token)
      .expect(200)
      .end((err) => {
        // (err, res)
        if (err) {
          return done(err);
        }

        User.findById(users[0]._id)
          .then((user) => {
            expect(user.tokens.length).toBe(0);
            done();
          })
          .catch((e) => done(e));
      });
  });
});
