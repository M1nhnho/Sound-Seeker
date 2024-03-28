const mongoose = require("mongoose");
const connect = require("../database/connection.js");
const User = require("../mongoose-models/user.js");
const SpotifyWebApi = require("spotify-web-api-node");
const spotifyApi = new SpotifyWebApi({
  clientId: process.env.CLIENT_ID,
  clientSecret: process.env.CLIENT_SECRET,
  redirectUri: process.env.REDIRECT_URI,
});

async function saveUser({ code }) {
  await connect();
  const newBody = {};
  return spotifyApi
    .authorizationCodeGrant(code)
    .then(({ body: { access_token, refresh_token, expires_in } }) => {
      newBody.access_token = access_token;
      newBody.refresh_token = refresh_token;
      newBody.expiry_date = Date.now() + expires_in * 1000;
      spotifyApi.setAccessToken(access_token);
      spotifyApi.setRefreshToken(refresh_token);
      return spotifyApi.getMe();
    })
    .then(({ body: { id, display_name, images } }) => {
      newBody.id = id;
      newBody.display_name = display_name;
      if (images > 0) {
        newBody.image =
          "https://files.slack.com/files-tmb/T01KPE0QGCD-F06RU8D6ACU-5d0da9163e/default-avatar-icon_360.jpg";
      } else {
        newBody.image = images[0].url;
      }

      return spotifyApi.getMyTopArtists({ limit: 50 });
    })
    .then(({ body: { items } }) => {
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
      mongoose.disconnect();
      return newUser;
    })
    .catch((err) => {
      console.log(err);
      mongoose.disconnect();
    });
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
          access_token: tokenData.body.access_token,
          expiry_date: Date.now() + tokenData.body.expires_in * 1000,
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
