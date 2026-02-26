import { renderSongs } from "./components/ui.js";
import { getSongsForUI, playSong, saveUserStatus, checkLoginStatus } from "./components/core.js";

checkLoginStatus();
const allSongs = JSON.parse(localStorage.getItem('songs')) || [];
let currentPage = 1;
const limit = 4; 
let currentFilteredList = [];

function updateTrending() {
    const country = document.getElementById('filter-country').value;
    const genre = document.getElementById('filter-genre').value;

    currentFilteredList = allSongs.filter(s => {
        const matchCountry = (country === 'all' || s.country === country);
        const matchGenre = (genre === 'all' || s.genre === genre);
        return matchCountry && matchGenre;
    });

    currentFilteredList.sort((a, b) => (b.views || 0) - (a.views || 0));

    const totalPages = Math.ceil(currentFilteredList.length / limit) || 1;
    if (currentPage > totalPages) currentPage = totalPages;

    const start = (currentPage - 1) * limit;
    const end = start + limit;
    const pagedSongs = currentFilteredList.slice(start, end);

    renderSongs(getSongsForUI(pagedSongs));
    document.getElementById('page-info').innerText = `Trang ${currentPage} / ${totalPages}`;

    document.getElementById('prev-page').disabled = (currentPage === 1);
    document.getElementById('next-page').disabled = (currentPage === totalPages);
}

document.getElementById('filter-country').addEventListener('change', () => {
    currentPage = 1;
    updateTrending();
});
document.getElementById('filter-genre').addEventListener('change', () => {
    currentPage = 1;
    updateTrending();
});

document.getElementById('prev-page').addEventListener('click', () => {
    if (currentPage > 1) {
        currentPage--;
        updateTrending();
    }
});
document.getElementById('next-page').addEventListener('click', () => {
    const totalPages = Math.ceil(currentFilteredList.length / limit);
    if (currentPage < totalPages) {
        currentPage++;
        updateTrending();
    }
});

updateTrending();

document.getElementById('song-list').addEventListener('click', (e) => {
    const card = e.target.closest('.song-card');
    if (card) playSong(card.dataset.id);
});