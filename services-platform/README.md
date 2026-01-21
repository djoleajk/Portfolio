# Platforma za Usluge

Dobrodošli na **Platformu za Usluge** - modernu online aplikaciju koja povezuje pružaoce usluga sa klijentima.

## 🌟 Funkcionalnosti

### Za Sve Korisnike
- 🏠 **Naslovna Stranica** - Pregled popularnih kategorija i top pružalaca usluga
- 🔍 **Napredna Pretraga** - Filtriranje po kategorijama, lokaciji, ceni i ocenama
- 👤 **Registracija i Prijava** - Jednostavan sistem autentifikacije
- 📱 **Responzivan Dizajn** - Prilagođen za sve uređaje (desktop, tablet, mobilni)

### Za Klijente
- 🔎 **Pretraga Usluga** - Pronalaženje idealnog pružaoca usluga
- 📅 **Zakazivanje Termina** - Brzo i jednostavno zakazivanje
- 💬 **Sistem Poruka** - Direktna komunikacija sa pružaocima
- ⭐ **Ocenjivanje** - Ostavljanje recenzija nakon završenih usluga
- 📊 **Lični Panel** - Pregled svojih termina, poruka i recenzija

### Za Pružaoce Usluga
- 📝 **Profil Pružaoca** - Detaljni profil sa opisom, cenama i kontaktom
- 📥 **Upravljanje Terminima** - Prihvatanje i odbijanje zahteva
- 💬 **Poruke** - Komunikacija sa klijentima
- ⭐ **Recenzije** - Pregled svih dobijenih ocena
- 📈 **Statistike** - Praćenje prosečne ocene i broja recenzija

### Za Administratore
- 👥 **Upravljanje Korisnicima** - Pregled, uređivanje i brisanje korisnika
- 🛠️ **Upravljanje Pružaocima** - Kontrola statusa pružalaca usluga
- ⭐ **Moderacija Recenzija** - Odobravanje ili odbijanje recenzija
- 📅 **Pregled Termina** - Uvid u sve zakazane termine
- 📊 **Dashboard** - Statistike i nedavne aktivnosti
- 🏷️ **Kategorije** - Pregled svih kategorija usluga

## 📁 Struktura Projekta

```
Platforma za Usluge/
│
├── index.html          # Naslovna stranica
├── usluge.html         # Stranica za pretragu usluga
├── dashboard.html      # Korisnički panel
├── admin.html          # Administratorski panel
│
├── styles.css          # Svi CSS stilovi
│
├── app.js              # Osnovna funkcionalnost i autentifikacija
├── services.js         # Funkcionalnost pretrage usluga
├── dashboard.js        # Funkcionalnost korisničkog panela
├── admin.js            # Funkcionalnost admin panela
│
└── README.md           # Dokumentacija
```

## 🚀 Pokretanje Aplikacije

### Prednosti
- Nema potrebe za instalacijom dodatnih paketa
- Sve radi u browseru
- Podaci se čuvaju u localStorage-u

### Koraci

1. **Otvorite `index.html`** u vašem web browseru:
   - Dvostruki klik na fajl, ili
   - Desni klik → "Open with" → izaberite browser, ili
   - Koristite Live Server u VS Code-u

2. **To je sve!** Aplikacija je spremna za korišćenje.

## 👥 Test Nalozi

### Administrator
- **Email:** admin@platforma.rs
- **Lozinka:** admin123

### Sample Pružaoci Usluga
Platforma dolazi sa 6 unapred kreiranih pružalaca usluga iz različitih kategorija:
- Marko Petrović (Popravke - Vodoinstalater)
- Ana Jovanović (Lepota i Wellness - Frizer)
- Stefan Nikolić (IT i Tehnologija - Web Developer)
- Milica Đorđević (Dom i Bašta - Čišćenje)
- Nikola Ilić (Edukacija - Privatni Časovi)
- Jelena Pavlović (Transport - Selidbe)

### Kreiranje Novog Naloga
1. Kliknite na "Registracija"
2. Unesite podatke
3. Izaberite tip korisnika (Klijent ili Pružalac Usluga)
4. Popunite dodatna polja ako ste pružalac
5. Kliknite "Registruj se"

## 📖 Kako Koristiti

### Kao Klijent

1. **Pronađite Uslugu**
   - Koristite pretragu na naslovnoj strani
   - Ili kliknite na kategoriju koja vas interesuje
   - Ili idite direktno na stranicu "Usluge"

2. **Filtrirajte Rezultate**
   - Koristite filtere za kategoriju, lokaciju, cenu i ocenu
   - Sortirajte po oceni, ceni ili broju recenzija

3. **Pogledajte Profil**
   - Kliknite na karticu pružaoca za više detalja
   - Pročitajte opis i recenzije

