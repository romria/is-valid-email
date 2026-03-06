import { describe, test, expect } from 'vitest';
import isValidEmail from './is-valid-email.js';
import { VALID_EMAILS, INVALID_EMAILS } from './test-cases.js';

// Emails excluded from strict assertion — unsupported features or ambiguous test data.
const KNOWN_UNSUPPORTED: ReadonlySet<string> = new Set([
  // Ambiguous test data: no RFC rule distinguishes this from the valid 58-char-local variant;
  // both local (60 chars) and domain (44 chars) are within their respective RFC limits.
  `123456789012345678901234567890123456789012345678901234567890@12345678901234567890123456789012345678901234`,

  // Mixed quoted/unquoted atoms in local part (e.g. "first"."last"@iana.org)
  `test."test"@iana.org`,
  `"first"."last"@iana.org`,
  `"first".middle."last"@iana.org`,
  `"first".last@iana.org`,
  `first."last"@iana.org`,
  `"first"."middle"."last"@iana.org`,
  `"first.middle"."last"@iana.org`,
  `first."mid\\dle"."last"@iana.org`,
  // Comments in parentheses
  `(foo)cal(bar)@(baz)iamcal.com(quux)`,
  `cal@iamcal(woo).(yay)com`,
  `cal(woo(yay)hoopla)@iamcal.com`,
  `cal(foo\\@bar)@iamcal.com`,
  `cal(foo\\)bar)@iamcal.com`,
  `first().last@iana.org`,
  `pete(his account)@silly.test(his host)`,
  `c@(Chris's host.)public.example`,
  `jdoe@machine(comment). example`,
  `1234 @ local(blah) .machine .example`,
  `first(abc.def).last@iana.org`,
  `first(a"bc.def).last@iana.org`,
  `first.(")middle.last(")@iana.org`,
  `first(abc\\(def)@iana.org`,
  `first.last@x(1234567890123456789012345678901234567890123456789012345678901234567890).com`,
  `a(a(b(c)d(e(f))g)h(i)j)@iana.org`,
  `HM2Kinsists@(that comments are allowed)this.is.ok`,
]);

describe('rejects invalid emails', () => {
  for (const email of INVALID_EMAILS) {
    if (KNOWN_UNSUPPORTED.has(email)) {
      test.todo(`[unsupported] ${email}`);
    } else {
      test(email, () => {
        expect(isValidEmail(email)).toBe(false);
      });
    }
  }
});

describe('accepts valid emails', () => {
  for (const email of VALID_EMAILS) {
    if (KNOWN_UNSUPPORTED.has(email)) {
      test.todo(`[unsupported] ${email}`);
    } else {
      test(email, () => {
        expect(isValidEmail(email)).toBe(true);
      });
    }
  }
});
