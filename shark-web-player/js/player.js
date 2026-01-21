document.addEventListener('DOMContentLoaded', function() {
     
    const progress = document.querySelector('.progress');
    const progressBar = document.querySelector('.progress-bar');
    const timer = document.querySelector('.timer');
    const playlist = document.getElementById('playlist');
    
     
    const audioPlayer = new Audio();
    
    // Poboljšanja: Shuffle i Repeat modovi
    let shuffleMode = false;
    let repeatMode = false;
    let originalPlaylistOrder = [];
    
    // Poboljšanja: Error handling - definisaćemo funkcije kasnije
    
    
    const volumeSlider = document.getElementById('volume');
    const volumeIcon = document.querySelector('.volume-icon');
    let lastVolume = 1;

    
    volumeSlider.addEventListener('input', (e) => {
        const value = e.target.value / 100;
        audioPlayer.volume = value;
        updateVolumeIcon(value);
    });

    volumeIcon.addEventListener('click', () => {
        if (audioPlayer.volume > 0) {
            lastVolume = audioPlayer.volume;
            audioPlayer.volume = 0;
            volumeSlider.value = 0;
            volumeIcon.textContent = '🔇';
        } else {
            audioPlayer.volume = lastVolume;
            volumeSlider.value = lastVolume * 100;
            updateVolumeIcon(lastVolume);
        }
    });

    function updateVolumeIcon(value) {
        if (value === 0) volumeIcon.textContent = '🔇';
        else if (value < 0.5) volumeIcon.textContent = '🔉';
        else volumeIcon.textContent = '🔊';
    }
    
     
    const prevBtn = document.getElementById('prev');
    const playPauseBtn = document.getElementById('play-pause');
    const stopBtn = document.getElementById('stop');
    const nextBtn = document.getElementById('next');
    
     
    const footerBtns = document.querySelectorAll('.footer-btn');
    const [addBtn, delBtn, miscBtn, sortBtn, infoBtn] = footerBtns;

     
    let tracks = [];
    let currentTrackIndex = 0;

    // Poboljšanja: localStorage funkcije
    function savePlaylist() {
        try {
            // Sačuvaj samo streamove (audio fajlovi se ne mogu sačuvati u localStorage)
            const playlistData = tracks.filter(track => track.isStream).map(track => ({
                name: track.name,
                url: track.url,
                isStream: true
            }));
            localStorage.setItem('sharkPlayerPlaylist', JSON.stringify(playlistData));
            localStorage.setItem('sharkPlayerCurrentIndex', currentTrackIndex.toString());
        } catch (e) {
            console.warn('Could not save playlist:', e);
        }
    }

    function loadPlaylist() {
        try {
            const saved = localStorage.getItem('sharkPlayerPlaylist');
            if (saved) {
                const playlistData = JSON.parse(saved);
                // Učitaj samo streamove (audio fajlovi se ne mogu sačuvati u localStorage)
                tracks = playlistData.filter(track => track.isStream).map(track => ({
                    name: track.name,
                    url: track.url,
                    isStream: true
                }));
                const savedIndex = localStorage.getItem('sharkPlayerCurrentIndex');
                if (savedIndex && tracks.length > 0) {
                    currentTrackIndex = Math.min(parseInt(savedIndex, 10) || 0, tracks.length - 1);
                }
                if (tracks.length > 0) {
                    refreshPlaylist();
                    return true;
                }
            }
        } catch (e) {
            console.warn('Could not load playlist:', e);
        }
        return false;
    }

     
    const defaultStations = [
        { name: "AS FM", url: "https://asfmonair-masterasfm.radioca.st/stream" },
        { name: "NAXI RADIO", url: "https://naxi128.streaming.rs:9152/;*.mp3" },
        { name: "NOVA S Radio", url: "http://radio.novas.tv/novas.mp3" },
        { name: "PLAY", url: "https://stream.playradio.rs:8443/play.mp3" },
        { name: "HIT FM", url: "https://streaming.hitfm.rs/hit.mp3" },
        { name: "Radio Pingvin", url: "https://uzivo.radiopingvin.com/domaci1" },
        { name: "TDI Radio", url: "https://streaming.tdiradio.com/tdiradio.mp3" },
        { name: "Radio S Cafe", url: "https://stream.radios.rs:9012/;*.mp3" },
        { name: "Radio S XTRA", url: "https://stream.radios.rs:9026/;*.mp3" },
        { name: "NAXI ROCK", url: "https://stream.radios.rs:9032/;*.mp3" },
        { name: "RADIO IN", url: "https://radio3-64ssl.streaming.rs:9212/;*.mp3" },
        { name: "ROCK RADIO", url: "https://edge9.pink.rs/rockstream" },
        { name: "SUPER FM", url: "https://onair.superfm.rs/superfm.mp3" },
        { name: "NAXI 80s", url: "https://naxidigital-80s128ssl.streaming.rs:8042/;*.mp3" },
        { name: "PRVI Radio", url: "https://mastermedia.shoutca.st/proxy/prviradions?mp=/stream" },
        { name: "NAXI HOUSE", url: "https://naxidigital-house128ssl.streaming.rs:8002/;*.mp3" },
        { name: "TDI Domacica", url: "https://streaming.tdiradio.com/domacica.mp3" },
        { name: "NAXI CAFE", url: "https://naxidigital-cafe128ssl.streaming.rs:8022/;*.mp3" },
        { name: "TDI HOUSE", url: "https://streaming.tdiradio.com/houseclassics.mp3" },
        { name: "RED", url: "https://stream.redradio.rs/sid=1" }
    ];

    // Poboljšanja: Funkcija za dodavanje bez čuvanja (koristi se za početno učitavanje)
    function addStreamToPlaylistInitial(name, url) {
        const stream = {
            name: name,
            url: url,
            isStream: true
        };
        tracks.push(stream);
        
        const streamElement = document.createElement('div');
        streamElement.className = 'playlist-item';
        streamElement.innerHTML = `
            <span class="stream-icon">📻</span>
            <span>${name}</span>
        `;
        makeItemSelectable(streamElement);
        streamElement.addEventListener('dblclick', () => {
            currentTrackIndex = tracks.length - 1;
            playTrack(currentTrackIndex);
        });
        playlist.appendChild(streamElement);
    }

    // Poboljšanja: Učitaj playlistu iz localStorage ili učitaj default stanice
    if (!loadPlaylist()) {
        defaultStations.forEach(station => {
            addStreamToPlaylistInitial(station.name, station.url);
        });
        savePlaylist();
    }

     
    playPauseBtn.addEventListener('click', () => {
        const audio = getCurrentAudio();
        if (!audio) return;
        
        if (audio.paused) {
            audio.play();
            playPauseBtn.textContent = '⏸';
        } else {
            audio.pause();
            playPauseBtn.textContent = '▶';
        }
    });

     
    prevBtn.addEventListener('click', () => {
        if (tracks.length === 0) return;
        
        if (shuffleMode && tracks.length > 1) {
            let prevIndex;
            do {
                prevIndex = Math.floor(Math.random() * tracks.length);
            } while (prevIndex === currentTrackIndex && tracks.length > 1);
            currentTrackIndex = prevIndex;
        } else if (currentTrackIndex > 0) {
            currentTrackIndex--;
        } else if (repeatMode) {
            currentTrackIndex = tracks.length - 1;
        } else {
            return;
        }
        playTrack(currentTrackIndex);
    });

     
    nextBtn.addEventListener('click', () => {
        if (tracks.length === 0) return;
        
        if (shuffleMode && tracks.length > 1) {
            let nextIndex;
            do {
                nextIndex = Math.floor(Math.random() * tracks.length);
            } while (nextIndex === currentTrackIndex && tracks.length > 1);
            currentTrackIndex = nextIndex;
        } else {
            currentTrackIndex = (currentTrackIndex + 1) % tracks.length;
        }
        playTrack(currentTrackIndex);
    });

    
    stopBtn.addEventListener('click', () => {
        const audio = getCurrentAudio();
        if (!audio) return;
        audio.pause();
        audio.currentTime = 0;
        playPauseBtn.textContent = '▶';
        
         
        const trackInfo = document.querySelector('.track-info');
        trackInfo.textContent = 'No track playing';
        timer.textContent = '--:--:--';
        progress.style.width = '0%';
    });

     
    const streamDialog = document.getElementById('streamDialog');
    const streamName = document.getElementById('streamName');
    const streamUrl = document.getElementById('streamUrl');
    const addStreamBtn = document.getElementById('addStreamBtn');
    const cancelStreamBtn = document.getElementById('cancelStreamBtn');

     
    addBtn.addEventListener('click', () => {
         
        const existingOptions = document.querySelector('.add-options');
        if (existingOptions) {
            existingOptions.remove();
            return;
        }

        const options = document.createElement('div');
        options.className = 'add-options';
        options.innerHTML = `
            <button id="addFile">Add Audio File</button>
            <button id="addStream">Add Radio Stream</button>
        `;
        
        document.body.appendChild(options);
        
         
        document.addEventListener('click', (e) => {
            if (!options.contains(e.target) && e.target !== addBtn) {
                options.remove();
            }
        });
        
        options.querySelector('#addFile').onclick = () => {
            options.remove();
            addAudioFile();
        };
        
        options.querySelector('#addStream').onclick = () => {
            options.remove();
            showStreamDialog();
        };
    });

    function addAudioFile() {
        const input = document.createElement('input');
        input.type = 'file';
        input.accept = 'audio/*';
        input.multiple = true;
        input.onchange = (e) => {
            Array.from(e.target.files).forEach(file => addTrackToPlaylist(file));
        };
        input.click();
    }

    
    function showStreamDialog() {
        streamDialog.style.display = 'block';
        
        document.addEventListener('click', closeStreamDialogOutside);
    }

    function closeStreamDialogOutside(e) {
        if (!streamDialog.querySelector('.dialog-content').contains(e.target) && 
            !e.target.matches('#addStream')) {
            streamDialog.style.display = 'none';
            document.removeEventListener('click', closeStreamDialogOutside);
        }
    }

    
    addStreamBtn.addEventListener('click', () => {
        const name = streamName.value.trim();
        const url = streamUrl.value.trim();
        
        if (name && url) {
            addStreamToPlaylist(name, url);
            streamDialog.style.display = 'none';
            streamName.value = '';
            streamUrl.value = '';
            document.removeEventListener('click', closeStreamDialogOutside);
        }
    });

    cancelStreamBtn.addEventListener('click', () => {
        streamDialog.style.display = 'none';
        streamName.value = '';
        streamUrl.value = '';
        document.removeEventListener('click', closeStreamDialogOutside);
    });

    function makeItemSelectable(element) {
        let mouseDownTime = 0;
        
        element.addEventListener('mousedown', () => {
            mouseDownTime = Date.now();
        });

        element.addEventListener('mouseup', (e) => {
            const clickDuration = Date.now() - mouseDownTime;
            
           
            if (clickDuration < 200) {
                const index = Array.from(playlist.children).indexOf(element) - 1;
                currentTrackIndex = index;
                playTrack(index);
            }

            
            playlist.querySelectorAll('.playlist-item').forEach(item => {
                item.classList.remove('selected');
            });
            element.classList.add('selected');
        });

        
        element.addEventListener('contextmenu', (e) => {
            e.preventDefault();
            
            
            const existingMenu = document.querySelector('.context-menu');
            if (existingMenu) existingMenu.remove();

            
            const contextMenu = document.createElement('div');
            contextMenu.className = 'context-menu';
            contextMenu.innerHTML = `
                <div class="menu-item" data-action="play">Play</div>
                <div class="menu-item" data-action="stop">Stop</div>
                <div class="menu-item" data-action="delete">Delete</div>
            `;

            
            contextMenu.style.position = 'fixed';
            contextMenu.style.left = `${e.clientX}px`;
            contextMenu.style.top = `${e.clientY}px`;
            document.body.appendChild(contextMenu);

            
            contextMenu.addEventListener('click', (event) => {
                const action = event.target.dataset.action;
                const index = Array.from(playlist.children).indexOf(element) - 1; // Adjust for header

                switch(action) {
                    case 'play':
                        currentTrackIndex = index;
                        playTrack(index);
                        break;
                    case 'stop':
                        if (currentTrackIndex === index) {
                            const audio = getCurrentAudio();
                            if (audio) {
                                audio.pause();
                                audio.currentTime = 0;
                                playPauseBtn.textContent = '▶';
                            }
                        }
                        break;
                    case 'delete':
                        tracks.splice(index, 1);
                        element.remove();
                        savePlaylist(); // Poboljšanje: Sačuvaj playlistu
                        if (currentTrackIndex >= tracks.length) {
                            currentTrackIndex = Math.max(0, tracks.length - 1);
                        }
                        showToast('Obrisano iz playliste', 'info');
                        break;
                }
                contextMenu.remove();
            });

           
            document.addEventListener('click', () => {
                contextMenu.remove();
            }, { once: true });
        });
    }

    
    function addStreamToPlaylist(name, url) {
        const stream = {
            name: name,
            url: url,
            isStream: true
        };
        
        tracks.push(stream);
        savePlaylist(); // Poboljšanje: Sačuvaj playlistu
        
        const streamElement = document.createElement('div');
        streamElement.className = 'playlist-item';
        streamElement.innerHTML = `
            <span class="stream-icon">📻</span>
            <span>${name}</span>
        `;
        makeItemSelectable(streamElement);
        streamElement.addEventListener('dblclick', () => {
            currentTrackIndex = tracks.length - 1;
            playTrack(currentTrackIndex);
        });
        
        playlist.appendChild(streamElement);
        showToast(`Dodato: ${name}`, 'success');
    }

    
    function addTrackToPlaylist(file) {
        const track = {
            name: file.name,
            url: URL.createObjectURL(file),
            isStream: false,
            fileObject: file // Čuvamo referencu za localStorage
        };
        
        tracks.push(track);
        savePlaylist(); // Poboljšanje: Sačuvaj playlistu
        
        const trackElement = document.createElement('div');
        trackElement.className = 'playlist-item';
        trackElement.textContent = track.name;
        makeItemSelectable(trackElement);
        trackElement.addEventListener('dblclick', () => {
            currentTrackIndex = tracks.length - 1;
            playTrack(currentTrackIndex);
        });
        
        playlist.appendChild(trackElement);
        showToast(`Dodato: ${file.name}`, 'success');
    }

    
    function playTrack(index) {
        const track = tracks[index];
        if (!track) return;

        audioPlayer.src = track.url;
        
        
        const trackInfo = document.querySelector('.track-info');
        trackInfo.textContent = track.name;
        
        if (track.isStream) {
            document.querySelector('.bitrate').textContent = 'LIVE';
        } else {
            document.querySelector('.bitrate').textContent = '128 kbps';
        }
        
        // Ukloni postojeći event listener i dodaj novi
        audioPlayer.removeEventListener('timeupdate', updateProgress);
        audioPlayer.addEventListener('timeupdate', () => updateProgress({ target: audioPlayer }));
        audioPlayer.play().catch(err => {
            console.error('Play error:', err);
            showToast('Neuspešna reprodukcija. Proverite dozvole.', 'error');
        });
        playPauseBtn.textContent = '⏸';
        
        
        playlist.querySelectorAll('.playlist-item').forEach(item => {
            item.classList.remove('active');
            item.classList.remove('selected');
        });
        
        
        const playlistItems = Array.from(playlist.children);
        if (playlistItems[index + 1]) { // +1 to account for header
            playlistItems[index + 1].classList.add('active');
        }
    }

    
    delBtn.addEventListener('click', () => {
        const selected = playlist.querySelector('.playlist-item.selected');
        if (selected) {
            const deleteWarning = document.createElement('div');
            deleteWarning.className = 'delete-warning';
            deleteWarning.innerHTML = `
                <div class="warning-content">
                    <div class="warning-header">⚠️ Upozorenje</div>
                    <div class="warning-message">
                        Da li ste sigurni da želite da obrišete:
                        <div class="warning-item">${selected.textContent}</div>
                    </div>
                    <div class="warning-buttons">
                        <button class="warning-btn confirm">Obriši</button>
                        <button class="warning-btn cancel">Odustani</button>
                    </div>
                </div>
            `;
            
            document.body.appendChild(deleteWarning);

            
            deleteWarning.querySelector('.confirm').addEventListener('click', () => {
                const index = Array.from(playlist.children).indexOf(selected);
                if (index !== -1) {
                    tracks.splice(index - 1, 1); // Adjust for playlist header
                    selected.remove();
                    savePlaylist(); // Poboljšanje: Sačuvaj playlistu
                    if (currentTrackIndex >= tracks.length) {
                        currentTrackIndex = Math.max(0, tracks.length - 1);
                    }
                    showToast('Obrisano iz playliste', 'info');
                }
                deleteWarning.remove();
            });

            
            deleteWarning.querySelector('.cancel').addEventListener('click', () => {
                deleteWarning.remove();
            });

            
            document.addEventListener('click', (e) => {
                if (!deleteWarning.querySelector('.warning-content').contains(e.target) && 
                    e.target !== delBtn) {
                    deleteWarning.remove();
                }
            });
        }
    });

    sortBtn.addEventListener('click', () => {
        const existingSortMenu = document.querySelector('.sort-menu');
        if (existingSortMenu) {
            existingSortMenu.remove();
            return;
        }

        const sortMenu = document.createElement('div');
        sortMenu.className = 'sort-menu';
        sortMenu.innerHTML = `
            <div class="sort-option" data-sort="az">A-Z ↓</div>
            <div class="sort-option" data-sort="za">Z-A ↑</div>
            <div class="sort-option" data-sort="recent">Najnovije prvo</div>
            <div class="sort-option ${shuffleMode ? 'active-mode' : ''}" data-sort="shuffle">${shuffleMode ? '✓ ' : ''}Izmešaj</div>
            <div class="sort-option ${repeatMode ? 'active-mode' : ''}" data-sort="repeat">${repeatMode ? '✓ ' : ''}Ponavljaj</div>
        `;

        const buttonRect = sortBtn.getBoundingClientRect();
        sortMenu.style.position = 'absolute';
        sortMenu.style.left = `${buttonRect.left}px`;
        sortMenu.style.top = `${buttonRect.top - sortMenu.scrollHeight - 5}px`;
        document.body.appendChild(sortMenu);

        sortMenu.addEventListener('click', (e) => {
            const option = e.target.dataset.sort;
            if (!option) return;

            const items = Array.from(playlist.querySelectorAll('.playlist-item'));
            let sortedTracks = [...tracks];
            
            switch(option) {
                case 'az':
                    sortedTracks.sort((a, b) => a.name.localeCompare(b.name));
                    break;
                case 'za':
                    sortedTracks.sort((a, b) => b.name.localeCompare(a.name));
                    break;
                case 'recent':
                    sortedTracks.reverse();
                    break;
                case 'shuffle':
                    shuffleMode = !shuffleMode;
                    if (shuffleMode) {
                        showToast('Shuffle mode: ON', 'success');
                    } else {
                        showToast('Shuffle mode: OFF', 'info');
                    }
                    sortMenu.remove();
                    return; // Ne sortiraj, samo promeni mod
                case 'repeat':
                    repeatMode = !repeatMode;
                    if (repeatMode) {
                        showToast('Repeat mode: ON', 'success');
                    } else {
                        showToast('Repeat mode: OFF', 'info');
                    }
                    sortMenu.remove();
                    return; // Ne sortiraj, samo promeni mod
            }

            
            tracks = sortedTracks;
            savePlaylist(); // Poboljšanje: Sačuvaj sortiranu playlistu
            
            
            refreshPlaylist();
            
            sortMenu.remove();
        });

        
        document.addEventListener('click', (e) => {
            if (!sortMenu.contains(e.target) && e.target !== sortBtn) {
                sortMenu.remove();
            }
        });
    });

    miscBtn.addEventListener('click', () => {
        const selected = playlist.querySelector('.playlist-item.selected');
        if (selected) {
            const track = tracks[Array.from(playlist.children).indexOf(selected) - 1];
            const details = document.createElement('div');
            details.className = 'track-details';
            details.innerHTML = `
                <div class="details-header">
                    ${track.isStream ? '📻 Stream Info' : '🎵 Track Info'}
                </div>
                <div class="details-content">
                    <div class="detail-row">
                        <span class="detail-label">Name:</span>
                        <span class="detail-value">${track.name}</span>
                    </div>
                    <div class="detail-row">
                        <span class="detail-label">Type:</span>
                        <span class="detail-value">${track.isStream ? 'Radio Stream' : 'Audio File'}</span>
                    </div>
                    <div class="detail-row">
                        <span class="detail-label">Status:</span>
                        <span class="detail-value ${currentTrackIndex === (Array.from(playlist.children).indexOf(selected) - 1) ? 'status-active' : 'status-inactive'}">
                            ${currentTrackIndex === (Array.from(playlist.children).indexOf(selected) - 1) ? 'Now Playing' : 'Not Playing'}
                        </span>
                    </div>
                    ${track.isStream ? `
                        <div class="detail-row">
                            <span class="detail-label">URL:</span>
                            <span class="detail-value url-value">${track.url}</span>
                        </div>
                    ` : ''}
                </div>
                <div class="details-footer">
                    <button class="play-btn" onclick="this.parentElement.parentElement.remove();">Close</button>
                </div>
            `;
            document.body.appendChild(details);

            
            document.addEventListener('click', (e) => {
                if (!details.contains(e.target) && e.target !== miscBtn) {
                    details.remove();
                }
            });
        }
    });

    infoBtn.addEventListener('click', () => {
        const infoModal = document.createElement('div');
        infoModal.className = 'info-modal';
        infoModal.innerHTML = `
            <div class="info-content">
                <h3>O aplikaciji Shark Web Player</h3>
                <p>Shark Web Player je jednostavan i besplatan online plejer koji vam omogućava da brzo i lako reprodukujete audio sadržaje direktno iz svog internet pregledača.</p>
                <p>Aplikacija je napravljena s ciljem da bude lako dostupna svima.</p>
                <p>
                    🔹 Podrška za više formata<br>
                    🔹 Besplatna i otvorena za korišćenje<br>
                    🔹 Razvijena kao doprinos digitalnoj dostupnosti i zajednici
                </p>
                <p>Shark Web Player je deo šire inicijative za razvoj korisnih, javno dostupnih digitalnih alata.</p>
                <div style="margin: 15px 0; padding: 10px; background: rgba(255,255,255,0.05); border-radius: 5px;">
                    <strong style="color: #0af;">Keyboard Shortcuts:</strong><br>
                    Space - Play/Pause<br>
                    ← → - Previous/Next<br>
                    ↑ ↓ - Volume +/-<br>
                    Esc - Close dialogs
                </div>
                <button class="close-info">Zatvori</button>
            </div>
        `;
        document.body.appendChild(infoModal);
        
        
        const closeBtn = infoModal.querySelector('.close-info');
        closeBtn.addEventListener('click', () => infoModal.remove());
        
        
        infoModal.addEventListener('click', (e) => {
            if (e.target === infoModal) {
                infoModal.remove();
            }
        });
    });

    
    // Poboljšanja: Interaktivni progress bar
    progressBar.addEventListener('click', (e) => {
        const audio = getCurrentAudio();
        if (!audio || !audio.duration || audio.duration === Infinity || isNaN(audio.duration)) return;
        
        const rect = progressBar.getBoundingClientRect();
        const clickX = e.clientX - rect.left;
        const percent = clickX / rect.width;
        audio.currentTime = percent * audio.duration;
        updateProgress({ target: audio });
    });

    progressBar.addEventListener('mousemove', (e) => {
        progressBar.style.cursor = 'pointer';
    });
    
    function updateProgress(e) {
        const audio = e.target;
        const currentTrack = tracks[currentTrackIndex];
        
        // Za streamove prikaži samo trenutno vreme ili LIVE
        if (currentTrack && currentTrack.isStream) {
            if (!audio.duration || audio.duration === Infinity || isNaN(audio.duration)) {
                timer.textContent = 'LIVE';
                return;
            }
            const time = formatTime(audio.currentTime);
            timer.textContent = time;
        } else {
            // Za audio fajlove prikaži trenutno / ukupno vreme
            if (!audio.duration || audio.duration === Infinity || isNaN(audio.duration)) {
                progress.style.width = '0%';
                timer.textContent = '00:00:00';
                return;
            }
            const percent = (audio.currentTime / audio.duration) * 100;
            progress.style.width = percent + '%';
            
            const time = formatTime(audio.currentTime);
            const duration = formatTime(audio.duration);
            timer.textContent = `${time} / ${duration}`;
        }
    }
    
    // Poboljšanja: Autoplay sledećeg
    audioPlayer.addEventListener('ended', () => {
        if (repeatMode && tracks.length > 0) {
            playTrack(currentTrackIndex);
        } else if (shuffleMode && tracks.length > 1) {
            let nextIndex;
            do {
                nextIndex = Math.floor(Math.random() * tracks.length);
            } while (nextIndex === currentTrackIndex && tracks.length > 1);
            currentTrackIndex = nextIndex;
            playTrack(currentTrackIndex);
        } else if (currentTrackIndex < tracks.length - 1) {
            currentTrackIndex++;
            playTrack(currentTrackIndex);
        }
    });

    function formatTime(seconds) {
        const hrs = Math.floor(seconds / 3600);
        const mins = Math.floor((seconds % 3600) / 60);
        const secs = Math.floor(seconds % 60);
        return `${pad(hrs)}:${pad(mins)}:${pad(secs)}`;
    }

    function pad(num) {
        return num.toString().padStart(2, '0');
    }

    function getCurrentAudio() {
        return audioPlayer;
    }

    function refreshPlaylist() {
        playlist.innerHTML = '<div class="playlist-header">Radio stanice</div>';
        tracks.forEach((track, index) => {
            const trackElement = document.createElement('div');
            trackElement.className = 'playlist-item';
            if (track.isStream) {
                trackElement.innerHTML = `
                    <span class="stream-icon">📻</span>
                    <span>${track.name}</span>
                `;
            } else {
                trackElement.textContent = track.name;
            }
            makeItemSelectable(trackElement);
            if (index === currentTrackIndex) {
                trackElement.classList.add('active');
            }
            playlist.appendChild(trackElement);
        });
    }

    // Poboljšanja: Keyboard shortcuts
    document.addEventListener('keydown', (e) => {
        // Ignoriši ako je fokus na input polju
        if (e.target.tagName === 'INPUT') return;
        
        switch(e.code) {
            case 'Space':
                e.preventDefault();
                playPauseBtn.click();
                break;
            case 'ArrowLeft':
                e.preventDefault();
                prevBtn.click();
                break;
            case 'ArrowRight':
                e.preventDefault();
                nextBtn.click();
                break;
            case 'ArrowUp':
                e.preventDefault();
                volumeSlider.value = Math.min(100, parseInt(volumeSlider.value) + 10);
                volumeSlider.dispatchEvent(new Event('input'));
                break;
            case 'ArrowDown':
                e.preventDefault();
                volumeSlider.value = Math.max(0, parseInt(volumeSlider.value) - 10);
                volumeSlider.dispatchEvent(new Event('input'));
                break;
            case 'KeyS':
                if (e.ctrlKey || e.metaKey) {
                    e.preventDefault();
                    sortBtn.click();
                }
                break;
            case 'Escape':
                // Zatvori sve modale
                document.querySelectorAll('.stream-dialog, .info-modal, .delete-warning, .track-details, .sort-menu, .add-options').forEach(el => {
                    if (el.style.display !== 'none') el.remove();
                });
                break;
        }
    });

    // Poboljšanja: Toast notifikacije
    function showToast(message, type = 'info') {
        const toast = document.createElement('div');
        toast.className = `toast toast-${type}`;
        toast.textContent = message;
        document.body.appendChild(toast);
        
        setTimeout(() => {
            toast.classList.add('show');
        }, 10);
        
        setTimeout(() => {
            toast.classList.remove('show');
            setTimeout(() => toast.remove(), 300);
        }, 3000);
    }

    function hideToast() {
        const toasts = document.querySelectorAll('.toast');
        toasts.forEach(toast => {
            toast.classList.remove('show');
            setTimeout(() => toast.remove(), 300);
        });
    }

    // Poboljšanja: Error handling
    audioPlayer.addEventListener('error', (e) => {
        showToast('Greška pri reprodukciji. Proverite URL ili fajl.', 'error');
        console.error('Audio error:', e);
    });
    
    audioPlayer.addEventListener('loadstart', () => {
        // Toast će biti prikazan samo ako treba
    });
    
    audioPlayer.addEventListener('canplay', () => {
        // Audio je spreman za reprodukciju
    });

    // Poboljšanja: Čuvanje trenutne pozicije
    audioPlayer.addEventListener('play', () => {
        savePlaylist();
    });

    audioPlayer.addEventListener('pause', () => {
        savePlaylist();
    });
});
