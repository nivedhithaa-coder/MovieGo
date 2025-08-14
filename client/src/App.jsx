import React from 'react'
import Navbar from './components/Navbar'
import Home from './pages/Home'
import Movies from './pages/Movies'
import MovieDetails from './pages/MovieDetails'
import MyBookings from './pages/MyBookings'
import SeatLayout from './pages/SeatLayout'
import { Route, Routes, useLocation } from 'react-router-dom'
import {Toaster} from 'react-hot-toast'
import Footer from './components/Footer'

const App=()=>{

  const isAdminRoute = useLocation().pathname.startsWith('/admin')

  return(
    <>
    <Toaster/>
      {!isAdminRoute && <Navbar/>}
      <Routes>
        <Route path='/' element={<Home/>}></Route>
        <Route path='/movies' element={<Movies/>}></Route>
        <Route path='/movies/:id' element={<MovieDetails/>}></Route>
        <Route path='/movies/:id/:date' element={<SeatLayout/>}></Route>
        <Route path='/my-bookings' element={<MyBookings/>}></Route>


      </Routes>
      {!isAdminRoute && <Footer/>}
    </>
  )
}

export default App