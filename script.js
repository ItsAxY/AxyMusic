document.addEventListener("DOMContentLoaded", async () => {
    const playlist = document.getElementById("playlist");
    const audio = document.getElementById("audio");
    const playButton = document.getElementById("play");
    const nextButton = document.getElementById("next");
    const prevButton = document.getElementById("prev");
    const shuffleButton = document.getElementById("shuffle");

    let songs = [];
    let currentIndex = 0;
    let isShuffle = false;

    // Fetch song list from the server
    async function fetchSongs() {
        try {
            const response = await fetch("songs.php");
            songs = await response.json();
            renderPlaylist();
        } catch (error) {
            console.error("Error fetching songs:", error);
        }
    }

    function renderPlaylist() {
        playlist.innerHTML = "";
        songs.forEach((song, index) => {
            const li = document.createElement("li");
            li.textContent = song;
            li.addEventListener("click", () => playSong(index));
            playlist.appendChild(li);
        });
    }

    function playSong(index) {
        currentIndex = index;
        audio.src = `music/${songs[currentIndex]}`;
        audio.play();
    }

    playButton.addEventListener("click", () => {
        if (audio.paused) {
            audio.play();
            playButton.textContent = "⏸ Pause";
        } else {
            audio.pause();
            playButton.textContent = "▶ Play";
        }
    });

    nextButton.addEventListener("click", () => {
        currentIndex = (currentIndex + 1) % songs.length;
        playSong(currentIndex);
    });

    prevButton.addEventListener("click", () => {
        currentIndex = (currentIndex - 1 + songs.length) % songs.length;
        playSong(currentIndex);
    });

    shuffleButton.addEventListener("click", () => {
        isShuffle = !isShuffle;
        if (isShuffle) {
            songs = songs.sort(() => Math.random() - 0.5);
        } else {
            songs.sort();
        }
        renderPlaylist();
    });

    audio.addEventListener("ended", () => {
        nextButton.click();
    });

    await fetchSongs();
});
