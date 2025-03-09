import React, { useState } from "react";
import GlassCard from "@/components/ui/glass-card";
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, ReferenceLine } from "recharts";
import { Cloud, Sun, Droplets, Wind, Thermometer, Moon, RefreshCw } from "lucide-react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { weatherCodeToDescription, weatherCodeToIcon, useWeatherData } from "@/lib/weather-service";
import { Skeleton } from "@/components/ui/skeleton";
import { useUserLocation } from "@/lib/location-service";
import { Button } from "@/components/ui/button";

interface WeatherForecastProps {
  systemCapacityKW: number;
}

const WeatherForecast = ({ systemCapacityKW }: WeatherForecastProps) => {
  const [retryCount, setRetryCount] = useState(0);
  const { location, isLoading: isLocationLoading, error: locationError } = useUserLocation();
  const { weatherData, solarForecast, isLoading: isWeatherLoading, error: weatherError } = useWeatherData(
    location.latitude,
    location.longitude,
    systemCapacityKW
  );
  
  const isLoading = isLocationLoading || isWeatherLoading;
  const error = locationError || weatherError;
  
  // Handle retry
  const handleRetry = () => {
    setRetryCount(retryCount + 1);
    // Force reload the page to retry fetching location and weather data
    window.location.reload();
  };
  
  // Format date for display
  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', { weekday: 'short', month: 'short', day: 'numeric' });
  };
  
  // Format time for display
  const formatTime = (timeString: string) => {
    const date = new Date(timeString);
    return date.toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit' });
  };
  
  // Format hourly data for charts
  const formatHourlyData = () => {
    if (!weatherData || !solarForecast) return [];
    
    // Get the next 24 hours of data
    return weatherData.hourly.time.slice(0, 24).map((time, index) => {
      return {
        time: formatTime(time),
        temperature: weatherData.hourly.temperature_2m[index],
        cloudCover: weatherData.hourly.cloud_cover[index],
        precipitation: weatherData.hourly.precipitation[index],
        precipitationProbability: weatherData.hourly.precipitation_probability[index],
        production: solarForecast.production[index],
        efficiency: solarForecast.efficiency[index],
        weatherCode: weatherData.hourly.weather_code[index],
        isDay: weatherData.hourly.is_day[index]
      };
    });
  };
  
  // Format daily data for display
  const formatDailyData = () => {
    if (!weatherData) return [];
    
    return weatherData.daily.time.map((time, index) => {
      return {
        date: formatDate(time),
        maxTemp: weatherData.daily.temperature_2m_max[index],
        minTemp: weatherData.daily.temperature_2m_min[index],
        precipitation: weatherData.daily.precipitation_sum[index],
        precipitationProbability: weatherData.daily.precipitation_probability_max[index],
        weatherCode: weatherData.daily.weather_code[index],
        sunrise: formatTime(weatherData.daily.sunrise[index]),
        sunset: formatTime(weatherData.daily.sunset[index])
      };
    });
  };
  
  // Calculate total daily production
  const calculateDailyProduction = () => {
    if (!solarForecast) return [];
    
    // Group by day and sum production
    const dailyProduction: Record<string, number> = {};
    
    solarForecast.time.forEach((time, index) => {
      const date = time.split('T')[0];
      const production = solarForecast.production[index];
      
      if (!dailyProduction[date]) {
        dailyProduction[date] = 0;
      }
      
      dailyProduction[date] += production;
    });
    
    // Convert to array and format
    return Object.entries(dailyProduction).map(([date, production]) => {
      return {
        date: formatDate(date),
        production: parseFloat(production.toFixed(1))
      };
    });
  };
  
  if (isLoading) {
    return (
      <GlassCard 
        title="Weather & Solar Forecast"
        description="Loading weather data..."
        className="h-full"
      >
        <div className="space-y-2">
          <div className="flex justify-between">
            <Skeleton className="h-8 w-1/3" />
            <Skeleton className="h-8 w-1/3" />
          </div>
          <Skeleton className="h-[160px] w-full" />
          <div className="grid grid-cols-4 gap-1">
            <Skeleton className="h-14 w-full" />
            <Skeleton className="h-14 w-full" />
            <Skeleton className="h-14 w-full" />
            <Skeleton className="h-14 w-full" />
          </div>
        </div>
      </GlassCard>
    );
  }
  
  if (error || !weatherData || !solarForecast) {
    return (
      <GlassCard 
        title="Weather & Solar Forecast"
        description="Unable to load weather data"
        className="h-full"
      >
        <div className="flex flex-col items-center justify-center h-[200px] text-center">
          <Cloud className="h-12 w-12 text-muted-foreground mb-2" />
          <p className="text-muted-foreground mb-2 text-xs">{error || "Failed to load weather data. Please try again later."}</p>
          <Button 
            variant="outline" 
            onClick={handleRetry}
            className="flex items-center gap-1"
            size="sm"
          >
            <RefreshCw size={12} />
            <span className="text-xs">Retry</span>
          </Button>
          <p className="text-[10px] text-muted-foreground mt-2">
            Using default location: {location.city}, {location.country}
          </p>
        </div>
      </GlassCard>
    );
  }
  
  const hourlyData = formatHourlyData();
  const dailyData = formatDailyData();
  const dailyProduction = calculateDailyProduction();
  
  return (
    <GlassCard 
      title="Weather & Solar Forecast"
      description={`${location.city}, ${location.country} - ${formatDate(weatherData.current.time)}`}
      className="h-full"
    >
      <div className="space-y-2">
        {/* Current Weather */}
        <div className="flex flex-wrap justify-between items-center p-2 rounded-md bg-gradient-to-r from-blue-500/10 to-blue-500/5 border border-blue-500/20">
          <div className="flex items-center gap-1.5">
            <div className="text-2xl">
              {weatherCodeToIcon[weatherData.current.weather_code]}
            </div>
            <div>
              <p className="text-base font-semibold leading-tight">{weatherData.current.temperature_2m}°C</p>
              <p className="text-[10px] text-muted-foreground leading-tight">{weatherCodeToDescription[weatherData.current.weather_code]}</p>
            </div>
          </div>
          
          <div className="grid grid-cols-2 gap-x-3 gap-y-0.5 text-[10px]">
            <div className="flex items-center gap-1">
              <Thermometer size={12} className="text-red-500" />
              <span>Feels like: {weatherData.current.apparent_temperature}°C</span>
            </div>
            <div className="flex items-center gap-1">
              <Droplets size={12} className="text-blue-500" />
              <span>Humidity: {weatherData.current.relative_humidity_2m}%</span>
            </div>
            <div className="flex items-center gap-1">
              <Cloud size={12} className="text-gray-500" />
              <span>Cloud: {weatherData.current.cloud_cover}%</span>
            </div>
            <div className="flex items-center gap-1">
              <Wind size={12} className="text-cyan-500" />
              <span>Wind: {weatherData.current.wind_speed_10m} km/h</span>
            </div>
          </div>
        </div>
        
        <Tabs defaultValue="hourly" className="w-full">
          <TabsList className="grid w-full grid-cols-3">
            <TabsTrigger value="hourly" className="text-[10px]">Hourly</TabsTrigger>
            <TabsTrigger value="daily" className="text-[10px]">7-Day</TabsTrigger>
            <TabsTrigger value="solar" className="text-[10px]">Solar</TabsTrigger>
          </TabsList>
          
          {/* Hourly Forecast Tab */}
          <TabsContent value="hourly" className="pt-2">
            <div className="mb-2">
              <ResponsiveContainer width="100%" height={160}>
                <LineChart
                  data={hourlyData}
                  margin={{ top: 5, right: 5, left: 0, bottom: 5 }}
                >
                  <CartesianGrid strokeDasharray="3 3" stroke="#444" opacity={0.1} />
                  <XAxis 
                    dataKey="time" 
                    stroke="#888"
                    fontSize={8}
                    tickFormatter={(time) => time.split(' ')[0]}
                  />
                  <YAxis 
                    yAxisId="temp"
                    stroke="#888"
                    fontSize={8}
                    tickFormatter={(value) => `${value}°C`}
                  />
                  <YAxis 
                    yAxisId="precip"
                    orientation="right"
                    stroke="#888"
                    fontSize={8}
                    tickFormatter={(value) => `${value}%`}
                    domain={[0, 100]}
                  />
                  <Tooltip 
                    formatter={(value, name) => {
                      if (name === 'temperature') return [`${value}°C`, 'Temperature'];
                      if (name === 'precipitationProbability') return [`${value}%`, 'Precipitation Probability'];
                      return [value, name];
                    }}
                    labelFormatter={(time) => `${time}`}
                  />
                  <Line 
                    yAxisId="temp"
                    type="monotone" 
                    dataKey="temperature" 
                    stroke="#ff7c43" 
                    strokeWidth={1.5}
                    dot={{ r: 1 }}
                    activeDot={{ r: 3 }}
                  />
                  <Line 
                    yAxisId="precip"
                    type="monotone" 
                    dataKey="precipitationProbability" 
                    stroke="#1e88e5" 
                    strokeWidth={1.5}
                    dot={{ r: 1 }}
                    activeDot={{ r: 3 }}
                  />
                </LineChart>
              </ResponsiveContainer>
            </div>
            
            <div className="grid grid-cols-4 gap-1 overflow-x-auto">
              {hourlyData.slice(0, 8).map((hour, index) => (
                <div 
                  key={index} 
                  className="flex flex-col items-center p-1 rounded-sm bg-gradient-to-b from-blue-500/5 to-transparent border border-blue-500/10"
                >
                  <p className="text-[10px] text-muted-foreground">{hour.time}</p>
                  <div className="text-base my-0.5">{weatherCodeToIcon[hour.weatherCode]}</div>
                  <p className="text-[10px] font-medium">{hour.temperature}°C</p>
                  <div className="flex items-center gap-0.5">
                    <Droplets size={8} className="text-blue-500" />
                    <p className="text-[8px]">{hour.precipitationProbability}%</p>
                  </div>
                </div>
              ))}
            </div>
          </TabsContent>
          
          {/* Daily Forecast Tab */}
          <TabsContent value="daily" className="pt-2">
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-7 gap-1">
              {dailyData.map((day, index) => (
                <div 
                  key={index} 
                  className="flex flex-col p-1.5 rounded-sm bg-gradient-to-b from-blue-500/5 to-transparent border border-blue-500/10"
                >
                  <div className="flex justify-between items-center mb-0.5">
                    <p className="text-[10px] font-medium">{day.date}</p>
                    <div className="text-base">{weatherCodeToIcon[day.weatherCode]}</div>
                  </div>
                  
                  <div className="flex justify-between items-center mb-0.5">
                    <p className="text-[10px]">
                      <span className="text-red-500">{day.maxTemp}°</span> / <span className="text-blue-500">{day.minTemp}°</span>
                    </p>
                    <div className="flex items-center gap-0.5">
                      <Droplets size={8} className="text-blue-500" />
                      <p className="text-[8px]">{day.precipitationProbability}%</p>
                    </div>
                  </div>
                  
                  <div className="flex justify-between text-[8px] text-muted-foreground">
                    <div className="flex items-center gap-0.5">
                      <Sun size={8} className="text-amber-500" />
                      <span>{day.sunrise}</span>
                    </div>
                    <div className="flex items-center gap-0.5">
                      <Moon size={8} className="text-indigo-400" />
                      <span>{day.sunset}</span>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </TabsContent>
          
          {/* Solar Production Tab */}
          <TabsContent value="solar" className="pt-2">
            <div className="mb-2">
              <ResponsiveContainer width="100%" height={160}>
                <LineChart
                  data={hourlyData}
                  margin={{ top: 5, right: 5, left: 0, bottom: 5 }}
                >
                  <CartesianGrid strokeDasharray="3 3" stroke="#444" opacity={0.1} />
                  <XAxis 
                    dataKey="time" 
                    stroke="#888"
                    fontSize={8}
                    tickFormatter={(time) => time.split(' ')[0]}
                  />
                  <YAxis 
                    yAxisId="production"
                    stroke="#888"
                    fontSize={8}
                    tickFormatter={(value) => `${value}kW`}
                  />
                  <YAxis 
                    yAxisId="efficiency"
                    orientation="right"
                    stroke="#888"
                    fontSize={8}
                    tickFormatter={(value) => `${value}%`}
                    domain={[0, 100]}
                  />
                  <Tooltip 
                    formatter={(value, name) => {
                      if (name === 'production') return [`${value} kW`, 'Production'];
                      if (name === 'efficiency') return [`${value}%`, 'Efficiency'];
                      return [value, name];
                    }}
                    labelFormatter={(time) => `${time}`}
                  />
                  <ReferenceLine 
                    y={0} 
                    stroke="#666" 
                    strokeDasharray="3 3" 
                    yAxisId="production"
                  />
                  <Line 
                    yAxisId="production"
                    type="monotone" 
                    dataKey="production" 
                    stroke="#FFB13B" 
                    strokeWidth={1.5}
                    dot={{ r: 1 }}
                    activeDot={{ r: 3 }}
                  />
                  <Line 
                    yAxisId="efficiency"
                    type="monotone" 
                    dataKey="efficiency" 
                    stroke="#4ade80" 
                    strokeWidth={1.5}
                    dot={{ r: 1 }}
                    activeDot={{ r: 3 }}
                  />
                </LineChart>
              </ResponsiveContainer>
            </div>
            
            <div className="grid grid-cols-2 gap-1">
              <div className="p-1.5 rounded-sm bg-gradient-to-r from-amber-500/10 to-amber-500/5 border border-amber-500/20">
                <p className="text-[10px] text-muted-foreground mb-0.5">Today&apos;s Forecast</p>
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-semibold leading-tight">{dailyProduction[0]?.production.toFixed(1)} kWh</p>
                    <p className="text-[8px] text-muted-foreground leading-tight">Expected Production</p>
                  </div>
                  <div className="p-1 rounded-full bg-amber-500/20 text-amber-500">
                    <Sun size={14} />
                  </div>
                </div>
              </div>
              
              <div className="p-1.5 rounded-sm bg-gradient-to-r from-blue-500/10 to-blue-500/5 border border-blue-500/20">
                <p className="text-[10px] text-muted-foreground mb-0.5">Weather Impact</p>
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-semibold leading-tight">{
                      weatherData.current.cloud_cover > 70 
                        ? 'High' 
                        : weatherData.current.cloud_cover > 30 
                          ? 'Medium' 
                          : 'Low'
                    }</p>
                    <p className="text-[8px] text-muted-foreground leading-tight">Cloud Impact</p>
                  </div>
                  <div className="p-1 rounded-full bg-blue-500/20 text-blue-500">
                    <Cloud size={14} />
                  </div>
                </div>
              </div>
            </div>
            
            <div className="mt-2">
              <p className="text-[10px] font-medium mb-0.5">7-Day Production Forecast</p>
              <div className="grid grid-cols-7 gap-0.5">
                {dailyProduction.map((day, index) => (
                  <div key={index} className="flex flex-col items-center">
                    <div 
                      className="w-full bg-amber-500/20 rounded-t-sm" 
                      style={{ 
                        height: `${Math.max(12, (day.production / Math.max(...dailyProduction.map(d => d.production))) * 40)}px` 
                      }}
                    ></div>
                    <p className="text-[8px] mt-0.5">{day.date.split(' ')[0]}</p>
                    <p className="text-[8px] font-medium">{day.production}</p>
                  </div>
                ))}
              </div>
            </div>
          </TabsContent>
        </Tabs>
      </div>
    </GlassCard>
  );
};

export default WeatherForecast; 