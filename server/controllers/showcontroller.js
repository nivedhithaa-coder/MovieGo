import axios from 'axios';
import Movie from '../models/Movie.js';
import Show from '../models/Show.js';
import mongoose from 'mongoose';
import { DateTime } from 'luxon';

export const getNowPlayingMovies=async(req,res)=>{
    try{
        const {data}= await axios.get('https://api.themoviedb.org/3/movie/now_playing',
            {
                headers:{
                    Authorization: `Bearer ${process.env.TMDB_API_KEY}`
                }
            })
            const movies=data.results;
            res.json({success:true,movies:movies})
        
   }catch(error){
    console.log(error);
        res.json({success:false,message:error.message})
    }
}

// Add Show

export const addShow = async (req, res) => {
    try {
      const { movieId, showsInput, showPrice } = req.body;
      // [Fetch or create movie as before]
      let movie=await Movie.findById(movieId)
        if(!movie){
            // fetch movie details from tmdb api
            const [movieDetailsResponse, movieCreditsResponse]=await Promise.all([
                axios.get(`https://api.themoviedb.org/3/movie/${movieId}`,
                    {
                        headers:{
                            Authorization: `Bearer ${process.env.TMDB_API_KEY}`
                        }
                    }),axios.get(`https://api.themoviedb.org/3/movie/${movieId}/credits`,
                        {
                            headers:{
                                Authorization: `Bearer ${process.env.TMDB_API_KEY}`
                            }
                        })
            ])
            const movieApiData=movieDetailsResponse.data;
            const movieCreditsData=movieCreditsResponse.data;
            const movieDetails={
                _id:movieId,
                title:movieApiData.title,
                overview:movieApiData.overview,
                poster_path:movieApiData.poster_path,
                backdrop_path:movieApiData.backdrop_path,
                genres:movieApiData.genres,
                casts:movieApiData.casts,
                release_date:movieApiData.release_date,
                original_language:movieApiData.original_language,
                tagline:movieApiData.tagline||"",
                vote_average:movieApiData.vote_average,
                runtime:movieApiData.runtime,
            }
            movie=await Movie.create(movieDetails);
        }
  
      const showsToCreate = showsInput.flatMap(({ date, time: times }) =>
        times.map(t => ({
          movie: movieId,
          title:movie.title,
          showDateTime: DateTime.fromISO(`${date}T${t}`, { zone: 'Asia/Kolkata' })
            .toUTC()
            .toJSDate(),
          showPrice,
          occupiedSeats: {},
        }))
      );
  
      const createdShows = showsToCreate.length
        ? (await Show.insertMany(showsToCreate)).map(s => s.toJSON()) 
        : [];
  
      const formattedShows = createdShows.map(s => ({
        showId: s._id,
        movieTitle: s.movieTitle, 
        showDateTime: DateTime.fromJSDate(s.showDateTime, { zone: 'UTC' })
          .setZone('Asia/Kolkata')
          .toISO(),
        showPrice: s.showPrice,
      }));
  
      res.status(201).json({
        success: true,
        message: `Added movie "${movie.title}" and ${formattedShows.length} show(s) successfully.`,
        movie,
        shows: formattedShows,
      });
    } catch (error) {
      console.error(error);
      res.status(500).json({ success: false, message: error.message });
    }
  };


// API to get all shows from DB



// export const getShows = async (req, res) => {
//   try {
//     const shows = await Show.find({ showDateTime: { $gte: new Date() } })
//       .populate('movie')
//       .sort({ showDateTime: 1 });

//     const uniqueShows = new Set(shows.map(show => show.movie));
//     const showsArray = Array.from(uniqueShows).map(show => ({
//       ...show.toObject(),
//       showDateTime: DateTime.fromJSDate(show.showDateTime, { zone: 'UTC' })
//         .setZone('Asia/Kolkata')
//         .toISO()
//     }));

//     res.json({ success: true, shows: showsArray });
//   } catch (error) {
//     console.error(error);
//     res.json({ success: false, message: error.message });
//   }
// };

export const getShows = async (req, res) => {
  try {
    // Fetch all future shows with movie populated
    const shows = await Show.find({ showDateTime: { $gte: new Date() } })
      .populate('movie') // works because movie is string ref
      .sort({ showDateTime: 1 });

    // Filter out shows without a valid movie
    const validShows = shows.filter(show => show.movie);

    // Deduplicate shows by movie._id
    const seenMovies = new Set();
    const uniqueShows = validShows.filter(show => {
      if (seenMovies.has(show.movie._id)) return false;
      seenMovies.add(show.movie._id);
      return true;
    });

    res.json({ success: true, shows: uniqueShows });
  } catch (error) {
    console.log(error);
    res.json({ success: false, message: error.message });
  }
};

// export const getShows = async (req, res) => {
//   try {
//     const shows = await Show.find({ showDateTime: { $gte: new Date() } })
//       .populate('movie')
//       .sort({ showDateTime: 1 });

//     const formattedShows = shows.map((s) => {
//       // Convert UTC Date to IST
//       const istTime = DateTime.fromJSDate(s.showDateTime, { zone: 'UTC' })
//         .setZone('Asia/Kolkata')  // IST timezone
//         .toISO();                 // ISO string with +05:30 offset

//       return {
//         ...s.toObject(),
//         showDateTime: istTime,
//       };
//     });

//     res.json({ success: true, shows: formattedShows });
//   } catch (error) {
//     console.error(error);
//     res.json({ success: false, message: error.message });
//   }
// };

  
// To get single show from DB
export const getShow = async (req, res) => {
    try {
      const { movieId } = req.params;
      const shows = await Show.find({
        movie: movieId,
        showDateTime: { $gte: new Date() },
      }).sort({ showDateTime: 1 });
  
      const movie = await Movie.findById(movieId);
  
      const dateTime = {};
      shows.forEach((show) => {
        // Convert UTC to IST
        const istDateTime = DateTime.fromJSDate(show.showDateTime, { zone: 'UTC' })
          .setZone('Asia/Kolkata')
          .toISO(); // e.g. "2025-09-27T14:00:00+05:30"
  
        const date = istDateTime.split('T')[0];
  
        if (!dateTime[date]) {
          dateTime[date] = [];
        }
  
        dateTime[date].push({
          time: istDateTime,
          showId: show._id,
        });
      });
  
      res.json({ success: true, movie, dateTime });
    } catch (error) {
      console.error(error);
      res.json({ success: false, message: error.message });
    }
  };
  

// export const getShow=async(req,res)=>{
//     try{
//         const{movieId}=req.params;
//         //get all upcming show for the movie
//         const shows= await Show.find({movie:movieId,showDateTime:{$gte:new Date()}})

//         const movie=await Movie.findById(movieId);
//         const dateTime={};
//         shows.forEach((show)=>{
//             const date=show.showDateTime.toISOString().split("T")[0];
//             if(!dateTime[date]){
//                 dateTime[date]=[]
//             }
//             dateTime[date].push({time:show.showDateTime,showId:show._id})
//         })
//         res.json({success:true,movie,dateTime})
//     }catch(error){
//         console.log(error);
//         res.json({success:false,message:error.message})
//     }
// }