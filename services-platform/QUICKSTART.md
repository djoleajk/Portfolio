# 🚀 Brzi Start - Platforma za Usluge

Dobrodošli! Evo kako da brzo pokrenete aplikaciju i isprobate sve funkcionalnosti.

## ⚡ Pokretanje (1 minut)

### Opcija 1: Jednostavno otvaranje

```bash
# 1. Preuzmite projekat
# 2. Otvorite index.html u browser-u
# To je sve! 🎉
```

### Opcija 2: Sa Live Server

```bash
# Ako koristite VS Code sa Live Server ekstenzijom:
# 1. Otvorite projekat u VS Code
# 2. Desni klik na index.html
# 3. "Open with Live Server"
```

### Opcija 3: Sa NPM

```bash
# Ako imate Node.js instaliran:
npm start
# Ili:
npx live-server --port=8080 --open=index.html
```

## 🎯 Brzi Test Scenario (5 minuta)

### 1️⃣ Test kao Klijent

**Korak 1: Registracija**
```
1. Otvorite aplikaciju
2. Kliknite "Registracija"
3. Popunite:
   - Ime: Vaše Ime
   - Email: vas@email.com
   - Lozinka: test123
   - Tip: Klijent
4. Kliknite "Registruj se"
```

**Korak 2: Prijava**
```
1. Unesite email i lozinku
2. Kliknite "Prijavi se"
3. Redirectovani ste na dashboard
```

**Korak 3: Pretraga Usluga**
```
1. Kliknite "Usluge" u navigaciji
2. Pretražite "vodoinstalater"
3. Ili filtrirajte po kategoriji "Popravke"
4. Pregledajte rezultate
```

**Korak 4: Zakazivanje Termina**
```
1. Kliknite na bilo kog pružaoca
2. Kliknite "Zakaži Termin"
3. Popunite:
   - Datum: Sutra
   - Vreme: 10:00
   - Opis: "Pokvaren slavina u kuhinji"
   - Telefon: 060 123 4567
4. Pošaljite zahtev
```

**Korak 5: Provera Dashboard-a**
```
1. Idite u "Moj Panel"
2. Pogledajte "Moji Termini"
3. Vidite zakazan termin sa statusom "Na čekanju"
```

---

### 2️⃣ Test kao Pružalac Usluga

**Korak 1: Registracija kao Pružalac**
```
1. Odjavite se (ako ste prijavljeni)
2. Kliknite "Registracija"
3. Popunite:
   - Ime: Pera Perić
   - Email: pera@email.com
   - Lozinka: test123
   - Tip: Pružalac Usluga
   - Kategorija: IT i Tehnologija
   - Lokacija: Beograd
4. Registrujte se i prijavite se
```

**Korak 2: Uređivanje Profila**
```
1. U "Moj Panel" kliknite "Uredi Profil"
2. Dodajte:
   - Opis: "Iskusan web developer..."
   - Telefon: 064 123 4567
   - Cena: 3000 RSD/h
3. Sačuvajte
```

**Korak 3: Simulacija Zahteva**
```
(Budući korisnici će moći da vam šalju zahteve)
```

---

### 3️⃣ Test kao Administrator

**Korak 1: Prijava kao Admin**
```
Email: admin@platforma.rs
Lozinka: admin123
```

**Korak 2: Pregled Dashboard-a**
```
1. Idite na "Admin" u navigaciji
2. Vidite:
   - Ukupno korisnika: 7+
   - Ukupno pružalaca: 6+
   - Termini, recenzije
   - Nedavne aktivnosti
```

**Korak 3: Upravljanje Korisnicima**
```
1. Kliknite "Korisnici" u sidebar-u
2. Vidite sve registrovane korisnike
3. Možete menjati status
4. Možete brisati korisnike
```

**Korak 4: Pregled Pružalaca**
```
1. Kliknite "Pružaoci Usluga"
2. Vidite sve pružaoce sa ocenama
3. Možete suspendovati pružaoce
```

## 🎨 Demo Podaci

Aplikacija dolazi sa 6 unapred kreiranih pružalaca:

### 1. Marko Petrović - Vodoinstalater
- **Kategorija:** Popravke
- **Lokacija:** Beograd
- **Cena:** 2000 RSD/h
- **Ocena:** ⭐ 4.8

### 2. Ana Jovanović - Frizer
- **Kategorija:** Lepota i Wellness
- **Lokacija:** Novi Sad
- **Cena:** 1500 RSD/h
- **Ocena:** ⭐ 4.9

### 3. Stefan Nikolić - Web Developer
- **Kategorija:** IT i Tehnologija
- **Lokacija:** Beograd
- **Cena:** 3500 RSD/h
- **Ocena:** ⭐ 4.7

### 4. Milica Đorđević - Čišćenje
- **Kategorija:** Dom i Bašta
- **Lokacija:** Niš
- **Cena:** 1200 RSD/h
- **Ocena:** ⭐ 4.6

