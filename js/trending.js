import { renderSongs } from "./components/ui.js";
import { getSongsForUI, playSong, saveUserStatus, checkLoginStatus } from "./components/core.js";

checkLoginStatus();
const allSongs = JSON.parse(localStorage.getItem('songs')) || [];
let currentPage = 1;
const limit = 8; 
let currentFilteredList = [];
const urlParams = new URLSearchParams(window.location.search);
const initialQuery = urlParams.get('q');
const searchInput = document.getElementById('search-input');

if (initialQuery && searchInput) {
    searchInput.value = initialQuery;
}

function updateTrending() {
    const country = document.getElementById('filter-country').value;
    const genre = document.getElementById('filter-genre').value;
    const keyword = searchInput ? searchInput.value.toLowerCase().trim() : '';
    let filtered = allSongs.filter(s => {
        const matchCountry = (country === 'all' || s.country === country);
        const matchGenre = (genre === 'all' || s.genre === genre);
        const matchSearch = keyword === '' || 
                            s.title.toLowerCase().includes(keyword) || 
                            s.artist.toLowerCase().includes(keyword);
        return matchCountry && matchGenre && matchSearch;
    });
    filtered.sort((a, b) => (b.views || 0) - (a.views || 0));

    currentFilteredList = filtered;
    const totalPages = Math.ceil(currentFilteredList.length / limit) || 1;
    if (currentPage > totalPages) currentPage = totalPages;

    const start = (currentPage - 1) * limit;
    const end = start + limit;
    const pagedSongs = currentFilteredList.slice(start, end);

    renderSongs(getSongsForUI(pagedSongs), 'song-list');
    
    document.getElementById('page-info').innerText = `Trang ${currentPage} / ${totalPages}`;
    document.getElementById('prev-page').disabled = (currentPage === 1);
    document.getElementById('next-page').disabled = (currentPage === totalPages);

    if (filtered.length === 0) {
        document.getElementById('song-list').innerHTML = `<p style="color: var(--text-gray); grid-column: 1/-1; text-align: center; font-size: 1.2rem; margin-top: 20px;">Không tìm thấy bài hát nào phù hợp!</p>`;
    }
}

document.getElementById('filter-country').addEventListener('change', () => {
    currentPage = 1; updateTrending();
});
document.getElementById('filter-genre').addEventListener('change', () => {
    currentPage = 1; updateTrending();
});

if (searchInput) {
    searchInput.addEventListener('input', () => {
        currentPage = 1;
        updateTrending();
        const newUrl = new URL(window.location);
        if (searchInput.value.trim()) {
            newUrl.searchParams.set('q', searchInput.value.trim());
        } else {
            newUrl.searchParams.delete('q');
        }
        window.history.replaceState({}, '', newUrl);
    });
}

document.getElementById('prev-page').addEventListener('click', () => {
    if (currentPage > 1) {
        currentPage--; updateTrending();
    }
});
document.getElementById('next-page').addEventListener('click', () => {
    const totalPages = Math.ceil(currentFilteredList.length / limit);
    if (currentPage < totalPages) {
        currentPage++; updateTrending();
    }
});

updateTrending();
document.getElementById('song-list').addEventListener('click', (e) => {
    const clickedCard = e.target.closest('.song-card');
    
    if (e.target.classList.contains('btn-heart')) {
        e.stopPropagation();
        toggleFavorite(clickedCard.dataset.id);
        return;
    }
    
    if (e.target.classList.contains('detail-link')) return;
    
    if (clickedCard) {
        playSong(clickedCard.dataset.id);
        setTimeout(() => updateTrending(), 500); 
    }
});

function toggleFavorite(id) {
    const currentUser = JSON.parse(localStorage.getItem('currentUser'));
    if (!currentUser) { alert("You have to sign in first!"); return; }

    if (!currentUser.favorites) currentUser.favorites = [];
    const index = currentUser.favorites.indexOf(id);

    if (index === -1) {
        currentUser.favorites.push(id); alert("Added to your library!");
    } else {
        currentUser.favorites.splice(index, 1); alert("Removed from your library!");
    }

    saveUserStatus(currentUser);
    updateTrending();
}