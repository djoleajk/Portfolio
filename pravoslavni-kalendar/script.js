// Pravoslavni kalendar sa praznicima i postovima za 2025. godinu
const kalendar = {
    // Januar
    "2025-01-01": {
        praznik: "Nova Godina - Sveti Vasilije Veliki",
        tip: "Veliki svetitelj",
        post: "Nema posta",
        sveci: ["Sveti Vasilije Veliki"],
        opis: "Arhiepiskop carigradski, jedan od tri velika vaseljenska učitelja i svetitelja."
    },
    "2025-01-02": {
        praznik: "Sveti Silvestar",
        tip: "Uspomena",
        post: "Nema posta",
        sveci: ["Sveti Silvestar papa rimski"],
        opis: "Papa rimski koji je krstio cara Konstantina Velikog."
    },
    "2025-01-06": {
        praznik: "Badnje Veče",
        tip: "Pripremni dan",
        post: "Strogi post",
        sveci: [],
        opis: "Dan pripreme za Božić. Post do prve zvezde."
    },
    "2025-01-07": {
        praznik: "Božić - Rođenje Gospodnje",
        tip: "Veliki praznik",
        post: "Nema posta",
        sveci: ["Isus Hristos"],
        opis: "Rođenje Gospoda našeg Isusa Hrista po telu. Jedan od najvećih hrišćanskih praznika."
    },
    "2025-01-08": {
        praznik: "Sabor Presvete Bogorodice",
        tip: "Veliki praznik",
        post: "Nema posta",
        sveci: ["Presveta Bogorodica"],
        opis: "Slavlje u čast Presvete Bogorodice, majke Isusa Hrista."
    },
    "2025-01-14": {
        praznik: "Obrezanje Gospodnje - Nova Godina po julijanskom kalendaru",
        tip: "Srednji praznik",
        post: "Nema posta",
        sveci: ["Sveti Vasilije Veliki"],
        opis: "Osmi dan po rođenju Hrista, kada je obavljen obred obrezanja po zakonu Mojsijevom."
    },
    "2025-01-18": {
        praznik: "Bogojavljenski Sabor",
        tip: "Pripremni dan",
        post: "Strogi post",
        sveci: [],
        opis: "Pripremni dan za Bogojavljenje."
    },
    "2025-01-19": {
        praznik: "Bogojavljenje - Sveto Bogojavlјenje - Krštenje Gospodnje",
        tip: "Veliki praznik",
        post: "Nema posta",
        sveci: [],
        opis: "Krštenje Isusa Hrista u reci Jordan. Jedan od dvanaest velikih praznika."
    },
    "2025-01-20": {
        praznik: "Sabor Svetog Jovana Krstitelja",
        tip: "Srednji praznik",
        post: "Nema posta",
        sveci: ["Sveti Jovan Krstitelj"],
        opis: "Slavlje Svetog Jovana Krstitelja, preteče Gospodnјe."
    },
    "2025-01-27": {
        praznik: "Sveti Sava",
        tip: "Veliki svetitelj",
        post: "Dozvoljena riba",
        sveci: ["Sveti Sava"],
        opis: "Prvi srpski arhiepiskop i prosvjetitelj. Najvažniji srpski svetitelj."
    },
    "2025-01-30": {
        praznik: "Tri Jerarha",
        tip: "Uspomena",
        post: "Dozvoljena riba",
        sveci: ["Sveti Vasilije Veliki", "Sveti Grigorie Bogoslov", "Sveti Jovan Zlatousti"],
        opis: "Slavlјe tri velika vaseljenska učitelja."
    },

    // Februar
    "2025-02-02": {
        praznik: "Sretenje Gospodnje",
        tip: "Veliki praznik",
        post: "Dozvoljena riba",
        sveci: [],
        opis: "Četrdesetog dana po rođenju, Bogorodica je donela Hrista u jerusalimski hram."
    },
    "2025-02-10": {
        praznik: "Sveti Haralampo",
        tip: "Uspomena",
        post: "Dozvoljena riba",
        sveci: ["Sveti Haralampo"],
        opis: "Sveti mučenik i čudotvorac, zaštitnik od kuge i zaraznih bolesti."
    },
    "2025-02-24": {
        praznik: "Pronalaženje glave Svetog Jovana Krstitelja",
        tip: "Srednji praznik",
        post: "Strogi post",
        sveci: ["Sveti Jovan Krstitelj"],
        opis: "Prvo i drugo pronalaženje časne glave Svetog Jovana Krstitelja."
    },

    // Mart
    "2025-03-03": {
        praznik: "Početak Velikog posta",
        tip: "Post",
        post: "Strogi post",
        sveci: [],
        opis: "Počinje najduži i najstrožiji post u pravoslavnoj crkvi."
    },
    "2025-03-09": {
        praznik: "Sveti Četrdeset Mučenika Sevastiјskih",
        tip: "Uspomena",
        post: "Dozvoljena riba",
        sveci: ["Sveti Četrdeset Mučenika"],
        opis: "Mučenici koji su stradali na Sevastiјskom jezeru za vreme cara Likinija."
    },
    "2025-03-25": {
        praznik: "Blagovesti - Blagovesti Presvete Bogorodice",
        tip: "Veliki praznik",
        post: "Dozvoljena riba",
        sveci: ["Presveta Bogorodica"],
        opis: "Arhanđeo Gavrilo javio je Bogorodici da će roditi Sina Božijeg."
    },

    // April
    "2025-04-12": {
        praznik: "Lazareva Subota",
        tip: "Pripremni dan",
        post: "Dozvoljena riba i ikra",
        sveci: ["Pravedni Lazar"],
        opis: "Vaskrsenje pravednog Lazara. Subota pred Cvetni dan."
    },
    "2025-04-13": {
        praznik: "Cveti - Ulazak Gospodnji u Jerusalim",
        tip: "Veliki praznik",
        post: "Dozvoljena riba",
        sveci: [],
        opis: "Isus ulazi u Jerusalim i narod ga dočekuje sa palmovim granama."
    },
    "2025-04-14": {
        praznik: "Veliki Ponedeljak",
        tip: "Post",
        post: "Strogi post - Strasna Sedmica",
        sveci: [],
        opis: "Počinje Strasna sedmica - poslednja sedmica Velikog posta."
    },
    "2025-04-15": {
        praznik: "Veliki Utorak",
        tip: "Post",
        post: "Strogi post - Strasna Sedmica",
        sveci: [],
        opis: "Drugi dan Strasne sedmice."
    },
    "2025-04-16": {
        praznik: "Velika Sreda",
        tip: "Post",
        post: "Strogi post - Strasna Sedmica",
        sveci: [],
        opis: "Treći dan Strasne sedmice."
    },
    "2025-04-17": {
        praznik: "Veliki Četvrtak",
        tip: "Post",
        post: "Strogi post - Strasna Sedmica",
        sveci: [],
        opis: "Tajna Večera - poslednja večera Hrista sa apostolima."
    },
    "2025-04-18": {
        praznik: "Veliki Petak",
        tip: "Post",
        post: "Strogi post - Dan bez hrane",
        sveci: [],
        opis: "Stradanje i raspece Gospodnje. Najstrožiji post."
    },
    "2025-04-19": {
        praznik: "Velika Subota",
        tip: "Post",
        post: "Strogi post",
        sveci: [],
        opis: "Polaganje Hrista u grob. Očekivanje Vaskrsenja."
    },
    "2025-04-20": {
        praznik: "Vaskrs - Vaskrsenje Hristovo",
        tip: "Najveći praznik",
        post: "Nema posta",
        sveci: [],
        opis: "Vaskrsenje Gospoda Isusa Hrista. Najradosniji dan u pravoslavnom kalendaru. Hristos Voskrese!"
    },
    "2025-04-21": {
        praznik: "Drugi dan Vaskrsa",
        tip: "Veliki praznik",
        post: "Nema posta",
        sveci: [],
        opis: "Nastavak svetkovanja Vaskrsenja Hristovog."
    },
    "2025-04-23": {
        praznik: "Sveti Đorđe (Đurđevdan)",
        tip: "Veliki svetitelj",
        post: "Nema posta",
        sveci: ["Sveti Đorđe"],
        opis: "Veliki mučenik i čudotvorac, jedan od najštovanijih svetitelja."
    },

    // Maj
    "2025-05-06": {
        praznik: "Sveti Đorđe - Đurđić (prenos zbog Vaskrsa)",
        tip: "Veliki svetitelj",
        post: "Nema posta",
        sveci: ["Sveti Đorđe"],
        opis: "Praznik Svetog Đorđa prenesen zbog poklapanja sa Strasnom sedmicom."
    },
    "2025-05-21": {
        praznik: "Sveti Car Konstantin i carica Jelena",
        tip: "Uspomena",
        post: "Nema posta",
        sveci: ["Sveti Car Konstantin", "Sveta Carica Jelena"],
        opis: "Ravnoapostolni car i njegova majka koja je pronašla Časni Krst."
    },
    "2025-05-29": {
        praznik: "Spasovdan - Vaznesenje Gospodnje",
        tip: "Veliki praznik",
        post: "Nema posta",
        sveci: [],
        opis: "Četrdesetog dana po Vaskrsenju, Hristos se uzneo na nebo."
    },

    // Jun
    "2025-06-08": {
        praznik: "Trojice - Duhovi - Silazak Svetog Duha",
        tip: "Veliki praznik",
        post: "Nema posta",
        sveci: [],
        opis: "Pedeset dana po Vaskrsenju, Sveti Duh je sišao na apostole."
    },
    "2025-06-09": {
        praznik: "Duhovski Ponedeljak - Dan Svetog Duha",
        tip: "Veliki praznik",
        post: "Nema posta",
        sveci: [],
        opis: "Dan slavlјenja Svetog Duha, treće ličnosti Svete Trojice."
    },
    "2025-06-11": {
        praznik: "Početak Petrovog posta (Apostolski post)",
        tip: "Post",
        post: "Riba dozvoljena (osim srede i petka)",
        sveci: [],
        opis: "Počinje Petrov post koji traje do praznika Svetih apostola Petra i Pavla."
    },
    "2025-06-24": {
        praznik: "Rođenje Svetog Jovana Krstitelja (Ivanjdan)",
        tip: "Veliki praznik",
        post: "Dozvoljena riba",
        sveci: ["Sveti Jovan Krstitelj"],
        opis: "Rođenje Svetog Jovana Preteče, koji je krstio Isusa Hrista."
    },
    "2025-06-28": {
        praznik: "Vidovdan - Sveti Knez Lazar",
        tip: "Uspomena",
        post: "Nema posta",
        sveci: ["Sveti Knez Lazar"],
        opis: "Uspomena na Kosovsku bitku i stradanje Svetog kneza Lazara."
    },
    "2025-06-29": {
        praznik: "Petrovdan - Sveti Apostoli Petar i Pavle",
        tip: "Veliki praznik",
        post: "Nema posta",
        sveci: ["Sveti Apostol Petar", "Sveti Apostol Pavle"],
        opis: "Slavlјe prvih apostola Petra i Pavla. Završetak Petrovog posta."
    },

    // Jul
    "2025-07-07": {
        praznik: "Sveti Jovan Krstitelj (Ivanjdan - Rođenje)",
        tip: "Veliki praznik",
        post: "Dozvoljena riba",
        sveci: ["Sveti Jovan Krstitelj"],
        opis: "Rođenje Svetog Jovana Preteče po julijanskom kalendaru."
    },
    "2025-07-12": {
        praznik: "Sveti Apostoli Petar i Pavle (Petrovdan - po julijanskom)",
        tip: "Veliki praznik",
        post: "Nema posta",
        sveci: ["Sveti Apostol Petar", "Sveti Apostol Pavle"],
        opis: "Petrovdan po julijanskom kalendaru."
    },
    "2025-07-20": {
        praznik: "Sveti Ilija (Ilinden)",
        tip: "Veliki praznik",
        post: "Dozvoljena riba",
        sveci: ["Sveti Prorok Ilija"],
        opis: "Vatreni prorok Starog Zaveta koji se uzneo na nebo."
    },

    // Avgust
    "2025-08-01": {
        praznik: "Početak Uspenjskog posta (Velika Gospojina post)",
        tip: "Post",
        post: "Strogi post",
        sveci: [],
        opis: "Počinje dvonedelјni post koji traje do Velike Gospojine."
    },
    "2025-08-02": {
        praznik: "Sveti Ilija (Ilinden) - po julijanskom kalendaru",
        tip: "Veliki praznik",
        post: "Dozvoljena riba",
        sveci: ["Sveti Prorok Ilija"],
        opis: "Ilinden po julijanskom kalendaru."
    },
    "2025-08-06": {
        praznik: "Preobraženje Gospodnje",
        tip: "Veliki praznik",
        post: "Dozvoljena riba",
        sveci: [],
        opis: "Hristos se preobrazio na gori Tavor pred apostolima Petrom, Jakovom i Jovanom."
    },
    "2025-08-09": {
        praznik: "Sveti Velikomučenik Pantelejmоn",
        tip: "Uspomena",
        post: "Strogi post",
        sveci: ["Sveti Pantelејmon"],
        opis: "Veliki lečitelj i čudotvorac."
    },
    "2025-08-19": {
        praznik: "Preobraženje Gospodnje (po julijanskom kalendaru)",
        tip: "Veliki praznik",
        post: "Dozvoljena riba",
        sveci: [],
        opis: "Preobraženje po julijanskom kalendaru."
    },
    "2025-08-28": {
        praznik: "Velika Gospojina - Uspenje Presvete Bogorodice",
        tip: "Veliki praznik",
        post: "Nema posta",
        sveci: ["Presveta Bogorodica"],
        opis: "Upokojenje Presvete Bogorodice i njeno uznesenje na nebo."
    },
    "2025-08-29": {
        praznik: "Posekovanje glave Svetog Jovana Krstitelja",
        tip: "Veliki praznik",
        post: "Strogi post",
        sveci: ["Sveti Jovan Krstitelj"],
        opis: "Mučenička smrt Svetog Jovana Krstitelja po naredbi cara Iroda."
    },

    // Septembar
    "2025-09-11": {
        praznik: "Posekovanje glave Svetog Jovana Krstitelja (po julijanskom)",
        tip: "Veliki praznik",
        post: "Strogi post",
        sveci: ["Sveti Jovan Krstitelj"],
        opis: "Usekovanje glave Svetog Jovana po julijanskom kalendaru."
    },
    "2025-09-14": {
        praznik: "Krstovdan - Vozdviženje Časnog Krsta",
        tip: "Veliki praznik",
        post: "Strogi post",
        sveci: [],
        opis: "Pronalaženje i uzdizanje Časnog Krsta Hristovog."
    },
    "2025-09-21": {
        praznik: "Rođenje Presvete Bogorodice (Mala Gospojina)",
        tip: "Veliki praznik",
        post: "Dozvoljena riba",
        sveci: ["Presveta Bogorodica"],
        opis: "Rođenje Presvete Bogorodice od pravednih Joakima i Ane."
    },
    "2025-09-27": {
        praznik: "Krstovdan (Vozdviženje po julijanskom)",
        tip: "Veliki praznik",
        post: "Strogi post",
        sveci: [],
        opis: "Vozdviženje Časnog Krsta po julijanskom kalendaru."
    },

    // Oktobar
    "2025-10-04": {
        praznik: "Mala Gospojina (Rođenje Bogorodice po julijanskom)",
        tip: "Veliki praznik",
        post: "Dozvoljena riba",
        sveci: ["Presveta Bogorodica"],
        opis: "Rođenje Presvete Bogorodice po julijanskom kalendaru."
    },
    "2025-10-08": {
        praznik: "Pokrov Presvete Bogorodice",
        tip: "Veliki praznik",
        post: "Dozvoljena riba",
        sveci: ["Presveta Bogorodica"],
        opis: "Pokrov i zaštita Presvete Bogorodice nad svim vernicima."
    },
    "2025-10-19": {
        praznik: "Sveti Apostol Toma",
        tip: "Uspomena",
        post: "Nema posta",
        sveci: ["Sveti Apostol Toma"],
        opis: "Apostol koji je pipao rane Vaskrslog Hrista."
    },
    "2025-10-26": {
        praznik: "Sveti Velikomučenik Dimitrije (Mitrovdan)",
        tip: "Veliki praznik",
        post: "Nema posta",
        sveci: ["Sveti Dimitrije Solunski"],
        opis: "Veliki zaštitnik i čudotvorac, mučenik solunski."
    },

    // Novembar
    "2025-11-08": {
        praznik: "Sveti Arhangel Mihailo (Aranđelovdan)",
        tip: "Veliki praznik",
        post: "Nema posta",
        sveci: ["Sveti Arhangel Mihailo", "Sveti Arhangel Gavrilo"],
        opis: "Sabor svetih arhanđela Mihaila i Gavrila."
    },
    "2025-11-14": {
        praznik: "Početak Božićnog posta (Filipovki post)",
        tip: "Post",
        post: "Riba dozvoljena (osim srede i petka)",
        sveci: [],
        opis: "Počinje četrdesetodnevni Božićni post."
    },
    "2025-11-21": {
        praznik: "Vavedenje Presvete Bogorodice (Vavedenje)",
        tip: "Veliki praznik",
        post: "Dozvoljena riba",
        sveci: ["Presveta Bogorodica"],
        opis: "Uvođenje trogodišnje Bogorodice u jerusalimski hram."
    },

    // Decembar
    "2025-12-04": {
        praznik: "Vavedenje Presvete Bogorodice (po julijanskom)",
        tip: "Veliki praznik",
        post: "Dozvoljena riba",
        sveci: ["Presveta Bogorodica"],
        opis: "Vavedenje po julijanskom kalendaru."
    },
    "2025-12-13": {
        praznik: "Sveti Apostol Andrija Prvozvani",
        tip: "Veliki praznik",
        post: "Dozvoljena riba",
        sveci: ["Sveti Apostol Andrija"],
        opis: "Prvi od apostola koji je pozvan od Hrista."
    },
    "2025-12-19": {
        praznik: "Sveti Nikola (Nikoljdan)",
        tip: "Veliki praznik",
        post: "Dozvoljena riba",
        sveci: ["Sveti Nikola Čudotvorac"],
        opis: "Arhiepiskop mirlikijski, veliki zaštitnik i čudotvorac."
    }
};

