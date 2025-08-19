import React from "react";
import Navbar from "./components/Navbar";
import Home from "./pages/Home";
import Movies from "./pages/Movies";
import MovieDetails from "./pages/MovieDetails";
import MyBookings from "./pages/MyBookings";
import SeatLayout from "./pages/SeatLayout";
import { Route, Routes, useLocation } from "react-router-dom";
import { Toaster } from "react-hot-toast";
import Footer from "./components/Footer";
import Layout from "./pages/Admin/Layout";
import Dashboard from "./pages/Admin/Dashboard";
import ListShows from "./pages/Admin/ListShows";
import AddShows from "./pages/Admin/AddShows";
import ListBookings from "./pages/Admin/ListBookings";

const App = () => {
  const isAdminRoute = useLocation().pathname.startsWith("/admin");

  return (
    <>
      <Toaster />
      {!isAdminRoute && <Navbar />}
      <Routes>
        <Route path="/" element={<Home />}></Route>
        <Route path="/movies" element={<Movies />}></Route>
        <Route path="/movies/:id" element={<MovieDetails />}></Route>
        <Route path="/movies/:id/:date" element={<SeatLayout />}></Route>
        <Route path="/my-bookings" element={<MyBookings />}></Route>
        <Route path="/admin/*" element={<Layout />}>
          <Route index element={<Dashboard />}></Route>
          <Route path="add-shows" element={<AddShows />}></Route>
          <Route path="list-shows" element={<ListShows />}></Route>
          <Route path="list-bookings" element={<ListBookings />}></Route>
        </Route>
      </Routes>
      {!isAdminRoute && <Footer />}
    </>
  );
};

export default App;
