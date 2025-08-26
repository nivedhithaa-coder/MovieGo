import React from "react";
//import { dummyShowsData } from "../assets/assets";
import MovieCard from "../components/MovieCard";
import BlurCircle from "../components/BlurCircle";
import { useAppContext } from "../context/AppContext";

const Movies = () => {

  const {image_base_url,shows}=useAppContext();

  return shows.length > 0 ? (
    <div
      className="relative my-40 mb-60 px-6 md:px-16 lg:px-16 lg:px-40 xl:px-44
    overflow-hidden min-h-[80vh]"
    >
      <h1 className=" text-lg font-medium my-4">Now Showing</h1>
      <BlurCircle top="0px" left="25px" />
      <div className="flex flex-wrap max-sm:justify-center gap-8">
        {shows.map((show) => (
          <MovieCard movie={show.movie} key={show._id} />
        ))}
      </div>
    </div>
  ) : (
    <div className='flex flex-col items-center justify-center h-screen'>
      <h1 className=' tex-3xl font-bold text-center'>No Movies Available</h1>
    </div>
  );
};

export default Movies;