4. **Zakažite Termin**
   - Kliknite "Zakaži Termin"
   - Popunite formu sa detaljima
   - Sačekajte potvrdu od pružaoca

5. **Ostavite Recenziju**
   - Nakon završene usluge
   - Idite u "Moj Panel" → "Moji Termini"
   - Kliknite "Ostavi Recenziju" kod završenog termina

### Kao Pružalac Usluga

1. **Registrujte se kao Pružalac**
   - Pri registraciji izaberite "Pružalac Usluga"
   - Unesite kategoriju i lokaciju

2. **Uredite Profil**
   - Idite u "Moj Panel" → "Moj Profil"
   - Kliknite "Uredi Profil"
   - Dodajte detaljan opis, cenu i kontakt

3. **Upravljajte Terminima**
   - Proverite zahteve u "Moji Termini"
   - Potvrdite ili odbijte termine
   - Označite završene poslove

4. **Komunicirajte sa Klijentima**
   - Odgovarajte na poruke u sekciji "Poruke"
   - Razmenjujte dodatne informacije

### Kao Administrator

1. **Prijavite se sa Admin Nalogom**
   - Email: admin@platforma.rs
   - Lozinka: admin123

2. **Dashboard**
   - Pregledajte statistike platforme
   - Pratite nedavne aktivnosti

3. **Upravljajte Korisnicima**
   - Pregledajte sve korisnike
   - Promenite status (aktivan/suspendovan/banovan)
   - Obrišite korisnike po potrebi

4. **Moderacija Recenzija**
   - Pregledajte sve recenzije
   - Obrišite neprikladan sadržaj

5. **Pregled Termina**
   - Uvid u sve termine na platformi
   - Filtriranje po statusu

## 🎨 Dizajn i Stil

- **Moderna UI** - Čist i profesionalan izgled
- **Intuitivna Navigacija** - Jednostavno snalaženje
- **Responzivan** - Savršeno radi na svim uređajima
- **Animacije** - Glatke tranzicije i efekti
- **Ikonice** - Font Awesome 6.0
- **Boje** - Profesionalna paleta boja (Indigo, Zelena, Crvena)

## 💾 Čuvanje Podataka

Aplikacija koristi **localStorage** web browsera za čuvanje svih podataka:
- Korisnički nalozi
- Profili pružalaca usluga
- Termini
- Poruke
- Recenzije

**Napomena:** Podaci ostaju sačuvani dok ne obrišete localStorage ili cookies browsera.

## 🔒 Bezbednost

**Ovo je frontend demo aplikacija** i **ne bi trebalo** koristiti u produkciji bez pravog backend sistema!

Za produkciju potrebno je:
- Backend server (Node.js, PHP, Python, itd.)
- Baza podataka (MySQL, PostgreSQL, MongoDB)
- Prava autentifikacija (JWT tokeni, sesije)
- Šifrovanje lozinki (bcrypt, hash)
- HTTPS protokol
- Input validacija na serveru
- Zaštita od SQL injection i XSS napada

## 🛠️ Tehnologije

- **HTML5** - Struktura
- **CSS3** - Stilizacija (Grid, Flexbox, Custom Properties)
- **JavaScript (ES6+)** - Funkcionalnost
- **localStorage API** - Čuvanje podataka
- **Font Awesome** - Ikonice

## 📱 Responzivnost

Aplikacija je potpuno responzivna i prilagođava se:
- 📱 Mobilnim telefonima (< 768px)
- 💻 Tabletima (768px - 1024px)
- 🖥️ Desktop računarima (> 1024px)

## ✨ Dodatne Funkcionalnosti

- ⚡ Real-time notifikacije
- 🔔 Badge za nepročitane poruke
- 🌟 Star rating sistem (1-5 zvezdica)
- 📊 Statistike i analitika
- 🔍 Napredna pretraga sa više filtera
- 💬 Sistem za poruke između korisnika
- 📅 Kalendar za zakazivanje
- ⭐ Sistem recenzija i ocena

## 🐛 Poznati Problemi

- Trenutno nema email notifikacija (frontend only)
- Nema upload slika za profile (može se dodati)
- Lozinke se čuvaju kao plain text (NE KORISTITI U PRODUKCIJI!)

## 🚀 Budući Razvoj

Predlozi za proširenje:
- Backend integracija
- Upload slika/avatara
- Email notifikacije
- Push notifikacije
- Real-time chat
- Kalendar sa dostupnošću
- Sistem plaćanja
- Google Maps integracija
- Multi-jezik podrška

## 📞 Podrška

Za pitanja i probleme, kreirajte issue ili kontaktirajte razvojni tim.

## 📄 Licenca

Ova aplikacija je kreirana kao demo projekat i može se slobodno koristiti u edukativne svrhe.

---

**Uživajte u korišćenju Platforme za Usluge!** 🎉

