// Normativi – Minski program
const minskiNormativi = [
  { artikal: "AB94/AB150", kalibar: "60mm", taktKovanja_s: 24, kovanje_kom: 900, taktPeskarenja_s: 41, peskarenje_kom: 1050, peskarenje_2kom: true, taktSuzavanja_s: 25, suzavanje_kom: 860 },
  { artikal: "AB114", kalibar: "60mm", taktKovanja_s: 28, kovanje_kom: 650, taktPeskarenja_s: 40, peskarenje_kom: 1080, peskarenje_2kom: true, taktSuzavanja_s: 25, suzavanje_kom: 750 },
  { artikal: "AB153", kalibar: "60mm", taktKovanja_s: 24, kovanje_kom: 900, taktPeskarenja_s: null, peskarenje_kom: null, peskarenje_2kom: false, taktSuzavanja_s: null, suzavanje_kom: null },
  { artikal: "AB66/AB159", kalibar: "81/82mm", taktKovanja_s: 24, kovanje_kom: 900, taktPeskarenja_s: 41, peskarenje_kom: 1050, peskarenje_2kom: true, taktSuzavanja_s: 25, suzavanje_kom: 860 },
  { artikal: "AB169", kalibar: "81/82mm", taktKovanja_s: 28, kovanje_kom: 650, taktPeskarenja_s: 40, peskarenje_kom: 1080, peskarenje_2kom: true, taktSuzavanja_s: 25, suzavanje_kom: 750 },
  { artikal: "AB156", kalibar: "120mm", taktKovanja_s: 154, kovanje_kom: 140, taktPeskarenja_s: 72, peskarenje_kom: 300, peskarenje_2kom: true, taktSuzavanja_s: 50, suzavanje_kom: 430 }
];

// Normativi – Artiljerijski program
const artiljerijskiNormativi = [
  { artikal: "105TF", kalibar: "105mm", taktKovanja_s: 154, kovanje_kom: 140, taktPeskarenja_s: 180, peskarenje_kom: 240, peskarenje_2kom: false, taktSuzavanja_s: 53, suzavanje_kom: 350 },
  { artikal: "122TF", kalibar: "122mm", taktKovanja_s: 154, kovanje_kom: 140, taktPeskarenja_s: 180, peskarenje_kom: 240, peskarenje_2kom: false, taktSuzavanja_s: 53, suzavanje_kom: 350 },
  { artikal: "122GG", kalibar: "122mm", taktKovanja_s: 145, kovanje_kom: 150, taktPeskarenja_s: 180, peskarenje_kom: 240, peskarenje_2kom: false, taktSuzavanja_s: 53, suzavanje_kom: 350 },
  { artikal: "TF152", kalibar: "152mm", taktKovanja_s: 170, kovanje_kom: 130, taktPeskarenja_s: 190, peskarenje_kom: 230, peskarenje_2kom: false, taktSuzavanja_s: 64, suzavanje_kom: 300 },
  { artikal: "M107", kalibar: "155mm", taktKovanja_s: 170, kovanje_kom: 130, taktPeskarenja_s: 190, peskarenje_kom: 230, peskarenje_2kom: false, taktSuzavanja_s: 64, suzavanje_kom: 300 }
];

const baseNormativi = [...minskiNormativi, ...artiljerijskiNormativi];

function getStoredCustomNormativi() {
  try {
    const raw = localStorage.getItem('normativi_custom');
    if (!raw) return [];
    const parsed = JSON.parse(raw);
    return Array.isArray(parsed) ? parsed : [];
  } catch (_) {
    return [];
  }
}

function saveCustomNormativi(items) {
  localStorage.setItem('normativi_custom', JSON.stringify(items));
}

function getAllNormativi() {
  return [...baseNormativi, ...getStoredCustomNormativi()];
}

function setIfExists(id, value) {
  const el = document.getElementById(id);
  if (el) {
    el.value = value;
  }
}

