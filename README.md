# Yuval & Rami's Chat App

- [Yuval \& Rami's Chat App](#yuval--ramis-chat-app)
- [Running the application](#running-the-application)
  - [Backend server setup](#backend-server-setup)
    - [MongoDB](#mongodb)
    - [Environment Variables](#environment-variables)
  - [Running the backend server](#running-the-backend-server)
  - [Running the chat application alone](#running-the-chat-application-alone)
- [About](#about)
    - [Front end](#front-end)
    - [Backend](#backend)
    - [Android app:](#android-app)
- [Credits](#credits)

# Running the application
In order to run the application all you need to do is run the backend server. In order to do that, follow these steps:
1. Open the command line in the root directory.
2. `cd` to `backend`
3. Run the `npm i` to install the modules.
4. Run `npm run server` to run the server.

These steps assume that you already have a MongoDB database running. If not please follow the [Backend server setup](#backend-server-setup) instructions to download and run a MongoDB database.

## Backend server setup
### MongoDB
In order to run the application you must have a database server up and running. In this application we are using the [MongoDB](https://www.mongodb.com/) platform to run the server.<br/>
Assuming you have a MongoDB server up and running you can `cd` into the `backend` directory and install the required node modules using `npm i`. <br />
### Environment Variables
The server uses the `dotenv` library, using the values provided in `.env` file. <br/>
The server uses the `JWT_KEY` and `PORT` variables. In cases when `.env` file is not provided, default values will be selected.

## Running the backend server
Afterwards you can run the server that connects to the database using `npm run server` (or you can use `node server.js` if you are not interested in running the server using nodemon).

## Running the chat application alone
To run the chat application you'll need to `cd` into the `chat-app` folder and run `npm start` to launch the React application, it will automatically open up in your default browser. Make sure to run the backend server first.

# About
This is a chat application project. The application can be ran both a browser (via accessing the server's url) and through an Android app.

To create the application, the following technologies and languages were used:
### Front end
  * Node.js using React.js.
  * WebSockets to connect to the backend server.
### Backend
  * Node.js using Express.js.
    * Exposing REST API endpoints.
    * Displaying the React.js application to the front end.
  * MongoDB using NoSQL database for data storage and retrival.
  * WebSockets to connect to web clients.
  * Firebase Cloud Messaging to connect to android clients.
### Android app:
  * The app was made using Java with OOP design principles and event driven programming.
  * Retrofit2 for REST API end point access.
  * Room for local SQL database storage.
  * Firebase Cloud Messaing for direct/instant communication with the backend.

In this chat app, users can register a new accounts and log into their account and chat with one another (assuming they are on the same server).

As it stands now the project is fully built with a supported web client and an androind client that can be ran, connected to and used.

# Credits
Most images are from [wikimedia.org](https://commons.wikimedia.org) and fall under free use.
Other images where taken from either [bootstrap's icon collection](https://icons.getbootstrap.com/) or were made in house by our graphics team (which is just one person).
