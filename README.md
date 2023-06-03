# Yuval & Rami's Chat App

- [Yuval \& Rami's Chat App](#yuval--ramis-chat-app)
  - [Running the application](#running-the-application)
  - [Running the backend server](#running-the-backend-server)
- [Running the chat application alone](#running-the-chat-application-alone)
- [About](#about)
- [Credits](#credits)

# Running the application
In order to run the application all you need to do is run the backend server. In order to do that follow these steps:
1. Open the command line in the root directory.
2. `cd` to `backend`
3. Run the `npm i` to install the modules.
4. Run `npm run server` to run the server.

These steps assume that you already have a MongoDB database running. If not please follow the [Running the backend server](#running-the-backend-server) instructions to download and run a MongoDB database.

## Running the backend server
In order to run the application you must have a database server up and running. In this application we are using the [MongoDB](https://www.mongodb.com/) platform to run the server.<br/>
Assuming you have a MongoDB server up and running you can `cd` into the `backend` directory and install the required node modules using `npm i`. Afterwards you can run the server that connects to the database using `npm run server` (or you can use `node server.js` if you are not interested in running the server using nodemon).

## Running the chat application alone
To run the chat application you'll need to `cd` into the `chat-app` folder and run `npm start` to launch the React application, it will automatically open up in your default browser. Make sure to run the backend server first.

# About
This project attempts to make a chat application that will be accessible on multiple platforms:

* Web browser
* Desktop app
* Android app

In this chat app, users will be able to register a new accounts and log into their account. By doing so, users may chat with each other.

As it stands now there exists a working website that can be downloaded and deployed. Running the server with an existing MongoDB database is also possible using the instructions defined at the top.

The website currently is fully funtional and operational. Chat messages update in live and you can create new accounts and add accounts based on their usernames.

# Credits
Most images are from [wikimedia.org](https://commons.wikimedia.org) and fall under free use.
Other images where taken from either [bootstrap's icon collection](https://icons.getbootstrap.com/) or were made in house by our graphics team (which is just one person).
