// const { SHA256 } = require('crypto-js');
// const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs');

const password = '123abc';

bcrypt.genSalt(10, (err, salt) => {
  bcrypt.hash(password, salt, (err, hash) => {
    console.log('hash :: ', hash);
  });
});

const hashedPassword =
  '$2a$10$/9TVaOSWzIeCM1qyQI4eoefb35CvsotTss8swCMYN7724LmaBse6i';

bcrypt.compare(password, hashedPassword, (err, result) => {
  console.log('Result :: ', result);
});

// const message = 'I am user number 3';
// const hash = SHA256(message);

// console.log(hash);
// console.log(hash.toString());

// const data = {
//   id: 10,
//   name: 'Sumit',
//   isHome: false,
// };

// const token = jwt.sign(data, '123abc');
// console.log('token :: ', token);

// const decoded = jwt.verify(token, '123abc');
// console.log('Decoded :: ', decoded);