### 5. Nikola Ilić - Privatni Časovi
- **Kategorija:** Edukacija
- **Lokacija:** Beograd
- **Cena:** 1800 RSD/h
- **Ocena:** ⭐ 4.9

### 6. Jelena Pavlović - Selidbe
- **Kategorija:** Transport
- **Lokacija:** Kragujevac
- **Cena:** 2500 RSD/h
- **Ocena:** ⭐ 4.5

## 🔥 Top 10 Funkcionalnosti za Testiranje

1. ✅ **Pretraga i filtriranje** - Probajte različite kombinacije filtera
2. ✅ **Responzivnost** - Otvorite na telefonu i tabletu
3. ✅ **Zakazivanje** - Zakažite nekoliko termina
4. ✅ **Poruke** - Pošaljite poruku pružaocu
5. ✅ **Recenzije** - Ostavite recenziju (nakon završenog termina)
6. ✅ **Uređivanje profila** - Promenite svoje podatke
7. ✅ **Sortiranje** - Sortirajte po ceni, oceni, broju recenzija
8. ✅ **Kategorije** - Kliknite na različite kategorije
9. ✅ **Admin panel** - Testirajte sve admin funkcionalnosti
10. ✅ **Notifikacije** - Obratite pažnju na toast poruke

## 🎯 Test Checklist

Koristite ovaj checklist da testirate sve funkcionalnosti:

### Autentifikacija
- [ ] Registracija kao klijent
- [ ] Registracija kao pružalac
- [ ] Prijava
- [ ] Odjava
- [ ] Prikaz korisničkog menija

### Pretraga i Filteri
- [ ] Pretraga po ključnoj reči
- [ ] Filter po kategoriji
- [ ] Filter po lokaciji
- [ ] Filter po ceni (min/max)
- [ ] Filter po oceni
- [ ] Sortiranje rezultata
- [ ] Prikaz "Nema rezultata"

### Profili Pružalaca
- [ ] Prikaz kartice pružaoca
- [ ] Otvaranje detaljnog profila
- [ ] Prikaz recenzija
- [ ] Prikaz kontakt informacija

### Termini
- [ ] Zakazivanje novog termina
- [ ] Prikaz mojih termina
- [ ] Filter termina po statusu
- [ ] Potvrđivanje termina (kao pružalac)
- [ ] Odbijanje termina (kao pružalac)
- [ ] Označavanje kao završeno

### Poruke
- [ ] Slanje poruke pružaocu
- [ ] Prijem poruka
- [ ] Čitanje poruka
- [ ] Odgovor na poruku
- [ ] Badge za nepročitane poruke

### Recenzije
- [ ] Ostavljanje recenzije
- [ ] Star rating (1-5)
- [ ] Prikaz recenzija u profilu
- [ ] Prosečna ocena

### Dashboard
- [ ] Prikaz profila
- [ ] Uređivanje profila
- [ ] Navigacija između sekcija
- [ ] Prikaz statistika (za pružaoce)

### Admin Panel
- [ ] Dashboard sa statistikama
- [ ] Pregled svih korisnika
- [ ] Uređivanje korisnika
- [ ] Brisanje korisnika
- [ ] Pregled pružalaca
- [ ] Suspendovanje pružalaca
- [ ] Moderacija recenzija
- [ ] Pregled termina

### Responzivnost
- [ ] Desktop (> 1024px)
- [ ] Tablet (768px - 1024px)
- [ ] Mobilni (< 768px)
- [ ] Navigacija na mobilnom

### UI/UX
- [ ] Animacije i tranzicije
- [ ] Modal dijalozi
- [ ] Toast notifikacije
- [ ] Loading states
- [ ] Error handling

## 🐛 Poznati Bug-ovi

- Nema poznatih bug-ova trenutno
- Prijavite ako pronađete problem!

## 💡 Saveti

1. **Koristite Chrome DevTools** - Otvorite sa F12 za debugging
2. **Proverite localStorage** - Application → Local Storage
3. **Testirajte u Incognito** - Za čist localStorage
4. **Mobalni prikaz** - DevTools → Toggle device toolbar
5. **Konzola** - Pratite console.log poruke

## 🎓 Sledeći Koraci

Nakon testiranja:

1. 📖 Pročitajte [README.md](README.md) za detalje
2. 🤝 Pogledajte [CONTRIBUTING.md](CONTRIBUTING.md) za doprinos
3. ❓ Proverite [FAQ.md](FAQ.md) za česta pitanja
4. 📝 Pročitajte [CHANGELOG.md](CHANGELOG.md) za izmene

## 🆘 Pomoć

Ako imate problema:

1. Proverite konzolu (F12) za greške
2. Proverite localStorage u DevTools-u
3. Osvežite stranicu (Ctrl+R)
4. Pokušajte u Incognito mode-u
5. Kontaktirajte maintainer-e

---

**Srećno Testiranje!** 🚀✨

*Vreme potrebno: 5-10 minuta za kompletno testiranje*

