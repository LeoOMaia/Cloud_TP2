let allSongsList = [];

let URL = 'http://localhost:32208';

fetch(URL + '/api/songs')
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
    songs.forEach(song => {
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
  let filteredAllSongs = [];
  if (searchValue !== '') {
    filteredAllSongs = allSongsList.filter(song => song.toLowerCase().includes(searchValue));
  }

  populateSongsList(filteredAllSongs, 'allSongsList');
  populateSongsList(selectedSongs, 'selectedSongsList');
}

searchInput.addEventListener("input", debounce(searchAndUpdate, 300));

document.getElementById("clearAllBtn").addEventListener("click", () => {
    allSongsList.push(...selectedSongs);
    selectedSongs = [];
    populateSongsList(allSongsList, "allSongsList");
    populateSongsList(selectedSongs, "selectedSongsList");
  });

const recommendationsContainer = document.querySelector('.recommendations-container');

function displayRecommendations(recommendations) {
  const recommendedList = document.getElementById("recommendedPlaylists");

  recommendedList.innerHTML = "";

  recommendations.forEach(recommendation => {
      const listItem = document.createElement("li");
      listItem.textContent = recommendation;
      recommendedList.appendChild(listItem);
  });
}

function displayNoRecommendationsMessage() {
  const recommendedList = document.getElementById("recommendedPlaylists");
  const noRecommendationsMessage = document.getElementById("noRecommendationsMessage");

  recommendedList.innerHTML = "";
  noRecommendationsMessage.style.display = "block";
}

function hideNoRecommendationsMessage() {
  const noRecommendationsMessage = document.getElementById("noRecommendationsMessage");
  noRecommendationsMessage.style.display = "none";
}


function displayRecommendations(recommendations) {
  const recommendedList = document.getElementById("recommendedPlaylists");

  recommendedList.innerHTML = "";

  recommendations.forEach(recommendation => {
    const listItem = document.createElement("li");
    const songLink = document.createElement("a");
    
    songLink.textContent = recommendation;
    songLink.href = `https://www.google.com/search?q=${encodeURIComponent(recommendation)}+song`;
    songLink.setAttribute("target", "_blank");
    songLink.style.color = "black";
    
    songLink.addEventListener("click", (event) => {
      event.preventDefault();
      window.open(songLink.href, '_blank');
    });
    
    listItem.appendChild(songLink);
    recommendedList.appendChild(listItem);
  });
}

document.getElementById("findPlaylistBtn").addEventListener("click", async () => {
  try {
    const response = await fetch(URL + '/api/recommend', {
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
    const versionElement = document.getElementById("version");
    let modelDateElement = document.getElementById("modelDate");

    const unixTimestamp = data.model_date;

    const date = new Date(unixTimestamp * 1000);
    const formattedDate = date.toLocaleDateString("en-US");


    if (data.version && data.model_date) {
      versionElement.textContent = 'Version: ' + data.version;
      modelDateElement.textContent = 'Model date: ' + formattedDate;
    } else {
      versionElement.textContent = 'Version information not available';
      modelDateElement.textContent = 'Model date information not available';
    }

    console.log('Recommendations:', data.recommended_playlists);

    if (data.recommended_playlists.length > 0) {
      displayRecommendations(data.recommended_playlists);
      hideNoRecommendationsMessage();
    } else {
      displayNoRecommendationsMessage();
    }
  } catch (error) {
    console.error('Error:', error);
  }
});

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