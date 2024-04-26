const API_KEY = import.meta.env.VITE_API_KEY;
const API_URL = 'https://api.openweathermap.org/data/2.5/weather';

export const getFetchWeatherUrl = (
  city: string,
  tempScale: OpenWeatherTempScale,
) => {
  return `${API_URL}?q=${city}&units=${tempScale}&appid=${API_KEY}`;
};

export const weatherFetcher = async ([city, tempScale]: [
  string,
  OpenWeatherTempScale,
]): Promise<OpenWeatherData> => {
  const res = await fetch(getFetchWeatherUrl(city, tempScale));
  return await res.json();
};

export interface OpenWeatherData {
  name: string;
  main: {
    feels_like: number;
    humidity: number;
    pressure: number;
    temp: number;
    temp_max: number;
    temp_min: number;
  };
  weather: {
    description: string;
    icon: string;
    id: number;
    main: string;
  }[];
  wind: {
    deg: number;
    speed: number;
  };
}

export type OpenWeatherTempScale = 'metric' | 'imperial';

export function getWeatherIconSrc(iconCode: string) {
  return `https://openweathermap.org/img/wn/${iconCode}@2x.png`;
}
