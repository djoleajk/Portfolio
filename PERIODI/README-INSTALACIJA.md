# Kako instalirati Periodi aplikaciju na Android uređaj

## Metoda 1: Instalacija preko Chrome browsera (Preporučeno)

1. **Otvori aplikaciju u Chrome browseru** na Android telefonu
   - Otvori Chrome browser
   - Unesi URL gde je aplikacija hostovana (npr. `https://tvoj-domen.com/periodi/`)

2. **Čekaj da se pojavi prompt za instalaciju**
   - Chrome će automatski detektovati da je aplikacija PWA
   - Pojaviće se banner na dnu ekrana sa opcijom "Dodaj na početni ekran" ili "Instaliraj aplikaciju"

3. **Klikni na "Instaliraj" ili "Dodaj na početni ekran"**
   - Ako ne vidiš prompt, klikni na meni (tri tačke) u Chrome-u
   - Izaberi "Dodaj na početni ekran" ili "Instaliraj aplikaciju"

4. **Potvrdi instalaciju**
   - Pojaviće se dijalog sa informacijama o aplikaciji
   - Klikni "Instaliraj"

5. **Aplikacija će se pojaviti na početnom ekranu**
   - Ikonica aplikacije će biti vidljiva na početnom ekranu
   - Možeš je pokrenuti kao običnu aplikaciju

## Metoda 2: Ručna instalacija

1. **Otvori Chrome browser** na Android telefonu
2. **Idi na URL aplikacije**
3. **Klikni na meni** (tri tačke u gornjem desnom uglu)
4. **Izaberi "Dodaj na početni ekran"** ili "Instaliraj aplikaciju"
5. **Potvrdi instalaciju**

## Zahtevi za instalaciju

- **Android verzija**: Android 5.0 (Lollipop) ili noviji
- **Browser**: Chrome 67+ ili drugi browser koji podržava PWA
- **HTTPS**: Aplikacija mora biti hostovana preko HTTPS protokola (ili localhost za testiranje)

## Testiranje na localhost

Ako testiraš aplikaciju lokalno:

1. **Koristi HTTPS** - Možeš koristiti `https://localhost` ili
2. **Koristi ngrok ili sličan servis** za kreiranje HTTPS tunela
3. **Ili koristi Chrome sa flagom** `chrome://flags/#unsafely-treat-insecure-origin-as-secure`

## Provera da li je PWA ispravno konfigurisana

1. Otvori Chrome DevTools (F12)
2. Idi na tab "Application" ili "Aplikacija"
3. Proveri:
   - **Manifest** - Treba da vidiš manifest.json sa svim informacijama
   - **Service Workers** - Treba da vidiš registrovani service worker
   - **Storage** - Treba da vidiš cache podatke

## Rešavanje problema

### Aplikacija se ne instalira
- Proveri da li je aplikacija hostovana preko HTTPS
- Proveri da li je manifest.json ispravno konfigurisan
- Proveri da li je service worker registrovan (u DevTools)

### Aplikacija se ne učitava offline
- Proveri da li je service worker ispravno keširao resurse
- Proveri Network tab u DevTools da vidiš koje resurse ne može da učita

### Ikona se ne prikazuje
- Proveri da li su ikone definisane u manifest.json
- Proveri da li su ikone u ispravnom formatu (SVG, PNG)

## Napredne opcije

### Ažuriranje aplikacije
- Service worker će automatski proveravati za update-ove
- Kada se pojavi nova verzija, korisnik će dobiti obaveštenje

### Offline funkcionalnost
- Aplikacija će raditi offline nakon prve instalacije
- Podaci se čuvaju u localStorage i cache-u

## Podrška

Za dodatnu pomoć, proveri:
- [PWA dokumentaciju](https://web.dev/progressive-web-apps/)
- [Chrome PWA dokumentaciju](https://developer.chrome.com/docs/workbox/)