// Postavke za dane posta (srede i petke tokom godine, osim nepostnih perioda)
const nepostniPeriodi = [
    // Svetle sedmice (nedelјa posle Vaskrsa)
    { start: new Date(2025, 3, 20), end: new Date(2025, 3, 26) },
    // Božićne sedmice (7-19 januar)
    { start: new Date(2025, 0, 7), end: new Date(2025, 0, 19) },
    // Nedelјa mislara (od Trojice do Petrovog posta)
    { start: new Date(2025, 5, 8), end: new Date(2025, 5, 10) }
];

// Periodi strogog posta
const postniPeriodi = [
    // Veliki post
    { start: new Date(2025, 2, 3), end: new Date(2025, 3, 19), naziv: "Veliki post" },
    // Petrov post
    { start: new Date(2025, 5, 11), end: new Date(2025, 5, 28), naziv: "Petrov post" },
    // Uspenjski post
    { start: new Date(2025, 7, 1), end: new Date(2025, 7, 27), naziv: "Uspenjski post" },
    // Božićni post
    { start: new Date(2025, 10, 14), end: new Date(2025, 11, 31), naziv: "Božićni post" }
];

// Funkcija za proveru da li je dan u nepostnom periodu
function jeNepostanDan(datum) {
    for (let period of nepostniPeriodi) {
        if (datum >= period.start && datum <= period.end) {
            return true;
        }
    }
    return false;
}

