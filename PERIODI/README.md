# 🩸 Periodi - Aplikacija za Praćenje Menstrualnog Ciklusa

Jednostavna i privatna web aplikacija za praćenje menstrualnog ciklusa, napravljena u Vanilla JavaScript bez eksternih biblioteka.

## ✨ Funkcionalnosti

### 📊 Dashboard
- Trenutni status ciklusa sa progress bar-om
- Predviđanja (sledeća menstruacija, ovulacija, plodni dani)
- Statistika ciklusa (prosečna dužina, ukupno ciklusa)
- Statistika simptoma (energija, raspoloženje, bol, libido)
- Brze akcije (počni ciklus, zabeleži simptome, dodaj podsetnik, popuni anketu)

### 📅 Kalendar
- Vizuelni prikaz meseca sa obeležavanjem dana
- Obeležavanje dana menstruacije, ovulacije i plodnih dana
- Navigacija kroz mesece
- Legenda sa objašnjenjem boja

### 💊 Simptomi
- Formular za unos simptoma (energija, raspoloženje, bol, libido)
- Range inputi za ocenjivanje (1-10)
- Checkbox za dodatne simptome
- Istorija simptoma sa AI generisanim sažecima

### 📋 AI Anketa
- Dnevna anketa sa AI generisanim pitanjima (Groq API)
- Pitanja prilagođena fazi ciklusa
- Automatsko generisanje sažetaka o osećanjima
- Validacija da su pitanja na srpskom jeziku

### ⚙️ Podešavanja
- Podešavanja ciklusa (prosečna dužina, dužina menstruacije)
- Notifikacije (period start, ovulation, fertile window)
- Izvoz podataka u JSON format
- Brisanje svih podataka

### 🎨 Tema
- Light/Dark mode sa automatskim pamćenjem
- Smooth tranzicije između tema
- Moderni dizajn sa gradijentima i animacijama

## 🏗️ Arhitektura

Aplikacija koristi **modularnu arhitekturu** gde svaka funkcionalnost ima svoj modul:

- `app.js` - Glavna klasa `PeriodTracker` koja koordinira sve module
- `js/storage.js` - Upravljanje localStorage operacijama
- `js/utils.js` - Pomoćne funkcije
- `js/dashboard.js` - Dashboard funkcionalnosti
- `js/calendar.js` - Kalendar funkcionalnosti
- `js/cycles.js` - Logika za upravljanje ciklusima
- `js/symptoms.js` - Upravljanje simptomima
- `js/formular-za-simptome.js` - Formular za unos simptoma (klasa)
- `js/anketa.js` - AI anketa sa Groq API-jem (klasa)
- `js/reminders.js` - Upravljanje podsetnicima
- `js/notifications.js` - Browser notifikacije
- `js/settings.js` - Podešavanja aplikacije
- `js/theme.js` - Dark/Light mode
- `js/events.js` - Event listeners

## 🚀 Pokretanje

1. Otvori `index.html` u web pregledaču
2. Aplikacija se automatski inicijalizuje
3. Svi podaci se čuvaju lokalno u browser-u

## 🔒 Privatnost

- **Svi podaci se čuvaju lokalno** - Nema slanja podataka na server
- **Nema Cloud Storage** - Podaci ostaju na tvom uređaju
- **Nema Tracking** - Bez analitike ili deljenja podataka
- **Izvoz Podataka** - Možeš izvesti sve podatke u JSON format

## 🌐 Jezik

Aplikacija je potpuno na **srpskom jeziku**:
- **Dijalekt**: Ekavski (lepo, deo, mleko, srećan, želeo, hteo)
- **Pismo**: Latinica
- **Lice**: Drugo lice jednine (ti, tebe, tvoj)
- **Rod**: Ženski rod za korisnicu

## 🤖 AI Funkcionalnosti

Aplikacija koristi **Groq API** za:
- Generisanje dnevne ankete sa prilagođenim pitanjima
- Generisanje sažetaka o osećanjima na osnovu odgovora

### API Konfiguracija
- **Model**: `llama-3.1-8b-instant`
- **Temperature**: 0.7
- **Validacija**: Automatska validacija da su pitanja na srpskom jeziku

## 📱 PWA Funkcionalnosti

Aplikacija je **PWA ready** sa `manifest.json`:
- Može se instalirati na uređaj
- Radi offline (nakon prvog učitavanja)
- Standalone prikaz

## 🎨 Dizajn

- **Moderni UI**: Gradijenti, animacije, micro-interactions
- **Responsive**: Radi na desktop, tablet i mobile uređajima
- **Dark/Light Mode**: Automatsko pamćenje teme
- **CSS Variables**: Za lako prilagođavanje boja

## 📋 Zahtevi

- Moderni web pregledač (Chrome, Firefox, Safari, Edge)
- JavaScript omogućen
- Local Storage podrška

## 📝 Licenca

Ovaj projekat je kreiran za ličnu upotrebu.

## 🛠️ Razvoj

Aplikacija je napravljena u **Vanilla JavaScript** bez eksternih biblioteka:
- **HTML5** - Semantička struktura
- **CSS3** - Moderni, responzivni dizajn
- **JavaScript (ES6+)** - Modularna arhitektura
- **Local Storage** - Čuvanje podataka

## 📞 Podrška

Za pitanja ili probleme, otvori issue na GitHub-u.

---

**Napomena**: Ova aplikacija nije medicinski alat i ne sme se koristiti kao zamena za medicinske savete. Uvek konsultuj lekara za medicinske probleme.
