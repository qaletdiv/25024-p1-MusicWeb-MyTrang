export function renderSongs(listSong, containerId = 'song-list') {
    const songListContainer = document.getElementById(containerId);
    
    if (!songListContainer) return; 

    let htmlContent = "";
    listSong.forEach(song => {
        htmlContent += `
            <div class="song-card" data-id="${song.id}">
                <div class="song-cover">
                    <img src="${song.cover}" alt="${song.title}">
                    <button class="btn-play-mini">▶</button>
                    <button class="btn-heart">
                        ${song.isFavorite ? "❤️" : "🤍"}
                    </button>
                </div>
                <div class="song-info">
                    <h3><a href="detail.html?id=${song.id}" class="detail-link" style="text-decoration: none;">${song.title}</a></h3>
                    <p>${song.artist}</p> 
                </div>
            </div>
        `
    });
    songListContainer.innerHTML = htmlContent;
}