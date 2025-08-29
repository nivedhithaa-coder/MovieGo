import Movie from "../models/Movie.js";
import Show from "../models/Show.js";


//API to get user bookings
export const getMovieBySearch=async(req,res)=>{
    try {
        const { title } = req.query;
    
        if (!title) {
          return res.status(400).json({ success: false, message: "Title query is required" });
        }
    
        // 1️⃣ Find movies whose title matches the search (case-insensitive)
        const movies = await Movie.find({
          title: { $regex: title, $options: "i" }
        });
    
        if (!movies.length) {
          return res.json({ success: true, shows: [] });
        }
    
        // 2️⃣ Find shows for the matched movies
        const shows = await Show.find({ movie: { $in: movies.map(m => m._id) } })
          .populate("movie"); // include movie details
    
        res.json({ success: true, shows });
      } catch (err) {
        console.error(err);
        res.status(500).json({ success: false, message: err.message });
      }
}