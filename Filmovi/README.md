# 🎬 Filmovi - Web Aplikacija za Kolekciju Filmova

Moderna, potpuno frontend web aplikacija za upravljanje i gledanje vaše kolekcije filmova. Radi isključivo sa statičkim fajlovima bez potrebe za serverom.

## ✨ Karakteristike

### 🎥 Video Player
- **Podrška za više formata izvora:**
  - MP4 direktni video fajlovi
  - HLS streaming (sa hls.js)
  - Iframe embeds (YouTube, Vimeo, itd.)
- **Napredne kontrole:**
  - Play/Pause, Scrub, Volume, Mute
  - Fullscreen i Picture-in-Picture
  - Kontrola brzine reprodukcije (0.5x - 2x)
  - Keyboard shortcuts
- **Automatsko prebacivanje** na drugi izvor u slučaju greške

### 🔍 Pretraga i Filteri
- Pretraga po naslovu i opisu u realnom vremenu
- Filter po žanru
- Filter po godini proizvodnje
- Reset dugme za brzo čišćenje filtera

### ⭐ Omiljeni Filmovi
- Dodavanje/uklanjanje filmova u omiljene
- Prikaz omiljenih filmova jednim klikom
- Podaci se čuvaju lokalno u pregledaču

### ⚙️ Admin Panel
- **Dodavanje novih filmova** sa potpunom kontrolom
- **Uređivanje postojećih filmova** (samo custom filmove)
- **Brisanje filmova** (samo custom filmove)
- **Dinamičko dodavanje više izvora** za svaki film
- **Preview postera** u realnom vremenu
- **Validacija forme** pre čuvanja

### 📱 Responsive Dizajn
- Potpuno prilagodljiv za sve veličine ekrana
- Mobile-first pristup
- Touch-friendly kontrole

### ♿ Pristupačnost
- ARIA atributi
- Keyboard navigacija
- Focus indikatori
- Screen reader friendly

## 🚀 Kako Pokrenuti

1. **Preuzmite sve fajlove:**
   - `index.html`
   - `styles.css`
   - `app.js`

2. **Otvorite `index.html` u vašem pregledaču**

To je sve! Nema instalacije, build procesa, ili servera.

## 📖 Korišćenje

### Osnovna Navigacija

1. **Pregled Filmova:** Svi filmovi se prikazuju u grid prikazu na glavnoj strani
2. **Klik na Film:** Otvara modal sa detaljima i video playerom
3. **Omiljeni:** Kliknite na dugme "⭐ Omiljeni" da vidite samo omiljene filmove
4. **Admin:** Kliknite na dugme "⚙️ Admin" da pristupite admin panelu

### Video Player Kontrole

#### Miš/Touch Kontrole:
- **Klik na video:** Play/Pause
- **Progress bar:** Klik ili drag za premotavanje
- **Volume slider:** Podešavanje glasnoće
- **Speed dropdown:** Promena brzine reprodukcije
- **Fullscreen:** Prikaz preko celog ekrana
- **Picture-in-Picture:** Gledanje dok radite nešto drugo

#### Keyboard Shortcuts:
- `Space` - Play/Pause
- `←` - Premotaj 5 sekundi unazad
- `→` - Premotaj 5 sekundi unapred
- `↑` - Povećaj glasnoću
- `↓` - Smanji glasnoću
- `F` - Fullscreen
- `M` - Mute/Unmute
- `ESC` - Zatvori modal

### 🛠️ Admin Panel - Dodavanje Filmova

#### Korak 1: Otvorite Admin Panel
Kliknite na dugme **"⚙️ Admin"** u header-u.

#### Korak 2: Dodajte Film
1. U tabu **"➕ Dodaj Film"**, popunite formu:
   - **Naslov filma** (obavezno)
   - **Godina** (obavezno)
   - **Trajanje** (npr. "120 min")
   - **Žanr** (npr. "Akcija", "Drama")
   - **Opis** (kratak opis filma)
   - **URL postera** (link do slike)

