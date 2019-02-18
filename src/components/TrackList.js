import React from "react";
import styles from "./TrackList.module.css";
import Track from "./Track";

const TrackList = ({ tracks, inPlaylist, onTrackClick }) => {
  return (
    <div className={styles.root}>
      {tracks.map((track, index) => {
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
