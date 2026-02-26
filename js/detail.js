import { playSong, saveUserStatus } from './components/core.js';

const params = new URLSearchParams(window.location.search);
const songId = params.get('id');

const songsList = JSON.parse(localStorage.getItem('songs')) || [];
const currentUser = JSON.parse(localStorage.getItem('currentUser'));

const song = songsList.find(s => s.id == songId);

if (song) {
    document.getElementById('detail-cover').src = song.cover;
    document.getElementById('detail-title').innerText = song.title;
    document.getElementById('detail-artist').innerText = song.artist;
    document.getElementById('detail-album').innerText = song.album || "Single";
    document.getElementById('detail-lyrics').innerText = song.lyrics || "Lyrics are updating...";

    document.getElementById('btn-play-detail').addEventListener('click', () => {
        playSong(String(song.id));
    }) ;

    document.getElementById('btn-download').onclick = () => {
        if (currentUser?.role === 'premium') {
            alert("Downloading: " + song.title + "...");
            let downloadedSongs = currentUser.downloadedSongs || [];
            downloadedSongs.push(String(song.id));
            currentUser.downloadedSongs = downloadedSongs;
            saveUserStatus(currentUser);
        } else {
            alert("Download feature is only for Premium members!");
            window.location.href = 'premium.html';
        }
    };
} else {
    alert("Song not found!");
    window.location.href = 'index.html';
}