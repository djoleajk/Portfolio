# 📝 Todo Lista Pro

Napredna web aplikacija za upravljanje zadacima sa potpunom funkcionalnosti, modernim dizajnom i PWA podrškom.

## ✨ Funkcionalnosti

### 🎯 Osnovne Funkcionalnosti

#### 1. **CRUD Operacije**
- ➕ **Create** - Dodavanje novih zadataka sa svim detaljima
- 📋 **Read** - Prikazivanje liste svih zadataka
- ✏️ **Update** - Izmena postojećih zadataka
- 🗑️ **Delete** - Brisanje zadataka sa potvrdom

#### 2. **Filtriranje Zadataka**
- **Svi zadaci** - Prikazuje sve zadatke
- **Aktivni** - Samo nezavršeni zadaci
- **Završeni** - Samo završeni zadaci
- **Po kategorijama** - Filter po vrsti zadatka (Posao, Lično, Kupovina, Zdravlje, Ostalo)

#### 3. **Pretraga**
- 🔍 **Real-time pretraga** - Pretražuje naziv i napomene zadataka
- Instant rezultati dok kucate

#### 4. **Sortiranje**
- 📅 **Po datumu** - Najnovije/najstarije prvo
- 🔤 **Alfabetski** - A-Z ili Z-A
- 🎯 **Po prioritetu** - Visoki, srednji, niski
- ⏰ **Po roku** - Zadaci sa najbližim rokovima prvo

### 🌟 Napredne Funkcionalnosti

#### 5. **Prioriteti Zadataka**
- 🔴 **Visoki prioritet** - Za hitne zadatke
- 🟡 **Srednji prioritet** - Za standardne zadatke
- 🟢 **Niski prioritet** - Za manje važne zadatke
- Vizuelna indikacija sa bojom na levoj strani zadatka

#### 6. **Rokovi (Due Dates)**
- 📅 Postavljanje krajnjeg roka za zadatak
- ⚠️ Upozorenja za zadatke koji kasne (crvena pozadina)
- 📊 Prikaz "Danas", "Sutra", "Zakasnjenje"
- 🔔 Browser notifikacije za zadatke sa rokom danas

#### 7. **Kategorije/Tagovi**
- 💼 **Posao** - Profesionalni zadaci
- 👤 **Lično** - Lični zadaci
- 🛒 **Kupovina** - Lista kupovine
- 💪 **Zdravlje** - Fitness i zdravlje
- 📌 **Ostalo** - Ostali zadaci

#### 8. **Dark Mode** 🌙
- Toggle dugme za tamnu temu
- Automatsko čuvanje preference
- Prijatan za oči u mraku
- Svi elementi prilagođeni tamnoj temi

#### 9. **Drag & Drop**
- 🖱️ Prevlačenje zadataka za promenu redosleda
- Intuitivno preuređivanje liste
- Automatsko čuvanje novog redosleda

#### 10. **Progress Bar**
- 📊 Vizuelni prikaz procenta završenih zadataka
- Real-time ažuriranje
- Animirani prelazi

#### 11. **Bulk Akcije**
- ✅ **Označi sve kao završeno** - Brzo završavanje svih zadataka
- 🗑️ **Obriši sve završene** - Čišćenje liste
- ❌ **Obriši sve zadatke** - Potpuno resetovanje (sa potvrdom)
- 💾 **Izvezi** - Export u JSON format
- 📥 **Uvezi** - Import iz JSON fajla

#### 12. **Undo Funkcionalnost**
- ↶ Vraćanje obrisanih zadataka
- Toast notifikacija sa "Vrati" dugmetom
- 5 sekundi za poništavanje akcije

#### 13. **Statistika i Analytics**
- 📊 Ukupan broj kreiranih zadataka
- ✅ Ukupan broj završenih zadataka
- 📈 Stopa završavanja (procenat)
- 📆 Prosek dnevno
- 📉 Grafikon završenih zadataka za poslednjih 7 dana
- 🔥 **Streak sistem** - Uzastopni dani sa završenim zadacima

#### 14. **Subtasks (Podzadaci)**
- 📋 Dodavanje podzadataka za svaki zadatak
- Checklist unutar glavnog zadatka
- Progress prikaz (npr. 2/5 podzadataka)
- Zasebni modal za upravljanje

#### 15. **Browser Notifikacije**
- 🔔 Notifikacije za zadatke sa rokom danas
- ⏰ Notifikacije kada se završi Pomodoro timer
- Automatska provera svakog minuta
- Zahtev za dozvolu pri prvom pokretanju

#### 16. **Pomodoro Timer**
- ⏱️ Integrisani tajmer za fokus
- ▶️ Start, ⏸️ Pause, 🔄 Reset kontrole
- 🍅 **Pomodoro** (25 min) - Rad
- ☕ **Kratka pauza** (5 min) - Odmor
- 🛋️ **Duga pauza** (15 min) - Duži odmor
- Zvučna i vizuelna signalizacija na kraju

#### 17. **Napomene**
- 📝 Dodavanje opisa/beleški za svaki zadatak
- Opciono polje ispod naziva zadatka
- Pretražive napomene
- Poseban vizuelni prikaz

