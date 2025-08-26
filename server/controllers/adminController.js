

// Api to check user===admin

import Booking from "../models/Booking.js"
import Show from "../models/Show.js";
import User from "../models/User.js";
export const isAdmin = async(req,res)=>{
    res.json({success:true,isAdmin:true})
}

//Api to get dashboard data

export const getDashboardData=async(req,res)=>{
    try{
        const bookings=await Booking.find({isPaid:true});
        const activeShows=await Show.find({showDateTime: {$gte :new Date()}}).populate('movie');

        const totalUser=await User.countDocuments();
        const dashboardData={
            totalBookings:bookings.length,
            totalRevenue:bookings.reduce((acc,booking)=>acc+booking.amount,0),
            activeShows,
            totalUser
        }
        res.json({success:true,dashboardData})
    }catch(error){
        console.log(error);
        res.json({success:false,message:error.message})
    }
    
}

//Api to get all shows
export const getAllShows = async (req, res) => {
    try {
      const shows = await Show.find({ showDateTime: { $gte: new Date() } })
        .populate({
          path: "movie",
          match: { _id: { $exists: true } }, // only populate if movie exists
        })
        .sort({ showDateTime: 1 })
        .lean();
  
      // filter out any shows where movie didn't populate
      const validShows = shows.filter(show => show.movie !== null);
  
      res.json({ success: true, shows: validShows });
    } catch (error) {
      console.log(error);
      res.json({ success: false, message: error.message });
    }
  };
  

//Api to get all Bookings

export const getAllBookings=async(req,res)=>{
    try{
        const bookings=await Booking.find({}).populate('user').populate({path:"show",
            populate:{path:"movie"}
        }).sort({createdAt:-1})
        res.json({success:true,bookings})
    }catch(error){
        console.log(error);
        res.json({success:false,message:error.message})
    }
}