function detectContext() {
  const path = (location && location.pathname) ? location.pathname : '';
  
  // Za koliko-komada.html, proveri odabrani tip operacije
  if (/koliko-komada\.html$/i.test(path)) {
    const selectedOperation = document.querySelector('input[name="operationType"]:checked');
    if (selectedOperation) {
      return selectedOperation.value; // 'kovanje', 'peskarenje', ili 'suzavanje'
    }
    return 'kovanje'; // Default
  }
  
  // Prvo proveri URL putanju za specificne stranice
  if (/peskarenje\.html$/i.test(path)) return 'peskarenje';
  if (/ubadanje\.html$/i.test(path) || /italijanka\.html$/i.test(path) || /bem\.html$/i.test(path)) return 'kovanje';
  if (/robot\.html$/i.test(path) || /zatvaranje-mine\.html$/i.test(path)) return 'suzavanje';
  if (/vreme-po-komadu\.html$/i.test(path)) return 'reverse-calc';
  
  // Fallback na proveru elemenata
  if (document.getElementById('timePerCycle') && document.getElementById('numberOfMines')) return 'peskarenje';
  if (document.getElementById('timePerPiece') && document.getElementById('startTimeInput') && !document.getElementById('endTimeInput')) {
    // Proveri da li je ubadanje, italijanka ili bem
    if (/ubadanje\.html$/i.test(path) || /italijanka\.html$/i.test(path) || /bem\.html$/i.test(path)) return 'kovanje';
    return 'suzavanje';
  }
  if (document.getElementById('totalHours') && document.getElementById('totalMinutes')) return 'reverse-calc';
  
  return 'generic';
}

function renderNormativiTable(container, item) {
  const ctx = detectContext();
  let headerCols = '';
  let rowCols = '';
  let minWidth = 'min-width: 760px;';

  if (ctx === 'peskarenje') {
    const taktText = item.taktPeskarenja_s !== null ? item.taktPeskarenja_s : 'нема';
    const peskarenjeText = item.peskarenje_kom !== null ? item.peskarenje_kom : 'нема';
    const napomena = item.peskarenje_2kom ? ' (2 ком.)' : '';
    headerCols = `
          <th>Артикал</th>
          <th>Калибар</th>
          <th>Такт пескарења (сек)</th>
          <th>Пескарење (ком)</th>`;
    rowCols = `
          <td><strong>${item.artikal}</strong></td>
          <td>${item.kalibar}</td>
          <td>${taktText}${napomena}</td>
          <td>${peskarenjeText}</td>`;
    minWidth = 'min-width: 420px;';
  } else if (ctx === 'kovanje') {
    const taktText = item.taktKovanja_s !== null ? item.taktKovanja_s : 'нема';
    const kovanjeText = item.kovanje_kom !== null ? item.kovanje_kom : 'нема';
    headerCols = `
          <th>Артикал</th>
          <th>Калибар</th>
          <th>Такт ковања (сек)</th>
          <th>Ковање (ком)</th>`;
    rowCols = `
          <td><strong>${item.artikal}</strong></td>
          <td>${item.kalibar}</td>
          <td>${taktText}</td>
          <td>${kovanjeText}</td>`;
    minWidth = 'min-width: 420px;';
  } else if (ctx === 'suzavanje') {
    const taktText = item.taktSuzavanja_s !== null ? item.taktSuzavanja_s : 'нема';
    const suzavanjeText = item.suzavanje_kom !== null ? item.suzavanje_kom : 'нема';
    headerCols = `
          <th>Артикал</th>
          <th>Калибар</th>
          <th>Такт сузавања (сек)</th>
          <th>Сузавање (ком)</th>`;
    rowCols = `
          <td><strong>${item.artikal}</strong></td>
          <td>${item.kalibar}</td>
          <td>${taktText}</td>
          <td>${suzavanjeText}</td>`;
    minWidth = 'min-width: 420px;';
  } else if (ctx === 'reverse-calc') {
    // Za vreme-po-komadu.html - ne prikazujemo normative jer nije potrebno
    headerCols = `
          <th>Артикал</th>
          <th>Калибар</th>`;
    rowCols = `
          <td><strong>${item.artikal}</strong></td>
          <td>${item.kalibar}</td>`;
    minWidth = 'min-width: 280px;';
  } else {
    headerCols = `
          <th>Артикал</th>
          <th>Калибар</th>`;
    rowCols = `
          <td><strong>${item.artikal}</strong></td>
          <td>${item.kalibar}</td>`;
    minWidth = 'min-width: 280px;';
  }

  container.innerHTML = `
    <table class="normativi-table" style="${minWidth}">
      <thead>
        <tr>
          ${headerCols}
        </tr>
      </thead>
      <tbody>
        <tr>
          ${rowCols}
        </tr>
      </tbody>
    </table>
  `;
}

