import type { Locale } from '../i18n'

type WeatherEntry = { icon: string; label: Record<Locale, string> }

// Códigos WMO devolvidos pela Open-Meteo (`weather_code`) — https://open-meteo.com/en/docs
export const weatherCodes: Record<number, WeatherEntry> = {
  0: { icon: '☀️', label: { pt: 'Céu limpo', en: 'Clear sky', de: 'Klarer Himmel' } },
  1: { icon: '🌤️', label: { pt: 'Maioritariamente limpo', en: 'Mainly clear', de: 'Überwiegend klar' } },
  2: { icon: '⛅', label: { pt: 'Parcialmente nublado', en: 'Partly cloudy', de: 'Teilweise bewölkt' } },
  3: { icon: '☁️', label: { pt: 'Nublado', en: 'Overcast', de: 'Bedeckt' } },
  45: { icon: '🌫️', label: { pt: 'Nevoeiro', en: 'Fog', de: 'Nebel' } },
  48: { icon: '🌫️', label: { pt: 'Nevoeiro gelado', en: 'Depositing rime fog', de: 'Reifnebel' } },
  51: { icon: '🌦️', label: { pt: 'Chuvisco fraco', en: 'Light drizzle', de: 'Leichter Nieselregen' } },
  53: { icon: '🌦️', label: { pt: 'Chuvisco moderado', en: 'Moderate drizzle', de: 'Mäßiger Nieselregen' } },
  55: { icon: '🌦️', label: { pt: 'Chuvisco intenso', en: 'Dense drizzle', de: 'Starker Nieselregen' } },
  56: { icon: '🌧️', label: { pt: 'Chuvisco gelado fraco', en: 'Light freezing drizzle', de: 'Leichter gefrierender Nieselregen' } },
  57: { icon: '🌧️', label: { pt: 'Chuvisco gelado intenso', en: 'Dense freezing drizzle', de: 'Starker gefrierender Nieselregen' } },
  61: { icon: '🌧️', label: { pt: 'Chuva fraca', en: 'Slight rain', de: 'Leichter Regen' } },
  63: { icon: '🌧️', label: { pt: 'Chuva moderada', en: 'Moderate rain', de: 'Mäßiger Regen' } },
  65: { icon: '🌧️', label: { pt: 'Chuva forte', en: 'Heavy rain', de: 'Starker Regen' } },
  66: { icon: '🌧️', label: { pt: 'Chuva gelada fraca', en: 'Light freezing rain', de: 'Leichter gefrierender Regen' } },
  67: { icon: '🌧️', label: { pt: 'Chuva gelada forte', en: 'Heavy freezing rain', de: 'Starker gefrierender Regen' } },
  71: { icon: '🌨️', label: { pt: 'Neve fraca', en: 'Slight snow fall', de: 'Leichter Schneefall' } },
  73: { icon: '🌨️', label: { pt: 'Neve moderada', en: 'Moderate snow fall', de: 'Mäßiger Schneefall' } },
  75: { icon: '🌨️', label: { pt: 'Neve forte', en: 'Heavy snow fall', de: 'Starker Schneefall' } },
  77: { icon: '🌨️', label: { pt: 'Grãos de neve', en: 'Snow grains', de: 'Schneegriesel' } },
  80: { icon: '🌦️', label: { pt: 'Aguaceiros fracos', en: 'Slight rain showers', de: 'Leichte Regenschauer' } },
  81: { icon: '🌦️', label: { pt: 'Aguaceiros moderados', en: 'Moderate rain showers', de: 'Mäßige Regenschauer' } },
  82: { icon: '⛈️', label: { pt: 'Aguaceiros violentos', en: 'Violent rain showers', de: 'Heftige Regenschauer' } },
  85: { icon: '🌨️', label: { pt: 'Aguaceiros de neve fracos', en: 'Slight snow showers', de: 'Leichte Schneeschauer' } },
  86: { icon: '🌨️', label: { pt: 'Aguaceiros de neve fortes', en: 'Heavy snow showers', de: 'Starke Schneeschauer' } },
  95: { icon: '⛈️', label: { pt: 'Trovoada', en: 'Thunderstorm', de: 'Gewitter' } },
  96: { icon: '⛈️', label: { pt: 'Trovoada com granizo fraco', en: 'Thunderstorm with slight hail', de: 'Gewitter mit leichtem Hagel' } },
  99: { icon: '⛈️', label: { pt: 'Trovoada com granizo forte', en: 'Thunderstorm with heavy hail', de: 'Gewitter mit starkem Hagel' } },
}

export function getWeatherInfo(code: number, locale: Locale): { icon: string; label: string } {
  const entry = weatherCodes[code]
  if (!entry) return { icon: '❔', label: '—' }
  return { icon: entry.icon, label: entry.label[locale] }
}
