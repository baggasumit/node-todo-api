const { SHA256 } = require('crypto-js');
const jwt = require('jsonwebtoken');

const message = 'I am user number 3';
const hash = SHA256(message);

console.log(hash);
console.log(hash.toString());

const data = {
  id: 10,
  name: 'Sumit',
  isHome: false,
};

const token = jwt.sign(data, '123abc');
console.log('token :: ', token);

const decoded = jwt.verify(token, '123abc');
console.log('Decoded :: ', decoded);
