import React from 'react';
import styles from './SearchResults.module.css';
import TrackList from './TrackList';

const SearchResults = ({ searchResults, onAddTrack }) => {
  return (
    <div className={styles.root}>
      <h2 className={styles.title}>Search Results</h2>
      {searchResults.length ?
      <TrackList tracks={searchResults} onTrackClick={onAddTrack} /> :
      <span className={styles.notFound}>No tracks found.</span>
      }
    </div>
  );
}

export default SearchResults;
