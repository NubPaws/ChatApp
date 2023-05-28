# Yuval & Rami's Chat App

- [Yuval \& Rami's Chat App](#yuval--ramis-chat-app)
	- [Running the application](#running-the-application)
		- [Running the backend server](#running-the-backend-server)
		- [Running the chat application](#running-the-chat-application)
	- [About](#about)
	- [Current State](#current-state)
- [Technologies](#technologies)
- [Credits](#credits)

## Running the application
### Running the backend server
In order to run the application you must have a database server up and running. In this application we are using the [MongoDB](https://www.mongodb.com/) platform to run the server.<br/>
Assuming you have a MongoDB server up and running you can `cd` into the `backend` directory and install the required node modules using `npm i`. Afterwards you can run the server that connects to the database using `npm run server` (or you can use `node server.js` if you are not interested in running the server using nodemon).

### Running the chat application
To run the chat application you'll need to `cd` into the `chat-app` folder and run `npm start` to launch the React application, it will automatically open up in your default browser. Make sure to run the backend server first.

## About
This project attempts to make a chat application that will be accessible on multiple platforms:

* Web browser
* Desktop app
* Android app

In this chat app, users will be able to register a new accounts and log into their account. By doing so, users may chat with each other.

## Current State
As it stands now there exists a working website that can be downloaded and deployed. The database is stored in memory and is volatile, therefore shutting the server down for any reason will cause all of the data (users, chats and messages) to be lost. This was made by design as the actual database will be implemented later using the **MVC** (**M**odel **V**iew **C**ontroller) design pattern.

Currently the website is, as stated, fully functional per execution. You can register new users and login, you can also add users to your chat and talk with them.

# Technologies
This project uses **ReactJS** with **bootstrap** for some of the stylings.<br>
In the future we will also implement a database structure, and an application for Windows and Android.

# Credits
Most images are from [wikimedia.org](https://commons.wikimedia.org) and fall under free use.
Other images where taken from either [bootstrap's icon collection](https://icons.getbootstrap.com/) or were made in house by our graphics team (which is just one person).
