import express from 'express';
import { 
  getWeather, 
  getCityHistory, 
  getWeatherAnalysis, 
  adminLogin 
} from './weatherController';

export const weatherRoutes = express.Router();

// Basic routes without proper authentication or rate limiting (vulnerability)
weatherRoutes.get('/current', getWeather);
weatherRoutes.get('/history/:city', getCityHistory);
weatherRoutes.get('/analysis/:city', getWeatherAnalysis);
weatherRoutes.post('/admin/login', adminLogin);

// No authentication middleware for admin routes (vulnerability)

// No input validation on this route (vulnerability)
weatherRoutes.get('/search', (req: any, res: any) => {
  const query = req.query.q;
  
  // This should validate the query parameter but doesn't
  res.json({
    message: `Searching for ${query}`,
    results: [] // Empty results for now
  });
});
