// Globalne promenljive
let intervalTajmera;
let ciljnoVreme;
let format24h = true;
let istorija = JSON.parse(localStorage.getItem("istorijaKalkulacija")) || [];

// Inicijalizacija
document.addEventListener("DOMContentLoaded", function () {
	// Event listener za tip kalkulacije
	document.querySelectorAll('input[name="tipKalkulacije"]').forEach((radio) => {
		radio.addEventListener("change", function () {
			document.getElementById("unosNapred").style.display =
				this.value === "napred" ? "block" : "none";
			document.getElementById("unosNazad").style.display =
				this.value === "nazad" ? "block" : "none";
		});
	});

	// Učitaj istoriju
	prikaziIstoriju();
});

// ========== OSNOVNE OPERACIJE ==========

function izracunajVreme() {
	const tipKalkulacije = document.querySelector(
		'input[name="tipKalkulacije"]:checked'
	).value;

	if (tipKalkulacije === "napred") {
		const pocetnoVreme = document.getElementById("pocetnoVreme").value;
		const sati = document.getElementById("trajanjeSati").value;
		const minuti = document.getElementById("trajanjeMinuti").value;

		if (!pocetnoVreme) {
			prikaziGresku("Molimo unesite početno vreme!");
			return;
		}

		if (!sati && !minuti) {
			prikaziGresku("Molimo izaberite trajanje (sati i/ili minuti)!");
			return;
		}

		const trajanje = `${sati || 0}:${minuti || 0}`;
		const ukljuciDane = document.getElementById("ukljuciDane").checked;
		const rezultat = izracunajNapred(pocetnoVreme, trajanje, ukljuciDane);

		prikaziRezultat(
			`Vreme završetka: <strong>${rezultat}</strong>`,
			`Napred: ${pocetnoVreme} + ${trajanje} = ${rezultat}`
		);
	} else {
		const krajnjeVreme = document.getElementById("krajnjeVreme").value;
		const sati = document.getElementById("trajanjeNazadSati").value;
		const minuti = document.getElementById("trajanjeNazadMinuti").value;

		if (!krajnjeVreme) {
			prikaziGresku("Molimo unesite krajnje vreme!");
			return;
		}

		if (!sati && !minuti) {
			prikaziGresku("Molimo izaberite trajanje (sati i/ili minuti)!");
			return;
		}

		const trajanje = `${sati || 0}:${minuti || 0}`;
		const rezultat = izracunajNazad(krajnjeVreme, trajanje);
		prikaziRezultat(
			`Početno vreme: <strong>${rezultat}</strong>`,
			`Nazad: ${krajnjeVreme} - ${trajanje} = ${rezultat}`
		);
	}
}

function izracunajNapred(pocetnoVreme, trajanje, ukljuciDane = false) {
	const [pocSati, pocMin] = pocetnoVreme.split(":").map(Number);
	const [trajSati, trajMin] = trajanje.split(":").map(Number);
	let ukupnoMinuta = pocSati * 60 + pocMin + trajSati * 60 + trajMin;

	if (ukljuciDane) {
		const dani = Math.floor(ukupnoMinuta / (24 * 60));
		ukupnoMinuta = ukupnoMinuta % (24 * 60);
		const krajnjiSati = Math.floor(ukupnoMinuta / 60);
		const krajnjiMin = ukupnoMinuta % 60;
		if (dani > 0) {
			return `${dani} dan(a) ${krajnjiSati
				.toString()
				.padStart(2, "0")}:${krajnjiMin.toString().padStart(2, "0")}`;
		}
	}

	const krajnjiSati = Math.floor(ukupnoMinuta / 60) % 24;
	const krajnjiMin = ukupnoMinuta % 60;
	return `${krajnjiSati.toString().padStart(2, "0")}:${krajnjiMin
		.toString()
		.padStart(2, "0")}`;
}

