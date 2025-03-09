import { useState, useEffect } from 'react';

export interface LocationData {
  latitude: number;
  longitude: number;
  city: string;
  country: string;
  timezone: string;
}

// Default location (Oslo, Norway) as fallback
export const defaultLocation: LocationData = {
  latitude: 59.9139,
  longitude: 10.7522,
  city: 'Oslo',
  country: 'Norway',
  timezone: 'Europe/Oslo'
};

/**
 * Safely access localStorage with error handling
 */
const safeLocalStorage = {
  getItem: (key: string): string | null => {
    try {
      return localStorage.getItem(key);
    } catch (error) {
      console.warn('Error accessing localStorage:', error);
      return null;
    }
  },
  setItem: (key: string, value: string): void => {
    try {
      localStorage.setItem(key, value);
    } catch (error) {
      console.warn('Error writing to localStorage:', error);
    }
  }
};

/**
 * Attempts to fetch location data from multiple sources
 * @returns Location data including latitude, longitude, city, and country
 */
export const fetchUserLocation = async (): Promise<LocationData> => {
  try {
    // Try multiple geolocation APIs in sequence
    const apis = [
      // First try ipapi.co
      async () => {
        const response = await fetch('https://ipapi.co/json/', { mode: 'cors' });
        if (!response.ok) throw new Error(`ipapi.co error: ${response.status}`);
        const data = await response.json();
        return {
          latitude: data.latitude,
          longitude: data.longitude,
          city: data.city,
          country: data.country_name,
          timezone: data.timezone
        };
      },
      // Then try ipinfo.io as fallback
      async () => {
        const response = await fetch('https://ipinfo.io/json', { mode: 'cors' });
        if (!response.ok) throw new Error(`ipinfo.io error: ${response.status}`);
        const data = await response.json();
        // ipinfo returns location as "lat,lng" string
        const [lat, lng] = (data.loc || '0,0').split(',').map(Number);
        return {
          latitude: lat,
          longitude: lng,
          city: data.city || 'Unknown',
          country: data.country || 'Unknown',
          timezone: data.timezone || 'UTC'
        };
      },
      // Finally try browser geolocation API
      async () => {
        return new Promise<LocationData>((resolve, reject) => {
          if (!navigator.geolocation) {
            reject(new Error('Geolocation not supported'));
            return;
          }
          
          navigator.geolocation.getCurrentPosition(
            async (position) => {
              try {
                // Use reverse geocoding to get city and country
                const { latitude, longitude } = position.coords;
                const response = await fetch(
                  `https://nominatim.openstreetmap.org/reverse?format=json&lat=${latitude}&lon=${longitude}&zoom=10`,
                  { headers: { 'Accept-Language': navigator.language || 'en' } }
                );
                
                if (!response.ok) {
                  // If reverse geocoding fails, return coordinates only
                  resolve({
                    latitude,
                    longitude,
                    city: 'Unknown',
                    country: 'Unknown',
                    timezone: Intl.DateTimeFormat().resolvedOptions().timeZone
                  });
                  return;
                }
                
                const data = await response.json();
                resolve({
                  latitude,
                  longitude,
                  city: data.address?.city || data.address?.town || data.address?.village || 'Unknown',
                  country: data.address?.country || 'Unknown',
                  timezone: Intl.DateTimeFormat().resolvedOptions().timeZone
                });
              } catch (error) {
                // If reverse geocoding fails, return coordinates only
                resolve({
                  latitude: position.coords.latitude,
                  longitude: position.coords.longitude,
                  city: 'Unknown',
                  country: 'Unknown',
                  timezone: Intl.DateTimeFormat().resolvedOptions().timeZone
                });
              }
            },
            (error) => {
              reject(new Error(`Geolocation error: ${error.message}`));
            },
            { timeout: 10000, enableHighAccuracy: false }
          );
        });
      }
    ];
    
    // Try each API in sequence until one succeeds
    for (const apiCall of apis) {
      try {
        return await apiCall();
      } catch (error) {
        console.warn('Location API attempt failed:', error);
        // Continue to next API
      }
    }
    
    // If all APIs fail, use default location
    console.warn('All location APIs failed, using default location');
    return defaultLocation;
  } catch (error) {
    console.error('Failed to fetch location data:', error);
    // Return default location if there's an error
    return defaultLocation;
  }
};

/**
 * Custom hook to get the user's location with local storage caching
 * @returns Location data, loading state, and error
 */
export const useUserLocation = () => {
  const [location, setLocation] = useState<LocationData>(defaultLocation);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  
  useEffect(() => {
    const getLocation = async () => {
      try {
        setIsLoading(true);
        
        // Try to get cached location data first
        const cachedLocation = safeLocalStorage.getItem('userLocation');
        const cachedTimestamp = safeLocalStorage.getItem('userLocationTimestamp');
        
        // Use cached location if it's less than 24 hours old
        if (cachedLocation && cachedTimestamp) {
          try {
            const timestamp = parseInt(cachedTimestamp, 10);
            const now = Date.now();
            const oneDay = 24 * 60 * 60 * 1000; // 24 hours in milliseconds
            
            if (now - timestamp < oneDay) {
              const parsedLocation = JSON.parse(cachedLocation) as LocationData;
              setLocation(parsedLocation);
              setIsLoading(false);
              return;
            }
          } catch (parseError) {
            console.warn('Error parsing cached location:', parseError);
            // Continue to fetch new location if parsing fails
          }
        }
        
        // If no valid cached data, fetch new location
        const data = await fetchUserLocation();
        
        // Cache the location data
        safeLocalStorage.setItem('userLocation', JSON.stringify(data));
        safeLocalStorage.setItem('userLocationTimestamp', Date.now().toString());
        
        setLocation(data);
        setError(null);
      } catch (err) {
        console.error('Location error:', err);
        setError('Failed to fetch location data. Using default location.');
        
        // Ensure we have at least the default location
        setLocation(defaultLocation);
      } finally {
        setIsLoading(false);
      }
    };
    
    getLocation();
  }, []);
  
  return { location, isLoading, error };
}; 