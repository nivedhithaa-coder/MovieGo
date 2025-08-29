import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import img from "../assets/logo.png";
import { MenuIcon, SearchIcon, TicketPlus, XIcon } from "lucide-react";
import { useClerk, UserButton, useUser } from "@clerk/clerk-react";
import { useAppContext } from "../context/AppContext";

const Navbar = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const { user } = useUser();
  const { openSignIn } = useClerk();
  const navigate = useNavigate();
  const { axios, getToken } = useAppContext();

  // Handle search
  const handleSearch = async () => {
    if (!searchQuery.trim()) return;
  
    try {
      const res = await axios.get(
        `/api/shows/search?title=${encodeURIComponent(searchQuery.trim())}`,
        {
          headers: {
            Authorization: `Bearer ${await getToken()}`,
          },
        }
      );
  
      const data = res.data; // ✅ Axios already parses JSON
      if (data.shows && data.shows.length > 0) {
        const movieId = data.shows[0].movie._id;
        navigate(`/movies/${movieId}`);
        setSearchQuery("");
        setIsOpen(false);
      } else {
        alert("No movie found");
      }
    } catch (error) {
      console.error(error);
      alert("Error searching for movies");
    }
  };
  
  return (
    <div className="fixed top-0 left-0 z-50 w-full flex items-center justify-between px-6 md:px-16 lg:px-36 py-5">
      
      {/* Logo */}
      <Link to="/" className="max-md:flex-1">
        <img src={img} alt="logo" className="w-42 h-auto" />
      </Link>

      {/* Menu Links */}
      <div
        className={`max-md:absolute max-md:top-0 max-md:left-0 z-50 flex flex-col md:flex-row items-center gap-8 min-md:px-8 py-3
        max-md:h-screen min-md:rounded-full backdrop-blur bg-black/70 md:bg-white/10 md:border border-gray-300/20 overflow-hidden transition-[width] duration-300 ${
          isOpen ? "max-md:w-full" : "max-md:w-0"
        }`}
      >
        <XIcon
          className="md:hidden absolute top-6 right-6 w-6 h-6 cursor-pointer"
          onClick={() => setIsOpen(false)}
        />
        <Link onClick={() => { scrollTo(0,0); setIsOpen(false); }} to="/">Home</Link>
        <Link onClick={() => { scrollTo(0,0); setIsOpen(false); }} to="/movies">Movies</Link>
        <Link onClick={() => { scrollTo(0,0); setIsOpen(false); }} to="/admin">Theatre-Admins</Link>

        {/* Mobile Search */}
        <div className="md:hidden mt-4 flex w-full px-4">
          <input
            type="text"
            placeholder="Search movies..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            onKeyDown={(e) => e.key === "Enter" && handleSearch()}
            className="flex-1 px-4 py-2 rounded-l-full outline-none focus:ring-2 focus:ring-pink-500"
          />
          <button
            onClick={handleSearch}
            className="px-4 py-2 bg-primary text-white rounded-r-full hover:bg-primary-dull transition"
          >
            Search
          </button>
        </div>
      </div>

      {/* Desktop Right Section */}
      <div className="hidden md:flex items-center gap-4">
        {/* Desktop Search */}
        <div className="flex items-center gap-2">
          <input
            type="text"
            placeholder="Search movies..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            onKeyDown={(e) => e.key === "Enter" && handleSearch()}
            className="px-4 py-2 rounded-l-full outline-none focus:ring-2 focus:ring-pink-500"
          />
          <button
            onClick={handleSearch}
            className="px-4 py-2 bg-primary text-white rounded-r-full hover:bg-primary-dull transition"
          >
            Search
          </button>
        </div>

        { !user ? (
          <button
            onClick={openSignIn}
            className="px-4 py-1 sm:px-7 sm:py-2 bg-primary hover:bg-primary-dull transition rounded-full font-medium"
          >
            Login
          </button>
        ) : (
          <UserButton>
            <UserButton.MenuItems>
              <UserButton.Action
                label="My Bookings"
                labelIcon={<TicketPlus width={15} />}
                onClick={() => navigate('/my-bookings')}
              />
            </UserButton.MenuItems>
          </UserButton>
        )}
      </div>

      {/* Hamburger */}
      <MenuIcon
        className="max-md:ml-4 md:hidden w-8 h-8 cursor-pointer"
        onClick={() => setIsOpen(!isOpen)}
      />
    </div>
  );
};

export default Navbar;