function izracunajNazad(krajnjeVreme, trajanje) {
	const [krajnSati, krajnMin] = krajnjeVreme.split(":").map(Number);
	const [trajSati, trajMin] = trajanje.split(":").map(Number);
	let ukupnoMinuta = krajnSati * 60 + krajnMin - (trajSati * 60 + trajMin);
	if (ukupnoMinuta < 0) ukupnoMinuta += 24 * 60;
	const pocSati = Math.floor(ukupnoMinuta / 60) % 24;
	const pocMin = ukupnoMinuta % 60;
	return `${pocSati.toString().padStart(2, "0")}:${pocMin
		.toString()
		.padStart(2, "0")}`;
}

// ========== RAZLIKA VREMENA ==========

function izracunajRazliku() {
	const vremeOd = document.getElementById("vremeOd").value;
	const vremeDo = document.getElementById("vremeDo").value;

	if (!vremeOd || !vremeDo) {
		prikaziGresku("Molimo unesite oba vremena!");
		return;
	}

	const [odSati, odMin] = vremeOd.split(":").map(Number);
	const [doSati, doMin] = vremeDo.split(":").map(Number);

	let odMinuta = odSati * 60 + odMin;
	let doMinuta = doSati * 60 + doMin;

	const prelazDana = document.getElementById("prelazDana").checked;
	if (prelazDana && doMinuta < odMinuta) {
		doMinuta += 24 * 60;
	}

	let razlikaMinuta = doMinuta - odMinuta;
	if (razlikaMinuta < 0) razlikaMinuta += 24 * 60;

	const sati = Math.floor(razlikaMinuta / 60);
	const minuti = razlikaMinuta % 60;

	prikaziRezultat(
		`Razlika: <strong>${sati}h ${minuti}min</strong> (${razlikaMinuta} minuta)`,
		`Razlika: ${vremeOd} - ${vremeDo} = ${sati}h ${minuti}min`
	);
}

// ========== SABIRANJE VIŠE PERIODA ==========

function dodajPeriod() {
	const kontejner = document.getElementById("periodiKontejner");
	const noviPeriod = document.createElement("div");
	noviPeriod.className = "row mb-2 period-item align-items-end";
	noviPeriod.innerHTML = `
		<div class="col-md-2">
			<label class="form-label small">Sati</label>
			<select class="form-select form-select-sm">
				<option value="0">0h</option>
				<option value="1" selected>1h</option>
				<option value="2">2h</option>
				<option value="3">3h</option>
				<option value="4">4h</option>
				<option value="5">5h</option>
				<option value="6">6h</option>
				<option value="8">8h</option>
				<option value="10">10h</option>
			</select>
		</div>
		<div class="col-md-2">
			<label class="form-label small">Min</label>
			<select class="form-select form-select-sm">
				<option value="0" selected>0</option>
				<option value="15">15</option>
				<option value="30">30</option>
				<option value="45">45</option>
			</select>
		</div>
		<div class="col-md-6">
			<label class="form-label small">Opis (opciono)</label>
			<input type="text" class="form-control form-control-sm" placeholder="npr. Sastanak" />
		</div>
		<div class="col-md-2">
			<button class="btn btn-danger btn-sm w-100" onclick="ukloniPeriod(this)">
				<i class="bi bi-trash"></i>
			</button>
		</div>
	`;
	kontejner.appendChild(noviPeriod);
}

function ukloniPeriod(dugme) {
	dugme.closest(".period-item").remove();
}

function saberiPeriode() {
	const periodi = document.querySelectorAll("#periodiKontejner .period-item");
	let ukupnoMinuta = 0;
	let opisi = [];

	periodi.forEach((period) => {
		const sati = parseInt(period.querySelectorAll("select")[0]?.value || 0);
		const minuti = parseInt(period.querySelectorAll("select")[1]?.value || 0);
		const opis = period.querySelector('input[type="text"]')?.value || "";

		ukupnoMinuta += sati * 60 + minuti;
		const trajanje = `${sati}:${minuti.toString().padStart(2, "0")}`;
		if (opis) opisi.push(`${trajanje} (${opis})`);
		else opisi.push(trajanje);
	});

	const sati = Math.floor(ukupnoMinuta / 60);
	const minuti = ukupnoMinuta % 60;

	let detaljHTML = "<ul class='mb-0'>";
	opisi.forEach((opis) => {
		detaljHTML += `<li>${opis}</li>`;
	});
	detaljHTML += "</ul>";

	prikaziRezultat(
		`Ukupno trajanje: <strong>${sati}h ${minuti}min</strong> (${ukupnoMinuta} minuta)<br>${detaljHTML}`,
		`Sabiranje perioda = ${sati}h ${minuti}min`
	);
}

