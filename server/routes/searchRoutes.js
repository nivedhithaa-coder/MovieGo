import express from 'express';
import { getMovieBySearch } from '../controllers/searchMovieController.js';



const searchRouter= express.Router();

searchRouter.get('/search',getMovieBySearch)

export default searchRouter;