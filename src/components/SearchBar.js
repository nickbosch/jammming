import React from 'react';
import styles from './SearchBar.module.css';

const SearchBar = props => {
  return (
    <div className={styles.root}>
      <input className={styles.input} placeholder="Enter A Song Title" />
      <button className={styles.button}>SEARCH</button>
    </div>
  );
}

export default SearchBar;
