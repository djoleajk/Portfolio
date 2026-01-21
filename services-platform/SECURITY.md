# Sigurnosna Politika

## ⚠️ Važno Upozorenje

**Ova aplikacija je DEMO projekat i NE bi trebalo koristiti u produkciji bez implementacije pravih sigurnosnih mera!**

## 🔒 Trenutno Stanje Sigurnosti

### ❌ Sigurnosni Rizici u Demo Verziji

1. **Lozinke u Plain Text**
   - Lozinke se čuvaju kao običan tekst u localStorage
   - Nema hash-ovanja ili šifrovanja
   - **Rizik:** Svako ko ima pristup browser-u može videti lozinke

2. **localStorage Čuvanje Podataka**
   - Svi podaci su dostupni kroz browser Developer Tools
   - Nema enkripcije podataka
   - **Rizik:** Potpuna izloženost svih podataka

3. **Client-Side Autentifikacija**
   - Validacija se dešava samo na client-u
   - Nema server-side verifikacije
   - **Rizik:** Lako se može zaobići

4. **Nema HTTPS**
   - Podaci se prenose preko HTTP-a
   - **Rizik:** Man-in-the-middle napadi

5. **Nema Input Validacije na Server-u**
   - Validacija je samo na client-u
   - **Rizik:** XSS, SQL Injection, itd.

6. **Nema Rate Limiting-a**
   - Neograničen broj pokušaja prijave
   - **Rizik:** Brute force napadi

7. **Nema CSRF Zaštite**
   - Nema tokena za zaštitu formi
   - **Rizik:** Cross-Site Request Forgery

## ✅ Što Treba Implementirati za Produkciju

### 1. Backend i Baza Podataka

```javascript
// Primer: Node.js + Express + PostgreSQL
const express = require('express');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');

// Hash lozinke
const hashedPassword = await bcrypt.hash(password, 10);

// JWT autentifikacija
const token = jwt.sign({ userId: user.id }, process.env.JWT_SECRET);
```

### 2. Šifrovanje Lozinki

**Preporučeno:**
- bcrypt (Node.js)
- password_hash() (PHP)
- hashlib (Python)

```javascript
// Nikada ne radite ovo:
user.password = plainPassword; // ❌

// Uvek koristite hashing:
user.password = await bcrypt.hash(plainPassword, 10); // ✅
```

### 3. HTTPS Protokol

```nginx
# Nginx konfiguracija
server {
    listen 443 ssl;
    ssl_certificate /path/to/cert.pem;
    ssl_certificate_key /path/to/key.pem;
    # ...
}
```

### 4. Input Validacija

**Client-side I Server-side:**

```javascript
// Client-side (nedovoljno!)
if (email.includes('@')) { ... }

// Server-side (obavezno!)
const validator = require('validator');
if (!validator.isEmail(email)) {
    return res.status(400).json({ error: 'Invalid email' });
}
```

### 5. Zaštita od XSS

```javascript
// Escape HTML
const escapeHtml = (text) => {
    const map = {
        '&': '&amp;',
        '<': '&lt;',
        '>': '&gt;',
        '"': '&quot;',
        "'": '&#039;'
    };
    return text.replace(/[&<>"']/g, m => map[m]);
};
```

### 6. CSRF Tokeni

```javascript
// Express middleware
const csrf = require('csurf');
app.use(csrf());

// U formi
<input type="hidden" name="_csrf" value="{{ csrfToken }}">
```

### 7. Rate Limiting

```javascript
const rateLimit = require('express-rate-limit');

const loginLimiter = rateLimit({
    windowMs: 15 * 60 * 1000, // 15 minuta
    max: 5, // 5 pokušaja
    message: 'Previše pokušaja prijave'
});

app.post('/login', loginLimiter, loginHandler);
```

### 8. Sigurne Sesije

```javascript
const session = require('express-session');

app.use(session({
    secret: process.env.SESSION_SECRET,
    resave: false,
    saveUninitialized: false,
    cookie: {
        secure: true, // Samo HTTPS
        httpOnly: true, // Ne dostupno JavaScript-u
        maxAge: 3600000 // 1 sat
    }
}));
```

### 9. Content Security Policy

