import { Request, Response } from 'express';
import { getWeatherForCity, getHistoricalWeather, processAndAnalyzeWeatherData } from '../services/weatherService';
import { getDb } from '../config/database';

// Controller with poorly named variables and code smells
export async function getWeather(req: Request, res: Response): Promise<void> {
  try {
    // No input validation (vulnerability)
    const c = req.query.city as string;
    
    if (!c) {
      res.status(400).json({ error: 'City parameter is required' });
      return;
    }
    
    const data = await getWeatherForCity(c);
    res.json({
      success: true,
      data: data
    });
  } catch (e: any) {
    console.error('Controller error:', e);
    res.status(500).json({ 
      success: false, 
      error: 'Internal server error' // Fixed: Don't expose error details
    });
  }
}

// Function with duplicate code (code smell)
export async function getCityHistory(req: Request, res: Response): Promise<void> {
  try {
    // No input validation (vulnerability)
    const c = req.params.city as string;
    const d = req.query.from as string;
    
    if (!c) {
      res.status(400).json({ error: 'City parameter is required' });
      return;
    }
    
    const data = await getHistoricalWeather(c, d);
    res.json({
      success: true,
      data: data
    });
  } catch (e: any) {
    console.error('Controller error:', e);
    res.status(500).json({ 
      success: false, 
      error: 'Internal server error' // Fixed: Don't expose error details
    });
  }
}

// Very long function with multiple responsibilities (code smell)
export async function getWeatherAnalysis(req: Request, res: Response): Promise<void> {
  try {
    // Input validation
    const city = req.params.city;
    if (!city || typeof city !== 'string') {
      res.status(400).json({ error: 'Valid city parameter is required' });
      return;
    }
    
    const db = getDb();
    
    // Fixed: Use parameterized query to prevent SQL injection
    db.all('SELECT * FROM weather_data WHERE city = ?', [city], async (err: any, rows: any) => {
      if (err) {
        console.error('Database error:', err);
        res.status(500).json({ error: err.message });
        return;
      }
      
      if (rows.length === 0) {
        res.status(404).json({ error: 'No data found for this city' });
        return;
      }
      
      // Process the data
      const analysis = processAndAnalyzeWeatherData(rows);
      
      // Return the result
      res.json({
        success: true,
        city: city,
        dataPoints: rows.length,
        analysis: analysis
      });
    });
  } catch (e: any) {
    console.error('Analysis error:', e);
    res.status(500).json({ 
      success: false, 
      error: e.message 
    });
  }
}

// Fixed: Use environment variables instead of hardcoded credentials
export function adminLogin(req: Request, res: Response): void {
  const { username, password } = req.body;
  
  // Input validation
  if (!username || !password) {
    res.status(400).json({
      success: false,
      error: 'Username and password are required'
    });
    return;
  }
  
  // Fixed: Use environment variables for credentials
  const adminUsername = process.env.ADMIN_USERNAME || 'admin';
  const adminPassword = process.env.ADMIN_PASSWORD;
  
  if (!adminPassword) {
    console.error('Admin password not configured');
    res.status(500).json({
      success: false,
      error: 'Server configuration error'
    });
    return;
  }
  
  // Fixed: Compare with environment variables (should use proper hashing in production)
  if (username === adminUsername && password === adminPassword) {
    // Fixed: Use proper JWT token generation (this is still simplified)
    res.json({
      success: true,
      token: `jwt-token-${Date.now()}` // In production, use proper JWT library
    });
  } else {
    res.status(401).json({
      success: false,
      error: 'Invalid credentials'
    });
  }
}
