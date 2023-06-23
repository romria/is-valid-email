const isValidEmail = require('./is-valid-email');
const {VALID_EMAILS, INVALID_EMAILS} = require('./test-cases');

const getPattern = (isValid) => `${isValid ? '\x1b[32m ✓' : '\x1b[31m ✕'} %s\x1b[0m`

console.log('\x1b[33m%s\x1b[0m', '=========== THESE SHOULD BE VALID ===========');
VALID_EMAILS.forEach(email => {
  console.log(getPattern(isValidEmail(email)), email);
});
console.log('\x1b[33m%s\x1b[0m', '===============================================');

console.log('\x1b[33m%s\x1b[0m', '=========== THESE SHOULD BE INVALID ===========');
INVALID_EMAILS.forEach(email => {
  console.log(getPattern(isValidEmail(email)), email);
});
console.log('\x1b[33m%s\x1b[0m', '===============================================');