// Funkcija za dobijanje informacija o postu za određeni dan
function getPostInfo(datum) {
    const dan = datum.getDay(); // 0 = nedelјa, 3 = sreda, 5 = petak
    
    // Provera da li je dan u postnom periodu
    for (let period of postniPeriodi) {
        if (datum >= period.start && datum <= period.end) {
            if (dan === 3 || dan === 5) { // Sreda ili petak
                return {
                    post: "Strogi post (sreda/petak u " + period.naziv + ")",
                    jePost: true
                };
            } else if (period.naziv === "Veliki post" || period.naziv === "Uspenjski post") {
                return {
                    post: "Post - " + period.naziv,
                    jePost: true
                };
            } else {
                return {
                    post: "Riba dozvoljena - " + period.naziv,
                    jePost: true
                };
            }
        }
    }
    
    // Provera za redovne srede i petke van postnih perioda
    if ((dan === 3 || dan === 5) && !jeNepostanDan(datum)) {
        return {
            post: "Post (sreda/petak)",
            jePost: true
        };
    }
    
    return {
        post: "Nema posta",
        jePost: false
    };
}

// Funkcija za formatiranje datuma u oblik YYYY-MM-DD
function formatDatum(datum) {
    const godina = datum.getFullYear();
    const mesec = String(datum.getMonth() + 1).padStart(2, '0');
    const dan = String(datum.getDate()).padStart(2, '0');
    return `${godina}-${mesec}-${dan}`;
}

// Funkcija za dobijanje naziva meseca
function getNazivMeseca(mesec) {
    const meseci = [
        'Januar', 'Februar', 'Mart', 'April', 'Maj', 'Jun',
        'Jul', 'Avgust', 'Septembar', 'Oktobar', 'Novembar', 'Decembar'
    ];
    return meseci[mesec];
}

// Funkcija za dobijanje naziva dana
function getNazivDana(dan) {
    const dani = ['Nedelјa', 'Ponedelјak', 'Utorak', 'Sreda', 'Četvrtak', 'Petak', 'Subota'];
    return dani[dan];
}

// Trenutni prikaz
let trenutnaMesec = new Date().getMonth();
let trenutnaGodina = new Date().getFullYear();

// Funkcija za generisanje kalendara
function generisiKalendar(mesec, godina) {
    const kalendarDiv = document.getElementById('calendar');
    kalendarDiv.innerHTML = '';
    
    // Dodaj zaglavlja za dane u nedelјi
    const daniUnedelјi = ['Ned', 'Pon', 'Uto', 'Sre', 'Čet', 'Pet', 'Sub'];
    daniUnedelјi.forEach(dan => {
        const header = document.createElement('div');
        header.className = 'day-header';
        header.textContent = dan;
        kalendarDiv.appendChild(header);
    });
    
    // Prvi dan meseca
    const prviDan = new Date(godina, mesec, 1);
    const prviDanUnedelјi = prviDan.getDay();
    
    // Broj dana u mesecu
    const brojDanaUMesecu = new Date(godina, mesec + 1, 0).getDate();
    
    // Dodaj prazne ćelije pre prvog dana
    for (let i = 0; i < prviDanUnedelјi; i++) {
        const praznaCelija = document.createElement('div');
        praznaCelija.className = 'day empty';
        kalendarDiv.appendChild(praznaCelija);
    }
    
    // Danas
    const danas = new Date();
    const danasStr = formatDatum(danas);
    
    // Dodaj dane meseca
    for (let dan = 1; dan <= brojDanaUMesecu; dan++) {
        const datum = new Date(godina, mesec, dan);
        const datumStr = formatDatum(datum);
        
        const danDiv = document.createElement('div');
        danDiv.className = 'day';
        
        // Dodaj broj dana
        const brojDana = document.createElement('div');
        brojDana.className = 'day-number';
        brojDana.textContent = dan;
        danDiv.appendChild(brojDana);
        
        // Proveri da li postoji praznik
        let jePraznik = false;
        let jePost = false;
        let tekst = '';
        
        if (kalendar[datumStr]) {
            jePraznik = true;
            tekst = kalendar[datumStr].praznik;
            if (kalendar[datumStr].post !== "Nema posta") {
                jePost = true;
            }
        } else {
            // Proveri za redovni post
            const postInfo = getPostInfo(datum);
            if (postInfo.jePost) {
                jePost = true;
                tekst = postInfo.post;
            }
        }
        
        // Dodaj oznaku
        if (tekst) {
            const labela = document.createElement('div');
            labela.className = 'day-label';
            labela.textContent = tekst;
            danDiv.appendChild(labela);
        }
        
        // Dodaj boje
        if (jePraznik) {
            danDiv.classList.add('praznik');
        }
        if (jePost && !jePraznik) {
            danDiv.classList.add('post');
        }
        
        // Označi današnji dan
        if (datumStr === danasStr) {
            danDiv.classList.add('danas');
        }
        
        // Dodaj event listener za klik
        danDiv.addEventListener('click', () => prikaziDetalje(datum, datumStr));
        
        kalendarDiv.appendChild(danDiv);
    }
    
    // Ažuriraj naslov
    document.getElementById('currentMonth').textContent = 
        `${getNazivMeseca(mesec)} ${godina}.`;
}

