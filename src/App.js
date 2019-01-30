import React, { Component } from 'react';
import 'normalize.css';
import './App.css';

import SearchBar from './components/SearchBar';
import PlaylistBuilder from './components/PlaylistBuilder';
import SearchResults from './components/SearchResults';
import Playlist from './components/Playlist';

class App extends Component {
  render() {
    return (
      <div className="app">
        <SearchBar />
        <PlaylistBuilder>
          <SearchResults />
          <Playlist />
        </PlaylistBuilder>
      </div>
    );
  }
}

export default App;
