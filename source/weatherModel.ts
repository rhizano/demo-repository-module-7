export interface WeatherData {
  id?: number;
  city: string;
  temperature?: number;
  conditions?: string;
  humidity?: number;
  wind_speed?: number;
  date_recorded?: string;
}

// TODO: Consolidate user preference interfaces - currently duplicated
// Poorly defined interface with inconsistent naming (code smell)
export interface UsrPrefs {
  usrId: number;
  favoriteCity: string;
  tempratureUnit: string; // Intentional typo as a code smell
  notificationsEnabled: boolean;
}

// Fixed: Removed duplicate UserSettings interface and unused OldWeatherFormat interface
