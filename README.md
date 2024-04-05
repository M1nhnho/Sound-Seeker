# Sound Seeker Backend

## Northcoders Software Development Final Project

Welcome to the backend of Sound Seeker! This repository houses the server-side code that powers our Festival Recommender App. Built with MongoDB, Mongoose, and Express.js, our backend manages user data storage, Spotify API integration, and token management for seamless access to Spotify's features.

## Features
- **User Data Storage:** Our backend saves user information, including Spotify data such as top artists and top genres, to the MongoDB database.
- **Spotify API Integration:** The backend handles requests to the Spotify API retrieving user data.
- **Token Management:** We manage access tokens for the Spotify API, handling the initial token and token refreshes, ensuring smooth communication between our app and Spotify's services.
## API Endpoints
- **POST /api/users** - Create a new user and save their data to the database.
- **GET /api/users/:id** - Retrieve user data by user ID.
- **GET /api/users/:id/token** - Retrieve user's access token by user ID.
- **DELETE /api/users/:id** - Delete user data by user ID.
## Set up
Below are instructions on how to run our app locally. 
Due to the nature of the Spotify API this process is relatively lengthy, however, following the steps below should help you through the process.

1. **Clone the Repository:** Clone this repository to your local machine using `git clone`.
2. **Install Dependencies:** Navigate to the project directory and install dependencies by running `npm install`.
3. **Spotify API:** Set up an app on [Spotify's dashboard](https://developer.spotify.com/) to get a client ID, client secret and to set up the redirect URI. More details on how to do this can be found [here](https://developer.spotify.com/documentation/web-api/tutorials/getting-started#create-an-app).
4. **Set Up MongoDB:** Follow these [instructions](https://www.mongodb.com/docs/atlas/tutorial/deploy-free-tier-cluster/) to set up your database. Make sure you are in the Atlas UI tab.
5. **Get MongoDB connection string:** Follow these [instructions](https://www.mongodb.com/basics/mongodb-connection-string) to get your connection string to use for the `DATABASE_URI` below. The connection method you will need to select is Drivers.
6. **Create Environment Variables:** Create a `.env.development` file in the root directory of the project and add the following variables:

    ```
    CLIENT_ID = ...

    CLIENT_SECRET = ...

    REDIRECT_URI = ...

    DATABASE_URI = ...
    ```
8. **Host on Render:** Follow these [instructions](https://coding-boot-camp.github.io/full-stack/mongodb/deploy-with-render-and-mongodb-atlas) at the Create a Render App section. The environment variables should be set as above including `NODE_ENV` as `production`.
9. **Set Up Frontend:** Once the server on Render is running correctly, refer to the [Frontend instructions](https://github.com/sjdmurden/Sound-Seeker-fe/).
## Contributors
- James Metcalfe [@jamesraymetcalfe](https://github.com/jamesraymetcalfe)
- David Taylor [@davidtaylor21](https://github.com/davidtaylor21)
- Sebastian Murden [@sjdmurden](https://github.com/sjdmurden)
- Tien Nguyen-Ho [@m1nhnho](https://github.com/m1nhnho)
- Kamilla Mohamed [@kamilla2424](https://github.com/kamilla2424)
- Rayhan Elbeera [@raybeera](https://github.com/raybeera)   
