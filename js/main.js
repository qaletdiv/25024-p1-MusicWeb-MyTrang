import { renderSongs } from "./components/ui.js";
import { getSongsForUI, playSong, saveUserStatus, checkLoginStatus } from "./components/core.js";

//initial init for main - Home page
const rawData = localStorage.getItem('songs');
const listSong = JSON.parse(rawData) || [];
const songsForUI = getSongsForUI(listSong);


//play song - Home page
const popSongs = songsForUI.filter(song => song.genre === 'pop');
renderSongs(popSongs, 'pop-list');

const rockSongs = songsForUI.filter(song => song.genre === 'rock');
renderSongs(rockSongs, 'rock-list');

const vnSongs = songsForUI.filter(song => song.country === 'vn');
renderSongs(vnSongs, 'vn-list');

const homeSection = document.getElementById('home');

homeSection.addEventListener('click', (e) => {
    const clickedCard = e.target.closest('.song-card');
    
    if (e.target.classList.contains('btn-heart')) {
        e.stopPropagation();
        const card = e.target.closest('.song-card');
        const songId = card.dataset.id;
        toggleFavorite(songId);
        return;
    }
    
    if (e.target.classList.contains('detail-link')) {
        return;
    }
    
    if (clickedCard) {
        const songId = clickedCard.dataset.id;
        playSong(songId);
    }
});

//add to library - Fav songs
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
    }

    saveUserStatus(currentUser);
    window.location.reload();
}

checkLoginStatus();

const searchInput = document.getElementById('search-input');
const categoriesWrapper = document.getElementById('categories-wrapper');
const titleSearch = document.getElementById('title-search');

if (searchInput) {
    searchInput.addEventListener('input', (e) => {
        const searchTerm = e.target.value.toLowerCase().trim();

        if (searchTerm === "") {
            categoriesWrapper.style.display = "block";
            titleSearch.style.display = "none";
            document.getElementById('search-results-list').innerHTML = "";
        } else {
            categoriesWrapper.style.display = "none";
            titleSearch.style.display = "block";
            
            const searchFilter = listSong.filter(s =>
                s.title.toLowerCase().includes(searchTerm) ||
                s.artist.toLowerCase().includes(searchTerm)
            );
            renderSongs(getSongsForUI(searchFilter), 'search-results-list');
        }
    });
}