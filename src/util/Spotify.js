class Spotify {
  constructor(clientId) {
    this.clienId = clientId;
    this.stateKey = "spotify_auth_state";
    this.accessTokenKey = "spotify_access_token";

    let params = this.getHashParams();

    this.accessToken = params.access_token;
    this.state = params.state;
    this.storedState = localStorage.getItem(this.stateKey);

    if (
      this.accessToken &&
      (this.state == null || this.state !== this.storedState)
    ) {
      alert("There was an error during the authentication");
    } else {
      localStorage.removeItem(this.stateKey);
      if (this.accessToken) {
        console.log(this.accessToken);
      }
    }
  }
  authenticate() {
    if (this.accessToken) return;

    let state = this.generateRandomString(16);
    localStorage.setItem(this.stateKey, state);

    let scope = "playlist-read-private playlist-modify-private";
    let url = "https://accounts.spotify.com/authorize";
    url += "?response_type=token";
    url += "&client_id=" + encodeURIComponent(this.clienId);
    url += "&scope=" + encodeURIComponent(scope);
    url += "&redirect_uri=" + encodeURIComponent(window.location.href);
    url += "&state=" + encodeURIComponent(state);

    window.location = url;
  }
  /**
   * Obtains parameters from the hash of the URL
   * @return Object
   */
  getHashParams() {
    var hashParams = {};
    var e,
      r = /([^&;=]+)=?([^&;]*)/g,
      q = window.location.hash.substring(1);
    while ((e = r.exec(q))) {
      hashParams[e[1]] = decodeURIComponent(e[2]);
    }
    return hashParams;
  }
  /**
   * Generates a random string containing numbers and letters
   * @param  {number} length The length of the string
   * @return {string} The generated string
   */
  generateRandomString(length) {
    var text = "";
    var possible =
      "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";
    for (var i = 0; i < length; i++) {
      text += possible.charAt(Math.floor(Math.random() * possible.length));
    }
    return text;
  }
  /**
   * Search Spotify for tracks matching a given search term
   * @param  {string} term The search term
   * @return {Array} The search results in an Array of Objects
   */
  search(term) {
    return fetch(
      `https://api.spotify.com/v1/search?q=${encodeURIComponent(
        term
      )}&type=track`,
      {
        headers: {
          Authorization: `Bearer ${this.accessToken}`
        }
      }
    )
      .then(
        response => {
          if (response.ok) {
            return response.json();
          }

          console.log(response);
          throw new Error("Request failed!");
        },
        networkError => console.log(networkError.message)
      )
      .then(jsonResponse => {
        let searchResults = [];

        if (jsonResponse.tracks) {
          searchResults.push(
            ...jsonResponse.tracks.items.map(track => {
              return {
                title: track.name,
                album: track.album.name,
                artist: track.artists.map(artist => artist.name).join(", ")
              };
            })
          );
        }

        return searchResults;
      });
  }
}

export default Spotify;
