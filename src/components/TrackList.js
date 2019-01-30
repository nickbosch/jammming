import React from 'react';
import styles from './TrackList.module.css';
import Track from './Track';

const tracks = [
  {
    title: 'Tiny Dancer',
    artist: 'Elton John',
    album: 'Madman Across The Water'
  },
  {
    title: 'Tiny Dancer',
    artist: 'Tim McGraw',
    album: 'Love Story'
  },
  {
    title: 'Tiny Dancer',
    artist: 'Rockabye Baby!',
    album: 'Lullaby Renditions of Elton John'
  },
  {
    title: 'Tiny Dancer',
    artist: 'The White Raven',
    album: 'Tiny Dancer'
  },
  {
    title: 'Tiny Dancer - Live Album Version',
    artist: 'Ben Folds',
    album: 'Ben Folds Live'
  },
];

const TrackList = props => {
  return (
    <div className={styles.root}>
      {tracks.map((track, index) => {
        return <Track key={index} title={track.title} artist={track.artist} album={track.album} inPlaylist={props.inPlaylist} />
      })}
    </div>
  );
};

TrackList.defaultProps = {
  inPlaylist: false
};

export default TrackList;
