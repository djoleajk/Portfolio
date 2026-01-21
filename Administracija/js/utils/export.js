// Export Utilities
class ExportManager {
    /**
     * Eksportuje tabelu u CSV format
     * @param {Array} data - Podaci za export
     * @param {Array} columns - Kolone za export [{key: 'ime', label: 'Ime'}]
     * @param {string} filename - Ime fajla
     */
    static exportToCSV(data, columns, filename = 'export.csv') {
        if (!data || data.length === 0) {
            if (typeof toast !== 'undefined') {
                toast.warning('Nema podataka za export');
            } else {
                alert('Nema podataka za export');
            }
            return;
        }

        // Kreiraj CSV header
        const headers = columns.map(col => col.label || col.key).join(',');
        
        // Kreiraj CSV redove
        const rows = data.map(item => {
            return columns.map(col => {
                const value = this.getNestedValue(item, col.key);
                // Escape vrednosti koje sadrže zarez ili navodnike
                const stringValue = String(value || '');
                if (stringValue.includes(',') || stringValue.includes('"')) {
                    return `"${stringValue.replace(/"/g, '""')}"`;
                }
                return stringValue;
            }).join(',');
        });

        // Kombinuj header i redove
        const csvContent = [headers, ...rows].join('\n');
        
        // Dodaj BOM za UTF-8 (potrebno za Excel)
        const BOM = '\uFEFF';
        const blob = new Blob([BOM + csvContent], { type: 'text/csv;charset=utf-8;' });
        
        // Kreiraj download link
        const link = document.createElement('a');
        const url = URL.createObjectURL(blob);
        link.setAttribute('href', url);
        link.setAttribute('download', filename);
        link.style.visibility = 'hidden';
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
        
        if (typeof toast !== 'undefined') {
            toast.success(`Fajl ${filename} je uspešno preuzet!`);
        }
    }

    /**
     * Eksportuje radnike u CSV
     */
    static exportRadnici() {
        const columns = [
            { key: 'id', label: 'ID' },
            { key: 'ime', label: 'Ime i Prezime' },
            { key: 'jmbg', label: 'JMBG' },
            { key: 'telefon', label: 'Telefon' },
            { key: 'email', label: 'Email' },
            { key: 'pozicija', label: 'Pozicija' },
            { key: 'datum', label: 'Datum Zaposlenja' }
        ];
        
        const dataToExport = filteredRadnici.length > 0 ? filteredRadnici : radnici;
        const date = new Date().toISOString().split('T')[0];
        this.exportToCSV(dataToExport, columns, `radnici_${date}.csv`);
    }

    /**
     * Eksportuje plate u CSV
     */
    static exportPlate() {
        const columns = [
            { key: 'id', label: 'ID' },
            { key: 'radnikId', label: 'Radnik ID' },
            { key: 'mesec', label: 'Mesec' },
            { key: 'godina', label: 'Godina' },
            { key: 'osnovna', label: 'Osnovna Plata' },
            { key: 'bonusi', label: 'Bonusi' },
            { key: 'ukupno', label: 'Ukupno' }
        ];
        
        this.exportToCSV(plate, columns, `plate_${new Date().toISOString().split('T')[0]}.csv`);
    }

    /**
     * Eksportuje godišnje odmore u CSV
     */
    static exportOdmori() {
        const columns = [
            { key: 'id', label: 'ID' },
            { key: 'radnikId', label: 'Radnik ID' },
            { key: 'pocetak', label: 'Datum Početka' },
            { key: 'zavrsetak', label: 'Datum Završetka' },
            { key: 'status', label: 'Status' }
        ];
        
        this.exportToCSV(odmori, columns, `odmori_${new Date().toISOString().split('T')[0]}.csv`);
    }

    /**
     * Dobija vrednost iz ugnježdenog objekta
     */
    static getNestedValue(obj, path) {
        return path.split('.').reduce((current, prop) => current?.[prop], obj);
    }

    /**
     * Eksportuje sve podatke u JSON format
     */
    static exportAllToJSON() {
        // Koristi BackupRestoreManager ako je dostupan
        if (typeof BackupRestoreManager !== 'undefined') {
            BackupRestoreManager.exportAllToJSON();
        } else {
            // Fallback na originalnu implementaciju
            const allData = {
                radnici: radnici,
                plate: plate,
                odmori: odmori,
                ostale: ostale,
                korisnici: korisnici.map(k => {
                    const { password, ...userWithoutPassword } = k;
                    return userWithoutPassword;
                }),
                poruke: poruke,
                zahteviOdmor: zahteviOdmor,
                zahteviAdmin: zahteviAdmin,
                exportDate: new Date().toISOString()
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
            }
        }
    }
}

// Export
if (typeof module !== 'undefined' && module.exports) {
    module.exports = { ExportManager };
}

