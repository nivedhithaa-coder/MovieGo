import React, { useEffect, useState } from "react";
import { dummyShowsData, dummyBookingData } from "../../assets/assets";
import Title from "../../components/admin/Title";
import { dateFormat } from "../../lib/dateFormat";

const ListBookings = () => {
  const currency = import.meta.env.VITE_CURRENCY;

  const [loading, setLoading] = useState(true);
  const [bookings, setBookings] = useState([]);

  const getAllBookings = async () => {
    setBookings(dummyBookingData);
    setLoading(false);
  };

  useEffect(() => {
    getAllBookings();
  }, []);

  return !loading ? (
    <>
      <Title text1="List" text2="Bookings" />
      <div className="max-w-4xl mt-6 overflow-x-auto">
        <table className="w-full border-collapse rounded-md overflow-hidden text-nowrap">
          <thead>
            <tr className="bg-primary/20 text-left text-white">
              <th className="p-2 font-medium pl-5">User Name</th>
              <th className="p-2 font-medium pl-5">Movie Name</th>
              <th className="p-2 font-medium pl-5">Show Time</th>
              <th className="p-2 font-medium pl-5">Seats</th>
              <th className="p-2 font-medium pl-5">Amount</th>
            </tr>
          </thead>
          <tbody className="text-sm font-light">
            {bookings.map((item, index) => (
              <tr
                key={index}
                className="border-b border-primary/20 bg-primary/5 even:bg-primary/10"
              >
                <td className="p-2 min-w-45 pl-5">{item.user.name}</td>
                <td className="p-2 pl-5">{item.show.movie.title}</td>
                <td className="p-2 pl-5">
                  {dateFormat(item.show.showDateTime)}
                </td>
                <td className="p-2 pl-5">
                  {Object.keys(item.bookedSeats)
                    .map((seat) => item.bookedSeats[seat])
                    .join(",")}
                </td>
                <td className="p-2 pl-5">
                  {currency} {item.amount}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </>
  ) : (
    <div className="text-white">Loading...</div>
  );
};

export default ListBookings;
