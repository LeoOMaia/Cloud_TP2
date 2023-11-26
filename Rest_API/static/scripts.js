const url_songs = 'http://10.102.75.219:32196/api/songs';
const url_recommend = 'http://10.102.75.219:32196/api/recommend';

let allSongsList = []; // Initialize as an empty array

// Fetch songs from the API
fetch(url_songs)
  .then(response => {
    if (!response.ok) {
      throw new Error('Network response was not ok');
    }
    return response.json();
  })
  .then(data => {
    if (data && data.songs && Array.isArray(data.songs) && data.songs.length > 0) {
      allSongsList = data.songs;
      console.log('Received songs:', allSongsList);
    } else {
      console.error('Invalid or empty songs data received from the API');
    }
  })
  .catch(error => console.error('Error fetching songs:', error));


let selectedSongs = [];

function populateSongsList(songs, listElement) {
  const songListDiv = document.getElementById(listElement);
  songListDiv.innerHTML = "";

  if (songs && Array.isArray(songs)) {
    const searchValue = document.getElementById("searchInput").value.trim().toLowerCase();

    // Filter songs based on case-insensitive search
    const filteredSongs = songs.filter(song => song.toLowerCase().includes(searchValue));

    filteredSongs.forEach(song => {
      const songOption = document.createElement("div");
      songOption.classList.add("song-option");
      songOption.textContent = song;
      songOption.addEventListener("click", () => {
        if (listElement === "allSongsList") {
          selectSong(song);
        } else {
          removeSong(song);
        }
      });
      songListDiv.appendChild(songOption);
    });
  } else {
    console.error("Invalid or undefined 'songs' data.");
    console.log("Received songs:", songs);
  }
}

function selectSong(song) {
  selectedSongs.push(song);
  populateSongsList(selectedSongs, "selectedSongsList");
  const index = allSongsList.indexOf(song);
  if (index !== -1) {
    allSongsList.splice(index, 1);
    populateSongsList(allSongsList, "allSongsList");
  }
}

function removeSong(song) {
  const index = selectedSongs.indexOf(song);
  if (index !== -1) {
    selectedSongs.splice(index, 1);
    populateSongsList(selectedSongs, "selectedSongsList");
    allSongsList.push(song);
    populateSongsList(allSongsList, "allSongsList");
  }
}

populateSongsList(allSongsList, "allSongsList");

const searchInput = document.getElementById("searchInput");

function searchAndUpdate() {
  const searchValue = searchInput.value.trim().toLowerCase();
  const filteredSongs = allSongsList.filter(song => song.toLowerCase().includes(searchValue));
  populateSongsList(filteredSongs, "allSongsList");
}

// Attach debounced search function to the input
searchInput.addEventListener("input", debounce(searchAndUpdate, 300));

document.getElementById("clearAllBtn").addEventListener("click", () => {
    allSongsList.push(...selectedSongs);
    selectedSongs = [];
    populateSongsList(allSongsList, "allSongsList");
    populateSongsList(selectedSongs, "selectedSongsList");
  });

// Assume you have a container in your HTML for recommendations with ID 'recommendations-container'
const recommendationsContainer = document.querySelector('.recommendations-container');

function displayRecommendations(recommendations) {
  const recommendedList = document.getElementById("recommendedPlaylists");

  // Clear previous recommendations
  recommendedList.innerHTML = "";

  // Display new recommendations
  recommendations.forEach(recommendation => {
      const listItem = document.createElement("li");
      listItem.textContent = recommendation;
      recommendedList.appendChild(listItem);
  });
}

// Event listener for Find Playlist button
document.getElementById("findPlaylistBtn").addEventListener("click", async () => {
  try {
      const response = await fetch(url_recommend, {
          method: 'POST',
          headers: {
              'Content-Type': 'application/json'
          },
          body: JSON.stringify({ songs: selectedSongs })
      });

      if (!response.ok) {
          throw new Error('Network response was not ok');
      }

      const data = await response.json();
      console.log('Recommendations:', data.recommended_playlists);

      // Update the UI with the recommendations
      displayRecommendations(data.recommended_playlists);
  } catch (error) {
      console.error('Error:', error);
  }
});


// Debounce function for search input
function debounce(func, delay) {
  let timeoutId;
  return function () {
    const context = this;
    const args = arguments;
    clearTimeout(timeoutId);
    timeoutId = setTimeout(() => {
      func.apply(context, args);
    }, delay);
  };
}