// Funkcija za prikazivanje detalja
function prikaziDetalje(datum, datumStr) {
    const modal = document.getElementById('modal');
    const modalDate = document.getElementById('modalDate');
    const modalBody = document.getElementById('modalBody');
    const kandilo = document.getElementById('kandilo');
    
    const danNaziv = getNazivDana(datum.getDay());
    const dan = datum.getDate();
    const mesec = getNazivMeseca(datum.getMonth());
    const godina = datum.getFullYear();
    
    modalDate.textContent = `${danNaziv}, ${dan}. ${mesec} ${godina}.`;
    
    let html = '';
    let jeVelikPraznik = false;
    
    if (kalendar[datumStr]) {
        const danInfo = kalendar[datumStr];
        
        // Proveri da li je veliki praznik za kandilo
        if (danInfo.tip === "Veliki praznik" || danInfo.tip === "Najveći praznik") {
            jeVelikPraznik = true;
        }
        
        html += '<div class="modal-section">';
        html += `<h3>🎊 ${danInfo.praznik}</h3>`;
        html += `<p><strong>Tip:</strong> ${danInfo.tip}</p>`;
        html += `<p><strong>Post:</strong> ${danInfo.post}</p>`;
        
        if (danInfo.sveci && danInfo.sveci.length > 0) {
            html += `<p><strong>Sveci:</strong> ${danInfo.sveci.join(', ')}</p>`;
        }
        
        if (danInfo.opis) {
            html += `<p><strong>Opis:</strong> ${danInfo.opis}</p>`;
        }
        html += '</div>';
        
        // Dodaj liturgijske informacije ako postoje
        if (liturgijskeInfo[datumStr]) {
            const liturgija = liturgijskeInfo[datumStr];
            
            html += '<div class="modal-section">';
            html += '<h3>⛪ Liturgijske Informacije</h3>';
            html += `<p><strong>Tip Liturgije:</strong> ${liturgija.tipLiturgije}</p>`;
            html += `<p><strong>Glas:</strong> ${liturgija.glas}</p>`;
            html += `<p><strong>Boja Odeždi:</strong> ${liturgija.bojaOdezdi}</p>`;
            html += `<p><strong>Apostol:</strong> ${liturgija.apostol}</p>`;
            html += `<p><strong>Jevanđelje:</strong> ${liturgija.jevanđelje}</p>`;
            
            if (liturgija.tropar) {
                html += `<p><strong>Tropar:</strong><br><em>"${liturgija.tropar}"</em></p>`;
            }
            
            if (liturgija.kondak) {
                html += `<p><strong>Kondak:</strong><br><em>"${liturgija.kondak}"</em></p>`;
            }
            html += '</div>';
        }
        
        // Dodaj biblijske stihove ako postoje
        if (biblijskiStihovi[datumStr]) {
            html += '<div class="modal-section">';
            html += '<h3>📖 Biblijski Stih Dana</h3>';
            html += `<p><em>"${biblijskiStihovi[datumStr]}"</em></p>`;
            html += '</div>';
        }
    } else {
        const postInfo = getPostInfo(datum);
        
        html += '<div class="modal-section">';
        html += '<h3>Redovan dan</h3>';
        html += `<p><strong>Post:</strong> ${postInfo.post}</p>`;
        
        if (postInfo.jePost) {
            html += '<p><strong>Napomena:</strong> U pravoslavnoj tradiciji, sreda i petak su postni dani tokom cele godine (osim u nepostnim periodima).</p>';
        }
        html += '</div>';
    }
    
    modalBody.innerHTML = html;
    
    // Aktiviraj kandilo za velike praznike
    if (jeVelikPraznik) {
        kandilo.classList.add('active');
    } else {
        kandilo.classList.remove('active');
    }
    
    modal.style.display = 'block';
    
    // Zvučni efekat zvona
    if (jeVelikPraznik) {
        simulirajZvono();
    }
}

// Event listeneri za navigaciju
document.getElementById('prevMonth').addEventListener('click', () => {
    trenutnaMesec--;
    if (trenutnaMesec < 0) {
        trenutnaMesec = 11;
        trenutnaGodina--;
    }
    generisiKalendar(trenutnaMesec, trenutnaGodina);
});

document.getElementById('nextMonth').addEventListener('click', () => {
    trenutnaMesec++;
    if (trenutnaMesec > 11) {
        trenutnaMesec = 0;
        trenutnaGodina++;
    }
    generisiKalendar(trenutnaMesec, trenutnaGodina);
});

// Zatvori modal
document.querySelector('.close').addEventListener('click', () => {
    document.getElementById('modal').style.display = 'none';
});

// Zatvori modal klikom van njega
window.addEventListener('click', (event) => {
    const modal = document.getElementById('modal');
    if (event.target === modal) {
        modal.style.display = 'none';
    }
});

// Inicijalno generisanje kalendara
generisiKalendar(trenutnaMesec, trenutnaGodina);

// ============ NOVE FUNKCIONALNOSTI ============

