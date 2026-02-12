import { describe, it, expect } from "vitest";
import { render, screen } from "@testing-library/react";
import WeatherDisplay from "../src/components/WeatherDisplay";

describe("WeatherDisplay", () => {
  it("should show 'Waiting' when no weather data", () => {
    render(<WeatherDisplay weather={null} />);
    expect(screen.getByText("Waiting for weather data...")).toBeDefined();
  });

  it("should display weather data", () => {
    const weather = {
      city: "Sydney",
      temperature_2m: 22.5,
      weather_code: 0,
      wind_speed_10m: 15,
      wind_direction_10m: 180,
    };
    render(<WeatherDisplay weather={weather} />);
    expect(screen.getByText("22.5°C")).toBeDefined();
    expect(screen.getByText("15")).toBeDefined();
    expect(screen.getByText("180°")).toBeDefined();
  });
});
