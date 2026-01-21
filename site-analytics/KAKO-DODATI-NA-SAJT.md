# 🚀 Kako dodati Analytics na moj sajt?

## ⚡ SUPER BRZO (2 koraka)

### Korak 1: Kopirajte fajl

Kopirajte fajl **`analytics-tracker.js`** u folder vašeg sajta.

```
vaš-sajt/
├── index.html
├── about.html
├── contact.html
└── analytics-tracker.js  ← Kopirajte ovde
```

---

### Korak 2: Dodajte script tag

Na **SVAKU stranicu** koju želite da pratite, dodajte ovu liniju **PRE zatvaranja `</body>` taga**:

```html
<script src="analytics-tracker.js"></script>
</body>
</html>
```

---

## ✅ GOTOVO! To je sve!

Tracker će automatski početi da beleži:
- Svaku posetu
- Jedinstvene posetioce
- Trajanje sesija
- Izvore saobraćaja
- I još mnogo toga...

---

## 📋 KOMPLETAN PRIMER

### Primer 1: Jednostavan HTML sajt

**Pre:**
```html
<!DOCTYPE html>
<html>
<head>
    <title>Moj sajt</title>
</head>
<body>
    <h1>Dobrodošli</h1>
    <p>Sadržaj moje stranice...</p>
</body>
</html>
```

**Posle:**
```html
<!DOCTYPE html>
<html>
<head>
    <title>Moj sajt</title>
</head>
<body>
    <h1>Dobrodošli</h1>
    <p>Sadržaj moje stranice...</p>
    
    <!-- 🔥 Dodajte OVO na kraj -->
    <script src="analytics-tracker.js"></script>
</body>
</html>
```

---

### Primer 2: Ako imate više stranica

Dodajte istu liniju na **SVE stranice**:

```
vaš-sajt/
├── index.html          ← dodaj <script src="analytics-tracker.js"></script>
├── about.html          ← dodaj <script src="analytics-tracker.js"></script>
├── contact.html        ← dodaj <script src="analytics-tracker.js"></script>
├── products.html       ← dodaj <script src="analytics-tracker.js"></script>
└── analytics-tracker.js
```

---

### Primer 3: Sajt u podfolderu

Ako je tracker u drugom folderu, podesite putanju:

```
sajt/
├── index.html
├── pages/
│   ├── about.html
│   └── contact.html
└── js/
    └── analytics-tracker.js
```

**Na `index.html`:**
```html
<script src="js/analytics-tracker.js"></script>
```

**Na `pages/about.html`:**
```html
<script src="../js/analytics-tracker.js"></script>
```

---

## 🎯 Gde videti statistiku?

### Opcija 1: Kopirajte Dashboard

1. Kopirajte ove fajlove u folder `admin/` ili `analytics/`:
   - `index.html` (Dashboard)
   - `script.js`
   - `style.css`

```
vaš-sajt/
├── index.html
├── about.html
├── analytics-tracker.js
└── analytics/
    ├── index.html    ← Dashboard
    ├── script.js
    └── style.css
```

2. Otvorite: `https://vaš-sajt.com/analytics/`

---

### Opcija 2: Lokalni Dashboard

Držite Dashboard lokalno:

1. Otvorite `index.html` (Dashboard) direktno u pretraživaču
2. On će učitati podatke iz localStorage
3. **Važno:** Mora biti na istom domenu kao sajt (ili koristi `file://`)

---

## 🔧 Napredne opcije

### Pratite custom događaje

Dodajte ovo gde god želite da pratite nešto posebno:

```html
<button onclick="trackCustomEvent()">Klikni me</button>

<script>
function trackCustomEvent() {
    if (window.analyticsTracker) {
        window.analyticsTracker.trackEvent('button_click', {
            button: 'Call to Action',
            page: window.location.pathname
        });
    }
    
    // Vaša normalna logika...
    alert('Dugme kliknuto!');
}
</script>
```

### Pratite forme

```html
<form onsubmit="trackFormSubmit()">
    <input type="email" required>
    <button>Prijavi se</button>
</form>

<script>
function trackFormSubmit() {
    if (window.analyticsTracker) {
        window.analyticsTracker.trackEvent('form_submit', {
            form: 'Newsletter signup'
        });
    }
}
</script>
```

---

## ❓ Često postavljana pitanja

### Q: Mora li biti na svim stranicama?
**A:** Ne mora, ali bolje je. Tracker beleži samo stranice gde je dodat.

### Q: Radi li na WordPress-u?
**A:** DA! Dodajte u `footer.php` fajl vašeg theme-a:

```php
<!-- Pre wp_footer() -->
<script src="<?php echo get_template_directory_uri(); ?>/analytics-tracker.js"></script>
<?php wp_footer(); ?>
```

### Q: Radi li na React/Vue/Angular?
**A:** DA! Dodajte u `public/index.html`:

```html
<body>
    <div id="root"></div>
    <script src="%PUBLIC_URL%/analytics-tracker.js"></script>
</body>
```

### Q: Mogu li videti podatke sa telefona?
**A:** DA! Dashboard je responsive i radi na svim uređajima.

### Q: Hoće li usporiti sajt?
**A:** NE! Tracker je veličine ~10KB i učitava se asinkrono.

### Q: Šta ako korisnik obriše localStorage?
**A:** Izgubićete podatke za tog korisnika. Zato koristite Export redovno.

### Q: Mogu li pratiti više sajtova?
**A:** DA! Svaki domen ima svoje localStorage podatke.

---

## 🎨 Bonus: Prilagodite Dashboard

Promenite boje u `style.css`:

```css
:root {
    --primary-blue: #ff6b6b;     /* Vaša boja */
    --secondary-blue: #ee5a6f;   /* Vaša boja */
}
```

---

## 📊 Šta će biti praćeno?

✅ Svaka poseta (page view)  
✅ Jedinstveni posetioci (Visitor ID)  
✅ Vreme provedeno na sajtu  
✅ Izvori saobraćaja (Google, Facebook, direktno...)  
✅ Bounce rate (stopa napuštanja)  
✅ Najpopularnije stranice  
✅ Aktivnost po satima  
✅ Lokacija korisnika (na osnovu jezika)  

---

## 🚀 Testiranje

1. Dodajte tracker na vaš sajt
2. Otvorite sajt u pretraživaču
3. Pritisnite **F12** → **Console**
4. Videćete: `✅ Analytics Tracker aktiviran - Praćenje u toku!`
5. U **Application → Local Storage** videćete podatke
6. Otvorite Dashboard da vidite statistiku

---

## 💡 Pro saveti

✅ Eksportujte podatke redovno (backup)  
✅ Testirajte u Incognito mode-u  
✅ Dodajte na sve stranice odjednom  
✅ Koristite demo-site.html za testiranje pre dodavanja na pravi sajt  
✅ Proverite da li radi na mobilnim uređajima  

---

## 🆘 Ako nešto ne radi

1. Proverite putanju do `analytics-tracker.js`
2. Otvorite Console (F12) i pogledajte greške
3. Proverite da li je script na kraju `<body>` taga
4. Proverite da li je JavaScript omogućen
5. Osvežite stranicu (Ctrl+F5)

---

## 📞 Potrebna pomoć?

Pogledajte:
- `primer-integracija.html` - Detaljni primeri sa kodom
- `README.md` - Kompletan tehnički opis
- `BRZI-START.md` - Korak-po-korak vodič

---

**🎉 Sada možete pratiti analitiku svog sajta! 🚀**