// Liturgijske informacije za praznike
const liturgijskeInfo = {
    "2025-01-07": {
        tipLiturgije: "Liturgija Svetog Vasilija Velikog",
        glas: 1,
        bojaOdezdi: "Zlatna",
        apostol: "Galatima 4:4-7",
        jevanđelje: "Matej 2:1-12",
        tropar: "Rođenje Tvoje, Hriste Bože naš, zablistalo je svetu svetlost razuma: kroz njega se klanjatelji zvezda od zvezde se poučili da Te poznaju, Sunce pravde, i da saznaju Tebe, Istok s visine. Gospode, slava Tebi!",
        kondak: "Deva danas Svevišnjeg rađa, i zemlja pećinu Nepristupnom prinosi. Anđeli sa pastirima slave. Mudri zvezdou putuju. Nas radi rodilo se Dete mlado, Bog predvečni."
    },
    "2025-01-19": {
        tipLiturgije: "Liturgija Svetog Jovana Zlatoustog",
        glas: 2,
        bojaOdezdi: "Bela",
        apostol: "1. Korinćanima 9:19-27",
        jevanđelje: "Luka 3:1-18",
        tropar: "U Jordanu krštavajuči se Ti, Gospode, pokaza se poklonstvo Trojici: jer Otca glas posvedoči Tebi, naziva Te ljubljenog Sina, i Duh u vidu golubovu utvrđavaše reči istinu. Pokazavšemu se Hriste Bože i mir prosvetivšemu, slava Tebi!",
        kondak: "Javio si se danas vaseljeni, i svetlost Tvoja, Gospode, označila se je na nama, sa razumom Te pevajući: došao si i pokazao se, Svetlost nepristupna."
    },
    "2025-03-25": {
        tipLiturgije: "Liturgija Svetog Jovana Zlatoustog",
        glas: 4,
        bojaOdezdi: "Plava/Zlatna",
        apostol: "Jevrejima 2:11-18",
        jevanđelje: "Luka 1:24-38",
        tropar: "Danas spasenja našeg glavizna, i otkriće tajne od veka: Sin Božiji Sin Devin postaje, i Gavrilo blagodat blagovesti. Zato i mi sa njim Bogorodici zovimo: Raduj se, Blagodatna, Gospod s tobom!",
        kondak: "Vođa raniju Ti, Bogorodice, sa nebesa poslat bi da Ti zove: Raduj se! I sa beztelesnim glasom vidjevši Te, Gospode, otelotvorena, zapanjио se je i stajao zvaјući Ti tako: Raduj se, Blagodatna, Gospod s tobom!"
    },
    "2025-04-13": {
        tipLiturgije: "Liturgija Svetog Jovana Zlatoustog",
        glas: 6,
        bojaOdezdi: "Zelena/Zlatna",
        apostol: "Filibljanima 4:4-9",
        jevanđelje: "Jovan 12:1-18",
        tropar: "Obšee vaskresenje pre Svojih strastij uvjeravajuči, iz mertvih podigao si Lazara, Hriste Bože. Zato i mi, kao otročići, znake pobede nosimo, i Tebi, Pobedniku smrti, zovemo: Osana na visini! Blagosloven koji dolazi u ime Gospodnje!",
        kondak: "Hrista na prestolu na nebesima, a na zemlji na žrebetu noseći, pohvale anđelske i pesme detije primi, Hriste Bože, govoreći: Blagosloven jesi koji dolaziš, Adama opet pozvati."
    },
    "2025-04-20": {
        tipLiturgije: "Liturgija Svetog Jovana Zlatoustog",
        glas: 1,
        bojaOdezdi: "Crvena/Zlatna",
        apostol: "Dela apostolska 1:1-8",
        jevanđelje: "Jovan 1:1-17",
        tropar: "Hristos vaskrese iz mertvих, smrću smrt razdavi, i onima u grobovim život darova!",
        kondak: "Ako i u grob siđe, bezsmertne, ali adovu razori silu, i vaskrsе kao pobednik, Hriste Bože, ženama mironosicam pozvавši: Radujte se! I Svojim apostolima mir darovавši, pale Jedan podavatelj vaskrsenja!"
    },
    "2025-05-29": {
        tipLiturgije: "Liturgija Svetog Jovana Zlatoustog",
        glas: 7,
        bojaOdezdi: "Zlatna",
        apostol: "Dela apostolska 1:1-12",
        jevanđelje: "Luka 24:36-53",
        tropar: "Vaznesao se jesi u slavi, Hriste Bože naš, radost učinivši učenicima Svojim obećanjem Svetog Duha, utvrđenim im biv blagoslovom, јako Ti jesi Sin Božiji, Iskupitelj sveta!",
        kondak: "Delo nad nama ispunivši domostrоjstva, i jеdinivši zemaljska sa nebeskima, vaznesao se jesi u slavi, Hriste Bože naš, nikako ne rastajući se, no ostajući nepodeljivo, i zоveći onima koji Те ljube: Ja sam sa vama i niko protiv vas!"
    },
    "2025-06-08": {
        tipLiturgije: "Liturgija Svetog Jovana Zlatoustog",
        glas: 8,
        bojaOdezdi: "Zelena/Zlatna",
        apostol: "Dela apostolska 2:1-11",
        jevanđelje: "Jovan 7:37-52; 8:12",
        tropar: "Blagosloven jesi, Hriste Bože naš, koji si premudre ribаre pokazao, poslavši im Duha Svetog, i kroz njih svijet ulovio, Čovekoljubče, slava Tebi!",
        kondak: "Kada, silazeći, jezike smuti, razdeljaše narodе Višnji: kada jezike ognjene deli, u jedinstvo sve pozva, i sagласno slavimo Presvеtog Duha!"
    },
    "2025-08-06": {
        tipLiturgije: "Liturgija Svetog Jovana Zlatoustog",
        glas: 7,
        bojaOdezdi: "Bela",
        apostol: "2. Petrova 1:10-19",
        jevanđelje: "Matej 17:1-9",
        tropar: "Preobraziv se na gori, Hriste Bože, pokazao si učenicima Svojim slavu Svoju, koliko su mogli; da zasija i nama grеšnima svetlost Tvoja večna molitvama Bogorodice; Svetlodavče, slava Tebi!",
        kondak: "Na gori se preobrazio, i koliko su mogli primiti učenici Tvoji, slavу Tvoju, Hriste Bože, videli su; da, kad Te vide raspetog, strаdanje ubо razumeju dobrovoljno, svetu že propovedaju, јako Ti jesi voistinu Otčее sіјаnje."
    },
    "2025-08-28": {
        tipLiturgije: "Liturgija Svetog Jovana Zlatoustog",
        glas: 1,
        bojaOdezdi: "Plava/Zlatna",
        apostol: "Filibljanima 2:5-11",
        jevanđelje: "Luka 10:38-42; 11:27-28",
        tropar: "U rođenju devstvo sačuvala si, u uspenju sveta ne ostavila si, Bogorodice, prestavila se jesi k Životu, materom bivši Života, i molitvama Svojim izbavljaš od smrti duše naše!",
        kondak: "U molitvama Neusipajušcuju Bogorodicu, i u zaštitama nepremestno upovanje, grоb i smrt ne zadržаše: kako što jesi Žіvotа Mati, prestavio je u život Voплotivšійsja iz črevа Dejstvennago."
    },
    "2025-09-14": {
        tipLiturgije: "Liturgija Svetog Jovana Zlatoustog",
        glas: 1,
        bojaOdezdi: "Ljubičasta/Crvena",
        apostol: "1. Korinćanima 1:18-24",
        jevanđelje: "Jovan 19:6-11, 13-20, 25-28, 30-35",
        tropar: "Spasi, Gospode, narod Svoj i blagoslovi dostojanje Tvoje, pobedu pravoslavnim hrišćanima na protivnike darivајući, i Tvoje sačinjavanje Krstom Tvojim hraneći!",
        kondak: "Vоznesеni na Krst voljno, novom Tvojoj državi milovanja Tvoja daruj, Hriste Bože; obraduj nam silom Svojom, pobede dајući nam na protivnike, pomоć imušće oružје mira, nepobednu pobedu!"
    }
};

// Biblijski stihovi dana
const biblijskiStihovi = {
    "2025-01-01": "Jer nam se rodi dete, sin nam se dade; vlast će biti na ramenu njegovom, i ime će mu biti: Čudo, Svetnik, Bog silan, Otac večni, Knez mirnoga. (Isaija 9:6)",
    "2025-01-07": "A Reč postade telo i useli se medu nama, puno blagodati i istine; i videsmo slavu njegovu, slavu kao jedinorodnoga od Oca. (Jovan 1:14)",
    "2025-01-19": "I glas se oglasi sa nebesa: Ti si moj ljubljeni Sin; u Tebi mi je volja. (Luka 3:22)",
    "2025-01-27": "Zakon je kroz Mojsija dan, a blagodat i istina bi kroz Isusa Hrista. (Jovan 1:17)",
    "2025-02-02": "I uzeše ga u naručje svoje i blagoslovi Boga govoreći: Sada puštaš slugu svoga, Vladiko, po reči Svojoj u miru. (Luka 2:28-29)",
    "2025-03-25": "I reče joj anđeo: Ne boj se, Marijo, jer nađe blagodat kod Boga. (Luka 1:30)",
    "2025-04-13": "Blagosloven onaj što ide, Car u ime Gospodnje! (Luka 19:38)",
    "2025-04-20": "I reče im: Ne bojte se; vi tražite Isusa Nazarećanina raspetoga; uskrsnu, nema ga ovde; evo mesta gde su ga položili. (Marko 16:6)",
    "2025-05-29": "Čekajte u gradu Jerusalimu dok se ne odenete silom s visine. (Luka 24:49)",
    "2025-06-08": "I napuniše se svi Duha Svetoga, i stadoše govoriti drugim jezicima kako im Duh davaše te govorahu. (Dela 2:4)",
    "2025-06-24": "Glas onoga što viče u pustinji: Poravnite put Gospodnji, prave činite staze Njemu. (Marko 1:3)",
    "2025-06-28": "Uzjahavši na konja u pomoć bratima svojim, polažući i život svoj za njih. (Akatist kneza Lazara)",
    "2025-08-06": "I preobražen bi pred njima: i zasija lice Njegovo kao sunce, a haljine Njegove postadoše bele kao svetlost. (Matej 17:2)",
    "2025-08-28": "Blažena si ti među ženama, i blagosloven plod utrobe tvoje. (Luka 1:42)",
    "2025-09-14": "A meni ne daj se hvaliti osim krstom Gospoda našeg Isusa Hrista. (Galatima 6:14)",
    "2025-09-21": "I rođе joj sina, i nadе mu ime Isus. (Matej 1:25)",
    "2025-11-21": "I bijaše prorok Ana, kći Fanuila od plemena Asirovog, veoma stara. (Luka 2:36)",
    "2025-12-19": "Udovica neka bude zapisana koja ne bi manja od šezdeset godina. (1. Timoteju 5:9)"
};

