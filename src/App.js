import React, { Component } from 'react';
import 'normalize.css';
import './App.css';

import SearchBar from './components/SearchBar';
import PlaylistBuilder from './components/PlaylistBuilder';
import SearchResults from './components/SearchResults';
import Playlist from './components/Playlist';

class App extends Component {
  
  constructor(props) {
    super(props);
    
    // bind methods for correct 'this' keyword
    this.performSearch = this.performSearch.bind(this);
  }

  performSearch(searchTerm) {
    console.log(searchTerm);
  }
  
  render() {
    return (
      <div className="app">
        <SearchBar onSearch={this.performSearch} />
        <PlaylistBuilder>
          <SearchResults />
          <Playlist />
        </PlaylistBuilder>
      </div>
    );
  }
}

export default App;
