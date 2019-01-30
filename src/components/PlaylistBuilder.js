import React from 'react';
import styles from './PlaylistBuilder.module.css';

const PlaylistBuilder = props => {
  return (
    <div className={styles.root}>
      {props.children}
    </div>
  );
}

export default PlaylistBuilder;