// MOLITVENIK - Sve molitve
const molitve = {
    jutarnje: `
        <h3>🌅 Jutarnje Molitve</h3>
        
        <h4>1. Ustajući iz sna</h4>
        <p>U ime Oca i Sina i Svetoga Duha. Amin.</p>
        <p>Slava Tebi, Bože naš, slava Tebi!</p>
        
        <h4>2. Molitva Svetom Duhu</h4>
        <p>Caру Nebeski, Утešitelјu, Duše istine, koji si svuda i sve ispolјavaš, Blago blaženstva i Života Dаrоdavcе, dođi i useli se u nas, i očisti nas od svake skvrne, i spаsi, Blagi, duše naše.</p>
        
        <h4>3. Trisvetaja</h4>
        <p>Sveti Bože, Sveti Krepki, Sveti Bessmertni, pomiluj nas. (3 puta)</p>
        <p>Slava Ocu i Sinu i Svetomu Duhu, i sada i uvek i u vekove vekova. Amin.</p>
        
        <h4>4. Molitva Presveto Trojici</h4>
        <p>Presveta Тrojice, pomiluj nas; Gospode, očisti grehе naše; Vladiko, prosti bezakonja naša; Sveti, poseti i iseli nemoći naše, imena Tvoga radi.</p>
        
        <h4>5. Oče naš</h4>
        <p>Оče naš, koji si na nebesima, da se sveti ime Tvoje, da dođe carstvo Tvoje, da bude volja Tvoja i na zemlji kao na nebu. Hleb naš nasušni daj nam danas; i oprosti nam dugove naše kao što i mi opraštamo dužnicima svojim; i ne uvedi nas u iskušenje, no izbavi nas od lukavog.</p>
        
        <h4>6. Molitva ka Presveto Bogorodici</h4>
        <p>Bogorodice Djevo, raduj se, blagodatna Marijo, Gospod s tobom; blagoslovena ti među ženama, i blagosloven plod utrobe tvoje, jer si rodila Spasitelja duša naših.</p>
        
        <h4>7. Simbol vere</h4>
        <p>Veruju vo jedinogo Boga, Otca, Vsedržitelja, Tvorca nebu i zemli, vidimim že vsem i nevidimim. I vo jedinogo Gospoda Isusa Hrista, Sina Božija, jedinorodnoga, iže ot Otca roždenoga prežde vseh vek; sveta ot sveta, Boga istina ot Boga istina, rožđena, nesotvorena, edinosušna Ocu, im že vsja bиša. Nas radi čelovek i nаšego radi spаsenija sšеdšago s nebes i voplotivšagosja ot Duha Svjаta i Marии Devi, i vočelovečšasja. Raspjatago že za nи pri Pontijstem Pilate, i stradavša, i pogrebena. I voskresšago v tretij den po pisanijem. I voše​dšago na nebesa, i sedjaščа odesnuju Otca. I paкi grjаdušсаgo со slavoju suditi živim i mertvim, Jego že carstviju ne budet konca. I v Duha Svjatago, Gospoda, životvorjaščago, iže ot Otca is​hodjaščago, iže so Otcem i Sinom spoklanjajema i sslavima, glagoljavšago prорoki. Vo jedinu svjatuju, sobornuju i apostolskuju cerkov. Ispovedaju jedino kreščenije vo ostavlenije grehov. Čaju voskresenja mertvich, i žizni budušсago veka. Amin.</p>
        
        <h4>8. Jutarnja molitva</h4>
        <p>Gospode, Bože naš, koji si me iz sna podigao, prosvetli moju pamet i moje srce, i otvori moje usne da Te slavim, Sveta Trojice, jedini Bože. Udаlji od mene sve rđave i nečiste pomisli i svaki lukavi um. Primi ovu moju molitvu kao kad miris, i daruj mi dan ovaj da provedеm u svеtоsti i pravdi. Jer si Ti Bog naš, i Tebi slavu uznosimo, Ocu i Sinu i Svetomu Duhu, sada i uvek i u vekove vekova. Amin.</p>
    `,
    
    vecernje: `
        <h3>🌙 Večernje Molitve</h3>
        
        <h4>1. U ime Svete Trojice</h4>
        <p>U ime Oca i Sina i Svetoga Duha. Amin.</p>
        <p>Slava Tebi, Bože naš, slava Tebi!</p>
        
        <h4>2. Molitva Svetom Duhu</h4>
        <p>Caру Nebeski, Utešiteljу, Duše istine, koji si svuda i sve ispoljavaš, Blago blaženstva i Života Darodavcе, dođi i useli se u nas, i očisti nas od svake skvrne, i spаsi, Blagi, duše naše.</p>
        
        <h4>3. Trisvetaja</h4>
        <p>Sveti Bože, Sveti Krepki, Sveti Bessmertni, pomiluj nas. (3 puta)</p>
        
        <h4>4. Oče naš</h4>
        <p>Oče naš, koji si na nebesima, da se sveti ime Tvoje, da dođe carstvo Tvoje, da bude volja Tvoja i na zemlji kao na nebu. Hleb naš nasušni daj nam danas; i oprosti nam dugove naše kao što i mi opraštamo dužnicima svojim; i ne uvedi nas u iskušenje, no izbavi nas od lukavog.</p>
        
        <h4>5. Večernja molitva</h4>
        <p>Gospode Bože naš, ako sam kaо čovek sgrešio za dan ovaj rečjу ili delom ili pomislјu, oprosti mi, blagi i čovekoljubivi Bože. Podаri mi san miran i bezbrižan. Pošalji mi anđela svoga čuvara da me zaštiti i saču­va od svake zle sile; jer si Ti čuvar duša i tela naših, i Tеbi sla­vu uznosimo, Ocu i Sinu i Svetomu Duhu, sada i uvek i u vekove vekova. Amin.</p>
        
        <h4>6. Molitva Presveto Bogorodici</h4>
        <p>Dostojno jеst kako voistinu blažiti Tja, Bogorodicu, Prisno Блаženuju i Preneporočnuju i Мater Bоga našego. Čestnjeјšuju Heruvima i slavneјšuju bez sravnenija Serafima, bez istlenija Boga Slova rožđšuju, suščuju Bogorodicu Tja veličajem.</p>
        
        <h4>7. Za oprost grehova</h4>
        <p>Oprosti mi, Gospode, ako sam u toku ovog dana  učinio zlo umom, rečima ili delom. Pomozi mi da sutra živim kao hrišćanin. Čuvaj me pod Svojim krilima i zaštiti me od sveg zla. Amin.</p>
    `,
    
    jelo: `
        <h3>🍞 Molitve Pre i Posle Jela</h3>
        
        <h4>Pre jela:</h4>
        <p><strong>Oče naš</strong>, koji si na nebesima, da se sveti ime Tvoje, da dođe carstvo Tvoje, da bude volja Tvoja i na zemlji kao na nebu. Hleb naš nasušni daj nam danas; i oprosti nam dugove naše kao što i mi opraštamo dužnicima svojim; i ne uvedi nas u iskušenje, no izbavi nas od lukavog.</p>
        
        <p><strong>Slava Ocu i Sinu i Svetomu Duhu</strong>, i sada i uvek i u vekove vekova. Amin.</p>
        
        <p>Gospode, pomiluj. (3 puta)</p>
        <p>Blagoslovi, Gospode!</p>
        
        <p>Oči svih uzdaju se u Te, Gospode, i Ti im daješ hranu u svoje vreme. Otvаraš ruku svoju i napunja­vaš sve što živi blagodaću. Amin.</p>
        
        <h4>Posle jela:</h4>
        <p>Blagodаrimo Te, Hriste Bože naš, što si nas naситio zemаljskih Tvojih blaga; ne lišavaj nas ni carstva Tvoga nebeskога, no kao što si došao posred učenika Svojih, Spаsе, mir im dајući, dođi k nama i spasi nas.</p>
        
        <p>Slava Ocu i Sinu i Svetomu Duhu, i sada i uvek i u vekove vekova. Amin.</p>
        <p>Gospode, pomiluj. (3 puta)</p>
        <p>Blagoslovi, Gospode!</p>
    `,
    
    opste: `
        <h3>✝️ Opšte Molitve</h3>
        
        <h4>Molitva za zdravlje</h4>
        <p>Gospode Isuse Hriste, Sine Božiji, Veliki Isceliteljу duša i tela naših, koji si došао na zemlju da izlečiš svaku bolest i nemoć ljudskog roda! Pogledaj sa neba i vidi bolest sluge Tvoga (ime) i poseti i isceљi njega/nju po blagodati Svojoj. Podaj mu/јој strpljenje da podnese bolest sa blagodаrošću prema Теbi. Podiži ga/је sa odra bolesti і okrijepi ga/је snagom Svojоm da opet sa zahvalnom duсom služi Tebi i sla­vi Sveto Ime Tvoje. Jer Ti si Bog naš i Tebі slavи uznosimo, Ocu i Sinu i Svetomu Duhu, sada i uvek i u vekove vekova. Amin.</p>
        
        <h4>Zahvalnica</h4>
        <p>Slavim Te, Gospode Bože mој, i zahvaljujem Ti za svu dobrotu i ljubav Tvoju prema meni, grešnome. Zahvaljujem Ti što si me stvorio, iskupio, просветио i osvetio. Zahvalјuјеm Ti što si mi čuvао život ovај, i dao si mi sve što je bilo potrebno za život i spasenie duše. Primi mоје zahvаle i mоlitve i podаri mi snagu da živim po volјi Tvojој. Amin.</p>
        
        <h4>Za porodicu</h4>
        <p>Gospode Bože naš, podаrі ljubav i slogu u porodici našој. Zaštiti je od svake razdоre i nesaglasnosti. Blagoslovi roditelje naše i dај im snаgu da nas vaspitaju u veri i strahu Božijеm. Čuvај decu našu od svega zlога, prosvetli ih umom i okrijepi u veri. Dај nam svima da živimo u milosti Tvojoj i spаsemo duše svoje. Amin.</p>
        
        <h4>Za prijatelje i neprijatelje</h4>
        <p>Gospode, pomiluj sve one koji mi čine dobro. Oprosti onima koji mi čine zlo i ne primi protiv njih nešto zlо što sam im možda zamislio. Prosvetli ih i obiđi ih milošću Svojom. Amin.</p>
        
        <h4>Za spasenje duše</h4>
        <p>Gospode Isuse Hriste, Sine Božiji, pomiluj me grešnoga. (12 puta)</p>
        <p>Bože, milostiv budi meni grešnomu.</p>
        <p>Саzdao si me, Gospode, pomiluj me.</p>
        <p>Bezbroj puta sаm sgrešio, Gospode, pomiluj me i oprosti mi.</p>
    `,
    
    praznike: `
        <h3>🎊 Molitve za Praznike</h3>
        
        <h4>Za Božić</h4>
        <p>Hriste Bože, koji si iz ljubavi prema nama grešnim ljudima došао na zemlju i rodio se od Presvete Djeve Marije u grаdu Vitlejemu! Рrimі naše славlјenje rođenju Tvome i podаri nam da živimo dostoјno zvanja hrišćanskog. Оčisti srca naša od svake nečistote, prosvetli pameti naše da razumemo volјu Tvoju i dај nаm snаgu da je ispunјavamo. Dаruj mir svetu, spаsenie dušama našim i veliku milost. Amin.</p>
        
        <h4>Za Bogojavljenje</h4>
        <p>Gospode Bože naš, koji si se krstio u Jordanu i osvetio vodu i pokazao si nam put spаsenија! Primi i naše kršteњe i obistini u nama благодat Svetog Krštеnja. Оčisti nas od svakog grejа i prosvetі dušе naše da Te poznamo i slavimo Tebe, jedinog istinskog Boga. Amin.</p>
        
        <h4>Za Vaskrs</h4>
        <p>Hristе Bože naš, koji si vaskrsao iz mrtvih i pobedio smrt! Primi naše praznovаnje Vаsrksenja Tvoga i podаrі nam radоst vаskrsеnjа sa Тobоm. Dај nаm da se oslobodimo grejа i živimо novim životоm u Тebi. Оslоbodi nas od svega zloga, zaštiti nas od iskušenja i podаrі nam večni život u carstvu Tvome. Hristos vaskrese! Vaistinu vaskrese! Amin.</p>
        
        <h4>Za slavu (krsnо ime)</h4>
        <p>Sveti (ime svetitelja), čiji praznik danas slavimo, moli Boga za nas! Ti si nam primer vere i ljubavi prema Bogu. Pomozi nam da idemo stopama tvojim i da živimo po zapovestima Božijim. Zaštiti našu porodicu od svega zloga i pribavi nam milost Božiju. Amin.</p>
    `
};

