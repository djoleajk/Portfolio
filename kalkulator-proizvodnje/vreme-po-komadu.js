function formatDuration(seconds) {
    // Validacija - ako nije broj, vrati prazan string
    if (isNaN(seconds) || seconds === null || seconds === undefined) {
        return '';
    }
    
    const hours = Math.floor(seconds / 3600);
    const minutes = Math.floor((seconds % 3600) / 60);
    const secs = Math.floor(seconds % 60);

    // Gramatika za sate
    let hourText = '';
    if (hours === 1) {
        hourText = 'сат';
    } else if (hours >= 2 && hours <= 4) {
        hourText = 'сата';
    } else if (hours >= 5) {
        hourText = 'сати';
    }

    if (hours > 0) {
        return `${hours} ${hourText} ${minutes}мин ${secs}сек`;
    } else if (minutes > 0) {
        return `${minutes}мин ${secs}сек`;
    } else {
        return `${secs}сек`;
    }
}

function formatTimePerPiece(seconds) {
    // Validacija - ako nije broj, vrati prazan string
    if (isNaN(seconds) || seconds === null || seconds === undefined) {
        return '';
    }
    
    const hours = Math.floor(seconds / 3600);
    const minutes = Math.floor((seconds % 3600) / 60);
    const secs = Math.round((seconds % 60) * 100) / 100; // Zaokruzivanje na 2 decimale za sekunde

    if (hours > 0) {
        return `${hours}${hourText(hours)} ${minutes}мин ${secs.toFixed(2)}сек`;
    } else if (minutes > 0) {
        return `${minutes}мин ${secs.toFixed(2)}сек`;
    } else {
        return `${secs.toFixed(2)}сек`;
    }
}

function hourText(hours) {
    if (hours === 1) return ' сат';
    if (hours >= 2 && hours <= 4) return ' сата';
    return ' сати';
}

function calculate() {
    const numberOfPiecesInput = document.getElementById('numberOfPieces').value;
    const totalHoursInput = document.getElementById('totalHours').value;
    const totalMinutesInput = document.getElementById('totalMinutes').value;
    const totalSecondsInput = document.getElementById('totalSeconds').value;

    // Validacija unosa
    const numberOfPieces = parseInt(numberOfPiecesInput);
    if (!numberOfPieces || numberOfPieces <= 0 || isNaN(numberOfPieces)) {
        alert('Молимо унесите валидан број комада!');
        return;
    }

    const totalHours = parseInt(totalHoursInput) || 0;
    const totalMinutes = parseInt(totalMinutesInput) || 0;
    const totalSeconds = parseInt(totalSecondsInput) || 0;

    if (totalHours === 0 && totalMinutes === 0 && totalSeconds === 0) {
        alert('Молимо унесите валидно време (најмање минуте или секунде)!');
        return;
    }

    // Pretvori sve u sekunde
    const totalTimeInSeconds = (totalHours * 3600) + (totalMinutes * 60) + totalSeconds;

    // Validacija rezultata
    if (isNaN(totalTimeInSeconds) || totalTimeInSeconds <= 0) {
        alert('Грешка при израчунавању времена! Молимо проверите унете вредности.');
        return;
    }

    // Izračunaj vreme po komadu
    const timePerPieceInSeconds = totalTimeInSeconds / numberOfPieces;
    
    // Validacija rezultata
    if (isNaN(timePerPieceInSeconds) || timePerPieceInSeconds <= 0) {
        alert('Грешка при израчунавању времена по комаду!');
        return;
    }

    // Prikaz rezultata
    document.getElementById('timePerPiece').textContent = formatTimePerPiece(timePerPieceInSeconds);
    document.getElementById('totalPieces').textContent = numberOfPieces + ' ком';
    document.getElementById('totalDuration').textContent = formatDuration(totalTimeInSeconds);

    document.getElementById('results').classList.remove('hidden');

    // Skroluj do rezultata
    setTimeout(() => {
        document.getElementById('results').scrollIntoView({ behavior: 'smooth', block: 'center' });
    }, 100);

    // Sačuvaj u istoriju
    if (typeof historyManager !== 'undefined') {
        historyManager.addCalculation({
            operation: 'Време по Комаду',
            numberOfPieces: numberOfPieces,
            totalDuration: totalTimeInSeconds, // Pošalji broj sekundi, ne formatiran string
            timePerPiece: Math.round(timePerPieceInSeconds * 100) / 100
            // Ne šaljemo startTime i endTime jer nisu relevantni za ovu operaciju
        });
    }
}

document.getElementById('calculateBtn').addEventListener('click', calculate);

// Enter key support
document.getElementById('numberOfPieces').addEventListener('keypress', function(e) {
    if (e.key === 'Enter') {
        document.getElementById('totalHours').focus();
    }
});

document.getElementById('totalHours').addEventListener('keypress', function(e) {
    if (e.key === 'Enter') {
        document.getElementById('totalMinutes').focus();
    }
});

document.getElementById('totalMinutes').addEventListener('keypress', function(e) {
    if (e.key === 'Enter') {
        document.getElementById('totalSeconds').focus();
    }
});

document.getElementById('totalSeconds').addEventListener('keypress', function(e) {
    if (e.key === 'Enter') {
        calculate();
    }
});

