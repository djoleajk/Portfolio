# Changelog

Svi značajni izmeni projekta će biti dokumentovani u ovom fajlu.

Format je zasnovan na [Keep a Changelog](https://keepachangelog.com/en/1.0.0/),
a projekat prati [Semantic Versioning](https://semver.org/spec/v2.0.0.html).

## [1.0.0] - 2025-10-21

### Dodato
- ✅ Kompletna naslovna stranica sa hero sekcijom
- ✅ Sistem registracije i prijave korisnika
- ✅ Tri tipa korisnika: Admin, Klijent, Pružalac usluga
- ✅ Stranica za pretragu i filtriranje usluga
- ✅ Profili pružalaca usluga sa detaljnim informacijama
- ✅ Sistem za zakazivanje termina
- ✅ Interni sistem za poruke između korisnika
- ✅ Sistem recenzija i ocenjivanja (1-5 zvezdica)
- ✅ Korisnički dashboard sa:
  - Profilom i uređivanjem podataka
  - Pregledom termina
  - Inbox-om za poruke
  - Recenzijama
  - Upravljanjem uslugama (za pružaoce)
- ✅ Administratorski panel sa:
  - Dashboard-om i statistikama
  - Upravljanjem korisnicima
  - Upravljanjem pružaocima usluga
  - Moderacijom recenzija
  - Pregledom svih termina
  - Upravljanjem kategorijama
- ✅ 6 glavnih kategorija usluga:
  - Popravke
  - Dom i Bašta
  - Lepota i Wellness
  - IT i Tehnologija
  - Edukacija
  - Transport
- ✅ Sample podaci (6 pružalaca usluga)
- ✅ Responzivan dizajn za sve uređaje
- ✅ Notifikacijski sistem
- ✅ Badge za nepročitane poruke
- ✅ LocalStorage persistencija podataka
- ✅ Moderne animacije i tranzicije
- ✅ Font Awesome 6.0 ikonice
- ✅ Validacija formulara
- ✅ Filtriranje i sortiranje rezultata
- ✅ Modalni dijalozi za interakcije
- ✅ Readme dokumentacija
- ✅ Contributing guidelines
- ✅ MIT licenca

### Sigurnost
- ⚠️ Napomena: Ovo je frontend-only demo aplikacija
- ⚠️ Lozinke se čuvaju kao plain text u localStorage
- ⚠️ NE koristiti u produkciji bez pravog backend sistema

## Planirane Funkcionalnosti za Verziju 2.0

### Backend Integracija
- [ ] REST API backend (Node.js/Express ili slično)
- [ ] Baza podataka (PostgreSQL/MongoDB)
- [ ] Prava autentifikacija (JWT tokeni)
- [ ] Šifrovanje lozinki (bcrypt)
- [ ] Server-side validacija

### Nove Funkcionalnosti
- [ ] Upload slika/avatara za profile
- [ ] Email notifikacije
- [ ] Push notifikacije
- [ ] Real-time chat sa WebSocket-ima
- [ ] Video pozivi
- [ ] Kalendar sa dostupnošću pružalaca
- [ ] Sistem plaćanja (Stripe/PayPal integracija)
- [ ] Google Maps integracija za lokacije
- [ ] Multi-jezik podrška (Srpski, Engleski)
- [ ] Tema switcher (light/dark mode)
- [ ] Advanced search sa AI preporukama
- [ ] Eksport podataka (PDF/CSV)
- [ ] Analytics dashboard
- [ ] Mobile aplikacija (React Native)

### Poboljšanja
- [ ] SEO optimizacija
- [ ] PWA funkcionalnost
- [ ] Accessibility (WCAG 2.1)
- [ ] Performance optimizacija
- [ ] Lazy loading slika
- [ ] Code splitting
- [ ] Unit testovi (Jest)
- [ ] E2E testovi (Cypress)
- [ ] CI/CD pipeline

### Bezbednost
- [ ] HTTPS
- [ ] CSRF zaštita
- [ ] XSS zaštita
- [ ] SQL Injection zaštita
- [ ] Rate limiting
- [ ] CAPTCHA za registraciju
- [ ] Two-factor authentication

---

## Tip Verzija

- **Major (X.0.0)**: Breaking changes
- **Minor (1.X.0)**: Nove funkcionalnosti (backward compatible)
- **Patch (1.0.X)**: Bug fixes

---

**[1.0.0]**: Prva stabilna verzija - 2025-10-21

