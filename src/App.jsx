import Player from "./components/Player";
import Playlist from "./components/Playlist";
import allSongs from "./data/allSongs";
import { useState, useRef } from "react";

function App() {
  const audioRef = useRef(new Audio());
  const [isShuffle, setIsShuffle] = useState(false);
  const [isPlaying, setIsPlaying] = useState(false);
  const [userData, setUserData] = useState({
    songs: allSongs,
    currentSong: null,
    songCurrentTime: 0,
  });

  // ================= PLAY SONG =================
  const handlePlaySong = (id) => {
    const song = userData.songs.find((song) => song.id === id);
    if (!song) return;

    audioRef.current.src = song.src;
    audioRef.current.title = song.title;

    if (!userData.currentSong || userData.currentSong.id !== song.id) {
      audioRef.current.currentTime = 0;
    } else {
      audioRef.current.currentTime = userData.songCurrentTime;
    }

    setUserData((prev) => ({
      ...prev,
      currentSong: song,
    }));

    setIsPlaying(true);
    audioRef.current.play();
  };

  // ============== PLAY BUTTON =============
  const handlePlayBtn = () => {
    if (!userData.currentSong) {
      handlePlaySong(userData.songs[0].id);
    } else {
      handlePlaySong(userData.currentSong.id);
    }
  };

  // ================ PAUSE =================
  const handlePauseBtn = () => {
    setUserData((prev) => ({
      ...prev,
      songCurrentTime: audioRef.current.currentTime,
    }));

    audioRef.current.pause();
    setIsPlaying(false);
  };

  // ================= NEXT =================
  const handlePlayNextSong = () => {
    if (!userData.currentSong) {
      handlePlaySong(userData.songs[0].id);
      return;
    }

    const currentIndex = userData.songs.findIndex(
      (song) => song.id === userData.currentSong.id,
    );
    const nextSong = isShuffle
      ? userData.songs[Math.floor(Math.random() * userData.songs.length)]
      : userData.songs[currentIndex + 1];

    if (nextSong) {
      handlePlaySong(nextSong.id);
    }
  };

  // ================= PREVIOUS =================
  const handlePlayPreviousSong = () => {
    if (!userData.currentSong) return;

    const currentIndex = userData.songs.indexOf(userData.currentSong);
    const previousSong = userData?.songs[currentIndex - 1];

    if (previousSong) {
      handlePlaySong(previousSong.id);
    }
  };

  // ================= SHUFFLE =================
  const handleShuffleBtn = () => {
    setIsShuffle((prev) => !prev);
  };

  // ================= DELETE =================
  const handleDeleteSong = (id) => {
    if (userData?.currentSong?.id === id) {
      setUserData((prev) => ({
        ...prev,
        currentSong: null,
        songCurrentTime: 0,
      }));

      handlePauseBtn();
      setPlayerDisplay();
    }

    setUserData((prev) => ({
      ...prev,
      songs: prev.songs.filter((song) => song.id !== id),
    }));

    renderSongs(userData?.songs);
  };

  return (
    <div className="container">
      <Player
        currentSong={userData.currentSong}
        onPlay={handlePlayBtn}
        onPause={handlePauseBtn}
        onNext={handlePlayNextSong}
        onPrevious={handlePlayPreviousSong}
        onShuffle={handleShuffleBtn}
        onToggleShuffle={isShuffle}
        onTogglePlayBtn={isPlaying}
      />
      <Playlist
        songs={userData.songs}
        onPlay={handlePlaySong}
        onDelete={handleDeleteSong}
        currentSong={userData.currentSong}
      />
    </div>
  );
}

export default App;
