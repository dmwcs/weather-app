interface WeatherData {
  city: string;
  temperature_2m: number;
  weather_code: number;
  wind_speed_10m: number;
  wind_direction_10m: number;
}

interface WeatherDisplayProps {
  weather: WeatherData | null;
}

export default function WeatherDisplay({ weather }: WeatherDisplayProps) {
  if (!weather) {
    return <p className="text-gray-400">Waiting for weather data...</p>;
  }

  return (
    <div className="grid grid-cols-3 gap-4">
      <div className="bg-gray-700 p-4 rounded-lg text-center">
        <div className="text-3xl font-bold">{weather.temperature_2m}°C</div>
        <div className="text-gray-400 text-sm mt-1">Temperature</div>
      </div>
      <div className="bg-gray-700 p-4 rounded-lg text-center">
        <div className="text-3xl font-bold">{weather.wind_speed_10m}</div>
        <div className="text-gray-400 text-sm mt-1">Wind Speed (km/h)</div>
      </div>
      <div className="bg-gray-700 p-4 rounded-lg text-center">
        <div className="text-3xl font-bold">{weather.wind_direction_10m}°</div>
        <div className="text-gray-400 text-sm mt-1">Wind Direction</div>
      </div>
    </div>
  );
}
