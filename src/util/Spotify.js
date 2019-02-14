class Spotify {
  constructor(clientId) {
    this.storageKeys = {
      storedState: "spotify_auth_state",
      accessToken: "spotify_access_token",
      accessTokenExpiresAt: "spotify_expires_at",
      userId: "spotify_user_id"
    };

    this.clienId = clientId;

    for (let storageKey in this.storageKeys) {
      this[storageKey] = localStorage.getItem(this.storageKeys[storageKey]);
    }

    if (
      !this.accessToken ||
      this.accessTokenExpiresAt < Math.round(Date.now() / 1000)
    ) {
      for (let storageKey in this.storageKeys) {
        if (storageKey !== "storedState") {
          localStorage.removeItem(this.storageKeys[storageKey]);
          this[storageKey] = null;
        }
      }

      let params = this.getHashParams();

      if (params) {
        let storedState = localStorage.getItem(this.storageKeys.storedState);

        if (
          params.access_token &&
          (params.state == null || params.state !== storedState)
        ) {
          alert("There was an error during the authentication");
        } else if (params.access_token && params.expires_in) {
          this.accessToken = params.access_token;
          this.accessTokenExpiresAt =
            Math.round(Date.now() / 1000) + Number.parseInt(params.expires_in);

          localStorage.setItem(this.storageKeys.accessToken, this.accessToken);
          localStorage.setItem(
            this.storageKeys.accessTokenExpiresAt,
            this.accessTokenExpiresAt
          );
          localStorage.removeItem(this.storageKeys.storedState);

          this.getUser().then(user => {
            this.userId = user.id;
            localStorage.setItem(this.storageKeys.userId, this.userId);
          });
        }
      }
    }
  }
  authenticate() {
    if (this.accessToken) return;

    let state = this.generateRandomString(16);
    localStorage.setItem("spotify_auth_state", state);

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
  getUser() {
    return fetch("https://api.spotify.com/v1/me", {
      headers: {
        Authorization: `Bearer ${this.accessToken}`
      }
    })
      .then(
        response => {
          if (response.ok) return response.json();
          console.log(response);
          throw new Error("Request failed!");
        },
        networkError => console.log(networkError.message)
      )
      .then(jsonResponse => {
        return jsonResponse;
      });
  }
  /**
   * Search Spotify for tracks matching a given search term
   * @param  {string} term The search term
   * @return {Array} The search results in an Array of Objects
   */
  search(term) {
    if (!this.accessToken) return this.authenticate();

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
          if (response.ok) return response.json();
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
                artist: track.artists.map(artist => artist.name).join(", "),
                uri: track.uri
              };
            })
          );
        }

        return searchResults;
      });
  }
  createPlaylist(name, tracks) {
    if (!this.accessToken) return this.authenticate();

    return fetch(`https://api.spotify.com/v1/users/${this.userId}/playlists`, {
      method: "POST",
      headers: {
        Authorization: `Bearer ${this.accessToken}`,
        "Content-type": "application/json"
      },
      body: JSON.stringify({
        name,
        public: false,
        description: "Created using Jammming!"
      })
    })
      .then(
        response => {
          if (response.ok) return response.json();
          console.log(response);
          throw new Error("Request failed!");
        },
        networkError => console.log(networkError.message)
      )
      .then(jsonResponse => {
        if (jsonResponse.id) {
          let playlistId = jsonResponse.id;

          return fetch(
            `https://api.spotify.com/v1/playlists/${playlistId}/tracks`,
            {
              method: "POST",
              headers: {
                Authorization: `Bearer ${this.accessToken}`,
                "Content-type": "application/json"
              },
              body: JSON.stringify({
                uris: tracks
              })
            }
          )
            .then(
              response => {
                if (response.ok) return response.json();
                console.log(response);
                throw new Error("Request failed!");
              },
              networkError => console.log(networkError.message)
            )
            .then(jsonResponse => {
              return jsonResponse;
            });
        }
      });
  }
}

export default Spotify;
