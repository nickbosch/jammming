import React from 'react';
import styles from './TrackList.module.css';
import Track from './Track';

const TrackList = ({ tracks, inPlaylist }) => {
  return (
    <div className={styles.root}>
      {tracks.map((track, index) => {
        return <Track key={index} title={track.title} artist={track.artist} album={track.album} inPlaylist={inPlaylist} />
      })}
    </div>
  );
};

TrackList.defaultProps = {
  inPlaylist: false,
  tracks: []
};

export default TrackList;
