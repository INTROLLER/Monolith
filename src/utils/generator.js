const lower = 'abcdefghijklmnopqrstuvwxyz';
const upper = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ';
const num = '0123456789';
const symb = '!\"#$%&\'()*+,-./:;<=>?@[\\]^_`{|}~';

function generatePass(length, includeLowerCase, includeUpperCase, includeNumbers, includeSymbols) {
  let result = '';
  let chars = [];

  if (includeLowerCase) chars.push(...lower)
  if (includeUpperCase) chars.push(...upper)
  if (includeNumbers) chars.push(...num)
  if (includeSymbols) chars.push(...symb)

  for (let i = 0; i < length; i++) {
    result += chars[Math.floor(Math.random() * chars.length)];
  }

  return result
}

module.exports = {
  generatePass
}
