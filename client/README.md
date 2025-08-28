##### Important Infos

card number valid:4242 4242 4242 4242

# MERN Movie Ticket Booking App

A full-stack movie ticket booking application built using the MERN stack (MongoDB, Express.js, React, Node.js). Users can browse movies, view showtimes, 
book seats, and manage their bookings, while the admin panel enables movie and show management.

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
| |  ├──nodemailer.js
| |  └──db.js
│ ├── controllers/
| |   ├──showController
| |   ├──bookingController
| |   ├──userController
| |   ├──adminController
| |   └──stripeWebHooks
│ ├── models/
| |   ├──Movie.js
| |   ├──Booking.js
| |   ├──Show.js
| |   └──User.js
│ ├── routes/
| |   ├──bookingRoutes
| |   ├──userRoutes
| |   ├──adminRoutes
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
HTTP Method      API End point            Notes
GET           /api/show/now-playing     To get list of now playing shows
POST          /api/show/add             To add shows of a particular movie
GET           /api/show/all             To get all shows
GET           /api/show/:movieId        To get shows of a particular movie
POST          /api/booking/create       To create a booking
GET           /api/booking/seats/:showId To get list of reserved seats for a show
GET           /api/user/bookings        To get all bookings of the user
GET           /api/admin/dashboard      To get data of dashboard like total bookings, revenue etc… for admin
GET           /api/admin/all-shows      To get all show details for admin page
GET           /api/admin/all-bookings   To get list of all bookings done by users

##  Tech Stack

| Layer     | Tools & Libraries                                                                 |
|-----------|-----------------------------------------------------------------------------------|
| Frontend  | React, react-router-dom, axios, react-hot-toast                                   |
| Backend   | Node.js, Express.js, MongoDB (with Mongoose)                                      |
| Dev Tools | Postman (API testing),Thunderclient, Prettier (linting & formatting)              |
|  Tools    | Clerk (for user management), Inngest(for email notification),stripe(payment gateway|

Additionally, we have used Clerk for authentication and user management, and Inngest for handling asynchronous workflows via webhooks.
Clerk sends real-time webhook notifications for key user events—like user.created, user.updated, or user.deleted and Inngest functions helps to respond 
to specific events like syncing users to db, triggering email etc...

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
