import Booking from "../models/Booking.js";


//API to get user bookings
export const getUserBookings=async(req,res)=>{
    try{
        const user=req.auth().userId;

        const bookings=await Booking.find({user}).populate({
            path:'show',
            populate:{path:"movie"}
        }).sort({createdAt:-1})

        res.json({success:true,bookings})
    }catch(error){
        console.log(error.message);
        res.json({success:false,message:error.message});
    }
}