# Često Postavljana Pitanja (FAQ)

## Opšta Pitanja

### Šta je Platforma za Usluge?

Platforma za Usluge je online tržište koje povezuje pružaoce usluga sa klijentima. Omogućava jednostavno pronalaženje i zakazivanje različitih usluga, od popravki do edukacije.

### Da li je aplikacija besplatna?

Da, ovo je open-source demo aplikacija koja se može slobodno koristiti i modifikovati.

### Na kojim uređajima radi?

Aplikacija je responzivna i radi na:
- 💻 Desktop računarima
- 📱 Mobilnim telefonima
- 📱 Tabletima
- Svim modernim web browser-ima (Chrome, Firefox, Safari, Edge)

## Tehnička Pitanja

### Koje tehnologije su korišćene?

- **Frontend**: HTML5, CSS3, JavaScript (ES6+)
- **Storage**: localStorage API
- **Icons**: Font Awesome 6.0
- **Hosting**: Može se hostovati bilo gde (GitHub Pages, Netlify, Vercel, itd.)

### Da li ima backend?

Ne, trenutno je ovo frontend-only aplikacija. Svi podaci se čuvaju u localStorage-u browsera. Za produkciju bi trebalo dodati pravi backend.

### Kako se čuvaju podaci?

Podaci se čuvaju u localStorage-u browsera. To znači:
- ✅ Brzo učitavanje
- ✅ Nema potrebe za serverom
- ❌ Podaci se brišu ako obrišete browser cache
- ❌ Podaci nisu sigurni (plain text)
- ❌ Podaci su lokalni samo za taj browser

### Mogu li koristiti u produkciji?

**NE!** Ovo je demo aplikacija. Za produkciju trebate:
- Backend server (Node.js, PHP, Python, itd.)
- Bazu podataka
- Pravu autentifikaciju
- Šifrovanje lozinki
- HTTPS
- Server-side validaciju

## Korisničke Funkcionalnosti

### Kako da se registrujem?

1. Kliknite "Registracija" u navigaciji
2. Popunite formu (ime, email, lozinka)
3. Izaberite tip korisnika (Klijent ili Pružalac Usluga)
4. Ako ste pružalac, unesite dodatne informacije
5. Kliknite "Registruj se"

### Kako da se prijavim?

1. Kliknite "Prijava"
2. Unesite email i lozinku
3. Kliknite "Prijavi se"

**Test Nalog - Administrator:**
- Email: admin@platforma.rs
- Lozinka: admin123

### Kako da zakazem termin?

1. Prijavite se kao klijent
2. Pretražite usluge
3. Izaberite pružaoca
4. Kliknite "Zakaži Termin"
5. Popunite formu i pošaljite

### Kako da ostavim recenziju?

1. Morate imati završen termin
2. Idite u "Moj Panel" → "Moji Termini"
3. Kod završenog termina kliknite "Ostavi Recenziju"
4. Ocenite uslugu (1-5 zvezdica)
5. Napišite komentar
6. Pošaljite recenziju

### Kako da promenim profil?

1. Idite u "Moj Panel"
2. Kliknite "Uredi Profil"
3. Izmenite podatke
4. Sačuvajte izmene

## Pružaoci Usluga

### Kako da postanem pružalac usluga?

1. Pri registraciji izaberite "Pružalac Usluga"
2. Unesite kategoriju i lokaciju
3. Nakon registracije, uredite profil sa detaljima
4. Postavite cenu i opis

### Kako da upravljam terminima?

1. Idite u "Moj Panel" → "Moji Termini"
2. Videćete sve zahteve
3. Možete potvrditi ili odbiti termine
4. Nakon završetka označite kao "Završeno"

### Kako da odgovorim na poruke?

1. Idite u "Moj Panel" → "Poruke"
2. Izaberite poruku
3. Kliknite "Odgovori"
4. Napišite odgovor i pošaljite

### Kako da poboljšam ocenu?

- Pružajte kvalitetne usluge
- Budite brzi i pouzdani
- Komunicirajte jasno sa klijentima
- Potvrđujte termine na vreme
- Tražite od zadovoljnih klijenata da ostave recenzije

## Admin Panel

### Kako da pristupim admin panelu?

Prijavite se sa admin nalogom:
- Email: admin@platforma.rs
- Lozinka: admin123

### Šta mogu kao admin?

- Upravljati svim korisnicima
- Menjati status korisnika (aktivan/suspendovan/banovan)
- Brisati neprikladan sadržaj
- Pregledati sve termine i poruke
- Videti statistike platforme
- Upravljati kategorijama

### Kako da obrišem korisnika?

1. Idite u Admin Panel → Korisnici
2. Pronađite korisnika
3. Kliknite ikonu korpe
4. Potvrdite brisanje

### Kako da moderiram recenzije?

1. Idite u Admin Panel → Recenzije
2. Pregledajte recenzije
3. Možete odobriti, odbiti ili obrisati recenzije

## Problemi i Rešenja

### Ne mogu da se prijavim

- Proverite da li ste uneli tačan email i lozinku
- Proverite da li ste registrovani
- Pokušajte sa test nalogom (admin@platforma.rs / admin123)
- Očistite localStorage i pokušajte ponovo

### Izgubio/la sam podatke

Ako ste obrisali browser cache ili localStorage, podaci su trajno izgubljeni. localStorage je privremeno skladište.

### Aplikacija ne radi

1. Osvežite stranicu (F5 ili Ctrl+R)
2. Očistite cache i cookies
3. Pokušajte u drugom browser-u
4. Proverite konzolu (F12) za greške
5. Prijavite issue na GitHub-u

### Poruka "Morate biti prijavljeni"

Prijavite se ili se registrujte pre nego što pokušate da koristite funkcionalnosti koje zahtevaju autentifikaciju.

### Ne vidim pružaoce usluga

- Proverite filtere pretrage
- Očistite sve filtere i pokušajte ponovo
- Osvežite stranicu

### Moja recenzija ne prikazuje se

Recenzije mogu zahtevati odobrenje administratora. Takođe, možete ostaviti recenziju samo za završene termine.

## Razvojne Mogućnosti

### Mogu li dodati novu funkcionalnost?

Da! Pogledajte CONTRIBUTING.md za uputstva kako da doprinesete projektu.

### Planirate li dodati backend?

Backend integracija je planirana za verziju 2.0. Ako želite da pomognete, dobrodošli ste!

### Mogu li koristiti svoj dizajn?

Da, možete slobodno modifikovati CSS stilove i dizajn.

### Postoji li API dokumentacija?

Trenutno ne, jer nema backend-a. API dokumentacija će biti dostupna u budućoj verziji.

## Kontakt i Podrška

### Gde da prijavim bug?

Otvorite issue na GitHub repozitorijumu sa detaljnim opisom problema.

### Imam ideju za novu funkcionalnost

Super! Otvorite issue sa labelom "enhancement" i opišite svoju ideju.

### Trebam pomoć sa instalacijom

Pogledajte README.md fajl za detaljne instrukcije.

### Mogu li doprineti projektu?

Naravno! Pogledajte CONTRIBUTING.md za smernice.

---

**Nemate odgovor na vaše pitanje?**

Otvorite issue na GitHub-u ili kontaktirajte maintainer-e projekta.

