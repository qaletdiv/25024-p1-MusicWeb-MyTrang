const mainAudio = document.getElementById('main-audio');
let currentSongId = null;

export function getSongsForUI(allSongs) {
    const currentUser = JSON.parse(localStorage.getItem('currentUser'));
    const favorites = currentUser?.favorites || [];
    return allSongs.map(song => ({
        ...song,
        isFavorite: favorites.includes(String(song.id)) 
    }));
}

export function saveUserStatus(updatedUser) {
    localStorage.setItem('currentUser', JSON.stringify(updatedUser));
    const users = JSON.parse(localStorage.getItem('users')) || [];
    const userIndex = users.findIndex(u => String(u.id) === String(updatedUser.id));
    if (userIndex !== -1) {
        users[userIndex] = updatedUser;
        localStorage.setItem('users', JSON.stringify(users));
    }
}

export function playSong(id) {
    const songsList = JSON.parse(localStorage.getItem('songs')) || [];
    const song = songsList.find(s => String(s.id) === String(id));
    const currentUser = JSON.parse(localStorage.getItem('currentUser'));

    if (song && mainAudio) {
        currentSongId = id;
        const clickedCard = document.querySelector(`.song-card[data-id="${id}"]`);
        if (clickedCard) {
            const parentContainer = clickedCard.parentElement;
            if (parentContainer) {
                const siblingCards = parentContainer.querySelectorAll('.song-card');
                const queueIds = Array.from(siblingCards).map(card => card.dataset.id);
                localStorage.setItem('currentQueue', JSON.stringify(queueIds));
            }
        } else if (!localStorage.getItem('currentQueue')) {
            localStorage.setItem('currentQueue', JSON.stringify(songsList.map(s => String(s.id))));
        }

        document.getElementById('player-cover').src = song.cover;
        document.getElementById('player-cover').style.display = "inline";
        document.getElementById('player-title').innerText = song.title;
        document.getElementById('player-artist').innerText = song.artist;
        document.getElementById('player-bar').style.display = "flex";

        if (song.isPremium && (!currentUser || currentUser.role !== 'premium')) {
            alert("You need to be a premium member to play this song!");
            mainAudio.pause();
            return;
        }

        song.views = (song.views || 0) + 1;
        localStorage.setItem('songs', JSON.stringify(songsList));
        mainAudio.src = song.src;
        mainAudio.play();
        
        let playPauseBtn = document.querySelector(".play-pause-btn");
        if (playPauseBtn) playPauseBtn.innerText = "⏸";
    }
}

function formatTime(seconds) {
    if (isNaN(seconds)) return "0:00";
    const min = Math.floor(seconds / 60);
    const sec = Math.floor(seconds % 60);
    return `${min}:${sec < 10 ? '0' + sec : sec}`;
}

const progressBar = document.getElementById('progress-bar');
const currentTimeEl = document.getElementById('current-time');
const durationTimeEl = document.getElementById('duration-time');
mainAudio?.addEventListener('timeupdate', () => {
    if (mainAudio.duration) {
        const progress = (mainAudio.currentTime / mainAudio.duration) * 100;
        progressBar.value = progress;
        currentTimeEl.innerText = formatTime(mainAudio.currentTime);
        durationTimeEl.innerText = formatTime(mainAudio.duration);
    }
});

progressBar?.addEventListener('input', () => {
    const seekTime = (progressBar.value / 100) * mainAudio.duration;
    mainAudio.currentTime = seekTime;
});

const volumeBar = document.getElementById('volume-bar');

volumeBar?.addEventListener('input', () => {
    mainAudio.volume = volumeBar.value;
});

export function upgradeAccount() {
    window.location.href = 'premium.html';
}

export function checkLoginStatus() {
    const userStr = localStorage.getItem('currentUser');
    const authArea = document.getElementById('auth-area');
    if (!authArea) return;

    if (userStr) {
        const user = JSON.parse(userStr);
        const isPremium = user.role === 'premium';
        authArea.innerHTML = `
            <span>
                <div id="user-place">
                    <a href="profile.html" id="user-name" style="color: white;">${user.username}</a>
                    ${!isPremium ? '<button id="btn-upgrade" class="premium-btn">Upgrade Premium</button>' : '<span id="badge-vip">Premium member</span>'}
                    <button id="btn-logout">Log out</button>
                </div>
            </span>
        `;
        if (!isPremium) document.getElementById('btn-upgrade')?.addEventListener('click', upgradeAccount);
        
        document.getElementById('btn-logout')?.addEventListener('click', () => {
            const currentU = JSON.parse(localStorage.getItem('currentUser'));
            if(currentU) saveUserStatus(currentU);
            
            localStorage.removeItem('currentUser');
            window.location.reload();
        });
    } else {
        authArea.innerHTML = `<a href="login.html" style="color: white;">Log in</a> <a href="register.html" style="color: white;">Register</a>`;
    }
}

if(mainAudio){
    mainAudio.addEventListener('ended', () =>{
        playNextSong();
    });
}
function playNextSong(){
    const songsList = JSON.parse(localStorage.getItem('songs'));
    const queueIds = JSON.parse(localStorage.getItem('currentQueue')) || songsList.map(s => String(s.id));

    const currentSongIndex = queueIds.findIndex(id => String(id) === String(currentSongId));
    let nextIndex = currentSongIndex + 1;
    if(nextIndex >= queueIds.length){
        nextIndex = 0;
    }

    const nextSongId = queueIds[nextIndex];
    if(nextSongId) playSong(nextSongId);
}
function playPreviousSong(){
    const songsList = JSON.parse(localStorage.getItem('songs'));
    const queueIds = JSON.parse(localStorage.getItem('currentQueue')) || songsList.map(s => String(s.id));

    const currentSongIndex = queueIds.findIndex(id => String(id) === String(currentSongId));
    let preIndex = currentSongIndex - 1;
    if(preIndex < 0 ){
        preIndex = queueIds.length - 1;
    }

    const preSongId = queueIds[preIndex];
    if(preSongId) playSong(preSongId);
}

const togglePlayer = document.getElementById('toggle-player');
if(togglePlayer){
    togglePlayer.addEventListener('click', (e)=>{
        let playPauseBtn = document.querySelector(".play-pause-btn");
        if(e.target.classList.contains('previous-btn')){
            e.stopPropagation();
            playPreviousSong();
            return;
        }
        else if(e.target.classList.contains('next-btn')){
            e.stopPropagation();
            playNextSong();
            return;
        }
        else if (e.target.closest('.play-pause-btn')) {
            e.stopPropagation();
            if (!mainAudio.paused) {
                mainAudio.pause();
                playPauseBtn.innerText = "▶";
            } else {
                mainAudio.play();
                playPauseBtn.innerText = "⏸";
            }
        }
    })
}

const globalSearchInput = document.getElementById('search-input');
if (globalSearchInput) {
    globalSearchInput.addEventListener('keypress', (e) => {
        if (e.key === 'Enter') {
            e.preventDefault(); 
            const keyword = globalSearchInput.value.trim();
            if (!window.location.pathname.includes('trending.html')) {
                window.location.href = `trending.html?q=${encodeURIComponent(keyword)}`;
            }
        }
    });
}