const DISPOSABLE_DOMAINS = require('./disposable-domains');
const {RX_LOCAL, RX_DOMAIN_LABEL_RFC1123, RX_DOMAIN_IPV4, RX_DOMAIN_IPV6} = require('./regexp');

module.exports = function(email) {
  if (!email) return false;

  const parts = email.split('@');
  // An addr-spec is a specific Internet identifier that contains a locally interpreted string followed by the at-sign character ("@", ASCII value 64) followed by an Internet domain (RFC 5322 section 3.4.1)
  // ToDo: this should be reworked if quotes allowed
  if (parts.length !== 2) return false;

  const [local, domain] = parts;

  // The maximum total length of a user name or other local-part is 64 octets (RFC 5321 section 4.5.3.1.1)
  // Also, check for allowed symbols (RFC 5322, RFC 5321, and RFC 822 section 6.1)
  if (local.length > 64 || !RX_LOCAL.test(local)) return false;

  // The maximum total length of a domain name or number is 255 octets (RFC 5321 section 4.5.3.1.2, RFC 1035 section 2.3.4)
  if (domain.length > 255) return false;

  // if domain is an IP (v4/v6)
  if (RX_DOMAIN_IPV4.test(domain) || RX_DOMAIN_IPV6.test(domain)) {
    return true;
  }

  const domainLabels = domain.split('.');

  // domain label: 63 octets or less (RFC 1035 section 2.3.4)
  // check for allowed symbols in domain label (RFC 952 and RFC 1123 which allows label to start with a digit)
  if (domainLabels.some((label) => label.length > 63 || !RX_DOMAIN_LABEL_RFC1123.test(label)) ) return false;

  // check if email is from disposable provider
  if (DISPOSABLE_DOMAINS.has(domain)) return false;

  /* ToDo: support of unicode symbols (Thailand, China,...) */
  /* ToDo: add TLD check (https://publicsuffix.org/list/public_suffix_list.dat) */
  /* ToDo: ability to support quotes  */
  /* ToDo: ability to support comments in brackets */
  /* ToDo: ability to support Unicode notation "xn--" in a domain name */

  return true;
};
