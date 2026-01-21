# Blog Sistem - Front-End Blog Aplikacija

Kompletan front-end blog sistem izgrađen sa čistim HTML, CSS i JavaScript. Koristi IndexedDB za perzistentnost podataka bez potrebe za serverom.

## 🚀 Karakteristike

### Autentikacija i Autorizacija
- ✅ Registracija i login korisnika
- ✅ Session token u localStorage
- ✅ Četiri role sa različitim pravima:
  - **Admin**: Puna kontrola (upravljanje korisnicima, svim postovima, moderacija)
  - **Editor**: Upravljanje svim postovima i moderacija komentara
  - **Author**: Kreiranje i upravljanje sopstvenim postovima
  - **Subscriber**: Čitanje, komentarisanje

### Admin Panel
- ✅ Pregled i upravljanje korisnicima (promena role, status, brisanje)
- ✅ Pregled i upravljanje postovima (sa filterima)
- ✅ Moderacija komentara (odobravanje/odbijanje/brisanje)
- ✅ Statistika (broj korisnika, postova, komentara, pregleda)

### Postovi
- ✅ CRUD operacije (kreiranje, čitanje, ažuriranje, brisanje)
- ✅ Polja: naslov, slug, sadržaj, autor, kategorije, tagovi, status, featured image
- ✅ Lista sa paginacijom (9 postova po stranici)
- ✅ Pretraga i filtriranje (po kategoriji, tekstu)
- ✅ Sortiranje (najnovije, najstarije, najpopularnije)
- ✅ Draft/Published status
- ✅ Brojač pregleda
- ✅ Slični postovi na osnovu kategorija i tagova

### Komentari
- ✅ Dodavanje, uređivanje i brisanje komentara
- ✅ Threaded replies (1 nivo odgovora)
- ✅ Moderacija (odobravanje/odbijanje)
- ✅ Samo prijavljeni korisnici mogu komentarisati

### UI/UX
- ✅ Responzivan dizajn (mobile-first)
- ✅ Jasna UI struktura po ulogama
- ✅ ARIA atributi za pristupačnost
- ✅ Modali za forme
- ✅ Real-time validacija formi
- ✅ Animacije i transitions
- ✅ Loading spineri
- ✅ Toast notifikacije

### Bezbednost
- ✅ Sanitizacija korisničkih inputa (XSS prevencija)
- ✅ Validacija svih polja
- ✅ Escape HTML za siguran prikaz
- ✅ Ograničenje pristupa po ulogama
- ✅ SHA-256 hash za lozinke (demo - u produkciji koristiti bcrypt)

## 📁 Struktura Projekta

```
Blog System/
├── index.html              # Glavna stranica sa listom postova
├── admin.html              # Admin panel
├── post.html               # Prikaz pojedinačnog posta
├── css/
│   └── styles.css          # Svi stilovi (responzivni, mobile-first)
├── js/
│   ├── app.js              # Glavna aplikacija
│   ├── admin.js            # Admin panel logika
│   ├── post.js             # Single post page logika
│   ├── db.js               # IndexedDB wrapper
│   ├── auth.js             # Autentikacija i autorizacija
│   ├── users.js            # User management
│   ├── posts.js            # Posts CRUD
│   ├── comments.js         # Comments sistem
│   └── ui.js               # UI helper funkcije
└── README.md               # Ova datoteka
```

## 🛠️ Instalacija i Pokretanje

### Preduslov
- Moderan web pretraživač sa podrškom za:
  - ES6+ JavaScript Modules
  - IndexedDB
  - LocalStorage
  - Crypto API

### Pokretanje

1. **Preuzmite projekat**
   ```bash
   # Klonirajte ili preuzmite folder
   cd "Blog System"
   ```

2. **Pokrenite lokalnu development server**
   
   **Opcija 1: Korišćenjem Python**
   ```bash
   # Python 3
   python -m http.server 8000
   
   # Python 2
   python -m SimpleHTTPServer 8000
   ```

   **Opcija 2: Korišćenjem Node.js (http-server)**
   ```bash
   npx http-server -p 8000
   ```

   **Opcija 3: Korišćenjem PHP**
   ```bash
   php -S localhost:8000
   ```

   **Opcija 4: Live Server (VS Code Extension)**
   - Instalirajte "Live Server" extension u VS Code
   - Desni klik na `index.html` → "Open with Live Server"

3. **Otvorite u pretraživaču**
   ```
   http://localhost:8000
   ```

4. **(Opciono) Učitajte demo podatke**
   
   Pri prvom pokretanju možete učitati demo postove sa sadržajem:
   ```
   http://localhost:8000?demo=init
   ```
   
   Ovo će kreirati 6 primera blog postova sa komentarima.

