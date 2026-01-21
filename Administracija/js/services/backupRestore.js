// Backup and Restore Manager
class BackupRestoreManager {
    /**
     * Exportuje sve podatke u JSON format
     */
    static async exportAllToJSON() {
        try {
            if (typeof loadingManager !== 'undefined') {
                loadingManager.show('Kreiranje backup-a...');
            }

            const allData = {
                radnici: radnici,
                plate: plate,
                odmori: odmori,
                ostale: ostale,
                korisnici: korisnici.map(k => {
                    // Ne eksportujemo lozinke iz sigurnosnih razloga
                    const { password, ...userWithoutPassword } = k;
                    return userWithoutPassword;
                }),
                poruke: poruke,
                zahteviOdmor: zahteviOdmor,
                zahteviAdmin: zahteviAdmin,
                exportDate: new Date().toISOString(),
                version: '2.0'
            };

            const jsonContent = JSON.stringify(allData, null, 2);
            const blob = new Blob([jsonContent], { type: 'application/json' });
            
            const link = document.createElement('a');
            const url = URL.createObjectURL(blob);
            link.setAttribute('href', url);
            link.setAttribute('download', `backup_${new Date().toISOString().split('T')[0]}.json`);
            link.style.visibility = 'hidden';
            document.body.appendChild(link);
            link.click();
            document.body.removeChild(link);
            
            if (typeof toast !== 'undefined') {
                toast.success('Backup je uspešno preuzet!');
            } else {
                alert('Backup je uspešno preuzet!');
            }
        } catch (error) {
            console.error('Greška pri backup-u:', error);
            if (typeof toast !== 'undefined') {
                toast.error('Greška pri backup-u: ' + error.message);
            } else {
                alert('Greška pri backup-u: ' + error.message);
            }
        } finally {
            if (typeof loadingManager !== 'undefined') {
                loadingManager.hide();
            }
        }
    }

    /**
     * Restore podataka iz JSON fajla
     */
    static async restoreFromJSON(file) {
        return new Promise((resolve, reject) => {
            const reader = new FileReader();
            
            reader.onload = async (e) => {
                try {
                    if (typeof loadingManager !== 'undefined') {
                        loadingManager.show('Restore podataka...');
                    }

                    const jsonData = JSON.parse(e.target.result);
                    
                    // Validacija strukture
                    if (!this.validateBackupStructure(jsonData)) {
                        throw new Error('Neispravan format backup fajla');
                    }

                    // Potvrda od korisnika
                    if (!confirm('OVO ĆE ZAMENITI SVE POSTOJEĆE PODATKE! Da li ste sigurni?')) {
                        if (typeof loadingManager !== 'undefined') {
                            loadingManager.hide();
                        }
                        return;
                    }

                    // Restore svih podataka
                    await this.restoreData(jsonData);
                    
                    // Osveži stranicu
                    if (typeof toast !== 'undefined') {
                        toast.success('Podaci su uspešno restaurirani!');
                    } else {
                        alert('Podaci su uspešno restaurirani!');
                    }
                    
                    setTimeout(() => {
                        location.reload();
                    }, 1000);
                    
                    resolve();
                } catch (error) {
                    console.error('Greška pri restore-u:', error);
                    if (typeof toast !== 'undefined') {
                        toast.error('Greška pri restore-u: ' + error.message);
                    } else {
                        alert('Greška pri restore-u: ' + error.message);
                    }
                    reject(error);
                } finally {
                    if (typeof loadingManager !== 'undefined') {
                        loadingManager.hide();
                    }
                }
            };

            reader.onerror = () => {
                reject(new Error('Greška pri čitanju fajla'));
            };

            reader.readAsText(file);
        });
    }

    /**
     * Validira strukturu backup fajla
     */
    static validateBackupStructure(data) {
        const requiredFields = ['radnici', 'plate', 'odmori', 'ostale', 'korisnici'];
        return requiredFields.every(field => Array.isArray(data[field]));
    }

    /**
     * Restore podataka u bazu
     */
    static async restoreData(data) {
        // Obriši sve postojeće podatke
        await this.clearAllData();

        // Restore radnika
        for (const radnik of data.radnici) {
            await addRadnik(radnik);
        }

        // Restore plata
        for (const plata of data.plate) {
            await addPlata(plata);
        }

        // Restore odmora
        for (const odmor of data.odmori) {
            await addOdmor(odmor);
        }

        // Restore ostalih evidencija
        for (const ostala of data.ostale) {
            await addOstala(ostala);
        }

        // Restore korisnika (bez lozinki - treba ih resetovati)
        for (const korisnik of data.korisnici) {
            // Ako korisnik nema password, postavi default
            if (!korisnik.password) {
                const defaultPassword = korisnik.uloga === 'admin' ? 'admin123' : 'user123';
                if (typeof hashPassword !== 'undefined') {
                    korisnik.password = await hashPassword(defaultPassword);
                } else {
                    korisnik.password = defaultPassword;
                }
            }
            await addKorisnik(korisnik);
        }

        // Restore poruka
        if (data.poruke && Array.isArray(data.poruke)) {
            for (const poruka of data.poruke) {
                await addPoruka(poruka);
            }
        }

        // Restore zahteva za odmor
        if (data.zahteviOdmor && Array.isArray(data.zahteviOdmor)) {
            for (const zahtev of data.zahteviOdmor) {
                await addZahtevOdmor(zahtev);
            }
        }

        // Restore administrativnih zahteva
        if (data.zahteviAdmin && Array.isArray(data.zahteviAdmin)) {
            for (const zahtev of data.zahteviAdmin) {
                await addZahtevAdmin(zahtev);
            }
        }
    }

    /**
     * Briše sve podatke iz baze
     */
    static async clearAllData() {
        // Obriši sve iz svih store-ova
        const allRadnici = await getAllRadnici();
        const allPlate = await getAllPlate();
        const allOdmori = await getAllOdmori();
        const allOstale = await getAllOstale();
        const allKorisnici = await getAllKorisnici();
        const allPoruke = await getAllPoruke();
        const allZahteviOdmor = await getAllZahteviOdmor();
        const allZahteviAdmin = await getAllZahteviAdmin();

        for (const r of allRadnici) await deleteRadnik(r.id);
        for (const p of allPlate) await deletePlata(p.id);
        for (const o of allOdmori) await deleteOdmor(o.id);
        for (const o of allOstale) await deleteOstala(o.id);
        for (const k of allKorisnici) await deleteKorisnik(k.id);
        for (const p of allPoruke) await deletePoruka(p.id);
        for (const z of allZahteviOdmor) await deleteZahtevOdmor(z.id);
        for (const z of allZahteviAdmin) await deleteZahtevAdmin(z.id);
    }
}

// Export
if (typeof module !== 'undefined' && module.exports) {
    module.exports = { BackupRestoreManager };
}

