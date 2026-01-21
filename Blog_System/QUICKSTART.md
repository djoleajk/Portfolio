# 🚀 Quick Start Guide

## Brzo pokretanje u 3 koraka

### 1️⃣ Pokrenite server

**Najlakši način** (ako imate Python instaliran):
```bash
python -m http.server 8000
```

Ili za Node.js:
```bash
npx http-server -p 8000
```

### 2️⃣ Otvorite u pretraživaču

```
http://localhost:8000?demo=init
```

> ✅ Parametar `?demo=init` će automatski kreirati 6 demo blog postova

### 3️⃣ Prijavite se

Koristite jedan od demo naloga:

**Admin nalog** (puna kontrola):
- Email: `admin@example.com`
- Lozinka: `admin123`

**Author nalog** (kreiranje postova):
- Email: `author@example.com`
- Lozinka: `author123`

**Editor nalog** (moderacija):
- Email: `editor@example.com`
- Lozinka: `editor123`

---

## ✨ Šta možete odmah isprobati?

### Kao Admin:
1. Idite na **Admin panel**
2. Pogledajte statistiku
3. Upravljajte korisnicima (promena role, status)
4. Moderišite komentare

### Kao Author:
1. Kliknite **Novi post**
2. Napišite svoj prvi blog post
3. Dodajte kategorije i tagove
4. Sačuvajte kao Draft ili odmah objavite

### Kao bilo koji korisnik:
1. Pretražujte postove
2. Filtrirajte po kategorijama
3. Otvorite post i ostavite komentar
4. Odgovorite na tuđe komentare

---

## 🔧 Česta pitanja

**Q: Zašto ne radi kada otvorim direktno HTML fajl?**  
A: ES6 moduli ne rade preko `file://` protokola. Morate koristiti HTTP server.

**Q: Kako da resetujem sve podatke?**  
A: Otvorite Developer Tools (F12) → Console → unesite:
```javascript
localStorage.clear();
indexedDB.deleteDatabase('BlogSystemDB');
location.reload();
```

**Q: Gde se čuvaju podaci?**  
A: U IndexedDB vašeg pretraživača. Podaci ostaju i nakon što zatvorite stranicu.

**Q: Kako da promenim broj postova po stranici?**  
A: U `js/app.js` linija 15, promenite `this.perPage = 9;` na željeni broj.

---

## 📚 Sledeći koraci

1. **Pročitajte** `README.md` za detaljnu dokumentaciju
2. **Istražite** kod u `js/` folderu
3. **Prilagodite** boje u `css/styles.css`
4. **Testirajte** sve funkcionalnosti iz README test scenarija

---

**Enjoy coding! 🎉**

