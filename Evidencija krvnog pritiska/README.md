# Evidencija Krvnog Pritiska

Web aplikacija za praćenje i analizu krvnog pritiska. Aplikacija omogućava unos, pregled, statistiku i vizualizaciju merenja krvnog pritiska.

## 🚀 Funkcionalnosti

### Unos Podataka
- **Sistolički i dijastolički pritisak** (obavezno polje)
- **Puls** (opciono)
- **Datum i vreme** (automatski postavljeno, moguće izmeniti)
- **Aktivnost pre merenja** (mirno sedenje, posle fizičke aktivnosti, posle jela, itd.)
- **Simptomi** (glavobolja, vrtoglavica, mučnina, umor, bez simptoma)
- **Lekovi** (tekstualni unos)
- **Napomene** (dodatne informacije)

### Pregled Merenja
- **Tabelarni prikaz** svih merenja
- **Sortiranje** po datumu (najnovije prvo)
- **Filtriranje** po periodu (danas, ova nedelja, ovaj mesec, sva merenja)
- **Kategorizacija** prema WHO standardima sa bojama:
  - 🟢 Optimalan: <120/<80
  - 🟢 Normalan: 120-129/80-84
  - 🟡 Visok normalan: 130-139/85-89
  - 🟠 Hipertenzija 1: 140-159/90-99
  - 🔴 Hipertenzija 2: 160-179/100-109
  - 🔴 Hipertenzija 3: ≥180/≥110
- **Izmena i brisanje** merenja

### Statistika
- Ukupno merenja
- Prosek pritiska (sveukupno, ova nedelja, ovaj mesec)
- Minimum i maksimum vrednosti
- Prosečan puls
- Trend (poboljšanje, pogoršanje, stabilno)

### Grafikoni
- **Linijski grafikon** pritiska kroz vreme (sistolički i dijastolički)
- **Bar grafikon** prosečnih vrednosti po danima
- **Grafikon pulsa** (ako postoje podaci)

### Dodatne Funkcionalnosti
- **Dark mode** - prebacivanje između svetle i tamne teme
- **Export podataka** - preuzimanje svih merenja u JSON formatu
- **Responsive dizajn** - radi na svim uređajima (desktop, tablet, mobilni)
- **Lokalno skladištenje** - svi podaci se čuvaju u browseru (localStorage)

## 📋 Zahtevi

- Moderni web browser (Chrome, Firefox, Safari, Edge)
- Internet konekcija (samo za učitavanje Font Awesome i Google Fonts)

## 🛠️ Instalacija i Pokretanje

1. **Preuzmite ili klonirajte projekat**
   ```bash
   git clone <repository-url>
   cd "Evidencija krvnog pritiska"
   ```

2. **Otvorite aplikaciju**
   - Otvorite `index.html` u web browseru
   - Ili koristite lokalni server:
     ```bash
     # Python 3
     python -m http.server 8000
     
     # Node.js (sa http-server)
     npx http-server
     ```

3. **Pristupite aplikaciji**
   - Otvorite browser i idite na `http://localhost:8000`

## 📁 Struktura Projekta

```
/
├── index.html          # Glavna HTML struktura
├── css/
│   └── style.css       # Stilovi (uključujući dark mode)
├── js/
│   ├── app.js          # Glavna aplikacija logika
│   ├── storage.js       # localStorage funkcije
│   ├── charts.js        # Chart.js integracija
│   └── utils.js         # Pomoćne funkcije
└── README.md           # Dokumentacija
```

## 🎨 Dizajn

- **Minimalistički i moderan** dizajn
- **Dark mode** podrška
- **Responsive** - prilagođen svim ekranima
- **Intuitivna navigacija** sa hamburger menijem na mobilnim uređajima
- **Smooth animacije** i tranzicije

## 💾 Skladištenje Podataka

Svi podaci se čuvaju lokalno u browseru koristeći **localStorage API**. Podaci se ne šalju na server i ostaju na vašem uređaju.

### Backup
- Koristite opciju **Export JSON** za kreiranje backup kopije
- Podaci se eksportuju u JSON formatu koji možete kasnije importovati

## 🔧 Tehnologije

- **HTML5** - Struktura
- **CSS3** - Stilovi (Grid, Flexbox, CSS Variables)
- **Vanilla JavaScript** - Logika aplikacije
- **Chart.js** - Grafikoni (CDN)
- **Font Awesome** - Ikone (CDN)
- **Google Fonts** - Fontovi (Inter)

## 📱 Responsive Breakpoints

- **Mobile**: < 480px
- **Tablet**: 480px - 768px
- **Desktop**: 768px - 1024px
- **Large Desktop**: > 1024px

## 🎯 Korišćenje

1. **Dodavanje merenja**
   - Kliknite na "Unos Merenja" u navigaciji
   - Popunite formu sa podacima
   - Kliknite "Sačuvaj Merenje"

2. **Pregled merenja**
   - Kliknite na "Pregled" u navigaciji
   - Koristite filter za prikaz određenog perioda
   - Kliknite na ikone za izmenu ili brisanje

3. **Statistika**
   - Kliknite na "Statistika" u navigaciji
   - Pregledajte sve statističke podatke

4. **Grafikoni**
   - Kliknite na "Grafikoni" u navigaciji
   - Pregledajte vizualizacije podataka

5. **Dark mode**
   - Kliknite na ikonu meseca/sunca u header-u

## 📝 Napomene

- Aplikacija radi potpuno offline nakon što se učita (osim CDN resursa)
- Podaci se čuvaju samo u vašem browseru
- Preporučeno je redovno kreirati backup kopije (Export JSON)
- Aplikacija ne zahteva registraciju ili prijavu

## 🐛 Rešavanje Problema

### Podaci se ne čuvaju
- Proverite da li je omogućen localStorage u browseru
- Proverite da li imate dovoljno prostora u browseru

### Grafikoni se ne prikazuju
- Proverite internet konekciju (potrebna za Chart.js CDN)
- Osvežite stranicu

### Dark mode ne radi
- Proverite da li browser podržava CSS custom properties
- Osvežite stranicu

## 📄 Licenca

Ovaj projekat je kreiran za ličnu upotrebu.

## 👨‍💻 Autor

Kreirano za evidenciju i praćenje krvnog pritiska.

---

**Napomena**: Ova aplikacija nije medicinski alat i ne zamenjuje profesionalnu medicinsku pomoć. Uvek konsultujte lekara za medicinske savete.
