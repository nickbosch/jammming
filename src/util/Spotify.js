/**
 * NOTES:
 * In general, it would probably be sensible to use a package such as axios and
 * create a helper/wrapper function for all API calls to save repetition (instead
 * of calling fetch direclty each time). However, due to the small number of API
 * endpoints used in this project, I have decided to leave each one in.
 */

/**
 * Base URL for all API calls.
 */
const API_BASE = "https://api.spotify.com/v1";

class Spotify {
  /**
   * Create a new instance of the Spotify class.
   * @param {string} clientId The Client ID token used to connect to the Spotify API.
   */
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
          // check provided state parameter against storedState for security purposes
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
  /**
   * Authenticate with Spotify using the implicit-grant flow
   * @return {null}
   */
  authenticate() {
    if (this.accessToken) return;

    let state = this.generateRandomString(16);
    localStorage.setItem(this.storageKeys.storedState, state);

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
   * @return {Object}
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
   * Retrieve the details of the currently logged-in Spotify user
   * @return {Promise}
   */
  getUser() {
    return fetch(`${API_BASE}/me`, {
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
   * @return {Promise}
   */
  search(term) {
    if (!this.accessToken) {
      this.authenticate();
      return Promise();
    }

    return fetch(
      `${API_BASE}/search?q=${encodeURIComponent(term)}&type=track`,
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
  /**
   * Create a new private playlist for the currently logged-in Spotify user
   * @param  {string} name The name of the playlist
   * @param  {Array} tracks URIs of each track object to be added to the playlist
   * @return {Promise}
   */
  createPlaylist(name, tracks) {
    if (!this.accessToken) {
      this.authenticate();
      return Promise();
    }

    return fetch(`${API_BASE}/users/${this.userId}/playlists`, {
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

          return fetch(`${API_BASE}/playlists/${playlistId}/tracks`, {
            method: "POST",
            headers: {
              Authorization: `Bearer ${this.accessToken}`,
              "Content-type": "application/json"
            },
            body: JSON.stringify({
              uris: tracks
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
              return jsonResponse;
            });
        }
      });
  }
}

export default Spotify;
