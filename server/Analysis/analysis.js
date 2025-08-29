import Booking from '../models/Booking.js';
import Show from '../models/Show.js';
import Movie from '../models/Movie.js';

// Popular Movies (by booked seats)
import mongoose from "mongoose";
export const popularMovies = async (req, res) => {
  try {
    const result = await Booking.aggregate([
      // Join with shows (cast _id to string)
      {
        $lookup: {
          from: "shows",
          let: { showIdStr: "$show" },
          pipeline: [
            { $addFields: { _idStr: { $toString: "$_id" } } },
            { $match: { $expr: { $eq: ["$_idStr", "$$showIdStr"] } } }
          ],
          as: "showDetails"
        }
      },
      { $unwind: "$showDetails" },
      // Join with movies
      {
        $lookup: {
          from: "movies",
          localField: "showDetails.movie",
          foreignField: "_id",
          as: "movieDetails"
        }
      },
      { $unwind: "$movieDetails" },
      // Group by movie
      {
        $group: {
          _id: "$movieDetails._id",
          title: { $first: "$movieDetails.title" },
          totalSeats: { $sum: { $size: "$bookedSeats" } }
        }
      },
      { $sort: { totalSeats: -1 } }
    ]);

    res.json({ success: true, data: result });
  } catch (error) {
    console.error(error);
    res.status(500).json({ success: false, message: "Error fetching popular movies" });
  }
};


// Theatre Occupancy Rate (per show)
export const getShowOccupancy = async (req, res) => {
  try {
    const shows = await Show.aggregate([
      {
        $addFields: {
          bookedSeatsCount: { $size: { $objectToArray: "$occupiedSeats" } },
          totalSeats: 100, // replace with actual totalSeats if stored
        },
      },
      {
        $project: {
          title: 1,
          showDateTime: 1,
          bookedSeatsCount: 1,
          totalSeats: 1,
          occupancyRate: {
            $concat: [
              {
                $toString: {
                  $round: [
                    { $multiply: [{ $divide: ["$bookedSeatsCount", "$totalSeats"] }, 100] },
                    2,
                  ],
                },
              },
              "%",
            ],
          },
        },
      },
    ]);

    res.json({ success: true, data: shows });
  } catch (err) {
    res.status(500).json({ success: false, error: err.message });
  }
};

export const bookingPatterns = async (req, res) => {


  try {
    const activeUsers = await Booking.aggregate([
      {
        $group: {
          _id: "$userEmail",
          // userName: { $first: { $ifNull: ["$user.name", null] } },
          // userImage: { $first: { $ifNull: ["$user.image", null] } },
          totalBookings: { $sum: 1 },
          totalSeats: { $sum: { $size: "$bookedSeats" } }
        }
      },
      { $sort: { totalBookings: -1, totalSeats: -1 } },
      {
        $project: {
          _id: 0,        // exclude _id
          email: "$_id",  // optionally rename _id to email
          // userName: 1,
          // userImage: 1,
          totalBookings: 1,
          totalSeats: 1
        }
      }
    ]);
    

    res.json({
      success: true,
      data: activeUsers
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({
      success: false,
      message: err.message
    });
  }
}
export const salesTrend = async (req, res) => {
  try {
    const bookingTrends = await Booking.aggregate([
      {
        $group: {
          _id: {
            year: { $year: "$createdAt" },
            month: { $month: "$createdAt" },
            day: { $dayOfMonth: "$createdAt" },
          },
          totalBookings: { $sum: 1 },
          totalSeats: { $sum: { $size: "$bookedSeats" } },
          totalRevenue: { $sum: "$amount" },
        },
      },
      { $sort: { "_id.year": 1, "_id.month": 1, "_id.day": 1 } },
      // Convert _id to a proper date string
      {
        $project: {
          _id: 0,
          date: {
            $dateFromParts: {
              year: "$_id.year",
              month: "$_id.month",
              day: "$_id.day",
            },
          },
          totalBookings: 1,
          totalSeats: 1,
          totalRevenue: 1,
        },
      },
    ]);

    res.json({
      success: true,
      data: bookingTrends,
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({
      success: false,
      message: err.message,
    });
  }
};