// UI za dodavanje novih артикала uklonjen prema zahtevu

function initNormativiUI() {
  const all = getAllNormativi();

  // Insert UI right above the first .input-section
  const inputSection = document.querySelector('.input-section');
  if (!inputSection) return;

  const host = document.createElement('section');
  host.className = 'normativi-section';
  host.innerHTML = `
    <h3 class="normativi-title">Нормативи</h3>
    <div class="normativi-controls">
      <label for="artikalSelect"><strong>Артикал</strong></label>
      <select id="artikalSelect" class="filter-select"></select>
    </div>
    <div id="normativiTable"></div>
  `;

  inputSection.parentNode.insertBefore(host, inputSection);

  const select = host.querySelector('#artikalSelect');
  const tableHost = host.querySelector('#normativiTable');

  function refreshOptions(selectedArtikal) {
    select.innerHTML = '';
    getAllNormativi().forEach(n => {
      const opt = document.createElement('option');
      opt.value = n.artikal;
      opt.textContent = `${n.artikal} (${n.kalibar})`;
      if (n.artikal === selectedArtikal) opt.selected = true;
      select.appendChild(opt);
    });
  }

  function applySelection(artikal, autoFill = false) {
    const item = getAllNormativi().find(n => n.artikal === artikal) || getAllNormativi()[0];
    if (!item) return;
    renderNormativiTable(tableHost, item);

    // Autofill vrednosti samo kada je autoFill = true (kada korisnik klikne na dugme)
    if (autoFill) {
      const ctx = detectContext();
      if (ctx === 'peskarenje' && item.taktPeskarenja_s !== null) {
        setIfExists('timePerCycle', item.taktPeskarenja_s);
      } else if (ctx === 'kovanje' && item.taktKovanja_s !== null) {
        setIfExists('timePerPiece', item.taktKovanja_s);
      } else if (ctx === 'suzavanje' && item.taktSuzavanja_s !== null) {
        setIfExists('timePerPiece', item.taktSuzavanja_s);
      } else if (ctx === 'reverse-calc') {
        // Za vreme-po-komadu.html ne postavljamo automatski vrednosti
      }
    }

    localStorage.setItem('normativ_selected_artikal', item.artikal);
  }

  const saved = localStorage.getItem('normativ_selected_artikal');
  refreshOptions(saved || (all[0] && all[0].artikal));
  applySelection(select.value, true); // Automatski popuni pri inicijalizaciji

  select.addEventListener('change', () => applySelection(select.value, true)); // Automatski popuni pri promeni

  // Eksportuj funkciju za refresh normativa (za koliko-komada.html)
  window.refreshNormativiForContext = function(newContext) {
    const currentArtikal = select.value;
    const item = getAllNormativi().find(n => n.artikal === currentArtikal);
    if (item) {
      renderNormativiTable(tableHost, item);
      // Automatski popuni vrednost za novi kontekst
      if (newContext === 'peskarenje' && item.taktPeskarenja_s !== null) {
        setIfExists('timePerPiece', item.taktPeskarenja_s);
      } else if (newContext === 'kovanje' && item.taktKovanja_s !== null) {
        setIfExists('timePerPiece', item.taktKovanja_s);
      } else if (newContext === 'suzavanje' && item.taktSuzavanja_s !== null) {
        setIfExists('timePerPiece', item.taktSuzavanja_s);
      }
    }
  };

}

document.addEventListener('DOMContentLoaded', initNormativiUI);


