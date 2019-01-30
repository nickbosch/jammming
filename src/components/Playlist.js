import React from 'react';
import styles from './Playlist.module.css';
import TrackList from './TrackList';

const Playlist = props => {
  return (
    <div className={styles.root}>
      <input className={styles.input} value='New Playlist' />
      <TrackList inPlaylist={true} />
      <button className={styles.save}>SAVE TO SPOTIFY</button>
    </div>
  );
};

export default Playlist;