// ========== RADNI SATI ==========

function dodajPauzu() {
	const kontejner = document.getElementById("pauzeKontejner");
	const novaPauza = document.createElement("div");
	novaPauza.className = "row mb-2 pauza-item align-items-end";
	novaPauza.innerHTML = `
		<div class="col-md-2">
			<label class="form-label small">Sati</label>
			<select class="form-select form-select-sm">
				<option value="0" selected>0h</option>
				<option value="1">1h</option>
				<option value="2">2h</option>
			</select>
		</div>
		<div class="col-md-2">
			<label class="form-label small">Min</label>
			<select class="form-select form-select-sm">
				<option value="0">0</option>
				<option value="15" selected>15</option>
				<option value="30">30</option>
				<option value="45">45</option>
			</select>
		</div>
		<div class="col-md-6">
			<label class="form-label small">Opis (opciono)</label>
			<input type="text" class="form-control form-control-sm" placeholder="npr. Kafa" />
		</div>
		<div class="col-md-2">
			<button class="btn btn-danger btn-sm w-100" onclick="ukloniPauzu(this)">
				<i class="bi bi-trash"></i>
			</button>
		</div>
	`;
	kontejner.appendChild(novaPauza);
}

function ukloniPauzu(dugme) {
	dugme.closest(".pauza-item").remove();
}

function izracunajRadneSate() {
	const pocetakRada = document.getElementById("pocetakRada").value;
	const krajRada = document.getElementById("krajRada").value;

	if (!pocetakRada || !krajRada) {
		prikaziGresku("Molimo unesite početak i kraj rada!");
		return;
	}

	const [pocSati, pocMin] = pocetakRada.split(":").map(Number);
	const [krajSati, krajMin] = krajRada.split(":").map(Number);

	let ukupnoRadnoVreme = krajSati * 60 + krajMin - (pocSati * 60 + pocMin);
	if (ukupnoRadnoVreme < 0) ukupnoRadnoVreme += 24 * 60;

	// Obračunaj pauze
	const pauze = document.querySelectorAll("#pauzeKontejner .pauza-item");
	let ukupnoPauza = 0;
	let opisPauza = [];

	pauze.forEach((pauza) => {
		const sati = parseInt(pauza.querySelectorAll("select")[0]?.value || 0);
		const minuti = parseInt(pauza.querySelectorAll("select")[1]?.value || 0);
		const opis = pauza.querySelector('input[type="text"]')?.value || "";

		ukupnoPauza += sati * 60 + minuti;
		const trajanje = `${sati}:${minuti.toString().padStart(2, "0")}`;
		if (opis) opisPauza.push(`${trajanje} (${opis})`);
		else opisPauza.push(trajanje);
	});

	const nettoRadnoVreme = ukupnoRadnoVreme - ukupnoPauza;
	const bruttoSati = Math.floor(ukupnoRadnoVreme / 60);
	const bruttoMin = ukupnoRadnoVreme % 60;
	const nettoSati = Math.floor(nettoRadnoVreme / 60);
	const nettoMin = nettoRadnoVreme % 60;

	let pauzaHTML = "";
	if (opisPauza.length > 0) {
		pauzaHTML = "<br>Pauze: <ul class='mb-0'>";
		opisPauza.forEach((opis) => {
			pauzaHTML += `<li>${opis}</li>`;
		});
		pauzaHTML += "</ul>";
	}

	prikaziRezultat(
		`<strong>Brutto radno vreme:</strong> ${bruttoSati}h ${bruttoMin}min<br>
		<strong>Netto radno vreme:</strong> ${nettoSati}h ${nettoMin}min${pauzaHTML}`,
		`Radni sati: ${pocetakRada} - ${krajRada} = ${nettoSati}h ${nettoMin}min (netto)`
	);
}

