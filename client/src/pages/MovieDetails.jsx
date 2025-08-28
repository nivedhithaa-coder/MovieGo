import React from "react";
import { useState } from "react";
import { useParams } from "react-router-dom";
import { dummyDateTimeData, dummyShowsData } from "../assets/assets";
import { useEffect } from "react";
import { StarIcon } from "lucide-react";
import DateSelect from "../components/DateSelect";
import { useAppContext } from "../context/AppContext";

const MovieDetails = () => {
  const { id } = useParams();
  const [show, setShow] = useState(null);
  const {shows, axios, getToken, user,image_base_url}=useAppContext();
//   const getShow = async () => {
//     const show = dummyShowsData.find((show) => show._id === id);
//     if(show){
//         setShow({
//             movie: show,
//             dateTime: dummyDateTimeData,
//           })
//     }
//     else {
//         console.warn(`Show with id=${movie._id} not found`);
//       }
    
//   };

//   useEffect(() => {
//     getShow();
//   }, [id]);
const getShow = async () => {
  try{
    const{data}=await axios.get(`/api/show/${id}`,{
      headers: {
        Authorization: `Bearer ${await getToken()}`,
      },
    })
    if(data.success)
    {
      setShow(data)
    }
  }catch(error){
    console.log(error)
  }
};
useEffect(() => {
 
    getShow();
  }, [id]);
  

  return show ?(
    <div className='px-6 md:px-16 lg:px-40 pt-30 md:pt-50'>
        <div className='flex flex-col md:flex-row gap-8 max-w-6xl mx-auto'>
            <img src={image_base_url+(show?.movie?.poster_path ?? "/fallback.png")} alt="" className='max-ms:mx-auto rounded-xl
             h-104 max-w-70 object-cover'/>
             <div className='relative flex flex-col gap-3'>
                <p className='text-primary'>ENGLISH</p>
                <h1 className="text-4xl font-semibold max-w-96 mb-2 text-balance">{show.movie.title}</h1>
                <div className='flex items-center mb-4 gap-2 text-gray-300'>
                    <StarIcon className='w-5 h-5 text-primary fill-primary'/>
                    {show.movie.vote_average.toFixed(1)} User rating
                </div>
                <p className='text-gray-400 mt-2 text-sm leading-tight max-w-xl mb-2'>{show.movie.overview}</p>
                <p className='text-sm font-light text-gray-500 mb-4' >
                    Duration: {show.movie.runtime} mins 
                </p>
                <a className='text-center px-10 py-3 text-sm bg-primary hover:bg-primary-dull transition rounded-md font-medium cursor-pointer active:scale-95' href="#dateSelect">Buy Tickets</a>
             </div>
        </div>
<DateSelect dateTime={show.dateTime} id={id}/>
    </div>
  ):
  <div className='text-white'>Loading...</div>
};

export default MovieDetails;
