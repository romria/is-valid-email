import isValidEmail from './is-valid-email.ts';
import { VALID_EMAILS, INVALID_EMAILS } from './test-cases.ts';

const green = (s: string) => `\x1b[32m ✓ ${s}\x1b[0m`;
const red = (s: string) => `\x1b[31m ✕ ${s}\x1b[0m`;
const yellow = (s: string) => `\x1b[33m${s}\x1b[0m`;
const fmt = (valid: boolean, email: string) => (valid ? green : red)(email);

console.log(yellow('=========== THESE SHOULD BE VALID ==========='));
for (const email of VALID_EMAILS) {
  console.log(fmt(isValidEmail(email), email));
}
console.log(yellow('===============================================\n'));

console.log(yellow('=========== THESE SHOULD BE INVALID ==========='));
for (const email of INVALID_EMAILS) {
  console.log(fmt(!isValidEmail(email), email));
}
console.log(yellow('==============================================='));
