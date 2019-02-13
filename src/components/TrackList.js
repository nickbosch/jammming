import React from "react";
import styles from "./TrackList.module.css";
import Track from "./Track";

const TrackList = ({ tracks, inPlaylist, onTrackClick }) => {
  return (
    <div className={styles.root}>
      {tracks.map((track, index) => {
        // add index to the track ID to ensure each key is unique when tracks are added to the playlist multiple times
        return (
          <Track
            key={index}
            index={index}
            {...track}
            inPlaylist={inPlaylist}
            onClick={onTrackClick}
          />
        );
      })}
    </div>
  );
};

TrackList.defaultProps = {
  inPlaylist: false,
  tracks: []
};

export default TrackList;
