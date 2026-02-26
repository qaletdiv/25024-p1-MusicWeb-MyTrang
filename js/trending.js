import { renderSongs } from "./components/ui.js";
import { getSongsForUI, playSong, saveUserStatus, checkLoginStatus } from "./components/core.js";

checkLoginStatus();

function loadTrending(){
    const allSongs = JSON.parse(localStorage.getItem('songs'));
    const sortedSongs = allSongs.sort((a,b) => (b.views || 0) - (a.views || 0));
    const top5 = sortedSongs.slice(0, 5);

    renderSongs(getSongsForUI(top5));
};

loadTrending();

document.getElementById('song-list').addEventListener('click', (e) => {
    if(!e.target.closest('.song-card')) return;

    const songId = e.target.closest('.song-card').dataset.id;
    playSong(songId);
})