// ========== KONVERZIJA ==========

function konvertujVreme() {
	const broj = parseFloat(document.getElementById("konverzijaBroj").value);
	const jedinica = document.getElementById("konverzijaOd").value;

	if (isNaN(broj) || broj < 0) {
		prikaziGresku("Unesite validnu pozitivnu vrednost!");
		return;
	}

	let rezultati = {};

	// Konvertuj sve u minute prvo
	let ukupnoMinuta = 0;
	switch (jedinica) {
		case "sekunde":
			ukupnoMinuta = broj / 60;
			break;
		case "minute":
			ukupnoMinuta = broj;
			break;
		case "sati":
			ukupnoMinuta = broj * 60;
			break;
		case "dani":
			ukupnoMinuta = broj * 24 * 60;
			break;
	}

	// Izračunaj sve konverzije
	rezultati.sekunde = Math.round(ukupnoMinuta * 60);
	rezultati.minute = ukupnoMinuta;
	rezultati.sati = ukupnoMinuta / 60;
	rezultati.dani = ukupnoMinuta / (24 * 60);

	// Formatiranje
	const sasiMin = Math.floor(ukupnoMinuta / 60);
	const min = Math.round(ukupnoMinuta % 60);

	prikaziRezultat(
		`<strong>${broj} ${jedinica} je jednako:</strong><br>
		• ${rezultati.sekunde} sekundi<br>
		• ${rezultati.minute.toFixed(2)} minuta<br>
		• ${rezultati.sati.toFixed(2)} sati (${sasiMin}h ${min}min)<br>
		• ${rezultati.dani.toFixed(2)} dana`,
		`Konverzija: ${broj} ${jedinica}`
	);
}

// ========== ALARM ==========

function pokreniTajmer() {
	const alarmVreme = document.getElementById("alarmVreme").value;

	if (!alarmVreme) {
		prikaziGresku("Molimo unesite vreme alarma!");
		return;
	}

	ciljnoVreme = new Date();
	const [sati, minuti] = alarmVreme.split(":").map(Number);
	ciljnoVreme.setHours(sati, minuti, 0, 0);

	// Ako je vreme prošlo, dodaj 1 dan
	if (ciljnoVreme < new Date()) {
		ciljnoVreme.setDate(ciljnoVreme.getDate() + 1);
	}

	clearInterval(intervalTajmera);
	osveziPrikazTajmera();
	intervalTajmera = setInterval(osveziPrikazTajmera, 1000);

	document.getElementById("dugmeTajmer").innerHTML = '<i class="bi bi-alarm"></i> Alarm pokrenut...';
	document.getElementById("dugmeTajmer").disabled = true;
}

function zaustaviTajmer() {
	clearInterval(intervalTajmera);
	document.getElementById("prikazTajmera").textContent = "--:--:--";
	document.getElementById("dugmeTajmer").innerHTML = '<i class="bi bi-alarm"></i> Pokreni Alarm';
	document.getElementById("dugmeTajmer").disabled = false;
}

