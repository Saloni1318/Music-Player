const genreFilterArr = [
  'All', 'Punjabi', 'Haryanvi', 'Bollywood'
];

const songsData = [
  {
      id: 1,
      title: "My Queen",
      owner: "KD",
      name: "./music/My_Queen_1.mp3",
      songType: "Haryanvi",
      image: "./images/my queen.jpg"
  },
  {
      id: 2,
      title: "Sohne Lagde",
      owner: "Sidhu MooseWala",
      name: "./music/Sohne_Lagde_1.mp3",
      songType: "Punjabi",
      image: "./images/sohne lagde.jpg"
  },
  {
      id: 3,
      title: "Uljha Jiya",
      owner: "RaghavXTanishk BagchiXAsees Kaur",
      name: "./music/Teri Baaton Mein Aisa Uljha Jiya(PagalWorld.com.sb).mp",
      songType: "Bollywood",
      image: "./images/uljha jiya.jpg"
  },
  {
      id: 4,
      title: "Unchi Haveli",
      owner: "Aditya Kalkal and Renuka Panwar",
      name: "./music/Unchi Haveli.mp3",
      songType: "Bollywood",
      image: "./images/unchi haveli.jpg"
  },
  {
      id: 5,
      title: "Bebe Da Laad",
      owner: "Bunny Johal",
      name: "./music/Bebe_Da_Laad_1.mp3",
      songType: "Punjabi",
      image: "./images/bebe da laad.jpg"
  },
  {
      id: 6,
      title: "Got Commited",
      owner: "DavyXSimar Kaur",
      name: "./music/Got_Committed_1.mp3",
      songType: "Punjabi",
      image: "./images/got committed.jpg"
  },
  {
      id: 7,
      title: "Ve Haniya",
      owner: "DannyXAvvy Sra",
      name: "./music/Ve Haniya(PagalWorld.com.sb).mp3",
      songType: "Bollywood",
      image: "./images/ve haniya.jpg"
  },
 
];

const playListArr = [];

let currentPlaylist = 0;

let currentSelectedSong = songsData[0].id;
let counter = 0;

const genreFilter = document.getElementById('genres');
const songListEle = document.querySelector('.song-list');
const image = document.getElementById('image');
const title = document.getElementById('title');
const owner = document.getElementById('owner');
const audio = document.querySelector('audio');
const songPlayerSource = document.getElementById('song-player-source');
const previous = document.getElementById('previous');
const next = document.getElementById('next');
const toggleThemeBtn = document.getElementById("toggleThemeBtn");
const body = document.querySelector("body");
const createPlaylistForm = document.getElementById("create-playlist");
const submitBtn = document.querySelector(".submit-button");
const addToPlaylistBtn = document.querySelector(".add-to-playlist");
const allPlaylistEle = document.querySelector(".all-playlist");
const currentPlaylistEle = document.querySelector(".current-playlist");

function createOption(value) {
  const option = document.createElement('option');
  option.textContent = value;
  genreFilter.appendChild(option);
}

function addOption() {
  genreFilter.textContent = "";
  genreFilterArr.forEach((genre) => {
      createOption(genre);
  });
  genreFilter.value = genreFilterArr[0];
  showSongs();
}

// display all songs
function showSongs() {
  songListEle.textContent = "";
  const filterValue = genreFilter.value;
  const filteredArr = filterValue != "All" ? songsData.filter((song) => song.songType == filterValue) : [...songsData];
  if(filteredArr.length) {
      filteredArr.forEach((song) => {
          addSong(song);
      });
  }
}

function addSong(song, element) {
  const div = document.createElement('div');
  div.textContent = `${song.title} - ${song.owner}`;
  div.classList.add('song-name');
  songListEle.appendChild(div);
  div.addEventListener('click', () => {
      currentSelectedSong = song.id;
      renderCurrentSong();
  })
}

function searchSongById(id) {
  return songsData.find((song) => song.id == id);
}

// Render current song card
function renderCurrentSong() {
  if(currentSelectedSong) {
      const songObj = searchSongById(currentSelectedSong);
      image.src = songObj.image;
      title.textContent = songObj.title;
      owner.textContent = songObj.owner;

      // create source for audio
      songPlayerSource.src = songObj.name;
      songPlayerSource.type = "audio/mp3";
      audio.currentTime = 0;
      audio.load();
      audio.play();
  }
}

