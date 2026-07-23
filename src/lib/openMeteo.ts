import type { Locale } from '../i18n'

export type GeoResult = {
  id: number
  name: string
  latitude: number
  longitude: number
  country?: string
  admin1?: string
}

export type CurrentWeather = {
  temperature: number
  feelsLike: number
  humidity: number
  windSpeed: number
  weatherCode: number
}

export type DailyForecast = {
  date: string
  max: number
  min: number
  weatherCode: number
}

export type Forecast = {
  current: CurrentWeather
  daily: DailyForecast[]
}

export async function searchPlaces(query: string, locale: Locale): Promise<GeoResult[]> {
  const url = `https://geocoding-api.open-meteo.com/v1/search?name=${encodeURIComponent(query)}&count=5&language=${locale}&format=json`
  const response = await fetch(url)
  if (!response.ok) throw new Error('geocoding-failed')
  const data = await response.json()
  return (data.results ?? []).map((item: Record<string, unknown>): GeoResult => ({
    id: item.id as number,
    name: item.name as string,
    latitude: item.latitude as number,
    longitude: item.longitude as number,
    country: item.country as string | undefined,
    admin1: item.admin1 as string | undefined,
  }))
}

export async function fetchForecast(latitude: number, longitude: number): Promise<Forecast> {
  const url = `https://api.open-meteo.com/v1/forecast?latitude=${latitude}&longitude=${longitude}&current=temperature_2m,apparent_temperature,relative_humidity_2m,wind_speed_10m,weather_code&daily=temperature_2m_max,temperature_2m_min,weather_code&timezone=auto&forecast_days=6`
  const response = await fetch(url)
  if (!response.ok) throw new Error('forecast-failed')
  const data = await response.json()
  const daily: DailyForecast[] = (data.daily?.time ?? []).map((date: string, index: number) => ({
    date,
    max: data.daily.temperature_2m_max[index],
    min: data.daily.temperature_2m_min[index],
    weatherCode: data.daily.weather_code[index],
  }))
  return {
    current: {
      temperature: data.current.temperature_2m,
      feelsLike: data.current.apparent_temperature,
      humidity: data.current.relative_humidity_2m,
      windSpeed: data.current.wind_speed_10m,
      weatherCode: data.current.weather_code,
    },
    daily,
  }
}