#### 18. **Keyboard Shortcuts**
- `Ctrl/Cmd + K` - Fokus na pretragu
- `Ctrl/Cmd + N` - Fokus na novi zadatak
- `Enter` - Dodavanje/čuvanje zadatka
- `Escape` - Zatvaranje modala
- `Delete` - Brisanje selektovanog (planiran)

#### 19. **Multi-language (Srpski/Engleski)**
- 🌐 Toggle dugme za promenu jezika
- Potpuna lokalizacija UI-a
- Automatsko čuvanje preference
- Lako proširiv sistem za nove jezike

#### 20. **PWA (Progressive Web App)**
- 📱 Instalacija kao desktop/mobilna aplikacija
- 🔌 Offline podrška (Service Worker)
- 💾 Caching za brže učitavanje
- 📲 App manifest za instalaciju
- 🏠 Dodavanje na home screen

### 💾 Dodatne Karakteristike

- **localStorage** - Trajno čuvanje podataka
- **XSS zaštita** - Bezbedno rukovanje korisničkim inputom
- **Responsive dizajn** - Radi na svim uređajima
- **Print support** - Optimizovano za štampanje
- **Smooth animacije** - Glatke tranzicije i efekti
- **Custom scrollbar** - Stilizovan scrollbar
- **Empty states** - Prijatne poruke kada nema sadržaja

## 🚀 Instalacija i Pokretanje

### Jednostavno pokretanje:
1. Otvorite `Index.html` u browseru
2. Gotovo! Aplikacija je spremna za korišćenje

### Pokretanje kao PWA:
1. Otvorite aplikaciju preko HTTP servera (može biti i lokalni)
2. U browseru kliknite na ikonu za instalaciju (obično u address bar-u)
3. Aplikacija će biti instalirana i može raditi offline

### Lokalni server (opciono):
```bash
# Python 3
python -m http.server 8000

# Node.js (sa npx)
npx http-server

# PHP
php -S localhost:8000
```

Zatim otvorite: `http://localhost:8000`

## 📖 Kako Koristiti

### Dodavanje Zadatka:
1. Unesite naziv zadatka u input polje
2. (Opciono) Kliknite 📝 za dodavanje napomene
3. Izaberite prioritet, kategoriju i rok
4. Kliknite "Dodaj" ili pritisnite Enter

### Upravljanje Zadacima:
- ✅ Kliknite checkbox za označavanje kao završeno
- ✏️ Kliknite "Izmeni" za izmenu zadatka
- 📋 Kliknite za otvaranje podzadataka
- 🗑️ Kliknite "Obriši" za brisanje

### Filtriranje i Pretraga:
- Koristite filter dugmad (Svi/Aktivni/Završeni)
- Birajte kategoriju iz dropdown-a
- Kucajte u search bar za pretragu
- Menjajte sortiranje iz dropdown-a

### Pomodoro:
1. Izaberite mode (Pomodoro/Pauza)
2. Kliknite ▶️ za start
3. ⏸️ za pauzu, 🔄 za reset
4. Dobićete notifikaciju na kraju

### Statistika:
- Kliknite "Prikaži statistiku" na dnu
- Vidite detaljnu analitiku
- Grafikon pokazuje aktivnost za 7 dana

### Export/Import:
- Kliknite "Izvezi" za download JSON fajla
- Kliknite "Uvezi" za učitavanje backup-a

## 🎨 Tema i Jezik

### Promena Teme:
- Kliknite 🌙/☀️ ikonu u header-u
- Automatski se čuva preference

### Promena Jezika:
- Kliknite 🌐 ikonu u header-u
- Prelazi između srpskog i engleskog

## 🔧 Tehnologije

- **HTML5** - Struktura
- **CSS3** - Stilizacija i animacije
  - CSS Variables za teme
  - Flexbox & Grid layout
  - Media queries za responsivnost
- **JavaScript (Vanilla)** - Funkcionalnost
  - ES6+ features
  - LocalStorage API
  - Drag & Drop API
  - Notifications API
  - Service Worker API
- **PWA** - Progressive Web App
  - Manifest.json
  - Service Worker
  - Offline support

## 📱 Kompatibilnost

- ✅ Chrome 90+
- ✅ Firefox 88+
- ✅ Safari 14+
- ✅ Edge 90+
- ✅ Opera 76+
- ✅ Mobilni browseri (iOS Safari, Chrome Mobile)

## 📄 Licenca

Ovaj projekat je kreiran za edukativne svrhe i slobodan je za korišćenje.

## 🎯 Budući Razvoj

Moguća proširenja:
- 🔐 Autentifikacija korisnika
- ☁️ Cloud sinhronizacija
- 👥 Deljenje zadataka
- 📧 Email podsetnici
- 🎨 Kustomizacija tema i boja
- 🗂️ Projekti i radni prostori
- 📎 Prilaganje fajlova
- 🔗 Linkovanje zadataka
- 🤖 AI sugestije za produktivnost

## 👨‍💻 Autor

Kreirao: AI Assistant
Verzija: 1.0.0
Datum: 2025

---

**Uživajte u produktivnosti! 🚀**

