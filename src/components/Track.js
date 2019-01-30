import React from 'react';
import styles from './Track.module.css';

const Track = props => {
  return (
    <div className={styles.root}>
      <div className={styles.information}>
        <h3 className={styles.title}>{props.title}</h3>
        <p className={styles.description}>{props.artist} | {props.album}</p>
      </div>
      <button className={styles.action}>{props.inPlaylist ? '-' : '+'}</button>
    </div>
  );
}

export default Track;