> ⚠️ **VAŽNO**: Ne možete otvoriti direktno `file://` URL jer će ES6 moduli biti blokirani zbog CORS politike. Morate koristiti HTTP server.

## 👤 Demo Nalozi

Aplikacija automatski kreira demo naloge pri prvom pokretanju:

| Uloga | Email | Lozinka | Prava |
|-------|-------|---------|-------|
| Admin | admin@example.com | admin123 | Sve (upravljanje korisnicima, svim postovima, moderacija) |
| Editor | editor@example.com | editor123 | Upravljanje svim postovima, moderacija komentara |
| Author | author@example.com | author123 | Kreiranje i upravljanje sopstvenim postovima |

Možete i registrovati nove korisnike koji će dobiti "subscriber" ulogu.

## 🧪 Testiranje

### Test Scenario 1: Registracija i Login

1. Otvorite aplikaciju u pretraživaču
2. Kliknite "Registruj se"
3. Popunite formu:
   - Ime: "Test Korisnik"
   - Email: "test@example.com"
   - Lozinka: "test123"
   - Potvrda lozinke: "test123"
4. Kliknite "Registruj se"
5. ✅ Trebalo bi da budete automatski prijavljeni

**Validacija:**
- Novi korisnik ima ulogu "subscriber"
- Podaci su sačuvani u IndexedDB
- Session token je u localStorage
- UI se ažurirao (prikazuje "Zdravo, Test Korisnik")

### Test Scenario 2: Kreiranje Posta (kao Author)

1. Prijavite se kao `author@example.com` / `author123`
2. Kliknite "Novi post"
3. Popunite formu:
   - Naslov: "Moj prvi blog post"
   - Slug: "moj-prvi-blog-post" (automatski se generiše)
   - Sadržaj: "Ovo je sadržaj mog prvog blog posta sa **bold** tekstom."
   - Kategorije: "JavaScript, Tutorial"
   - Tagovi: "beginner, js"
   - Status: "Published"
4. Kliknite "Objavi"
5. ✅ Post se prikazuje na glavnoj stranici

**Validacija:**
- Post je vidljiv na glavnoj stranici
- Autor je "Author"
- Kategorije su prikazane
- Bold tekst je formatiran

### Test Scenario 3: Admin Upravljanje Korisnicima

1. Prijavite se kao `admin@example.com` / `admin123`
2. Idite na "Admin panel"
3. U tab "Korisnici", pronađite "Test Korisnik"
4. Kliknite "Izmeni"
5. Promenite ulogu u "Author"
6. Sačuvajte izmene
7. ✅ Korisnik sada ima "Author" ulogu

**Validacija:**
- Uloga je ažurirana u tabeli
- Test korisnik sada može kreirati postove

### Test Scenario 4: Komentarisanje

1. Prijavite se (bilo koja uloga)
2. Otvorite bilo koji post
3. Scroll do sekcije komentara
4. Unesite komentar: "Odličan post!"
5. Kliknite "Objavi komentar"
6. ✅ Komentar se prikazuje ispod posta

**Validacija:**
- Komentar je vidljiv
- Prikazuje se ime autora i datum
- Možete odgovoriti na komentar (reply)

### Test Scenario 5: Moderacija Komentara

1. Prijavite se kao `editor@example.com` / `editor123`
2. Idite na "Admin panel" → tab "Komentari"
3. Pronađite komentar
4. Kliknite "Odobri" ili "Odbij"
5. ✅ Status komentara se menja

**Validacija:**
- Status se ažurira
- Odbijeni komentari nisu vidljivi na postu

### Test Scenario 6: Pretraga i Filtriranje

1. Na glavnoj stranici, unesite tekst u search bar
2. Izaberite kategoriju iz filtera
3. Promenite sortiranje
4. ✅ Postovi se filtriraju u realnom vremenu

**Validacija:**
- Rezultati odgovaraju pretrazi
- Paginacija se ažurira
- Filter po kategoriji radi

### Test Scenario 7: XSS Prevencija

1. Pokušajte kreirati post sa naslovom: `<script>alert('XSS')</script>`
2. Ili komentar sa: `<img src=x onerror="alert('XSS')">`
3. ✅ Kod ne bi trebalo da se izvrši

**Validacija:**
- Script tagovi se prikazuju kao text, ne izvršavaju se
- Nema alert-a
- HTML je escape-ovan

### Test Scenario 8: Perzistentnost Podataka

1. Kreirajte post
2. Refresh stranice (F5)
3. ✅ Post je i dalje prisutan

**Validacija:**
- Podaci su sačuvani u IndexedDB
- Session je aktivan
- Ne gubite login status

