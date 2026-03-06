# AGENTS.md

Shared guidance for AI coding agents working with this repository.

# Project

Email validation function

## Commands

```bash
npm test           # run vitest test suite (265 passing, ~26 todo)
npm run test:watch # vitest in watch mode
npm run typecheck  # tsc --noEmit (checks all src/ including tests)
npm run lint       # eslint src/
npm start          # visual demo: runs validator against all test cases with colored output
```

## Architecture

TypeScript ESM library targeting Node ≥ 18. Source in `src/`.

**Public API** — `src/is-valid-email.ts` exports a single default function `isValidEmail(email: string): boolean`.

**Validation flow** (`src/is-valid-email.ts`):
1. `splitEmailParts` — quote-aware `@` split; handles `"user@name"@domain` quoted locals
2. Local part: quoted (`"..."`) → `isValidQuotedLocal`; unquoted → `RX_LOCAL` regex
3. Domain: IPv4/IPv6 bracket forms → `RX_DOMAIN_IPV4` / `RX_DOMAIN_IPV6`; otherwise split on `.` and validate each label with `RX_DOMAIN_LABEL_RFC1123`
4. Disposable domain blocklist check via `DISPOSABLE_DOMAINS` Set

**`src/regexp.ts`** — four exported regexes. `RX_DOMAIN_LABEL_RFC1123` uses `^[a-zA-Z0-9]([a-zA-Z0-9-]*[a-zA-Z0-9])?$` (allows consecutive hyphens to support `xn--` IDN ACE prefix).

**`src/disposable-domains.ts`** — large file, exports a `Set<string>` of disposable email provider domains. Loaded once at module import time.

**`src/test-cases.ts`** — exports `VALID_EMAILS` and `INVALID_EMAILS` arrays used by both `src/index.ts` (visual demo) and `src/is-valid-email.test.ts`.

**Known limitations** (documented as `todo` tests in the test file):
- Mixed quoted/unquoted atoms in local part (e.g. `"first"."last"@example.com`)
- Comments in parentheses (e.g. `user(comment)@example.com`)
- Unicode/IDN local parts; TLD validation

## tsconfig setup

Single config: `tsconfig.json` — base (`noEmit: true`), includes all `src/` files; used by IDE and `npm run typecheck`