function osveziPrikazTajmera() {
	const sada = new Date();
	const razlika = ciljnoVreme - sada;

	if (razlika <= 0) {
		clearInterval(intervalTajmera);
		document.getElementById("prikazTajmera").textContent = "⏰ ALARM!";
		document.getElementById("zvukAlarma").play();

		const poruka =
			document.getElementById("alarmPoruka").value || "Vreme je isteklo!";
		alert(poruka);

		document.getElementById("dugmeTajmer").innerHTML = '<i class="bi bi-alarm"></i> Pokreni Alarm';
		document.getElementById("dugmeTajmer").disabled = false;
		return;
	}

	const sati = Math.floor(razlika / (1000 * 60 * 60));
	const minuti = Math.floor((razlika % (1000 * 60 * 60)) / (1000 * 60));
	const sekunde = Math.floor((razlika % (1000 * 60)) / 1000);
	document.getElementById("prikazTajmera").textContent = `${sati
		.toString()
		.padStart(2, "0")}:${minuti.toString().padStart(2, "0")}:${sekunde
		.toString()
		.padStart(2, "0")}`;
}

// ========== POMOĆNE FUNKCIJE ==========

function proveriVreme(vreme) {
	return /^([0-1]?[0-9]|2[0-3]):[0-5][0-9]$/.test(vreme);
}

function proveriTrajanje(trajanje) {
	return /^\d{1,3}:\d{2}$/.test(trajanje);
}

function prikaziRezultat(html, istorijaText) {
	const rezultatDiv = document.getElementById("rezultat");
	rezultatDiv.innerHTML = html;
	rezultatDiv.className = "alert alert-success mt-4";
	rezultatDiv.style.display = "block";

	// Dodaj u istoriju
	dodajUIstoriju(istorijaText);
}

function prikaziGresku(poruka) {
	const rezultatDiv = document.getElementById("rezultat");
	rezultatDiv.innerHTML = `<i class="bi bi-exclamation-triangle"></i> ${poruka}`;
	rezultatDiv.className = "alert alert-danger mt-4";
	rezultatDiv.style.display = "block";
}

// ========== TRENUTNO VREME ==========

function prikaziTrenutnoVreme() {
	const sada = new Date();
	const vreme = formatujVreme(sada);
	document.getElementById("trenutnoVreme").textContent = vreme;
	document.getElementById("trenutnoVremeCard").style.display = "block";

	setTimeout(() => {
		document.getElementById("trenutnoVremeCard").style.display = "none";
	}, 3000);
}

function popuniTrenutno(inputId) {
	const sada = new Date();
	const vreme = formatujVreme(sada);
	document.getElementById(inputId).value = vreme;
}

function formatujVreme(datum) {
	let sati = datum.getHours();
	const minuti = datum.getMinutes();

	if (!format24h) {
		const ampm = sati >= 12 ? "PM" : "AM";
		sati = sati % 12 || 12;
		return `${sati.toString().padStart(2, "0")}:${minuti
			.toString()
			.padStart(2, "0")} ${ampm}`;
	}

	return `${sati.toString().padStart(2, "0")}:${minuti
		.toString()
		.padStart(2, "0")}`;
}

function toggleFormat() {
	format24h = !format24h;
	document.getElementById("formatLabel").textContent = format24h
		? "24h"
		: "12h";
}

// ========== ISTORIJA ==========

function dodajUIstoriju(tekst) {
	const sada = new Date();
	const vremenskaOznaka = sada.toLocaleString("sr-RS");

	istorija.unshift({
		tekst: tekst,
		vreme: vremenskaOznaka,
	});

	// Čuvaj samo poslednjih 20
	if (istorija.length > 20) {
		istorija = istorija.slice(0, 20);
	}

	localStorage.setItem("istorijaKalkulacija", JSON.stringify(istorija));
	prikaziIstoriju();
}

function prikaziIstoriju() {
	const kontejner = document.getElementById("istorijaKontejner");

	if (istorija.length === 0) {
		kontejner.innerHTML =
			'<p class="text-muted">Nema kalkulacija u istoriji.</p>';
		return;
	}

	let html = '<div class="list-group list-group-flush">';
	istorija.forEach((stavka, index) => {
		html += `
			<div class="list-group-item d-flex justify-content-between align-items-start">
				<div>
					<strong>${stavka.tekst}</strong><br>
					<small class="text-muted">${stavka.vreme}</small>
				</div>
				<button class="btn btn-sm btn-outline-danger" onclick="ukloniIzIstorije(${index})">
					<i class="bi bi-x"></i>
				</button>
			</div>
		`;
	});
	html += "</div>";

	kontejner.innerHTML = html;
}

