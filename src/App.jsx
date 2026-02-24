import Player from "./components/Player";
import Playlist from "./components/Playlist";
import allSongs from "./data/allSongs";
import { useState } from "react";


function App() {
  const [toggleShuffle, setToggleShuffle] = useState(false);
  const [togglePlayBtn, setTogglePlayBtn] = useState(true);
  const audio = new Audio();

  let userData = {
    songs: allSongs,
    currentSong: null,
    songCurrentTime: 0,
  };

  const handlePlaySong = async (id) => {
  
    const song = userData?.songs.find((song) => song.id === id);
    audio.src = song.src;
    audio.title = song.title;

    if (userData?.currentSong === null || userData?.currentSong.id !== song.id) {
      audio.currentTime = 0;
    } else {
      audio.currentTime = userData?.songCurrentTime;
    }
    userData.currentSong = song;

    
    highlightCurrentSong();

    setPlayerDisplay();
    setPlayButtonAccessibleText();
    audio.play();
    setTogglePlayBtn(!togglePlayBtn);
  }

  const highlightCurrentSong = () => {
    const playlistSongElements = document.querySelectorAll(".playlist-song");
    const songToHighlight = document.getElementById(
      `song-${userData?.currentSong?.id}`
    );

    playlistSongElements.forEach((songEl) => {
      songEl.removeAttribute("aria-current");
    });

    if (songToHighlight) songToHighlight.setAttribute("aria-current", "true");
  };

  const setPlayerDisplay = () => {
    const playingSong = document.getElementById("player-song-title");
    const songArtist = document.getElementById("player-song-artist");
    const currentTitle = userData?.currentSong?.title;
    const currentArtist = userData?.currentSong?.artist;

    playingSong.textContent = currentTitle ? currentTitle : "";
    songArtist.textContent = currentArtist ? currentArtist : "";
  };

  const setPlayButtonAccessibleText = () => {
    const playButton = document.getElementById("play");
    const song = userData?.currentSong || userData?.songs[0];

    playButton.setAttribute(
      "aria-label",
      song?.title ? `Play ${song.title}` : "Play"
    );
  };

  const handlePlayBtn = async () => {
    if (userData?.currentSong === null) {
      handlePlaySong(userData?.songs[0].id);
    } else {
      handlePlaySong(userData?.currentSong.id);
    }
  }

  const handlePauseBtn  = async () => {
    userData.songCurrentTime = audio.currentTime;
    audio.pause();

    setTogglePlayBtn(!togglePlayBtn);
  };

  const handlePlayNextSong = () => {
    if (userData?.currentSong === null) {
      handlePlaySong(userData?.songs[0].id);
    } else {
      const currentSongIndex = getCurrentSongIndex();
      const nextSong = userData?.songs[currentSongIndex + 1];

      handlePlaySong(nextSong.id);
    }
  };

  const handlePlayPreviousSong = () => {
    if (userData?.currentSong === null) return;
    else {
      const currentSongIndex = getCurrentSongIndex();
      const previousSong = userData?.songs[currentSongIndex - 1];

      handlePlaySong(previousSong.id);
    }
  };

  const handleShuffleBtn = () => {
    userData?.songs.sort(() => Math.random() - 0.5);
    userData.currentSong = null;
    userData.songCurrentTime = 0;

    setToggleShuffle(() => !toggleShuffle);

  };

  const handleDeleteSong = (id) => {
    if (userData?.currentSong?.id === id) {
      userData.currentSong = null;
      userData.songCurrentTime = 0;

      handlePauseBtn();
      setPlayerDisplay();
    }

    userData.songs = userData?.songs.filter((song) => song.id !== id);
    renderSongs(userData?.songs);
    highlightCurrentSong();
    setPlayButtonAccessibleText();

  };

  const getCurrentSongIndex = () => userData?.songs.indexOf(userData?.currentSong);



  return (
    <div className="container">
      <Player
        onPlay={handlePlayBtn}
        onPause={handlePauseBtn}
        onNext={handlePlayNextSong}
        onPrevious={handlePlayPreviousSong}
        onDelete={handleDeleteSong}
        onShuffle={handleShuffleBtn}
        onToggleShuffle={toggleShuffle}
        onTogglePlayBtn={togglePlayBtn}
      />
      <Playlist
        songs={userData.songs}
        onPlay={handlePlaySong} />
    </div>
  )
}

export default App
