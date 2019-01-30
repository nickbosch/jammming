import React from 'react';
import styles from './SearchResults.module.css';
import TrackList from './TrackList';

const SearchResults = props => {
  return (
    <div className={styles.root}>
      <h2 className={styles.title}>Search Results</h2>
      <TrackList />
    </div>
  );
}

export default SearchResults;
