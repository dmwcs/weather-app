import { describe, it, expect, vi, beforeEach } from "vitest";
import { fetchWeather } from "../src/services/weatherPoller";

describe("fetchWeather", () => {
  beforeEach(() => {
    vi.restoreAllMocks();
  });

  it("should return current weather data", async () => {
    const mockWeather = {
      temperature_2m: 22.5,
      weather_code: 0,
      wind_speed_10m: 15,
      wind_direction_10m: 180,
    };

    vi.stubGlobal(
      "fetch",
      vi.fn().mockResolvedValue({
        json: () => Promise.resolve({ current: mockWeather }),
      })
    );

    const result = await fetchWeather(-33.87, 151.21);
    expect(result).toEqual(mockWeather);
  });

  it("should call the correct API URL", async () => {
    const mockFetch = vi.fn().mockResolvedValue({
      json: () => Promise.resolve({ current: {} }),
    });
    vi.stubGlobal("fetch", mockFetch);

    await fetchWeather(-33.87, 151.21);

    expect(mockFetch).toHaveBeenCalledWith(
      expect.stringContaining("latitude=-33.87&longitude=151.21")
    );
  });
});
