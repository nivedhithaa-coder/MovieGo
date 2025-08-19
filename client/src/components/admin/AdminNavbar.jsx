import React from "react";
import img from '../../assets/logopage.png'
//".../assets/logopage.png";
import { Link } from "react-router-dom";

const AdminNavbar = () => {
  return (
    <div className="flex items-center justify-between px-6 py- md:px-10 h-16 border-b border-gray-300/30">
      <Link to={"/"} className="max-md:flex-1">
        <img src={img} alt="logo" className="w-36 h-auto" />
      </Link>
    </div>
  );
};

export default AdminNavbar;
