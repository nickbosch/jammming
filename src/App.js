import React, { Component } from "react";
import "normalize.css";
import "./App.css";

import SearchBar from "./components/SearchBar";
import PlaylistBuilder from "./components/PlaylistBuilder";
import SearchResults from "./components/SearchResults";
import Playlist from "./components/Playlist";
import Spotify from "./util/Spotify";

class App extends Component {
  constructor(props) {
    super(props);

    // initialise state
    this.state = {
      searchResults: [],
      playlistName: "New Playlist",
      playlistTracks: []
    };

    // bind methods for correct 'this' keyword
    this.performSearch = this.performSearch.bind(this);
    this.renamePlaylist = this.renamePlaylist.bind(this);
    this.addTrackToPlaylist = this.addTrackToPlaylist.bind(this);
    this.removeTrackFromPlaylist = this.removeTrackFromPlaylist.bind(this);
    this.savePlaylist = this.savePlaylist.bind(this);
  }

  componentDidMount() {
    this.spotify = new Spotify("bfff2dbca69343f6b50e01e542a119c6");
  }

  performSearch(searchTerm) {
    this.spotify.search(searchTerm).then(results => {
      this.setState({ searchResults: results });
    });
  }

  addTrackToPlaylist(trackIndex) {
    this.setState({
      playlistTracks: [
        ...this.state.playlistTracks,
        this.state.searchResults[trackIndex]
      ]
    });
  }

  removeTrackFromPlaylist(trackIndex) {
    let playlistTracks = [...this.state.playlistTracks];
    playlistTracks.splice(trackIndex, 1);
    this.setState({ playlistTracks });
  }

  renamePlaylist(e) {
    this.setState({ playlistName: e.target.value });
  }

  savePlaylist(e) {
    e.preventDefault();
    this.spotify.createPlaylist(
      this.state.playlistName,
      this.state.playlistTracks.map(track => track.uri)
    );
  }

  render() {
    return (
      <div className="app">
        <SearchBar onSearch={this.performSearch} />
        <PlaylistBuilder>
          <SearchResults
            searchResults={this.state.searchResults}
            onAddTrack={this.addTrackToPlaylist}
          />
          <Playlist
            name={this.state.playlistName}
            tracks={this.state.playlistTracks}
            onChangeName={this.renamePlaylist}
            onRemoveTrack={this.removeTrackFromPlaylist}
            onSave={this.savePlaylist}
          />
        </PlaylistBuilder>
      </div>
    );
  }
}

export default App;