function ukloniIzIstorije(index) {
	istorija.splice(index, 1);
	localStorage.setItem("istorijaKalkulacija", JSON.stringify(istorija));
	prikaziIstoriju();
}

function ocistiIstoriju() {
	if (confirm("Da li ste sigurni da želite da obrišete sve iz istorije?")) {
		istorija = [];
		localStorage.removeItem("istorijaKalkulacija");
		prikaziIstoriju();
	}
}

// ========== CLEAR FUNKCIJE ==========

function ocistiOsnovne() {
	document.getElementById("pocetnoVreme").value = "";
	document.getElementById("trajanjeSati").value = "";
	document.getElementById("trajanjeMinuti").value = "";
	document.getElementById("krajnjeVreme").value = "";
	document.getElementById("trajanjeNazadSati").value = "";
	document.getElementById("trajanjeNazadMinuti").value = "";
	document.getElementById("ukljuciDane").checked = false;
}

function ocistiRazliku() {
	document.getElementById("vremeOd").value = "";
	document.getElementById("vremeDo").value = "";
	document.getElementById("prelazDana").checked = false;
}

function ocistiPeriode() {
	const kontejner = document.getElementById("periodiKontejner");
	kontejner.innerHTML = `
		<div class="row mb-2 period-item align-items-end">
			<div class="col-md-2">
				<label class="form-label small">Sati</label>
				<select class="form-select form-select-sm">
					<option value="0">0h</option>
					<option value="1">1h</option>
					<option value="2" selected>2h</option>
					<option value="3">3h</option>
					<option value="4">4h</option>
					<option value="5">5h</option>
					<option value="6">6h</option>
					<option value="8">8h</option>
					<option value="10">10h</option>
				</select>
			</div>
			<div class="col-md-2">
				<label class="form-label small">Min</label>
				<select class="form-select form-select-sm">
					<option value="0">0</option>
					<option value="15">15</option>
					<option value="30" selected>30</option>
					<option value="45">45</option>
				</select>
			</div>
			<div class="col-md-6">
				<label class="form-label small">Opis (opciono)</label>
				<input type="text" class="form-control form-control-sm" placeholder="npr. Sastanak" />
			</div>
			<div class="col-md-2">
				<button class="btn btn-danger btn-sm w-100" onclick="ukloniPeriod(this)" disabled>
					<i class="bi bi-trash"></i>
				</button>
			</div>
		</div>
	`;
}

function ocistiRadne() {
	document.getElementById("pocetakRada").value = "";
	document.getElementById("krajRada").value = "";
	const kontejner = document.getElementById("pauzeKontejner");
	kontejner.innerHTML = `
		<label class="form-label">Pauze</label>
		<div class="row mb-2 pauza-item align-items-end">
			<div class="col-md-2">
				<label class="form-label small">Sati</label>
				<select class="form-select form-select-sm">
					<option value="0" selected>0h</option>
					<option value="1">1h</option>
					<option value="2">2h</option>
				</select>
			</div>
			<div class="col-md-2">
				<label class="form-label small">Min</label>
				<select class="form-select form-select-sm">
					<option value="0">0</option>
					<option value="15">15</option>
					<option value="30" selected>30</option>
					<option value="45">45</option>
				</select>
			</div>
			<div class="col-md-6">
				<label class="form-label small">Opis (opciono)</label>
				<input type="text" class="form-control form-control-sm" placeholder="npr. Ručak" />
			</div>
			<div class="col-md-2">
				<button class="btn btn-danger btn-sm w-100" onclick="ukloniPauzu(this)" disabled>
					<i class="bi bi-trash"></i>
				</button>
			</div>
		</div>
	`;
}

function ocistiKonverziju() {
	document.getElementById("konverzijaBroj").value = "";
	document.getElementById("konverzijaOd").value = "minute";
}
