import Booking from "../models/Booking.js";

// API to get user bookings
export const getUserBookings = async (req, res) => {
  try {
    // req.auth() returns the authenticated user
    const auth = await req.auth();
    // if (!auth || !auth.userId) {
    //   return res.status(401).json({ success: false, message: "User not authenticated" });
    // }

    const userId = auth.userId;
console.log(userId)
    const bookings = await Booking.find({ user: userId })
      .populate({
        path: "show",
        populate: { path: "movie" }
      })
      .sort({ createdAt: -1 });

    res.json({ success: true, bookings });
  } catch (error) {
    console.error(error.message);
    res.status(500).json({ success: false, message: error.message });
  }
};
