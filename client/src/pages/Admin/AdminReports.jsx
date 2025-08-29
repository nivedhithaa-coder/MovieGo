import React, { useEffect, useState } from "react";
import axios from "axios";
import {
  LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer
} from "recharts";

const ReportsDashboard = () => {
  const [popularMovies, setPopularMovies] = useState([]);
  const [movieOccupancy, setMovieOccupancy] = useState([]);
  const [showOccupancy, setShowOccupancy] = useState([]);
  const [activeUsers, setActiveUsers] = useState([]);
  const [salesTrend, setSalesTrend] = useState([]);
  const [viewByShow, setViewByShow] = useState(false);

  useEffect(() => {
    const fetchReports = async () => {
      try {
        const [moviesRes, movieOccRes, showOccRes, usersRes, salesRes] = await Promise.all([
          axios.get("/api/reports/popular-movies"),
          axios.get("/api/reports/movie-occupancy"),
          axios.get("/api/reports/occupancy"),
          axios.get("/api/reports/pattern"),
          axios.get("/api/reports/sales-trend"),
        ]);

        setPopularMovies(moviesRes.data.data);
        setMovieOccupancy(movieOccRes.data.data);
        setShowOccupancy(showOccRes.data.data);
        setActiveUsers(usersRes.data.data);

        const formatted = salesRes.data.data.map((d) => ({
          ...d,
          date: new Date(d.date).toLocaleDateString(),
          totalBookings: d.totalBookings || 0,
          totalSeats: d.totalSeats || 0,
          totalRevenue: d.totalRevenue || 0,
        }));

        setSalesTrend(formatted);
      } catch (error) {
        console.log(error);
      }
    };

    fetchReports();
  }, []);

  return (
    <div className="p-4 space-y-10">
      {/* Popular Movies */}
      <section>
        <h2 className="text-xl font-bold mb-2">Popular Movies</h2>
        <table className="w-full border">
          <thead>
            <tr>
              <th className="border px-2 py-1">Movie</th>
              <th className="border px-2 py-1">Total Seats</th>
              <th className="border px-2 py-1">Occupied Seats</th>
              <th className="border px-2 py-1">Occupancy Rate</th>
            </tr>
          </thead>
          <tbody>
            {popularMovies.map((movie, idx) => (
              <tr key={idx}>
                <td className="border px-2 py-1">{movie.title}</td>
                <td className="border px-2 py-1">{movie.totalSeats}</td>
                <td className="border px-2 py-1">{movie.totalOccupied}</td>
                <td className="border px-2 py-1">{movie.occupancyRate}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </section>

      {/* Toggle Movie / Show Occupancy */}
      <section>
        <h2 className="text-xl font-bold mb-2 flex items-center justify-between">
          Occupancy
          <div className="flex items-center space-x-2">
            <span className="text-sm font-medium">Movie-wise</span>
            <label className="relative inline-flex items-center cursor-pointer">
              <input
                type="checkbox"
                className="sr-only peer"
                checked={viewByShow}
                onChange={() => setViewByShow(!viewByShow)}
              />
              <div className="w-11 h-6 bg-gray-200 rounded-full peer peer-checked:bg-blue-600 peer-focus:ring-2 peer-focus:ring-blue-300 transition-all"></div>
              <div
                className={`absolute left-1 top-1 w-4 h-4 bg-white rounded-full shadow transform transition-all peer-checked:translate-x-5`}
              ></div>
            </label>
            <span className="text-sm font-medium">Show-wise</span>
          </div>
        </h2>

        <table className="w-full border">
          <thead>
            <tr>
              <th className="border px-2 py-1">Movie</th>
              {viewByShow && <th className="border px-2 py-1">Show Time</th>}
              <th className="border px-2 py-1">Total Seats / Show Seats</th>
              <th className="border px-2 py-1">Occupied Seats</th>
              <th className="border px-2 py-1">Occupancy Rate</th>
            </tr>
          </thead>
          <tbody>
            {viewByShow
              ? showOccupancy.map((show, idx) => (
                  <tr key={idx}>
                    <td className="border px-2 py-1">{show.title}</td>
                    <td className="border px-2 py-1">{new Date(show.showDateTime).toLocaleString()}</td>
                    <td className="border px-2 py-1">{show.totalSeats || "N/A"}</td>
                    <td className="border px-2 py-1">{show.bookedSeatsCount}</td>
                    <td className="border px-2 py-1">{show.occupancyRate}</td>
                  </tr>
                ))
              : movieOccupancy.map((movie, idx) => (
                  <tr key={idx}>
                    <td className="border px-2 py-1">{movie.title}</td>
                    <td className="border px-2 py-1">{movie.totalSeats}</td>
                    <td className="border px-2 py-1">{movie.totalOccupied}</td>
                    <td className="border px-2 py-1">{movie.occupancyRate}</td>
                  </tr>
                ))}
          </tbody>
        </table>
      </section>

      {/* Active Users */}
      <section>
        <h2 className="text-xl font-bold mb-2">Active Users</h2>
        <table className="w-full border">
          <thead>
            <tr>
              <th className="border px-2 py-1">Email</th>
              <th className="border px-2 py-1">Bookings</th>
              <th className="border px-2 py-1">Seats Booked</th>
            </tr>
          </thead>
          <tbody>
            {activeUsers.map((user, idx) => (
              <tr key={idx}>
                <td className="border px-2 py-1">{user.email}</td>
                <td className="border px-2 py-1">{user.totalBookings}</td>
                <td className="border px-2 py-1">{user.totalSeats}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </section>

      {/* Booking & Revenue Trends */}
      <section>
        <h2 className="text-xl font-bold mb-2">Booking & Revenue Trends</h2>
        <div className="flex flex-col md:flex-row space-y-4 md:space-y-0 md:space-x-4">
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
    </div>
  );
};

export default ReportsDashboard;