### Test Scenario 9: Responzivnost

1. Otvorite Developer Tools (F12)
2. Prebacite na mobile view (iPhone, Android)
3. Testirajte navigaciju, forme, liste
4. ✅ Layout se prilagođava ekranu

**Validacija:**
- Hamburger menu radi
- Forme su čitljive
- Dugmad su dovoljno velika za touch
- Nema horizontal scroll-a

### Test Scenario 10: Prava Pristupa

1. Prijavite se kao "subscriber"
2. Pokušajte pristupiti `admin.html`
3. ✅ Trebalo bi da budete preusmereni

**Validacija:**
- Subscriber ne vidi "Admin panel" link
- Ne vidi "Novi post" dugme
- Direktan pristup admin.html je blokiran

## 🔍 Provera IndexedDB

Da biste videli sačuvane podatke:

1. Otvorite Developer Tools (F12)
2. Idite na "Application" tab (Chrome) ili "Storage" (Firefox)
3. Expand "IndexedDB" → "BlogSystemDB"
4. Videćete store-ove:
   - `users` - Svi korisnici
   - `posts` - Svi postovi
   - `comments` - Svi komentari
   - `sessions` - Aktivne sesije

## 🎨 Prilagođavanje

### Promena Boja

Otvorite `css/styles.css` i izmenite CSS varijable u `:root`:

```css
:root {
    --primary-color: #3b82f6;  /* Glavna boja */
    --danger-color: #ef4444;    /* Boja za opasne akcije */
    --success-color: #10b981;   /* Boja za uspeh */
    /* ... */
}
```

### Promena Broja Postova Po Stranici

U `js/app.js`, linija ~10:

```javascript
this.perPage = 9; // Promenite na željeni broj
```

### Automatsko Odobravanje Komentara

U `js/comments.js`, linija ~31:

```javascript
status: 'approved', // Promenite u 'pending' za moderaciju
```

## 🐛 Troubleshooting

### Problem: Moduli se ne učitavaju

**Greška:** `Access to script at 'file://...' from origin 'null' has been blocked by CORS policy`

**Rešenje:** Morate pokrenuti HTTP server, ne možete otvoriti `file://` direktno.

### Problem: IndexedDB nije dostupan

**Greška:** `Failed to execute 'open' on 'IDBFactory'`

**Rešenje:** 
- Proverite da li pretraživač podržava IndexedDB
- Proverite da li je privatno pregledanje (Incognito) omogućeno - neke verzije blokiraju IndexedDB

### Problem: Login ne radi

**Rešenje:**
1. Otvorite Console (F12)
2. Proverite da li ima grešaka
3. Očistite localStorage i IndexedDB:
   ```javascript
   // U console-u:
   localStorage.clear();
   indexedDB.deleteDatabase('BlogSystemDB');
   ```
4. Refresh stranice

### Problem: Stilovi se ne primenjuju

**Rešenje:**
- Hard refresh: `Ctrl + F5` (Windows) ili `Cmd + Shift + R` (Mac)
- Očistite cache pretraživača

## 📝 Poznata Ograničenja

1. **Password Hashing**: Koristi se SHA-256 za demo. U produkciji koristiti server-side bcrypt.
2. **File Upload**: Featured images se čuvaju kao Data URL u IndexedDB (ograničenje veličine).
3. **Search**: Client-side pretraga - nije optimalna za veliki broj postova.
4. **Rate Limiting**: Nema ograničenja za broj zahteva.
5. **Email Validation**: Samo format validacija, nema stvarne verifikacije.

## 🚀 Budući Razvoj

- [ ] Export/Import podataka (JSON)
- [ ] Dark mode
- [ ] PWA podrška (offline mode)
- [ ] Rich text editor (Quill.js, TinyMCE)
- [ ] Drag & drop za slike
- [ ] Post revisions (history)
- [ ] User profiles sa avatarima
- [ ] Like sistem za postove
- [ ] Social sharing
- [ ] Print styling

## 📄 Licenca

Ovaj projekat je kreiran za edukativne svrhe. Slobodno ga koristite i prilagođavajte.

## 💡 Tehnologije

- **HTML5** - Semantički markup
- **CSS3** - Custom properties, Flexbox, Grid, Animations
- **JavaScript ES6+** - Modules, Async/Await, Classes
- **IndexedDB** - Client-side database
- **LocalStorage** - Session management
- **Web Crypto API** - Password hashing

## 🤝 Doprinos

Ovo je samostalni projekat. Ako pronađete bagove ili imate sugestije, možete kreirati issues ili pull requests.

---

**Autor:** Blog System Team  
**Datum:** 2025  
**Verzija:** 1.0.0

