import { inngest } from "../inngest/index.js";
import Booking from "../models/Booking.js";
import Show from "../models/Show.js"
import stripe from 'stripe'
import User from "../models/User.js";
// Fn to create availability of selectedseats
const checkSeatAvailability = async (showId, selectedSeats) => {
    try {
      const showData = await Show.findById(showId);
      if (!showData) return false;
  
      const occupiedSeats = showData.occupiedSeats || {}; // Make sure it exists
      const isAnySeatTaken = selectedSeats.some(seat => occupiedSeats[seat]);
  
      return !isAnySeatTaken;
  
    } catch (error) {
      console.log(error.message);
      return false;
    }
  };
  
// const checkSeatAvailability = async(showId, selectedSeats)=>{
//     try{
//         const showData=await Show.findById(showId)
//         if(!showData){
//             return false;
//         }
//         const occupiedSeats=showData.selectedSeats;
//         const isAnySeatTaken=selectedSeats.some(seat=>occupiedSeats[seat]);

//         return !isAnySeatTaken;

//     }catch(error){
//         console.log(error.message);
//         return false;
//     }
// }

export const createBooking=async(req,res)=>{
    try{
        const {userId}=req.auth();
        const {showId,selectedSeats}=req.body;
        const {origin}=req.headers;
        

        // fetch user
        const user = await User.findById(userId);
        if (!user) return res.json({ success: false, message: "User not found" });
        //check seat availability
        const isAvailable=await checkSeatAvailability(showId,selectedSeats)

        if(!isAvailable){
            return res.json({success:false,message:"Selected Seats not available"})
        }
        // get show details

        const showData=await Show.findById(showId).populate('movie');

        // create new booking
        const booking=await Booking.create({
            user:userId,
            show:showId,
            userEmail: user.email,
            amount:showData.showPrice*selectedSeats.length,
            bookedSeats:selectedSeats
        })

        selectedSeats.map((seat)=>{
            showData.occupiedSeats[seat]=userId;

        })
        showData.markModified('occupiedSeats');
        await showData.save();


        // Stripe Gateway
        const stripeInstance=new stripe(process.env.STRIPE_SECRET_KEY)

        const line_items=[{
            price_data:{
                currency:'INR',
                product_data:{
                    name:showData.movie.title
            },
            unit_amount:Math.floor(booking.amount)*100
            },
            quantity:1
        }]

        const session=await stripeInstance.checkout.sessions.create({
            success_url: `${origin}/loading/my-bookings`,
            cancel_url:`${origin}/my-bookings`,
            line_items:line_items,
            mode:'payment',
            metadata:{
                bookingId:booking._id.toString()
            },
            expires_at:Math.floor(Date.now()/1000 +30 *60), //expires in 30 mins
        })

        booking.paymentLink=session.url
        await booking.save()

// run inngest to check payment status
await inngest.send({
    name:"app/checkpayment",
    data:{
        bookingId:booking._id.toString()
    }
})


        res.json({success:true,url:session.url})
    }catch(error){
        console.log(error.message);
        res.json({success:false,message:error.message})
    }

}

export const getOccupiedSeats=async(req,res)=>{
    try{
        const {showId}=req.params;
        const showData=await Show.findById(showId)

        const occupiedSeats=Object.keys(showData.occupiedSeats)

        res.json({success:true,occupiedSeats})


    }catch(error){
        console.log(error.message);
        res.json({success:false,message:error.message})
    }
}