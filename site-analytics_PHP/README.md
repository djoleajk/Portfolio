# Site Analytics System

## Kako Funkcioniše

1. **Praćenje Poseta**

   - tracker.js se učitava na klijentskom sajtu
   - Šalje podatke o posetama na naš server
   - Prati: URL, referrer, user agent, IP adresu

2. **Baza Podataka**

   - clients: podaci o klijentima
   - websites: registrovani sajtovi
   - page_views: sve posete
   - daily_stats: dnevna statistika

3. **Dashboard**
   - Pregled statistike u realnom vremenu
   - Grafikoni i statistički podaci
   - Izveštaji po različitim parametrima

## Instalacija

1. Importujte `schema.sql` u vašu MySQL bazu
2. Podesite kredencijale baze u `config/database.php`
3. Dodajte sledeći kod na sajt koji želite da pratite:

```html
<script src="path/to/tracker.js"></script>
```

## Kako Koristiti

1. **Dodavanje Novog Sajta**

   - Registrujte se kao klijent
   - Dodajte svoj sajt
   - Dobićete API ključ
   - Dodajte tracker.js na svoj sajt

2. **Praćenje Statistike**

   - Posetite dashboard.php
   - Pogledajte reports.php za detaljne izveštaje
   - Koristite filtere za prilagođene preglede

3. **API Pristup**
   - Koristite svoj API ključ za pristup podacima
   - Dostupni endpoint-i: /api/stats, /api/report

# Kako implementirati analitiku na sajt

## 1. Dodavanje novog sajta

1. Idite na "Clients" i dodajte novog klijenta
2. Zapamtite dobijeni API ključ
3. Idite na "Websites" i dodajte novi sajt
4. Zapamtite website_id koji ste dobili

## 2. Implementacija trackera

Dodajte sledeći kod u HEAD sekciju vašeg sajta:

```html
<script>
	window.analyticsConfig = {
		websiteId: "YOUR_WEBSITE_ID", // ID sajta koji ste dobili
		apiKey: "YOUR_API_KEY", // API ključ koji ste dobili
	};
</script>
<script src="http://localhost/PORTFOLIO/site-analytics/tracker.js"></script>
```

## 3. Verifikacija

1. Otvorite vaš sajt u browseru
2. Proverite konzolu za eventualne greške
3. Posetite analytics dashboard da vidite statistiku
