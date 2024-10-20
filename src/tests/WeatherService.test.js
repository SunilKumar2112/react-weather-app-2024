import { jest } from '@jest/globals';
import 'jest-fetch-mock';
import {
  getWeatherData,
  formatForecastWeather,
  getFormattedWeatherData,
  iconUrlFromCode,
  formatToLocalTime
} from '../services/weatherService';

describe('Weather Service', () => {
  beforeEach(() => {
    fetch.resetMocks();
  });

  describe('getWeatherData', () => {
    it('fetches weather data successfully', async () => {
      const mockResponse = { name: 'London', main: { temp: 15 } };
      fetch.mockResponseOnce(JSON.stringify(mockResponse));

      const result = await getWeatherData('weather', { q: 'London' });
      expect(result).toEqual(mockResponse);
      expect(fetch).toHaveBeenCalledWith(expect.stringContaining('https://api.openweathermap.org/data/2.5/weather?q=London&appid='));
    });
  });

  describe('formatForecastWeather', () => {
    it('filters and formats hourly and daily forecast correctly', () => {
      const mockData = [
        { dt: 1609459200, main: { temp: 20 }, weather: [{ icon: '01d' }] },
        { dt: 1609462800, main: { temp: 21 }, weather: [{ icon: '02d' }] }
      ];
      const result = formatForecastWeather(1609459200, 0, mockData);

      expect(result).toHaveProperty('hourly');
      expect(result).toHaveProperty('daily');
      expect(result.hourly.length).toBe(2);
      expect(result.daily.length).toBe(2);
    });
  });



  describe('formatToLocalTime', () => {
    it('formats date and time correctly with default format', () => {
      const timestamp = 1609459200;
      const timezone = 0;
      const result = formatToLocalTime(timestamp, timezone);
      expect(result).toMatch(/Friday, 01 Jan 2021 | Local time: 12:00 AM/);
    });
  });
});