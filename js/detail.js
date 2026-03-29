import { playSong, saveUserStatus, checkLoginStatus, getSongsForUI } from './components/core.js';
import { renderSongs } from './components/ui.js';

checkLoginStatus();

const params = new URLSearchParams(window.location.search);
const songId = params.get('id');

const songsList = JSON.parse(localStorage.getItem('songs')) || [];
let currentUser = JSON.parse(localStorage.getItem('currentUser'));

const song = songsList.find(s => s.id == songId);

if (song) {
    document.getElementById('detail-cover').src = song.cover;
    document.getElementById('detail-title').innerText = song.title;
    document.getElementById('detail-artist').innerText = song.artist;
    document.getElementById('detail-album').innerText = song.album || "Single";
    document.getElementById('detail-lyrics').innerText = song.lyrics || "Lyrics are updating...";

    document.getElementById('detail-genre').innerText = song.genre || "N/A";
    document.getElementById('detail-country').innerText = song.country || "N/A";
    document.getElementById('detail-views').innerText = song.views || 0;
    const btnFav = document.getElementById('btn-add-fav');
    let isFav = currentUser?.favorites?.includes(String(song.id));
    
    if (isFav) {
        btnFav.innerText = "❤️ Remove from Library";
        btnFav.style.color = "var(--primary-color)";
        btnFav.style.borderColor = "var(--primary-color)";
    }

    btnFav.addEventListener('click', () => {
        if (!currentUser) {
            alert("You have to log in first!");
            return;
        }
        if (!currentUser.favorites) currentUser.favorites = [];
        
        const index = currentUser.favorites.indexOf(String(song.id));
        if (index === -1) {
            currentUser.favorites.push(String(song.id));
            btnFav.innerText = "❤️ Remove from Library";
            btnFav.style.color = "var(--primary-color)";
            btnFav.style.borderColor = "var(--primary-color)";
            alert("Added to your library!");
        } else {
            currentUser.favorites.splice(index, 1);
            btnFav.innerText = "🤍 Add to Library";
            btnFav.style.color = "white";
            btnFav.style.borderColor = "var(--text-gray)";
            alert("Removed from your library!");
        }
        saveUserStatus(currentUser);
    });
    document.getElementById('btn-play-detail').addEventListener('click', () => {
        playSong(String(song.id));
    });

    document.getElementById('btn-download').onclick = () => {
        if (currentUser?.role === 'premium') {
            alert("Downloading: " + song.title + "...");
            let downloadedSongs = currentUser.downloadedSongs || [];
            if(!downloadedSongs.includes(String(song.id))) {
                downloadedSongs.push(String(song.id));
                currentUser.downloadedSongs = downloadedSongs;
                saveUserStatus(currentUser);
            }
        } else {
            alert("Download feature is only for Premium members!");
            window.location.href = 'premium.html';
        }
    };
    function renderRelatedSongs() {
        const related = songsList.filter(s => 
            String(s.id) !== String(song.id) && 
            (s.genre === song.genre || s.artist === song.artist)
        ).slice(0, 4);

        if (related.length > 0) {
            renderSongs(getSongsForUI(related), 'song-list');
        } else {
            document.getElementById('song-list').innerHTML = "<p style='color: var(--text-gray);'>No related songs found.</p>";
        }
    }
    
    renderRelatedSongs();
    document.getElementById('song-list').addEventListener('click', (e) => {
        const clickedCard = e.target.closest('.song-card');
        
        if (e.target.classList.contains('btn-heart')) {
            e.stopPropagation();
            const songId = clickedCard.dataset.id;
            if (!currentUser) { alert("You have to sign in first!"); return; }
            if (!currentUser.favorites) currentUser.favorites = [];
            const idx = currentUser.favorites.indexOf(String(songId));
            if (idx === -1) {
                currentUser.favorites.push(String(songId)); alert("Added to your library!");
            } else {
                currentUser.favorites.splice(idx, 1); alert("Removed from your library!");
            }
            saveUserStatus(currentUser);
            renderRelatedSongs();
            return;
        }
        
        if (e.target.classList.contains('detail-link')) return;
        
        if (clickedCard) {
            playSong(clickedCard.dataset.id);
        }
    });

} else {
    alert("Song not found!");
    window.location.href = 'index.html';
}

const btnAddToPl = document.getElementById('btn-add-to-pl');
const plModal = document.getElementById('playlist-modal');
const closePlModal = document.getElementById('close-pl-modal');
const plContainer = document.getElementById('user-playlists-container');

if (btnAddToPl) {
    btnAddToPl.addEventListener('click', () => {
        const freshUser = JSON.parse(localStorage.getItem('currentUser'));
        if (!freshUser) {
            alert("You have to log in first!");
            return;
        }
        
        plModal.style.display = 'flex';
        renderPlaylistOptions(freshUser);
    });
}

function renderPlaylistOptions(user) {
    if (!user.playlists || user.playlists.length === 0) {
        plContainer.innerHTML = "<p style='color: var(--text-gray); font-size: 0.9rem; text-align: center;'>You don't have any playlists yet.</p>";
        return;
    }

    let html = "";
    user.playlists.forEach(pl => {
        const isAdded = pl.songs.includes(String(songId));
        html += `
            <div style="display: flex; justify-content: space-between; align-items: center; padding: 8px; background: #282828; border-radius: 5px;">
                <span style="font-size: 0.9rem;">${pl.name}</span>
                <button class="toggle-pl-btn" data-plid="${pl.id}" style="background: ${isAdded ? 'var(--primary-color)' : 'transparent'}; border: 1px solid ${isAdded ? 'var(--primary-color)' : 'var(--text-gray)'}; color: white; padding: 4px 10px; border-radius: 15px; cursor: pointer; font-size: 0.8rem;">
                    ${isAdded ? 'Added' : 'Add'}
                </button>
            </div>
        `;
    });
    plContainer.innerHTML = html;
}

document.getElementById('btn-create-new-pl')?.addEventListener('click', () => {
    const plName = prompt("Enter new playlist name:");
    if (plName) {
        const freshUser = JSON.parse(localStorage.getItem('currentUser'));
        if (!freshUser.playlists) freshUser.playlists = [];
        freshUser.playlists.push({
            id: Date.now(),
            name: plName,
            songs: [String(songId)]
        });
        saveUserStatus(freshUser);
        alert(`Playlist "${plName}" created and song added!`);
        renderPlaylistOptions(freshUser);
    }
});

plContainer?.addEventListener('click', (e) => {
    if (e.target.classList.contains('toggle-pl-btn')) {
        const plId = e.target.dataset.plid;
        const freshUser = JSON.parse(localStorage.getItem('currentUser'));
        const targetPl = freshUser.playlists.find(p => String(p.id) === String(plId));
        
        if (targetPl) {
            const songIndex = targetPl.songs.indexOf(String(songId));
            if (songIndex === -1) {
                targetPl.songs.push(String(songId));
            } else {
                targetPl.songs.splice(songIndex, 1);
            }
            saveUserStatus(freshUser);
            renderPlaylistOptions(freshUser);
        }
    }
});

if (closePlModal) {
    closePlModal.addEventListener('click', () => {
        plModal.style.display = 'none';
    });
}