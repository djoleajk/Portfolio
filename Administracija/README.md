# 📋 README - Administracija Preduzeća

## 📖 Opis Projekta

Sistem za vodenje evidencija radnika u preduzeću. Aplikacija omogućava:
- ✅ Upravljanje radnicima (CRUD operacije)
- ✅ Evidenciju plata sa detaljnim breakdown-om
- ✅ Upravljanje godišnjim odmorima
- ✅ Slanje poruka i obaveštenja
- ✅ Sistem zahteva (godišnji odmor i administrativni zahtevi)
- ✅ Različite uloge korisnika (Admin, Radnik, Korisnik)
- ✅ **Potpuno responsive dizajn sa odvojenim interfejsima za desktop i mobilne uređaje**

## 🚀 Pokretanje

1. Otvori `index.html` u modernom web browseru
2. Nema potrebe za instalacijom - aplikacija radi direktno u browseru
3. Koristi IndexedDB za čuvanje podataka lokalno

## 👤 Demo Nalozi

- **Admin**: 
  - Username: `admin`
  - Password: `admin123`

- **Korisnik**: 
  - Username: `user`
  - Password: `user123`

## 📱 Responsive Dizajn

Aplikacija automatski detektuje tip uređaja i prikazuje odgovarajući interfejs:

### 🖥️ Desktop Interfejs (> 768px)
- Tradicionalni tab navigacija na vrhu
- Potpuni header sa svim informacijama
- Optimizovan za veće ekrane

### 📱 Mobilni Interfejs (≤ 768px)
- **Mobilni Header**: Kompaktan header sa hamburger menijem
- **Sidebar Navigacija**: Slide-out meni sa svim opcijama
- **Bottom Navigation**: Fiksirana navigacija na dnu ekrana za brz pristup glavnim sekcijama
- **Touch-friendly**: Svi elementi optimizovani za dodir
- **Optimizovano za telefone**: Pregledljivo i lako za korišćenje

## 🎯 Paneli

### 👑 Administrativni Panel
- Dashboard sa statistikama
- Upravljanje radnicima
- Plate liste
- Godišnji odmori
- Ostale evidencije
- Poruke/Obaveštenja
- Zahtevi
- Upravljanje korisnicima

### 👤 Korisnički Panel
- Moj Profil
- Moji Zahtevi
- Poruke

### 👷 Radnički Panel
- Moj Profil
- Moje Plate
- Moji Odmori
- Moje Evidencije
- Poruke
- Moji Zahtevi

## 📁 Struktura Projekta

```
Adminstracuja/
├── index.html          # Glavni HTML fajl
├── style.css           # Stilovi
├── database.js         # IndexedDB operacije
├── auth.js            # Autentifikacija i autorizacija
├── script.js          # Glavna aplikaciona logika
├── js/
│   └── utils/
│       ├── password.js      # Hash-ovanje lozinki
│       ├── validators.js    # Validacione funkcije
│       ├── formatters.js    # Formatiranje podataka
│       ├── toast.js         # Toast notifikacije
│       ├── loading.js       # Loading indikatori
│       ├── errorHandler.js  # Error handling
│       ├── searchFilter.js  # Pretraga i filteri
│       └── helpers.js       # Pomoćne funkcije
└── SUGESTIJE_POBOLJSANJA.md  # Dokumentacija poboljšanja
```

## 🔧 Funkcionalnosti

### Admin Funkcionalnosti
- Upravljanje radnicima (dodavanje, izmena, brisanje)
- Upravljanje platama
- Upravljanje godišnjim odmorima
- Upravljanje korisnicima
- Slanje poruka i obaveštenja
- Odobravanje/odbijanje zahteva

### Radnik Funkcionalnosti
- Pregled sopstvenih podataka
- Pregled plata
- Pregled godišnjih odmora
- Slanje zahteva za godišnji odmor
- Slanje administrativnih zahteva
- Pregled poruka

### Korisnik Funkcionalnosti
- Pregled profila
- Slanje administrativnih zahteva
- Pregled poruka

## 🛠️ Tehnologije

- **HTML5** - Struktura
- **CSS3** - Stilovi
- **Vanilla JavaScript** - Logika
- **IndexedDB** - Lokalna baza podataka
- **Web Crypto API** - Hash-ovanje lozinki

## 🔒 Sigurnost

- ✅ SHA-256 hash-ovanje lozinki
- ✅ Validacija input-a
- ✅ XSS protekcija
- ✅ Session management

## 📝 Napomene

- Podaci se čuvaju lokalno u browseru (IndexedDB)
- Za produkciju bi trebalo dodati backend server
- Lozinke su hash-ovane koristeći SHA-256

## 🐛 Known Issues

- Nema backend servera (samo frontend)
- Podaci se gube ako se obriše browser cache
- Nema email notifikacija

## 📞 Support

Za pitanja i probleme, kontaktirajte razvojni tim.

---

**Verzija**: 2.0  
**Poslednje ažuriranje**: 2024

