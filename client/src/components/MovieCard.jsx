
import React from 'react';
import { StarIcon } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { useAppContext } from '../context/AppContext';

const MovieCard = ({ movie }) => {
  const navigate = useNavigate();
  const{image_base_url}=useAppContext();
  // handle genres (works if genres = ["Action"] or [{ name: "Action" }])
  const genresList = Array.isArray(movie.genres)
    ? movie.genres
        .slice(0, 2)
        .map(g => (typeof g === "string" ? g : g.name))
        .join(" | ")
    : "";

  const handleNavigate = () => {
    if (!movie?._id) {
      console.warn("Cannot navigate: movie._id is undefined");
      return;
    }
    const target = `/movies/${movie._id}`;
    console.log("Navigating to:", target);
    navigate(target);
    window.scrollTo(0, 0);
  };

  return (
    <div className="flex flex-col justify-between p-3 bg-gray-800 rounded-2xl hover:-translate-y-1 transition duration-300 w-70">
      <img
        onClick={handleNavigate}
        src={image_base_url+movie.backdrop_path}
        alt={movie.title}
        className="rounded-lg h-52 w-full object-cover object-right-bottom cursor-pointer"
      />

      <p className="font-semibold mt-2 truncate">{movie.title}</p>

      <p className="text-sm text-gray-400 mt-2">
        {movie.release_date ? new Date(movie.release_date).getFullYear() : ""}
        {genresList && ` • ${genresList}`}
        {movie.runtime ? ` • ${movie.runtime}m` : ""}
      </p>

      <div className="flex items-center justify-between mt-4 pb-3">
        <button
          onClick={handleNavigate}
          className="px-4 py-2 text-xs bg-primary hover:bg-primary-dull transition rounded-full font-medium cursor-pointer"
        >
          Buy Tickets
        </button>
        <p className="flex items-center gap-1 text-sm text-gray-400 mt-1 pr-1">
          <StarIcon className="w-4 h-4 text-primary fill-primary" />
          {movie.vote_average ? movie.vote_average.toFixed(1) : "N/A"}
        </p>
      </div>
    </div>
  );
};

export default MovieCard;
