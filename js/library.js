import { renderSongs } from "./components/ui.js";
import { getSongsForUI, saveUserStatus, playSong, checkLoginStatus, } from "./components/core.js";

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

//check login to display
checkLoginStatus();
//searching bar function
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