import isValidEmail from './is-valid-email';

const VALID_EMAILS = [
  `simple@example.com`,
  `very.common@example.com`,
  `disposable.style.email.with+symbol@example.com`,
  `other.email-with-hyphen@and.subdomains.example.com`,
  `fully-qualified-domain@example.com`,
  `user.name+tag+sorting@example.com`,  //(may go to user.name@example.com inbox depending on mail server)
  `x@example.com`, // (one-letter local-part)
  `example-indeed@strange-example.com`,
  `test/test@test.com`, // (slashes are a printable character, and allowed)
  `admin@mailserver1`, // (local domain name with no TLD, although ICANN highly discourages dotless email addresses[12])
  `example@s.example`, // (see the List of Internet top-level domains)
  `" "@example.org`, // (space between the quotes)
  `"john..doe"@example.org`, // (quoted double dot)
  `mailhost!username@example.org`, // (bangified host route used for uucp mailers)
  `"very.(),:;<>[]\".VERY.\"very@\\ \"very\".unusual"@strange.example.com`, // (include non-letters character AND multiple at sign, the first one being double quoted)
  `user%example.com@example.org`, // (% escaped mail route to user@example.com via example.org)
  `user-@example.org`, // (local part ending with non-alphanumeric character from the list of allowed printable characters)
  `postmaster@[123.123.123.123]`, // (IP addresses are allowed instead of domains when in square brackets, but strongly discouraged)
  `postmaster@[IPv6:2001:0db8:85a3:0000:0000:8a2e:0370:7334]`, // (IPv6 uses a different syntax)
];

const INVALID_EMAILS = [
  `Abc.example.com`, // (no @ character)
  `A@b@c@example.com`, // (only one @ is allowed outside quotation marks)
  `a"b(c)d,e:f;g<h>i[j\k]l@example.com`, // (none of the special characters in this local-part are allowed outside quotation marks)
  `just"not"right@example.com`, // (quoted strings must be dot separated or the only element making up the local-part)
  `this is"not\allowed@example.com`, // (spaces, quotes, and backslashes may only exist when within quoted strings and preceded by a backslash)
  `this\ still\"not\\allowed@example.com`, // (even if escaped (preceded by a backslash), spaces, quotes, and backslashes must still be contained by quotes)
  `1234567890123456789012345678901234567890123456789012345678901234+x@example.com`, // (local-part is longer than 64 characters)
  `i_like_underscore@but_its_not_allowed_in_this_part.example.com`, // (Underscore is not allowed in domain part)
  `QA[icon]CHOCOLATE[icon]@test.com`, // (icon characters)
];

// beforeEach(() => {
//   jest.spyOn(console, 'warn').mockImplementation(() => {});
// });
//
// beforeAll(() => {
//   jest.spyOn(console, 'log').mockImplementation(() => {});
//   jest.spyOn(console, 'error').mockImplementation(() => {});
//   jest.spyOn(console, 'warn').mockImplementation(() => {});
//   jest.spyOn(console, 'info').mockImplementation(() => {});
//   jest.spyOn(console, 'debug').mockImplementation(() => {});
// });

beforeEach(() => {
  jest.spyOn(console, 'error')
  // @ts-ignore jest.spyOn adds this functionallity
  console.error.mockImplementation(() => null);
});
//
// afterEach(() => {
//   // @ts-ignore jest.spyOn adds this functionallity
//   console.error.mockRestore()
// })

describe("valid emails", () => {
  test.each(VALID_EMAILS)("case %p", (email) => {
    const result = isValidEmail(email);
    expect(result).toBe(true);
  });
});

describe("invalid emails", () => {
  test.each(INVALID_EMAILS)("case %p", (email) => {
    const result = isValidEmail(email);
    expect(result).toBe(false);
  });
});


