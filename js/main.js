import { renderSongs } from "./components/ui.js";
import { getSongsForUI, playSong, saveUserStatus, checkLoginStatus } from "./components/core.js";

//initial init for main - Home page
const rawData = localStorage.getItem('songs');
const listSong = JSON.parse(rawData);
renderSongs(getSongsForUI(listSong));


//play song - Home page
let songList = document.getElementById('song-list');

songList.addEventListener('click', (e)=>{
    const clickedCard = e.target.closest('.song-card');
    if(e.target.classList.contains('btn-heart')){
        e.stopPropagation();
        const card = e.target.closest('.song-card');
        const songId = card.dataset.id;
        toggleFavorite(songId);
        return;
    }
    if(e.target.classList.contains('detail-link')){
        return;
    }
    if(clickedCard){
        const songId = clickedCard.dataset.id;
        playSong(songId);
    }
});

//add to library - Fav songs
function toggleFavorite(id){
    const currentUser = JSON.parse(localStorage.getItem('currentUser'));

    if(!currentUser){
        alert("You have to sign in first!");
        return;
    }

    if(!currentUser.favorites) currentUser.favorites = [];

    const index = currentUser.favorites.indexOf(id);

    if(index === -1){
        currentUser.favorites.push(id);
        alert("Added to your library!");
    }
    else{
        currentUser.favorites.splice(index, 1);
        alert("Removed from your library!");
    }

    saveUserStatus(currentUser);
    const rawSongs = JSON.parse(localStorage.getItem('songs'));
    renderSongs(getSongsForUI(rawSongs));

    if (window.location.pathname.includes('library.html')) {
        window.location.reload(); 
    }
}

checkLoginStatus();

const searchInput = document.getElementById('search-input');

if(searchInput){
    searchInput.addEventListener('input', (e)=>{
        const searchTerm = e.target.value.toLowerCase().trim();

        const searchFilter = listSong.filter(s =>
            s.title.toLowerCase().includes(searchTerm) ||
            s.artist.toLowerCase().includes(searchTerm)
        );

        renderSongs(getSongsForUI(searchFilter));
    })
}