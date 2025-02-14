const fs = require('fs');

let cryptoString
const mapsPath = './data/keys.json';

const lower = 'abcdefghijklmnopqrstuvwxyz';
const upper = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ';
const num = '0123456789';
const symb = '!\"#$%&\'()*+,-./:;<=>?@[\\]^_`{|}~';

const AllChars = [...lower, ...upper, ...num, ...symb + ' '];
const AllCharsNoSpace = [...lower, ...upper, ...num, ...symb];

// Load keys synchronously on startup
try {
  if (fs.existsSync(mapsPath)) {
    const data = fs.readFileSync(mapsPath, 'utf8'); // Blocking call
    cryptoString = JSON.parse(data);
    console.log("✅ Keys loaded successfully on startup!");
  } else {
    console.log("⚠️ Keys file not found, generating new keys...");
    cryptoString = generateKeys();
    fs.writeFileSync(mapsPath, JSON.stringify(cryptoString, null, 2), 'utf8');
    console.log("✅ New keys generated and saved!");
  }
} catch (error) {
  console.error("❌ Error reading keys.json:", error);
  process.exit(1); // Exit the app if keys can't be loaded
}

function encrypt(data_type, data) {
  let key

  if (data_type == 'password') key = cryptoString[0]
  else if (data_type == 'login') key = cryptoString[1]
  else if (data_type == 'auth_portal') key = cryptoString[2]

  let result = ''

  for (let i = 0; i < data.length; i++) {
    let char = data[i]
    let index = AllChars.indexOf(char)
    let encryptedChar = key[index]
    result += encryptedChar
  }

  return result
}

function decrypt(data_type, data) {
  let key

  if (data_type == 'password') key = cryptoString[0]
  else if (data_type == 'login') key = cryptoString[1]
  else if (data_type == 'auth_portal') key = cryptoString[2]

  let result = ''
  
  for (let i = 0; i < data.length; i++) {
    let char = data[i]
    let index = key.indexOf(char)
    let decryptedChar = AllChars[index]
    result += decryptedChar
  }

  return result
}

function generateKeys() {
  let resultList = []

  for (let i = 0; i < 3; i++) {
    let result = []

    for (let i = 0; i < AllChars.length; i++) {
      let index = Math.floor(Math.random() * AllCharsNoSpace.length)
      result.push(AllCharsNoSpace[index])
    }

    result.push(' ')

    resultList.push(result)
  }

  return resultList
}

module.exports = {
  encrypt,
  decrypt,
  generateKeys
}