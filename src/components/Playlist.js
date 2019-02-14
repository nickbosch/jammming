import React from "react";
import styles from "./Playlist.module.css";
import TrackList from "./TrackList";

const Playlist = ({ name, tracks, onChangeName, onRemoveTrack, onSave }) => {
  return (
    <div className={styles.root}>
      <input className={styles.input} value={name} onChange={onChangeName} />
      <TrackList
        inPlaylist={true}
        tracks={tracks}
        onTrackClick={onRemoveTrack}
      />
      <button className={styles.save} onClick={onSave}>
        SAVE TO SPOTIFY
      </button>
    </div>
  );
};

export default Playlist;