#### Korak 3: Dodajte Izvore
1. Kliknite **"➕ Dodaj izvor"**
2. Za svaki izvor unesite:
   - **Naziv izvora** (npr. "Izvor A", "HD Verzija")
   - **Tip izvora:**
     - **MP4 Video** - Za direktne MP4 linkove
     - **HLS Stream** - Za .m3u8 streaming linkove
     - **Iframe Embed** - Za YouTube/Vimeo embeds
   - **URL izvora** - Link do videa

3. Možete dodati više izvora po potrebi
4. Možete ukloniti izvor dugmetom **"🗑️ Ukloni"**

#### Korak 4: Sačuvajte
Kliknite **"💾 Sačuvaj Film"** - film će biti dodat u vašu kolekciju!

### 📝 Uređivanje i Brisanje Filmova

1. U admin panelu, idite na tab **"📋 Upravljaj Filmovima"**
2. Videćete listu svih filmova
3. **Filmovi koje ste vi dodali** imaju dugmad:
   - **"✏️ Uredi"** - Menja podatke filma
   - **"🗑️ Obriši"** - Briše film (sa potvrdnim dijalogom)
4. **Default filmovi** su zaključani i ne mogu se brisati

### 💾 Čuvanje Podataka

- **Omiljeni filmovi:** Čuvaju se u localStorage
- **Custom filmovi:** Čuvaju se u localStorage
- **Default filmovi:** Hardkodirani u aplikaciji, ne mogu se brisati
- Svi podaci ostaju u vašem pregledaču i ne šalju se nigde

## 🎨 Primeri Izvora

### MP4 Video
```
Tip: MP4 Video
URL: https://example.com/movie.mp4
```

### HLS Stream
```
Tip: HLS Stream
URL: https://example.com/stream.m3u8
```

### YouTube Embed
```
Tip: Iframe Embed
URL: https://www.youtube.com/embed/VIDEO_ID
```

### Vimeo Embed
```
Tip: Iframe Embed
URL: https://player.vimeo.com/video/VIDEO_ID
```

## 🔧 Tehnologije

- **HTML5** - Struktura
- **CSS3** - Stilizovanje (Flexbox, Grid, Animations)
- **Vanilla JavaScript** - Funkcionalnost (bez framework-a)
- **localStorage** - Čuvanje podataka
- **hls.js** - HLS streaming podrška (učitava se sa CDN-a)

## 🎯 Default Filmovi

Aplikacija dolazi sa 6 default filmova:
1. Veliki Gatsby (2013)
2. Interstellar (2014)
3. Početak (2010)
4. Matrix (1999)
5. Krstni otac (1972)
6. Tamni vitez (2008)

Ovi filmovi ne mogu se brisati, ali možete dodati svoje!

## 🐛 Troubleshooting

### Video se ne učitava?
- Proverite URL izvora
- Pokušajte drugi izvor (kliknite na dropdown meni "Izaberi izvor")
- Dugme "Probaj drugi izvor" automatski prelazi na sledeći izvor

### Poster se ne prikazuje?
- Proverite da li je URL tačan
- URL mora biti javno dostupan
- Podržani formati: JPG, PNG, WebP, GIF

### Admin panel ne čuva promene?
- Proverite da li ste popunili sva obavezna polja (označena sa *)
- Morate dodati bar jedan izvor za film
- Proverite konzolu pregledača (F12) za greške

### localStorage je pun?
- Izbrišite neke custom filmove
- Očistite localStorage u pregledaču:
  ```javascript
  localStorage.removeItem('customMovies')
  localStorage.removeItem('favorites')
  ```

## 📱 Browser Support

- ✅ Chrome/Edge (latest)
- ✅ Firefox (latest)
- ✅ Safari (latest)
- ✅ Mobile browsers

## 📄 Licenca

Ova aplikacija je otvorenog koda i možete je koristiti slobodno za lične projekte.

## 🤝 Doprinosi

Aplikacija je dizajnirana da bude jednostavna za prilagođavanje. Slobodno menjajte:
- Stilove u `styles.css`
- Funkcionalnost u `app.js`
- Default filmove u `moviesData` array-u

---

**Uživajte u gledanju filmova! 🎬🍿**