// Go to previous song
function playPrevious() {
  if(counter-1 < 0) {
      previous.disabled = true;
      return;
  }
  counter--;
  next.disabled = false;
  currentSelectedSong = songsData[counter].id;
  renderCurrentSong();
}

// Go to next song
function playNext() {
  if(counter+1 >= songsData.length) {
      next.disabled = true;
      return;
  }
  counter++;
  previous.disabled = false;
  currentSelectedSong = songsData[counter].id;
  renderCurrentSong();
}

function renderPlaylistSong(playlistId) {
  currentPlaylist = playlistId;

  const playlistIndex = findPlaylist();
  if(playlistIndex !== -1) {
      currentPlaylistEle.textContent = "";
      playListArr[playlistIndex].songs.forEach((songObj) => {
          addPlaylistEle(songObj);
      })
  }
}
// Create playlist
function createPlaylist() {
  let playlistInput = document.getElementById("playlist-name");
  if(playlistInput.value) {
      const playlistId = playListArr.length+1;
      playListArr.push({
          id: playlistId,
          name: playlistInput.value,
          songs: []
      });
      
      const div = document.createElement('div');
      div.textContent = playlistInput.value;
      div.classList.add('playlist-name');
      allPlaylistEle.appendChild(div);

      div.addEventListener('click', () => {
          renderPlaylistSong(playlistId);
      });
      createPlaylistForm.reset();
      if(currentPlaylist === 0) {
          currentPlaylist = playlistId;
      }
  }
}

function checkSongExistInPlaylist(playlistIndex) {
  return playListArr[playlistIndex].songs.findIndex((song) => song.id === currentSelectedSong);
}

function findPlaylist() {
  return playListArr.findIndex((playlist) => playlist.id == currentPlaylist);
}

function addPlaylistEle(songObj) {
  const div = document.createElement('div');
  div.textContent = `${songObj.title} - ${songObj.owner}`;
  div.classList.add('current-playlist-song');

  const i = document.createElement('i');
  i.classList.add("fa-solid", "fa-trash");
  div.appendChild(i);

  currentPlaylistEle.appendChild(div);

  // Render song from playlist
  div.addEventListener('click', (event) => {
      event.stopPropagation();
      currentSelectedSong = songObj.id;
      renderCurrentSong();
  })

  // Remove song from playlist
  i.addEventListener('click', (event) => {
      event.stopPropagation();
      div.remove();
  })
}

// Add song to playlist
function addToPlaylist() {
  if(currentPlaylist !== 0) {
      const playlistIndex = findPlaylist();
      if(playlistIndex !== -1 && checkSongExistInPlaylist(playlistIndex) === -1) {
          const songObj = searchSongById(currentSelectedSong);
          playListArr[playlistIndex].songs.push(songObj);
          addPlaylistEle(songObj);
      }
  }
}

// All event listners
genreFilter.addEventListener('change', (event) => {
  event.preventDefault();
  showSongs();
});

previous.addEventListener('click', (event) => {
  event.preventDefault();
  playPrevious();
});

next.addEventListener('click', (event) => {
  event.preventDefault();
  playNext();
});

toggleThemeBtn.addEventListener('click' , (event) => {
  event.preventDefault();
  toggleThemeBtn.dataset.theme = toggleThemeBtn.dataset.theme == "light" ? "dark" : "light";
  const darkThemeBtn = document.getElementById("darkThemeBtn");
  const lightThemeBtn = document.getElementById("lightThemeBtn");
  if(toggleThemeBtn.dataset.theme == "light") {
      darkThemeBtn.style.display = "none";
      lightThemeBtn.style.display = "block";
      body.classList.remove('dark');
  } else {
      darkThemeBtn.style.display = "block";
      lightThemeBtn.style.display = "none";
      body.classList.add('dark');
  }
});

createPlaylistForm.addEventListener('submit', (event) => {
  event.preventDefault();
  createPlaylist();
});

addToPlaylistBtn.addEventListener('click', (event) => {
  event.preventDefault();
  addToPlaylist();
});

addOption();
renderCurrentSong();
audio.pause();

    
  
      
     