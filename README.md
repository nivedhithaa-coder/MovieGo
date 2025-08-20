# MERN Movie Ticket Booking App

A full-stack movie ticket booking application built using the MERN stack (MongoDB, Express.js, React, Node.js). Users can browse movies, view showtimes, 
book seats, and manage their bookings, while the admin panel enables movie and show management.

---

##  Features

- **User Dashboard**
  - Browse currently playing movies
  - View all movies and their details like title, ratings, release year etc...
  - Book tickets and explore more movies
  - View booking history
  - Login using email id

- **Admin Panel**
  - Displays revenue, tickets booked, and additional information for admin
  - Separate routes for adding new shows, listing all bookings and shows
  - Manage and update show details

- **Technology Highlights**
  - Client-side routing via **React Router**
  - Toast notifications using **react-hot-toast**
  - Real-time seat selection with locking logic to prevent double booking

---

##  Project Structure

movie-ticket-app/
├── client/ # React app
│ ├── public/
│ │ ├── index.html
│ │ └── _redirects # For Netlify routing
│ └── src/
│ ├── components/
| |   ├── BlurCIrcle
| |   ├── Navbar
| |   ├── DateSelect
| |   ├── FeatureSection
| |   ├── Footer
| |   ├── HeroSection
| |   ├── MovieCard
| |   └── admin
| |       ├── Title
| |       ├── AdminNavbar
| |       └── SideBar
│ ├── pages/
| |   ├── Home
| |   ├── MovieDetails
| |   ├── Movies
| |   ├── MyBookings
| |   ├── SeatLayout
| |   └── Admin
| |       ├── Dashboard
| |       ├── Layout
| |       ├── AddShows
| |       ├── ListBookings
| |       └── ListShows
│ └── App.js
├── server/ # Express backend API
| ├──configs
| |  └──db.js
│ ├── controllers/
| |   ├──showController
│ ├── models/
| |   ├──Movie.js
| |   └──User.js
│ ├── routes/
| |   └──showRoutes
│ └── server.js
├── .gitignore
└── README.md

Routes Breakdown
Path	                Component	                           Notes
/	                       Home	                       Renders the homepage.
/movies	                Movies	                 Shows the list of available movies.
/movies/:id	         MovieDetails	       Shows details for a specific movie. :id is the movie ID param.
/movies/:id/:date	    SeatLayout	             Displays seat selection for a specific movie show date.
/my-bookings	        MyBookings	                Displays the user's booking history.
/admin/*	              Layout	                     Includes navigation/UI.
/admin(index)	         Dashboard	            Default admin dashboard view when '/admin' is accessed.
/admin/add-shows	     AddShows	                  Admin page for adding new showtimes.
/admin/list-shows	     ListShows	           Admin page for viewing a list of scheduled shows.
/admin/list-bookings	ListBookings	            Admin page for viewing user bookings.

API EndPoints
/api/show/now-playing - fetches list of movies playin now
/api/show/add  - allows user to add shows and ticket price
/api/show/all  - fetches all shows
.api/show/:movieId  - fetches show details for the particular movie


##  Tech Stack

| Layer     | Tools & Libraries                                                                 |
|-----------|-----------------------------------------------------------------------------------|
| Frontend  | React, react-router-dom, axios, react-hot-toast                                   |
| Backend   | Node.js, Express.js, MongoDB (with Mongoose)                                     |
| Dev Tools | Postman (API testing),Thunderclient, Prettier (linting & formatting)    

Additionally, we have used Clerk for authentication and user management, and Inngest for handling asynchronous workflows via webhooks.
Clerk sends real-time webhook notifications for key user events—like user.created, user.updated, or user.deleted and Inngest functions helps to respond 
to specific events like syncing users to db, triggering email etc...