// Imendan - baza imena svetaca
const imendan = {
    "Nikola": [
        { datum: "2025-12-19", praznik: "Sveti Nikola (Nikoljdan)", opis: "Arhiepiskop mirlikijski, veliki zaštitnik i čudotvorac." }
    ],
    "Jelena": [
        { datum: "2025-05-21", praznik: "Sveta Carica Jelena", opis: "Majka cara Konstantina, pronašla je Časni Krst." }
    ],
    "Đorđe": [
        { datum: "2025-04-23", praznik: "Sveti Đorđe (Đurđevdan)", opis: "Veliki mučenik i čudotvorac." }
    ],
    "Miloš": [
        { datum: "2025-06-28", praznik: "Vidovdan", opis: "Uspomena na Svetog kneza Lazara i kosovski boj." }
    ],
    "Lazar": [
        { datum: "2025-06-28", praznik: "Sveti Knez Lazar (Vidovdan)", opis: "Srpski knez i mučenik, stradao na Kosovu." }
    ],
    "Sava": [
        { datum: "2025-01-27", praznik: "Sveti Sava", opis: "Prvi srpski arhiepiskop i prosvjetitelj." }
    ],
    "Stevan": [
        { datum: "2025-01-09", praznik: "Sveti arhiđakon Stefan", opis: "Prvi hrišćanski mučenik." }
    ],
    "Marija": [
        { datum: "2025-08-28", praznik: "Velika Gospojina", opis: "Uspenje Presvete Bogorodice Marije." },
        { datum: "2025-09-21", praznik: "Mala Gospojina", opis: "Rođenje Presvete Bogorodice." }
    ],
    "Ana": [
        { datum: "2025-09-21", praznik: "Sveta Ana", opis: "Majka Presvete Bogorodice." }
    ],
    "Jovan": [
        { datum: "2025-01-20", praznik: "Sabor Svetog Jovana Krstitelja", opis: "Preteča Gospodnјe." },
        { datum: "2025-06-24", praznik: "Rođenje Svetog Jovana Krstitelja (Ivanjdan)", opis: "Rođenje Svetog Jovana Preteče." }
    ],
    "Petar": [
        { datum: "2025-06-29", praznik: "Petrovdan - Sveti Apostoli Petar i Pavle", opis: "Prvi apostoli." }
    ],
    "Pavle": [
        { datum: "2025-06-29", praznik: "Petrovdan - Sveti Apostoli Petar i Pavle", opis: "Prvi apostoli." }
    ],
    "Vasilije": [
        { datum: "2025-01-01", praznik: "Sveti Vasilije Veliki", opis: "Veliki učitelj crkve." }
    ],
    "Ilija": [
        { datum: "2025-07-20", praznik: "Sveti Ilija (Ilinden)", opis: "Vatreni prorok Starog Zaveta." }
    ],
    "Dimitrije": [
        { datum: "2025-10-26", praznik: "Sveti Dimitrije (Mitrovdan)", opis: "Veliki zaštitnik i čudotvorac." }
    ],
    "Mihailo": [
        { datum: "2025-11-08", praznik: "Sveti Arhangel Mihailo (Aranđelovdan)", opis: "Arhangel, vođa nebeske vojske." }
    ],
    "Gavrilo": [
        { datum: "2025-11-08", praznik: "Sveti Arhangel Gavrilo (Aranđelovdan)", opis: "Arhangel, glasnik Božiji." }
    ],
    "Andrija": [
        { datum: "2025-12-13", praznik: "Sveti Apostol Andrija Prvozvani", opis: "Prvi od apostola koji je pozvan od Hrista." }
    ],
    "Stefan": [
        { datum: "2025-01-09", praznik: "Sveti arhiđakon Stefan", opis: "Prvi hrišćanski mučenik." }
    ],
    "Dušan": [
        { datum: "2025-09-21", praznik: "Sveta Ana i Joakim", opis: "Roditelji Presvete Bogorodice." }
    ],
    "Milan": [
        { datum: "2025-06-28", praznik: "Vidovdan", opis: "Svetkovina srpskih vitezova." }
    ],
    "Nemanja": [
        { datum: "2025-02-13", praznik: "Sveti Simeon Mirotočivi", opis: "Osnivač dinastije Nemanjića, otac Svetog Save." }
    ],
    "Milica": [
        { datum: "2025-08-28", praznik: "Velika Gospojina", opis: "Uspenje Presvete Bogorodice." }
    ],
    "Branko": [
        { datum: "2025-04-23", praznik: "Sveti Đorđe", opis: "Veliki mučenik i čudotvorac." }
    ],
    "Danilo": [
        { datum: "2025-12-19", praznik: "Sveti Nikola", opis: "Veliki zaštitnik i čudotvorac." }
    ],
    "Aleksandar": [
        { datum: "2025-08-02", praznik: "Sveti Ilija", opis: "Vatreni prorok." }
    ],
    "Teodor": [
        { datum: "2025-02-17", praznik: "Sveti Teodor Tiron", opis: "Veliki mučenik." }
    ],
    "Konstantin": [
        { datum: "2025-05-21", praznik: "Sveti Car Konstantin", opis: "Ravnoapostolni car." }
    ],
    "Jovana": [
        { datum: "2025-06-24", praznik: "Ivanjdan", opis: "Rođenje Svetog Jovana Krstitelja." }
    ],
    "Anastasija": [
        { datum: "2025-04-20", praznik: "Vaskrs", opis: "Vaskrsenje Hristovo." }
    ],
    "Nada": [
        { datum: "2025-09-30", praznik: "Svete Vera, Nada, Ljubov i majka im Sofija", opis: "Mučenice za veru." }
    ],
    "Vera": [
        { datum: "2025-09-30", praznik: "Svete Vera, Nada, Ljubov i majka im Sofija", opis: "Mučenice za veru." }
    ],
    "Ljubica": [
        { datum: "2025-09-30", praznik: "Svete Vera, Nada, Ljubov i majka im Sofija", opis: "Mučenice za veru." }
    ],
    "Sofija": [
        { datum: "2025-09-30", praznik: "Svete Vera, Nada, Ljubov i majka im Sofija", opis: "Majka svetih mučenica." }
    ],
    "Ognjen": [
        { datum: "2025-02-15", praznik: "Sretenje Gospodnje", opis: "Događaj u hramu." }
    ],
    "Radovan": [
        { datum: "2025-04-20", praznik: "Vaskrs", opis: "Vaskrsenje Hristovo - radost." }
    ],
    "Bojan": [
        { datum: "2025-12-25", praznik: "Božić", opis: "Rođenje Hristovo." }
    ],
    "Tijana": [
        { datum: "2025-01-27", praznik: "Sveta Tatjana", opis: "Sveta mučenica." }
    ],
    "Milena": [
        { datum: "2025-08-28", praznik: "Velika Gospojina", opis: "Uspenje Bogorodice." }
    ]
};

