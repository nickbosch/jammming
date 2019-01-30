import React from 'react';
import styles from './SearchBar.module.css';

class SearchBar extends React.Component {

  constructor(props) {
    super(props);
    this.state = {
      searchTerm: ''
    }

    this.handleTermChange = this.handleTermChange.bind(this);
    this.handleSearch = this.handleSearch.bind(this);
    this.handleKeyPress = this.handleKeyPress.bind(this);
  }

  handleTermChange(e) {
    this.setState({ searchTerm: e.target.value });
  }

  handleSearch(e) {
    this.props.onSearch(this.state.searchTerm);
  }

  handleKeyPress(e) {
    if (e.keyCode === 13) {
      this.handleSearch(e);
    }
  }

  render() {
    return (
      <div className={styles.root}>
        <input
          className={styles.input}
          value={this.state.searchTerm}
          placeholder="Enter A Song Title"
          onChange={this.handleTermChange}
          onKeyDown={this.handleKeyPress} />
        <button className={styles.button} onClick={this.handleSearch}>SEARCH</button>
      </div>
    );
  }

}

export default SearchBar;
