const fs = require('fs');

let cryptoString
const securePath = './data/secure.json';

const lower = 'abcdefghijklmnopqrstuvwxyz';
const upper = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ';
const num = '0123456789';
const symb = '!\"#$%&\'()*+,-./:;<=>?@[\\]^_`{|}~';

const AllChars = [...lower, ...upper, ...num, ...symb + ' '];

function encrypt(data_type, data) {
  let key

  if (data_type == 'password') key = cryptoString[0]
  else if (data_type == 'login') key = cryptoString[1]
  else if (data_type == 'auth_portal') key = cryptoString[2]

  let encrypted = ''
  for (let i = 0; i < data.length; i++) {
    let char = data[i]
    let index = AllChars.indexOf(char)
    let encryptedChar = key[index]
    encrypted += encryptedChar
  }

  return encrypted
}

function decrypt(data_type, data) {
  let key

  if (data_type == 'password') key = cryptoString[0]
  else if (data_type == 'login') key = cryptoString[1]
  else if (data_type == 'auth_portal') key = cryptoString[2]

  let decrypted = ''
  for (let i = 0; i < data.length; i++) {
    let char = data[i]
    let index = key.indexOf(char)
    let decryptedChar = AllChars[index]
    decrypted += decryptedChar
  }

  return decrypted
}

try {
  fs.readFile(securePath, 'utf8', (err, data) => {
    if (err) {
      console.error('Error reading file:', err);
      return;
    }

    cryptoString = JSON.parse(data);
  });
} catch (error) {
  console.error('Error reading file:', error);
}

module.exports = {
  encrypt,
  decrypt
}