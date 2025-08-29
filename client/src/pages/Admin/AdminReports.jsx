import React, { useEffect, useState } from "react";
import axios from "axios";
import {
  BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer,
  LineChart, Line, CartesianGrid, Legend
} from "recharts";

const ReportsDashboard = () => {
  const [popularMovies, setPopularMovies] = useState([]);
  const [showOccupancy, setShowOccupancy] = useState([]);
  const [activeUsers, setActiveUsers] = useState([]);
  const [salesTrend, setSalesTrend] = useState([]);

  useEffect(() => {
    const fetchReports = async () => {
      const [moviesRes, occupancyRes, usersRes, salesRes] = await Promise.all([
        axios.get("/api/reports/popular-movies"),
        axios.get("/api/reports/occupancy"),
        axios.get("/api/reports/pattern"),
        axios.get("/api/reports/sales-trend"),
      ]);

      setPopularMovies(moviesRes.data.data);
      setShowOccupancy(occupancyRes.data.data);
      setActiveUsers(usersRes.data.data);

      // Format dates for chart
      const formatted = salesRes.data.data.map((d) => ({
        ...d,
        date: new Date(d.date).toLocaleDateString(),
        totalBookings: d.totalBookings || 0,
        totalSeats: d.totalSeats || 0,
        totalRevenue: d.totalRevenue || 0,
      }));

      setSalesTrend(formatted);
    };

    fetchReports();
  }, []);

  return (
    <div className="p-4 space-y-10">
      {/* Popular Movies */}
      <section>
        <h2 className="text-xl font-bold mb-2">Popular Movies</h2>
        <ResponsiveContainer width="100%" height={300}>
          <BarChart
            data={popularMovies}
            layout="vertical"
            margin={{ left: 120 }}
            barCategoryGap="30%"
          >
            <XAxis type="number" />
            <YAxis type="category" dataKey="title" />
            <Tooltip />
            <Bar dataKey="totalSeats" fill="#8884d8" />
          </BarChart>
        </ResponsiveContainer>
      </section>

      

      {/* Active Users */}
      <section>
        <h2 className="text-xl font-bold mb-2">Active Users</h2>
        <table className="w-full border">
          <thead>
            <tr>
              {/* <th className="border px-2 py-1">User</th> */}
              <th className="border px-2 py-1">Email</th>
              <th className="border px-2 py-1">Bookings</th>
              <th className="border px-2 py-1">Seats Booked</th>
            </tr>
          </thead>
          <tbody>
            {activeUsers.map((user, idx) => (
              <tr key={idx}>
                {/* <td className="border px-2 py-1">{user.userName || "N/A"}</td> */}
                <td className="border px-2 py-1">{user.email}</td>
                <td className="border px-2 py-1">{user.totalBookings}</td>
                <td className="border px-2 py-1">{user.totalSeats}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </section>

      {/* Booking & Revenue Trends side by side */}
      <section>
        <h2 className="text-xl font-bold mb-2">Booking & Revenue Trends</h2>
        <div className="flex flex-col md:flex-row space-y-4 md:space-y-0 md:space-x-4">
          {/* Bookings & Seats */}
          <div className="flex-1">
            <ResponsiveContainer width="100%" height={300}>
              <LineChart data={salesTrend}>
                <XAxis dataKey="date" />
                <YAxis />
                <CartesianGrid stroke="#ccc" />
                <Tooltip />
                <Legend />
                <Line type="monotone" dataKey="totalBookings" stroke="#8884d8" name="Bookings" />
                <Line type="monotone" dataKey="totalSeats" stroke="#82ca9d" name="Seats Booked" />
              </LineChart>
            </ResponsiveContainer>
          </div>

          {/* Revenue */}
          <div className="flex-1">
            <ResponsiveContainer width="100%" height={300}>
              <LineChart data={salesTrend}>
                <XAxis dataKey="date" />
                <YAxis />
                <CartesianGrid stroke="#ccc" />
                <Tooltip formatter={(value) => `₹${value}`} />
                <Legend />
                <Line type="monotone" dataKey="totalRevenue" stroke="#ff7300" name="Revenue" />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </div>
      </section>
      {/* Show Occupancy */}
      <section>
        <h2 className="text-xl font-bold mb-2">Show Occupancy</h2>
        <table className="w-full border">
          <thead>
            <tr>
              <th className="border px-2 py-1">Movie</th>
              <th className="border px-2 py-1">Show Time</th>
              <th className="border px-2 py-1">Occupied Seats</th>
              <th className="border px-2 py-1">Occupancy Rate</th>
            </tr>
          </thead>
          <tbody>
            {showOccupancy.map((show, idx) => (
              <tr key={idx}>
                <td className="border px-2 py-1">{show.title}</td>
                <td className="border px-2 py-1">{new Date(show.showDateTime).toLocaleString()}</td>
                <td className="border px-2 py-1">{show.bookedSeatsCount}</td>
                <td className="border px-2 py-1">{show.occupancyRate}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </section>
    </div>
    
  );
};

export default ReportsDashboard;
