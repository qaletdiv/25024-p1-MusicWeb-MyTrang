import { renderSongs } from "./components/ui.js";
import { getSongsForUI, saveUserStatus, playSong, checkLoginStatus, } from "./components/core.js";


const currentUser = JSON.parse(localStorage.getItem('currentUser'));
if (!currentUser) {
    alert("You have to log in first!");
    window.location.href = 'login.html';
}

const allSongs = JSON.parse(localStorage.getItem('songs')) || [];
//get fav songs list
function getFavoriteSongs() {
    const currentUser = JSON.parse(localStorage.getItem('currentUser'));
    const favorites = currentUser?.favorites || [];
    return allSongs.filter(song => favorites.includes(String(song.id)));
}

let favSongsRender = getFavoriteSongs();
//render fav songs
renderSongs(getSongsForUI(favSongsRender));

//play song || toggle the fav heart
let songList = document.getElementById('song-list');

songList.addEventListener('click', (e) => {
    const clickedCard = e.target.closest('.song-card');
    if (e.target.classList.contains('btn-heart')) {
        e.stopPropagation();
        const card = e.target.closest('.song-card');
        const songId = card.dataset.id;
        toggleFavorite(songId);
        return;
    }
    if (e.target.classList.contains('btn-remove-from-pl')) {
        e.stopPropagation();
        const songId = e.target.dataset.songid;
        const plId = e.target.dataset.plid;
        
        if (confirm("Remove this song from playlist?")) {
            removeSongFromPlaylist(songId, plId);
        }
        return;
    }

    if (clickedCard) {
        const songId = clickedCard.dataset.id;
        playSong(songId);
    }
});

function toggleFavorite(id) {
    const currentUser = JSON.parse(localStorage.getItem('currentUser'));

    if (!currentUser) {
        alert("You have to sign in first!"); 
        return;
    }

    if (!currentUser.favorites) currentUser.favorites = [];
    const index = currentUser.favorites.indexOf(id);

    if (index === -1) {
        currentUser.favorites.push(id);
        alert("Added to your library!");
    } else {
        currentUser.favorites.splice(index, 1);
        alert("Removed from your library!"); 
        window.location.reload(); 
    }

    saveUserStatus(currentUser);
    favSongsRender = getFavoriteSongs();
    renderSongs(getSongsForUI(favSongsRender));
}


checkLoginStatus();

const searchInput = document.getElementById('search-input');
if (searchInput) {
    searchInput.addEventListener('input', (e) => {
        const searchTerm = e.target.value.toLowerCase().trim();
        const currentFavs = getFavoriteSongs();
        
        const searchFilter = currentFavs.filter(s =>
            s.title.toLowerCase().includes(searchTerm) ||
            s.artist.toLowerCase().includes(searchTerm)
        );

        renderSongs(getSongsForUI(searchFilter));
    });
}

document.getElementById('btn-create-playlist')?.addEventListener('click', () => {
    const playlistName = prompt("Enter playlist name:");
    if (playlistName) {
        const currentUser = JSON.parse(localStorage.getItem('currentUser'));
        if (!currentUser.playlists) currentUser.playlists = [];
        
        currentUser.playlists.push({
            id: Date.now(),
            name: playlistName,
            songs: []
        });
        
        saveUserStatus(currentUser);
        renderPlaylists(); 
    }
});

function checkDownloadAccess() {
    const user = JSON.parse(localStorage.getItem('currentUser'));
    const downloadList = document.getElementById('download-list');
    
    if (user?.role !== 'premium') {
        downloadList.innerHTML = `<p>Feature only for <a href="premium.html">Premium users</a>.</p>`;
    } else {
        let text = '';
        const downloadedSongs = allSongs.filter(song => currentUser.downloadedSongs.includes(String(song.id)));
        downloadedSongs?.forEach(song => {
            text += `
                <div class="song-card" data-id="${song.id}" style="background-color: rbga(0,0,0, 0.5)!important; display: flex; justify-content: space-around; gap: 10px;">
                    <img class="song-cover" src="${song.cover}" alt="${song.title}" style="width: 10%;">
                    <div class="song-info">
                        <h3><a href="detail.html?id=${song.id}" class="detail-link" style="text-decoration: none;">${song.title}</a></h3>
                        <p>${song.artist}</p> 
                    </div>
            </div>
            `
        });
        downloadList.innerHTML = text;
    }
}
checkDownloadAccess();

function renderPlaylists() {
    const user = JSON.parse(localStorage.getItem('currentUser'));
    const container = document.getElementById('playlist-list');
    if (!container || !user.playlists) return;

    if (user.playlists.length === 0) {
        container.innerHTML = "<p style='color: #888;'>No playlists yet.</p>";
        return;
    }

    let htmlContent = "";
    user.playlists.forEach((pl, index) => {
        htmlContent += `
            <div class="playlist-item" style="background: #282828; padding: 15px; margin-bottom: 10px; border-radius: 8px;">
                <div style="display: flex; justify-content: space-between;">
                    <strong class="playlist-name" data-id="${pl.id}" style="cursor: pointer;">📂 ${pl.name}</strong>
                    <div>
                        <button class="btn-add-music" data-id="${pl.id}">+ Add</button>
                        <button class="btn-delete" data-index="${index}">Delete</button>
                    </div>
                </div>
                <small>${pl.songs.length} songs</small>
            </div>`;
    });
    container.innerHTML = htmlContent;
}
let currentTargetPlaylistId = null;
document.getElementById('playlist-list')?.addEventListener('click', (e) => {
    const user = JSON.parse(localStorage.getItem('currentUser'));
    const plId = e.target.dataset.id;
    const plIndex = e.target.dataset.index;

    if (e.target.classList.contains('playlist-name')) {
        viewPlaylistSongs(plId);
    }

    if (e.target.classList.contains('btn-add-music')) {
        currentTargetPlaylistId = plId;
        openAddSongToPlaylistModal();
    }

    if (e.target.classList.contains('btn-delete')) {
        if (confirm("Are you sure?")) {
            user.playlists.splice(plIndex, 1);
            saveUserStatus(user);
            renderPlaylists();
        }
    }
});

