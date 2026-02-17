import React, { useState, useEffect, useRef } from "react";
import './Weather.css';

const WeatherAPI = () => {
  // --- State Management ---
  const [query, setQuery] = useState("");
  const [suggestions, setSuggestions] = useState([]);
  const [weather, setWeather] = useState(null);
  
  // UI States
  const [loadingSearch, setLoadingSearch] = useState(false);
  const [loadingWeather, setLoadingWeather] = useState(false);
  const [showDropdown, setShowDropdown] = useState(false);
  const [error, setError] = useState("");

  // Ref to handle clicking outside the dropdown to close it
  const wrapperRef = useRef(null);

  // --- 1. Autocomplete Search Logic (Debounced) ---
  useEffect(() => {
    // If the input is empty or too short, clear suggestions
    if (query.length < 1) {
      setSuggestions([]);
      setShowDropdown(false);
      return;
    }

    // Debounce: Wait 400ms after user stops typing to avoid too many API calls
    const timer = setTimeout(async () => {
      setLoadingSearch(true);
      try {
        const response = await fetch(
          `https://geocoding-api.open-meteo.com/v1/search?name=${query}&count=5&language=en&format=json`
        );
        const data = await response.json();

        if (data.results) {
          setSuggestions(data.results);
          setShowDropdown(true);
        } else {
          setSuggestions([]);
          setShowDropdown(false);
        }
      } catch (err) {
        console.error("Search error:", err);
      } finally {
        setLoadingSearch(false);
      }
    }, 400);

    return () => clearTimeout(timer);
  }, [query]);

  // --- 2. Handle Clicking a City from List ---
  const handleCitySelect = async (city) => {
    // 1. Update UI
    setQuery(`${city.name}, ${city.country}`);
    setShowDropdown(false);
    setSuggestions([]);
    
    // 2. Fetch Weather for selected coordinates
    fetchWeather(city.latitude, city.longitude, city.name, city.country);
  };

  // --- 3. Fetch Weather Data ---
  const fetchWeather = async (lat, lon, name, country) => {
    setLoadingWeather(true);
    setError("");
    setWeather(null);

    try {
      const response = await fetch(
        `https://api.open-meteo.com/v1/forecast?latitude=${lat}&longitude=${lon}&current_weather=true`
      );
      const data = await response.json();

      if (data.current_weather) {
        setWeather({
          ...data.current_weather,
          cityName: name,
          countryName: country,
        });
      } else {
        setError("Weather data not available.");
      }
    } catch (err) {
      setError("Failed to fetch weather data.");
    } finally {
      setLoadingWeather(false);
    }
  };

  // Helper: Close dropdown if clicked outside
  useEffect(() => {
    function handleClickOutside(event) {
      if (wrapperRef.current && !wrapperRef.current.contains(event.target)) {
        setShowDropdown(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, [wrapperRef]);

  // Helper: Get Icon/Text based on WMO code
  const getWeatherInfo = (code) => {
    if (code === 0) return { icon: "☀️", text: "Clear Sky" };
    if (code >= 1 && code <= 3) return { icon: "⛅", text: "Partly Cloudy" };
    if (code >= 45 && code <= 48) return { icon: "🌫️", text: "Fog" };
    if (code >= 51 && code <= 67) return { icon: "🌧️", text: "Rain" };
    if (code >= 71) return { icon: "❄️", text: "Snow" };
    if (code >= 95) return { icon: "⛈️", text: "Thunderstorm" };
    return { icon: "🌡️", text: "Unknown" };
  };

  return (
    <div className="weather-page-container">
      <div className="weather-card" ref={wrapperRef}>
        <h2 className="weather-app-title">Weather App</h2>

        {/* --- Search Section --- */}
        <div className="weather-search-container">
          <div className="weather-input-wrapper">
            {/* Search Icon */}
            <svg className="weather-search-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <circle cx="11" cy="11" r="8" />
              <line x1="21" y1="21" x2="16.65" y2="16.65" />
            </svg>
            
            <input
              type="text"
              placeholder="Search for a city..."
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              onFocus={() => query.length > 0 && setShowDropdown(true)}
              className="weather-search-input"
            />
            
            {loadingSearch && <div className="weather-spinner-small"></div>}
          </div>

          <button className="weather-btn-search" onClick={() => setShowDropdown(true)}>
            Search
          </button>

          {/* --- Autocomplete Dropdown --- */}
          {showDropdown && suggestions.length > 0 && (
            <ul className="weather-dropdown-list">
              {suggestions.map((city) => (
                <li key={city.id} onClick={() => handleCitySelect(city)}>
                  <span className="weather-city-name">{city.name}</span>
                  <span className="weather-city-country">{city.admin1 ? `${city.admin1}, ` : ""}{city.country}</span>
                  <span className="weather-select-arrow">➔</span>
                </li>
              ))}
            </ul>
          )}

           {/* No Results State */}
           {showDropdown && suggestions.length === 0 && query.length > 2 && !loadingSearch && (
            <div className="weather-dropdown-list empty">
              City not found
            </div>
          )}
        </div>

        <div className="weather-divider"></div>

        {/* --- Weather Display Section --- */}
        <div className="result-area">
          {loadingWeather && <div className="weather-status-text">Loading weather data...</div>}
          {error && <div className="weather-status-text error">{error}</div>}
          
          {!weather && !loadingWeather && !error && (
            <div className="weather-status-text placeholder">
              Search for a city to see the weather
            </div>
          )}

          {weather && !loadingWeather && (
            <div className="weather-info weather-fade-in">
              <div className="weather-icon-large">
                {getWeatherInfo(weather.weathercode).icon}
              </div>
              <div className="weather-temp-display">
                {Math.round(weather.temperature)}°C
              </div>
              <div className="weather-condition-text">
                {getWeatherInfo(weather.weathercode).text}
              </div>
              <div className="weather-location-text">
                📍 {weather.cityName}, {weather.countryName}
              </div>
              <div className="weather-extra-details">
                <span>💨 Wind: {weather.windspeed} km/h</span>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default WeatherAPI;