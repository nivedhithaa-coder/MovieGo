import React, { useState, useEffect } from 'react';
import Title from '../../components/admin/Title';
import { dateFormat } from '../../lib/dateFormat';
import { useAppContext } from '../../context/AppContext';

const ListShows = () => {
  const { axios, getToken, user } = useAppContext();
  const currency = import.meta.env.VITE_CURRENCY;

  const [shows, setShows] = useState([]);
  const [loading, setLoading] = useState(true);

  const getAllShows = async () => {
    try {
      const { data } = await axios.get('/api/admin/all-shows', {
        headers: { Authorization: `Bearer ${await getToken()}` },
      });
      setShows(data.shows || []);
      setLoading(false);
    } catch (error) {
      console.error('Error fetching shows:', error);
      setLoading(false);
    }
  };

  useEffect(() => {
    if (user) getAllShows();
  }, [user]);

  return !loading ? (
    <>
      <Title text1="List" text2="Shows" />
      <div className="max-w-4xl mt-6 overflow-x-auto">
        <table className="w-full border-collapse rounded-md overflow-hidden text-nowrap">
          <thead>
            <tr className="bg-primary/20 text-left text-white">
              <th className="p-2 font-medium pl-5">Movie Name</th>
              <th className="p-2 font-medium pl-5">Show Time</th>
              <th className="p-2 font-medium pl-5">Total Bookings</th>
              <th className="p-2 font-medium pl-5">Amount</th>
            </tr>
          </thead>
          <tbody className="text-sm font-light">
            {shows.map((show) => {
              const movieTitle = show.movie?.title ?? 'Unknown Movie';
              const occupiedSeatsCount = Object.keys(show.occupiedSeats ?? {}).length;
              const pricePerShow = show.showPrice ?? 0;

              return (
                <tr
                  key={show._id}
                  className="border-b border-primary/10 bg-primary/5 even:bg-primary/10"
                >
                  <td className="p-2 min-w-45 pl-5">{movieTitle}</td>
                  <td className="p-2 pl-5">{dateFormat(show.showDateTime)}</td>
                  <td className="p-2 pl-5">{occupiedSeatsCount}</td>
                  <td className="p-2 pl-5">
                    {currency}
                    {occupiedSeatsCount * pricePerShow}
                  </td>
                </tr>
              );
            })}
            {!shows.length && (
              <tr>
                <td colSpan="4" className="text-center p-4 text-white/70">
                  No shows found.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </>
  ) : (
    <div className="text-white">Loading...</div>
  );
};

export default ListShows;
