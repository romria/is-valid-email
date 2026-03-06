import DISPOSABLE_DOMAINS from './disposable-domains.js';
import { RX_LOCAL, RX_DOMAIN_LABEL_RFC1123, RX_DOMAIN_IPV4, RX_DOMAIN_IPV6 } from './regexp.js';

/**
 * Splits an email string into [local, domain] parts, correctly handling
 * quoted local parts that may contain @ signs (e.g. "user@name"@example.com).
 * Returns null if no unquoted @ separator is found.
 */
function splitEmailParts(email: string): [string, string] | null {
  let inQuotes = false;
  let escaped = false;

  for (let i = 0; i < email.length; i++) {
    const char = email.charAt(i);

    if (escaped) {
      escaped = false;
      continue;
    }

    if (char === '\\' && inQuotes) {
      escaped = true;
      continue;
    }

    if (char === '"') {
      inQuotes = !inQuotes;
    } else if (char === '@' && !inQuotes) {
      return [email.slice(0, i), email.slice(i + 1)];
    }
  }

  return null;
}

/**
 * Validates a fully-quoted local part (e.g. "john..doe").
 * Allows any printable ASCII inside quotes; backslash escapes are supported.
 * Does not support mixed quoted/unquoted atoms (e.g. "first"."last") —
 * those are a known limitation.
 */
function isValidQuotedLocal(local: string): boolean {
  if (!local.startsWith('"') || !local.endsWith('"')) return false;
  // Minimum valid quoted local is three chars: "x"
  if (local.length < 3) return false;

  const content = local.slice(1, -1);

  for (let i = 0; i < content.length; i++) {
    const char = content.charAt(i);
    const code = content.charCodeAt(i);

    if (char === '\\') {
      // Escape sequence: next char must exist and be printable ASCII
      i++;
      if (i >= content.length) return false;
      const nextCode = content.charCodeAt(i);
      if (nextCode < 32 || nextCode > 126) return false;
    } else if (char === '"') {
      // Unescaped quote terminates the string — invalid mid-content
      return false;
    } else if (code < 32 || code === 127) {
      // Control characters not allowed
      return false;
    }
  }

  return true;
}

export default function isValidEmail(email: string): boolean {
  if (!email) return false;

  // An addr-spec is a locally interpreted string followed by "@" followed by
  // an Internet domain (RFC 5322 section 3.4.1).
  const parts = splitEmailParts(email);
  if (!parts) return false;

  const [local, domain] = parts;

  // The maximum total length of a user name or other local-part is 64 octets
  // (RFC 5321 section 4.5.3.1.1)
  if (local.length === 0 || local.length > 64) return false;

  // Validate local part: quoted or unquoted
  if (local.startsWith('"')) {
    if (!isValidQuotedLocal(local)) return false;
  } else {
    // Check for allowed symbols (RFC 5322, RFC 5321, RFC 822 section 6.1)
    if (!RX_LOCAL.test(local)) return false;
  }

  // The maximum total length of a domain name is 255 octets
  // (RFC 5321 section 4.5.3.1.2, RFC 1035 section 2.3.4)
  if (domain.length === 0 || domain.length > 255) return false;

  // IP address domains (v4/v6) are valid as-is
  if (RX_DOMAIN_IPV4.test(domain) || RX_DOMAIN_IPV6.test(domain)) {
    return true;
  }

  const domainLabels = domain.split('.');

  // Each domain label: 63 octets or less, valid characters (RFC 1035 section 2.3.4,
  // RFC 952, RFC 1123)
  if (domainLabels.some((label) => label.length === 0 || label.length > 63 || !RX_DOMAIN_LABEL_RFC1123.test(label))) {
    return false;
  }

  // Reject disposable email providers
  if (DISPOSABLE_DOMAINS.has(domain)) return false;

  // Known limitations (not yet implemented):
  // - Mixed quoted/unquoted atoms in local part (e.g. "first"."last"@example.com)
  // - Comments in parentheses (e.g. user(comment)@example.com)
  // - Unicode / IDN domains (xn-- notation)
  // - TLD validation (https://publicsuffix.org/list/public_suffix_list.dat)

  return true;
}