renderPlaylists();

function openAddSongToPlaylistModal() {
    const modal = document.getElementById('add-song-modal');
    const container = document.getElementById('fav-songs-to-add');
    const user = JSON.parse(localStorage.getItem('currentUser'));
    const allSongs = JSON.parse(localStorage.getItem('songs')) || [];
    const favorites = allSongs.filter(s => user.favorites?.includes(String(s.id)));

    if (favorites.length === 0) {
        alert("Your Library is empty! Go like some songs first.");
        return;
    }

    modal.style.display = 'flex';
    container.innerHTML = '';

    favorites.forEach(song => {
        const item = document.createElement('div');
        item.style = "display: flex; justify-content: space-between; padding: 10px; border-bottom: 1px solid #333; align-items: center;";
        item.innerHTML = `
            <div class="song-card" data-id="${song.id}">
                <div class="song-cover">
                    <img src="${song.cover}" alt="${song.title}" style="width: 20%">
                </div>
                <div class="song-info">
                    <h3><a href="detail.html?id=${song.id}" class="detail-link" style="text-decoration: none;">${song.title}</a></h3>
                    <p>${song.artist}</p> 
                </div>
                <button class="confirm-add-btn" data-songid="${song.id}" style="background: #1db954; border: none; padding: 5px 10px; border-radius: 5px; color: white; cursor: pointer;">Add</button>
            </div>     
        `;
        container.appendChild(item);
    });
}

document.getElementById('fav-songs-to-add')?.addEventListener('click', (e) => {
    if (e.target.classList.contains('confirm-add-btn')) {
        const songId = e.target.dataset.songid;
        const user = JSON.parse(localStorage.getItem('currentUser'));
        const playlist = user.playlists.find(p => p.id == currentTargetPlaylistId);
        
        if (playlist && !playlist.songs.includes(songId)) {
            playlist.songs.push(songId);
            saveUserStatus(user);
            alert("Added!");
            renderPlaylists();
        } else {
            alert("This song is already in the playlist!");
        }
    }
});

document.getElementById('close-add-modal')?.addEventListener('click', () => {
    document.getElementById('add-song-modal').style.display = 'none';
});

function viewPlaylistSongs(playlistId) {
    const user = JSON.parse(localStorage.getItem('currentUser'));
    const allSongs = JSON.parse(localStorage.getItem('songs')) || [];
    const playlist = user.playlists.find(p => p.id == playlistId);
    
    if (playlist) {
        const filteredSongs = allSongs.filter(s => playlist.songs.includes(String(s.id)));
        const songListContainer = document.getElementById('song-list');
        const titleEl = document.querySelector('.lib-block h2');
        if (titleEl) {
            titleEl.innerText = `Playlist: ${playlist.name}`;
            document.getElementById('back-to-fav')?.remove();
            let htmlContent = "";
            filteredSongs.forEach(song => {
                htmlContent += `
                    <div class="song-card" data-id="${song.id}" style="position: relative;">
                        <div class="song-cover">
                            <img src="${song.cover}" alt="${song.title}">
                            <button class="btn-remove-from-pl" data-songid="${song.id}" data-plid="${playlistId}" style="position: absolute; top: 5px; right: 5px; background: rgba(231, 76, 60, 0.9); border: none; color: white; border-radius: 50%; width: 25px; height: 25px; cursor: pointer; z-index: 10;">X</button>
                        </div>
                        <div class="song-info">
                            <h3>${song.title}</h3>
                            <p>${song.artist}</p>
                        </div>
                    </div>
                `;
            });
            songListContainer.innerHTML = htmlContent || "<p>No songs in this playlist.</p>";
            const backBtn = document.createElement('button');
            backBtn.id = "back-to-fav";
            backBtn.innerText = "← Back to Favorites";
            backBtn.className = "premium-btn";
            backBtn.style.marginBottom = "10px";
            backBtn.onclick = () => window.location.reload(); 
            titleEl.parentNode.insertBefore(backBtn, titleEl);
        }
    }
}

function removeSongFromPlaylist(songId, playlistId) {
    const user = JSON.parse(localStorage.getItem('currentUser'));
    const playlist = user.playlists.find(p => p.id == playlistId);
    
    if (playlist) {
        playlist.songs = playlist.songs.filter(id => String(id) !== String(songId));
        saveUserStatus(user);
        alert("Removed from playlist!");
        viewPlaylistSongs(playlistId); 
        renderPlaylists();
    }
}