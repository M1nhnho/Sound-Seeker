const mongoose = require("mongoose");
const connect = require("../database/connection.js");
const User = require("../mongoose-models/user.js");
const SpotifyWebApi = require('spotify-web-api-node');
const spotifyApi = new SpotifyWebApi({
  clientId: process.env.CLIENT_ID,
  clientSecret: process.env.CLIENT_SECRET,
  redirectUri: process.env.REDIRECT_URI
});

// async function getFirstTokenData(code) {
//   const postBody = `grant_type=authorization_code&code=${code}&redirect_uri=${redirectUri}`;
//   return axios
//     .post("https://accounts.spotify.com/api/token", postBody, {
//       headers: {
//         Authorization:
//           "Basic " +
//           new Buffer.from(clientId + ":" + clientSecret).toString("base64"),
//         "Content-Type": "application/x-www-form-urlencoded",
//       },
//     })
//     .then(({ data }) => {
//       return data;
//     });
// }

// async function getRefreshTokenData() {
//   const postBody = `grant_type=refresh_token&refresh_token=${refresh_token}`;
//   return axios
//     .post("https://accounts.spotify.com/api/token", postBody, {
//       headers: {
//         Authorization:
//           "Basic " +
//           new Buffer.from(clientId + ":" + clientSecret).toString("base64"),
//         "Content-Type": "application/x-www-form-urlencoded",
//       },
//     })
//     .then(({ data }) => {
//       return data;
//     });
// }

// async function getUserDetails(access_token) {
//   return axios
//     .get("https://api.spotify.com/v1/me", {
//       headers: {
//         Authorization: "Bearer " + access_token,
//       },
//     })
//     .then(({ data }) => {
//       console.log(data);
//       return data.id;
//     })
//     .then((id) => {
//       return axios
//         .get(`https://api.spotify.com/v1/users/${id}`, {
//           headers: {
//             Authorization: "Bearer " + access_token,
//           },
//         })
//         .then((response) => {
//           console.log(response);
//           return response;
//         });
//     });
// }

// async function getTopArtists(access_token) {
//   return axios
//     .get("https://api.spotify.com/v1/me/top/artists", {
//       params: { limit: 50, offset: 0 },
//       headers: {
//         Authorization: "Bearer " + access_token,
//       },
//     })
//     .then(({ data: { items } }) => {
//       return items;
//     });
// }

async function saveUser({ code }) {
  await connect();
  const newBody = {};
  return spotifyApi
    .authorizationCodeGrant(code)
    .then(({ body: {access_token, refresh_token, expires_in}}) => {
      newBody.access_token = access_token;
      newBody.refresh_token = refresh_token;
      newBody.expiry_date = Date.now() + expires_in * 1000;

      spotifyApi.setAccessToken(access_token);
      spotifyApi.setRefreshToken(refresh_token);
      return spotifyApi.getMe();
    })
    .then(({ body: { id, display_name, images }}) => {
      newBody.id = id;
      newBody.display_name = display_name;
      newBody.image = images[0].url;

      return spotifyApi.getMyTopArtists({ limit: 50 })
    })
    .then(({ body: { items }}) => {
      const topArtists = items;
      newBody.top_artists = topArtists.map((artist) => artist.name);

      const topGenresObj = {};
      topArtists.forEach((artist) => {
        artist.genres.forEach((genre) => {
          if (!topGenresObj[genre]) {
            topGenresObj[genre] = 1;
          } else {
            topGenresObj[genre]++;
          }
        });
      });
      const topGenresArr = Object.keys(topGenresObj);
      topGenresArr.sort((previous, current) => {
        return topGenresObj[current] - topGenresObj[previous];
      });
      newBody.top_genres = topGenresArr;

      const newUser = new User(newBody);
      return newUser.save();
    })
    .then((newUser) => {
      console.log(newUser);
      mongoose.disconnect();
      return newUser;
    })
    .catch((err) => {
      console.log(err);
      mongoose.disconnect();
    })

}

async function fetchUser(id) {
  await connect();
  try {
    const user = await User.findOne({ id });
    if (Date.now() >= user.expiry_date) {
      spotifyApi.setAccessToken(user.access_token);
      spotifyApi.setRefreshToken(user.refresh_token);
      const tokenData = await spotifyApi.refreshAccessToken();
      spotifyApi.setAccessToken(tokenData.body.access_token);
      await User.findOneAndUpdate(
        { id },
        {
          access_token: tokenData.access_token,
          expiry_date: Date.now() + tokenData.expires_in * 1000,
        }
      );
    }
    mongoose.disconnect();
    return user;
  } catch (err) {
    console.log(err);
  }
  mongoose.disconnect();
}

async function removeUser(id) {
  await connect();
  await User.findOneAndDelete({ id });
  mongoose.disconnect();
}

module.exports = { saveUser, fetchUser, removeUser };