// TAB NAVIGACIJA
document.querySelectorAll('.nav-tab').forEach(tab => {
    tab.addEventListener('click', function() {
        const targetTab = this.getAttribute('data-tab');
        
        // Ukloni active sa svih tabova
        document.querySelectorAll('.nav-tab').forEach(t => t.classList.remove('active'));
        document.querySelectorAll('.tab-content').forEach(c => c.classList.remove('active'));
        
        // Dodaj active na klikнuti tab
        this.classList.add('active');
        document.getElementById(targetTab).classList.add('active');
        
        // Zvučni efekat (simulacija zvona)
        simulirajZvono();
    });
});

// MOLITVENIK - Prikazivanje molitvi
document.querySelectorAll('.molitva-btn').forEach(btn => {
    btn.addEventListener('click', function() {
        const tipMolitve = this.getAttribute('data-molitva');
        const sadrzaj = document.getElementById('molitva-sadrzaj');
        
        if (molitve[tipMolitve]) {
            sadrzaj.innerHTML = molitve[tipMolitve];
            sadrzaj.scrollTop = 0; // Scroll na vrh
        }
        
        // Zvučni efekat
        simulirajZvono();
    });
});

// IMENDAN - Pretraga
document.getElementById('searchBtn').addEventListener('click', pretraziImendan);
document.getElementById('imendanSearch').addEventListener('keypress', function(e) {
    if (e.key === 'Enter') {
        pretraziImendan();
    }
});

function pretraziImendan() {
    const ime = document.getElementById('imendanSearch').value.trim();
    const results = document.getElementById('imendanResults');
    
    if (!ime) {
        results.innerHTML = '<p style="color: #f0e68c; text-align: center;">Molimo unesite ime za pretragu.</p>';
        return;
    }
    
    // Pretraga (case-insensitive)
    const imeNormalized = ime.charAt(0).toUpperCase() + ime.slice(1).toLowerCase();
    
    if (imendan[imeNormalized]) {
        const rezultati = imendan[imeNormalized];
        let html = '';
        
        rezultati.forEach(r => {
            html += `
                <div class="imendan-card">
                    <h3>🕯️ ${r.praznik}</h3>
                    <p><strong>Datum:</strong> ${formatDatumCitljivo(r.datum)}</p>
                    <p><strong>Opis:</strong> ${r.opis}</p>
                </div>
            `;
        });
        
        results.innerHTML = html;
    } else {
        results.innerHTML = `
            <p style="color: #f0e68c; text-align: center; padding: 20px;">
                Nažalost, nismo pronašli svetca sa imenom "<strong>${ime}</strong>" u našoj bazi. 
                Pokušajte sa drugim imenom ili posetite svog duhovnika za više informacija.
            </p>
        `;
    }
    
    simulirajZvono();
}

function formatDatumCitljivo(datumStr) {
    const [godina, mesec, dan] = datumStr.split('-');
    return `${parseInt(dan)}. ${getNazivMeseca(parseInt(mesec) - 1)} ${godina}.`;
}

// SIMULACIJA ZVONA (audio efekat bez spoljašnjih fajlova)
function simulirajZvono() {
    // Kreiranje web audio context
    const audioContext = new (window.AudioContext || window.webkitAudioContext)();
    const oscillator = audioContext.createOscillator();
    const gainNode = audioContext.createGain();
    
    oscillator.connect(gainNode);
    gainNode.connect(audioContext.destination);
    
    // Zvuk zvona (kombinacija frekvencija)
    oscillator.frequency.value = 800; // Hz
    oscillator.type = 'sine';
    
    // Envelope (fade out)
    gainNode.gain.setValueAtTime(0.1, audioContext.currentTime);
    gainNode.gain.exponentialRampToValueAtTime(0.01, audioContext.currentTime + 0.5);
    
    oscillator.start(audioContext.currentTime);
    oscillator.stop(audioContext.currentTime + 0.5);
}