```javascript
const helmet = require('helmet');

app.use(helmet.contentSecurityPolicy({
    directives: {
        defaultSrc: ["'self'"],
        scriptSrc: ["'self'", "'unsafe-inline'"],
        styleSrc: ["'self'", "'unsafe-inline'"],
        imgSrc: ["'self'", "data:", "https:"],
    }
}));
```

### 10. SQL Injection Zaštita

```javascript
// Nikada ne radite ovo:
const query = `SELECT * FROM users WHERE email = '${email}'`; // ❌

// Koristite prepared statements:
const query = 'SELECT * FROM users WHERE email = ?'; // ✅
db.query(query, [email]);
```

## 🛡️ Dodatne Sigurnosne Mere

### Two-Factor Authentication (2FA)

```javascript
const speakeasy = require('speakeasy');
const QRCode = require('qrcode');

// Generisanje secret-a
const secret = speakeasy.generateSecret();

// Verifikacija tokena
const verified = speakeasy.totp.verify({
    secret: user.twoFactorSecret,
    encoding: 'base32',
    token: userToken
});
```

### Email Verifikacija

```javascript
const crypto = require('crypto');
const nodemailer = require('nodemailer');

// Generisanje verifikacionog tokena
const token = crypto.randomBytes(32).toString('hex');

// Slanje email-a
const verificationUrl = `https://platforma.rs/verify?token=${token}`;
await sendEmail(user.email, 'Verifikujte email', verificationUrl);
```

### Logovanje Sigurnosnih Događaja

```javascript
const winston = require('winston');

const logger = winston.createLogger({
    level: 'info',
    format: winston.format.json(),
    transports: [
        new winston.transports.File({ filename: 'security.log' })
    ]
});

// Log sigurnosnih događaja
logger.warn('Failed login attempt', {
    email: email,
    ip: req.ip,
    timestamp: new Date()
});
```

### CAPTCHA

```html
<!-- Google reCAPTCHA -->
<script src="https://www.google.com/recaptcha/api.js"></script>
<div class="g-recaptcha" data-sitekey="your_site_key"></div>
```

## 📋 Security Checklist

Pre deploy-a u produkciju, proverite:

### Backend
- [ ] Implementiran backend server
- [ ] Koristi se baza podataka
- [ ] Lozinke su hash-ovane (bcrypt/argon2)
- [ ] JWT ili session-based auth
- [ ] Input validacija na serveru
- [ ] Prepared statements za SQL
- [ ] Rate limiting
- [ ] CORS pravilno konfigurisan

### Komunikacija
- [ ] HTTPS protokol
- [ ] SSL certifikat instaliran
- [ ] HSTS header enabled
- [ ] Secure cookies

### Zaštita
- [ ] CSRF tokeni
- [ ] XSS zaštita
- [ ] SQL Injection zaštita
- [ ] Content Security Policy
- [ ] Helmet.js ili sličan middleware

### Autentifikacija
- [ ] Šifrovane lozinke
- [ ] Sigurne sesije
- [ ] Token expiration
- [ ] Logout funkcionalnost
- [ ] Password reset flow
- [ ] Email verifikacija
- [ ] 2FA (opciono)

### Monitoring
- [ ] Error logging
- [ ] Security event logging
- [ ] Failed login attempts tracking
- [ ] Suspicious activity monitoring

### Compliance
- [ ] GDPR compliance (ako u EU)
- [ ] Privacy policy
- [ ] Terms of service
- [ ] Cookie consent

## 🚨 Prijavljivanje Sigurnosnih Problema

Ako pronađete sigurnosni problem u ovom demo projektu:

1. **NE** otvarajte javni issue
2. Pošaljite email maintainer-ima direktno
3. Opišite problem detaljno
4. Uključite korake za reprodukciju
5. Sačekajte odgovor pre javnog objavljivanja

## 📚 Resursi za Učenje

- [OWASP Top 10](https://owasp.org/www-project-top-ten/)
- [Node.js Security Checklist](https://blog.risingstack.com/node-js-security-checklist/)
- [Web Security Academy](https://portswigger.net/web-security)
- [MDN Web Security](https://developer.mozilla.org/en-US/docs/Web/Security)

## 📞 Kontakt

Za sigurnosna pitanja, kontaktirajte maintainer-e projekta.

---

**Zapamtite: Sigurnost nije dodatak, već neophodan deo svake web aplikacije!** 🔒

