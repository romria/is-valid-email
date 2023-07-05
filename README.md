## Front-End Email Validator

### Q&A: Email validation VS email verification?

We should clearly distinguish **Email validation** and **Email verification** processes.

**Email validation** is intended to prevent users from making typos at the time of input and lower the server load by reducing requests amount. This procedure is usually done at the frontend.

**Email verification** process helps to verify if **theoretically valid** email actually exists, and there is a real user on the receiving end of the email address. To verify an email address, server will send an activation letter with link/code to it. Then the end user should activate it from their inbox: which confirms that this is a real email and user has access to it.

Primarily, we should think this over from the business prospective:
* How much is it important to force users using a real email?
* Should we allow users to use temporary/disposable email services?
* Should it be required to confirm email ownership via confirmation letter/link before allowing to use the app?
* What are possible consequences users might face when using not a real or disposable email and how this affects business? (e.g. some other person might take control of the account, which can include paid services or sensitive information)

---

This repository covers only **Email validation** procedure, considering different algorithms and actions while trying to find the most optimal approach.

Since there is no 100%-efficient way to validate entered email, it always comes to a tradeoff between accuracy and algorithm complexity, which can include time-consuming third-party API requests.

This particular validation is based on known best practices and my personal experience.

### Supported features:
* General rules based on RFC 822, RFC 5321, RFC 5322, RFC 1035, RFC 952, RFC 1123
* IPv4/IPv6 domains
* Check for disposable email providers

### To be added:
* TLD check
* Unicode support
* quotes ""
* comments ()

---

### Prerequisites
* [Node.js](https://nodejs.org/) v18.11.0 or higher

### Run test cases
```bash
npm start
```

### Links
* [Disposable Email Domains](https://github.com/disposable-email-domains/disposable-email-domains)
* [RFC 822 "ARPA INTERNET TEXT MESSAGES"](https://datatracker.ietf.org/doc/html/rfc822)
* [RFC 5321 "Simple Mail Transfer Protocol"](https://datatracker.ietf.org/doc/html/rfc5321)
* [RFC 5322 "Internet Message Format"](https://datatracker.ietf.org/doc/html/rfc5322)
* [RFC 1035 "DOMAIN NAMES - IMPLEMENTATION AND SPECIFICATION"](https://datatracker.ietf.org/doc/html/rfc1035)
* [RFC 952 "DOD INTERNET HOST TABLE SPECIFICATION"](https://datatracker.ietf.org/doc/html/rfc952)
* [RFC 1123 "Requirements for Internet Hosts -- Application and Support"](https://datatracker.ietf.org/doc/html/rfc1123)
