import { Inngest } from "inngest";
import User from "../models/User.js";
import Booking from "../models/Booking.js"
import Show from "../models/Show.js"

import {sendEmail} from "../configs/nodemailer.js"
// Create a client to send and receive events
export const inngest = new Inngest({ id: "MovieGo" });

const syncUserCreation=inngest.createFunction(
    {id:'sync-user-from-clerk'},
    {event:'clerk/user.created'},
    async({event})=>{
        const {id,first_name,last_name,email_addresses,image_url}=event.data;
        const userData={
            _id:id,
            email:email_addresses[0].email_address,
            name:first_name+' '+last_name,
            image:image_url

        }
        await User.create(userData)
    }
)
// To Delete User
const syncUserDeletion=inngest.createFunction(
    {id:'delete-user-with-clerk'},
    {event:'clerk/user.deleted'},
    async({event})=>{
        const{id}=event.data;
        await User.findByIdAndDelete(id)
    }
)
//To update User data
const syncUserUpdation=inngest.createFunction(
    {id:'update-user-from-clerk'},
    {event:'clerk/user.updated'},
    async({event})=>{
        const {id,first_name,last_name,email_addresses,image_url}=event.data;
        const userData={
            _id:id,
            email:email_addresses[0].email_address,
            name:first_name+' '+last_name,
            image:image_url

        }
        await User.findByIdAndUpdate(id,userData)
    }
)

//Inngest fn to cancel booking within 10 mins if payment not paid
const releaseSeatsAndDeleteBooking=inngest.createFunction(
    {id:'release-seats-delete-booking'},
    {event:"app/checkpayment"},
    async({event,step})=>{
        const tenMinsLater=new Date(Date.now()+10*60*1000);
        await step.sleepUntil('wait-for-ten-minutes',tenMinsLater);

        await step.run('check-payment-status',async()=>{
            const bookingId=event.data.bookingId;
            const booking=await Booking.findById(bookingId)

            // to chek ispaid status
            if(!booking.isPaid){
                const show=await Show.findById(booking.show);
                booking.bookedSeats.forEach((seat)=>{
                    delete show.occupiedSeats[seat]
                });
                show.markModified('occupiedSeats')
                await show.save()
                await Booking.findByIdAndDelete(booking._id)
            }

        })
    }
)

//to send email whe booking done
// Inngest function to send booking confirmation email
const BookingConfirmationEmail = inngest.createFunction(
    { id: "send-booking-confirmation-email" },
    { event: "app/show.booked" },
    async ({ event }) => {
      const { bookingId } = event.data;
  
      // 🔹 Step 1: Find booking
      const booking = await Booking.findById(bookingId);
      if (!booking) {
        console.error("❌ Booking not found:", bookingId);
        return;
      }
  
      // 🔹 Step 2: Find user (manually, since user is a string ID)
      const user = await User.findById(booking.user);
      if (!user) {
        console.error("❌ User not found for booking:", booking.user);
        return;
      }
  
      // 🔹 Step 3: Find show + populate movie
      const show = await Show.findById(booking.show).populate("movie");
      if (!show) {
        console.error("❌ Show not found for booking:", booking.show);
        return;
      }
  
      // 🔹 Step 4: Send email
      await sendEmail(
        booking.userEmail, // to
        `Booking Confirmation for "${show.movie.title}"!!!`, // subject
        `<div style="font-family:Arial,sans-serif;line-height:1.5;">
          <h2>Hi ${user.name},</h2>
          <p>Your booking for <strong style="color:#F84565;">"${show.movie.title}"</strong> is confirmed.</p>
          <p>Date: ${new Date(show.showDateTime).toLocaleDateString('en-US', { timeZone: 'Asia/Kolkata' })}<br/>
          Time: ${new Date(show.showDateTime).toLocaleTimeString('en-US', { timeZone: 'Asia/Kolkata' })}
          </p>
          <p>Enjoy the show!!!</p>
          <p>Thanks for booking with us!<br/>- Team MovieGo</p>
        </div>`
      );
    }
  );
  
// Create an empty array where we'll export future Inngest functions
export const functions = [syncUserCreation,syncUserDeletion,syncUserUpdation,BookingConfirmationEmail,releaseSeatsAndDeleteBooking];