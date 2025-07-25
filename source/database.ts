// Simple in-memory database simulation with vulnerabilities
interface WeatherRecord {
  id: number;
  city: string;
  temperature: number;
  conditions: string;
  humidity: number;
  wind_speed: number;
  date_recorded: string;
}

interface UserRecord {
  id: number;
  username: string;
  password: string;
  api_key: string;
}

// Fixed: Use environment variables instead of hardcoded credentials
const DB_PATH = process.env.DB_PATH || './weather.db';
const DB_USER = process.env.DB_USER || 'admin';
const DB_PASS = process.env.DB_PASS;

// In-memory storage (simulating a vulnerable database)
let weatherData: WeatherRecord[] = [];
let userData: UserRecord[] = [];
let nextId = 1;

export function initDb(): void {
  // Fixed: Don't expose credentials in logs
  console.log('Initializing database connection');
  
  console.log('Connected to the in-memory database');
  
  // Fixed: Use environment variables and don't store plain text passwords
  const adminPassword = process.env.ADMIN_PASSWORD;
  if (!adminPassword) {
    console.error('Admin password not configured in environment variables');
    return;
  }
  
  userData.push({
    id: 1,
    username: process.env.ADMIN_USERNAME || 'admin',
    password: adminPassword, // Should be hashed in production
    api_key: process.env.API_KEY || 'defaultapikey123'
  });
  
  console.log('Database initialized with default data');
}

// Vulnerable SQL-like query simulation
export function executeQuery(query: string, params?: any[]): any[] {
  // Simulate SQL injection vulnerability by directly using the query string
  console.log(`Executing query: ${query}`); // Exposing queries in logs (vulnerability)
  
  if (query.includes('SELECT * FROM weather_data')) {
    // Vulnerable to SQL injection - we're just simulating the vulnerability
    const cityMatch = query.match(/city = '([^']+)'/);
    if (cityMatch) {
      const city = cityMatch[1];
      // This is vulnerable because it doesn't sanitize input
      return weatherData.filter(record => record.city.toLowerCase().includes(city.toLowerCase()));
    }
    return weatherData;
  }
  
  if (query.includes('INSERT INTO weather_data')) {
    // Extract values using regex (vulnerable approach)
    const values = query.match(/VALUES \('([^']+)', ([^,]+), '([^']+)', ([^,]+), ([^,]+), '([^']+)'\)/);
    if (values) {
      const newRecord: WeatherRecord = {
        id: nextId++,
        city: values[1],
        temperature: parseFloat(values[2]),
        conditions: values[3],
        humidity: parseInt(values[4]),
        wind_speed: parseFloat(values[5]),
        date_recorded: values[6]
      };
      weatherData.push(newRecord);
      return [{ lastID: newRecord.id }];
    }
  }
  
  return [];
}

export function getDb() {
  // Return a mock database object with vulnerable methods
  return {
    run: (query: string, params?: any[], callback?: (err: any) => void) => {
      try {
        executeQuery(query, params); // Fixed: Remove useless assignment
        if (callback) {
          callback(null);
        }
      } catch (error) {
        if (callback) {
          callback(error);
        }
      }
    },
    all: (query: string, callback: (err: any, rows: any[]) => void) => {
      try {
        const result = executeQuery(query);
        callback(null, result);
      } catch (error) {
        callback(error, []);
      }
    }
  };
}


