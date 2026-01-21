/**
 * Demo Data Generator
 * Creates sample posts and comments for testing
 */

import db from './db.js';
import auth from './auth.js';
import posts from './posts.js';
import comments from './comments.js';

class DemoData {
    /**
     * Initialize demo data
     */
    async init() {
        try {
            // Check if we already have posts
            const existingPosts = await db.getAll('posts');
            if (existingPosts.length > 0) {
                console.log('Demo data already exists');
                return;
            }

            console.log('Creating demo data...');

            // Get demo users
            const allUsers = await db.getAll('users');
            const admin = allUsers.find(u => u.role === 'admin');
            const author = allUsers.find(u => u.role === 'author');

            if (!admin || !author) {
                console.error('Demo users not found. Please wait for auth initialization.');
                return;
            }

            // Create demo posts
            const demoPosts = [
                {
                    title: 'Uvod u JavaScript ES6+ funkcionalnosti',
                    slug: 'uvod-u-javascript-es6-funkcionalnosti',
                    content: `JavaScript ES6 (ECMAScript 2015) je doneo revoluciju u načinu na koji pišemo kod. Evo najvažnijih funkcionalnosti:\n\n**Arrow funkcije** - Kraća sintaksa za pisanje funkcija:\n\nconst add = (a, b) => a + b;\n\n**Template literals** - Lakše formatiranje stringova:\n\nconst name = "Petar";\nconsole.log(\`Zdravo, \${name}!\`);\n\n**Destructuring** - Elegantno vađenje vrednosti iz objekata i nizova:\n\nconst { name, age } = user;\n\n**Spread operator** - Kopiranje i kombinovanje nizova i objekata:\n\nconst newArray = [...oldArray, newItem];\n\n**Promises i Async/Await** - Lakše rukovanje asinhronim operacijama:\n\nasync function fetchData() {\n  const response = await fetch(url);\n  return await response.json();\n}\n\nOve funkcionalnosti čine kod čitljivijim i lakšim za održavanje!`,
                    authorId: author.id,
                    authorName: author.name,
                    categories: ['JavaScript', 'Tutorial'],
                    tags: ['es6', 'beginner', 'javascript'],
                    status: 'published',
                    views: 42
                },
                {
                    title: 'CSS Grid vs Flexbox - Kada koristiti šta?',
                    slug: 'css-grid-vs-flexbox',
                    content: `CSS Grid i Flexbox su dva moćna alata za kreiranje layouta. Ali kada treba koristiti koji?\n\n**Flexbox** je idealan za:\n- Jednodimenzionalne layoute (redovi ILI kolone)\n- Centriranje elemenata\n- Navigacione barove\n- Card komponente u jednom redu\n\n*Primer Flexbox-a:*\n.container {\n  display: flex;\n  justify-content: space-between;\n  align-items: center;\n}\n\n**CSS Grid** je bolji za:\n- Dvodimenzionalne layoute (redovi I kolone istovremeno)\n- Kompleksnije grid sisteme\n- Page layouts sa headerom, sidebarom, i footer-om\n\n*Primer Grid-a:*\n.container {\n  display: grid;\n  grid-template-columns: 200px 1fr;\n  grid-template-rows: auto 1fr auto;\n  gap: 20px;\n}\n\n**Zaključak:** Možete ih kombinovati! Grid za opšti layout, Flexbox za komponente unutar grid-a.`,
                    authorId: admin.id,
                    authorName: admin.name,
                    categories: ['CSS', 'Design'],
                    tags: ['css', 'grid', 'flexbox', 'layout'],
                    status: 'published',
                    views: 38
                },
                {
                    title: 'Kako IndexedDB revolucioniše web aplikacije',
                    slug: 'indexeddb-revolucionise-web-aplikacije',
                    content: `IndexedDB je moćna client-side baza podataka koja omogućava skladištenje velikih količina strukturiranih podataka.\n\n**Zašto IndexedDB?**\n\n1. **Veća kapacitet** - Za razliku od localStorage (5-10MB), IndexedDB može čuvati stotine MB podataka\n\n2. **Struktuirani podaci** - Čuva JavaScript objekte direktno, ne samo stringove\n\n3. **Asinkrone operacije** - Ne blokira UI thread\n\n4. **Transakcije** - ACID kompatibilne operacije\n\n5. **Indeksiranje** - Brze pretrage po bilo kom polju\n\n**Primer korišćenja:**\n\nconst request = indexedDB.open('MyDatabase', 1);\n\nrequest.onsuccess = (event) => {\n  const db = event.target.result;\n  const transaction = db.transaction(['users'], 'readwrite');\n  const store = transaction.objectStore('users');\n  store.add({ id: 1, name: 'John Doe' });\n};\n\n**Savršeno za:**\n- Offline-first aplikacije\n- PWA (Progressive Web Apps)\n- Cache-ovanje podataka\n- Blog sisteme kao što je ovaj!\n\nIndexedDB je budućnost web skladištenja podataka.`,
                    authorId: author.id,
                    authorName: author.name,
                    categories: ['JavaScript', 'Database'],
                    tags: ['indexeddb', 'storage', 'pwa', 'advanced'],
                    status: 'published',
                    views: 56
                },
                {
                    title: 'Responsive Web Design - Best Practices',
                    slug: 'responsive-web-design-best-practices',
                    content: `Responsive dizajn je postao standard u modernom web developmentu. Evo ključnih principa:\n\n**1. Mobile-First pristup**\nKreniite od najmanjeg ekrana pa idite naviše:\n\n/* Mobile styles (base) */\n.container { padding: 10px; }\n\n/* Tablet and up */\n@media (min-width: 768px) {\n  .container { padding: 20px; }\n}\n\n**2. Fluid Grid**\nKoristite relativne jedinice (%, fr) umesto fiksnih (px):\n\n.grid {\n  display: grid;\n  grid-template-columns: repeat(auto-fit, minmax(300px, 1fr));\n}\n\n**3. Flexible Images**\nSlike koje se prilagođavaju kontejneru:\n\nimg {\n  max-width: 100%;\n  height: auto;\n}\n\n**4. Breakpoints**\nStandardni breakpoints:\n- Mobile: < 768px\n- Tablet: 768px - 1024px\n- Desktop: > 1024px\n\n**5. Touch-Friendly**\nDugmad i linkovi treba da budu minimum 44x44px za touchscreen.\n\n**6. Testiranje**\nTestirajte na stvarnim uređajima, ne samo u emulatoru!`,
                    authorId: admin.id,
                    authorName: admin.name,
                    categories: ['CSS', 'Design', 'Mobile'],
                    tags: ['responsive', 'css', 'mobile-first', 'ux'],
                    status: 'published',
                    views: 29
                },
                {
                    title: 'Web Accessibility (A11y) - Zašto je važna',
                    slug: 'web-accessibility-a11y',
                    content: `Web pristupačnost znači da su vaši sajtovi i aplikacije upotrebljivi za SVE korisnike, uključujući osobe sa invaliditetom.\n\n**Ključni principi:**\n\n**1. Semantički HTML**\nKoristite prave HTML tagove:\n\n<!-- Loše -->\n<div onclick="submit()">Submit</div>\n\n<!-- Dobro -->\n<button type="submit">Submit</button>\n\n**2. ARIA atributi**\nPomažu screen reader-ima:\n\n<button aria-label="Close dialog" aria-expanded="false">\n  ×\n</button>\n\n**3. Keyboard navigacija**\nSve funkcionalnosti moraju biti dostupne pomoću tastature:\n- Tab - navigacija napred\n- Shift+Tab - navigacija nazad\n- Enter/Space - aktivacija\n- Esc - zatvaranje\n\n**4. Color contrast**\nMinimum 4.5:1 za normalan tekst, 3:1 za veliki tekst.\n\n**5. Alt text za slike**\n<img src="logo.png" alt="Company Logo">\n\n**6. Focus indicators**\nKorisnik mora videti koji element je trenutno fokusiran.\n\n**Benefiti:**\n- Veća pristupačnost\n- Bolje SEO\n- Bolji UX za sve\n- Pravna usaglašenost (WCAG)\n\nPristupačnost nije opciona - to je odgovornost svakog developera!`,
                    authorId: author.id,
                    authorName: author.name,
                    categories: ['Accessibility', 'HTML'],
                    tags: ['a11y', 'accessibility', 'wcag', 'ux'],
                    status: 'published',
                    views: 21
                },
                {
                    title: 'JavaScript Security - Zaštita od XSS napada',
                    slug: 'javascript-security-xss',
                    content: `Cross-Site Scripting (XSS) je jedan od najčešćih sigurnosnih problema. Evo kako se zaštititi:\n\n**Šta je XSS?**\nXSS omogućava napadačima da ubace maliciozni JavaScript kod u vašu stranicu.\n\n**Primer napada:**\n// Korisnik unosi:\n<script>alert('Hacked!');</script>\n\n// Ako direktno prikažete:\ndocument.innerHTML = userInput; // OPASNO!\n\n**Kako se zaštititi:**\n\n**1. Escape HTML**\nfunction escapeHTML(str) {\n  const div = document.createElement('div');\n  div.textContent = str;\n  return div.innerHTML;\n}\n\n**2. Koristite textContent umesto innerHTML**\nelement.textContent = userInput; // BEZBEDNO\n\n**3. Sanitize input**\nKorišćenje biblioteka kao DOMPurify:\nconst clean = DOMPurify.sanitize(dirty);\n\n**4. Content Security Policy (CSP)**\nHTTP header koji ograničava izvore resursa:\nContent-Security-Policy: default-src 'self'\n\n**5. Validacija na server-side**\nNikad ne verujte client-side validaciji!\n\n**Best Practices:**\n- Escape sve user-generated sadržaje\n- Koristite prepared statements za SQL\n- Implementirajte rate limiting\n- Regular security audits\n\nBezbednost je kontinuiran proces, ne jednokratna akcija!`,
                    authorId: admin.id,
                    authorName: admin.name,
                    categories: ['JavaScript', 'Security'],
                    tags: ['security', 'xss', 'javascript', 'advanced'],
                    status: 'published',
                    views: 67
                }
            ];

            // Create posts
            for (const postData of demoPosts) {
                const postId = await db.add('posts', {
                    ...postData,
                    createdAt: Date.now() - Math.random() * 7 * 24 * 60 * 60 * 1000, // Random within last week
                    updatedAt: Date.now()
                });

                // Add some comments to posts
                if (Math.random() > 0.3) {
                    await db.add('comments', {
                        postId,
                        userId: admin.id,
                        userName: admin.name,
                        content: 'Odličan post! Hvala na deljenju znanja.',
                        status: 'approved',
                        createdAt: Date.now() - Math.random() * 3 * 24 * 60 * 60 * 1000,
                        updatedAt: Date.now()
                    });
                }

                if (Math.random() > 0.5) {
                    await db.add('comments', {
                        postId,
                        userId: author.id,
                        userName: author.name,
                        content: 'Veoma korisno! Imam pitanje - da li postoji dodatni resurs gde mogu naučiti više o ovoj temi?',
                        status: 'approved',
                        createdAt: Date.now() - Math.random() * 2 * 24 * 60 * 60 * 1000,
                        updatedAt: Date.now()
                    });
                }
            }

            console.log('Demo data created successfully!');
            console.log(`Created ${demoPosts.length} posts`);

        } catch (error) {
            console.error('Failed to create demo data:', error);
        }
    }

    /**
     * Clear all demo data
     */
    async clear() {
        try {
            await db.clear('posts');
            await db.clear('comments');
            console.log('Demo data cleared');
        } catch (error) {
            console.error('Failed to clear demo data:', error);
        }
    }
}

const demoData = new DemoData();

export default demoData;

