import initialSongs from "./mock-data.js";

const songs = localStorage.getItem('songs');

if (!songs){
    localStorage.setItem('songs', JSON.stringify(initialSongs));
}

if(!localStorage.getItem('users')){
    localStorage.setItem('users', JSON.stringify([]));
}

export const getUsers = () => JSON.parse(localStorage.getItem('users'));
export const saveUsers = (users) => localStorage.setItem('users', JSON.stringify(users));