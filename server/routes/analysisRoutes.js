import express from 'express'
import { bookingPatterns, getShowOccupancy, popularMovies, salesTrend } from '../Analysis/analysis.js';
import { protectAdmin } from '../middleware/auth.js';

const analysisRouter=express.Router();

analysisRouter.get('/popular-movies',popularMovies)
analysisRouter.get('/occupancy', getShowOccupancy)
analysisRouter.get('/pattern',bookingPatterns)
analysisRouter.get('/sales-trend',salesTrend)

export default analysisRouter;
