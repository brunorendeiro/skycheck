import { useEffect, useState } from 'react'
import { fetchForecast, searchPlaces, type Forecast, type GeoResult } from './lib/openMeteo'
import { getWeatherInfo } from './data/weatherCodes'
import { detectLocale, locales, ui, type Locale } from './i18n'
import { getStoredConsent, loadAnalytics } from './analytics'
import CookieConsent from './CookieConsent'

type Unit = 'c' | 'f'
type Place = { name: string; country?: string; admin1?: string; latitude: number; longitude: number; isCurrentLocation?: boolean }

const bcp47: Record<Locale, string> = { pt: 'pt-PT', en: 'en-US', de: 'de-DE' }

function toDisplayTemp(celsius: number, unit: Unit): number {
  const value = unit === 'f' ? celsius * 9 / 5 + 32 : celsius
  return Math.round(value)
}

function readRecent(): Place[] {
  try {
    const raw = window.localStorage.getItem('skycheck-recent')
    return raw ? JSON.parse(raw) : []
  } catch { return [] }
}

function placeLabel(place: Place): string {
  const parts = [place.name, place.admin1, place.country].filter(Boolean)
  return parts.join(', ')
}

const STORM_CODES = new Set([95, 96, 99])
const SNOW_CODES = new Set([71, 73, 75, 77, 85, 86])
const FOG_CODES = new Set([45, 48])
const RAIN_CODES = new Set([51, 53, 55, 56, 57, 61, 63, 65, 66, 67, 80, 81, 82])

function noteKeyFor(weatherCode: number, celsius: number) {
  if (STORM_CODES.has(weatherCode)) return 'noteStorm' as const
  if (SNOW_CODES.has(weatherCode)) return 'noteSnow' as const
  if (FOG_CODES.has(weatherCode)) return 'noteFog' as const
  if (RAIN_CODES.has(weatherCode)) return 'noteRain' as const
  if (celsius >= 30) return 'noteHot' as const
  if (celsius >= 22) return 'noteWarm' as const
  if (celsius >= 14) return 'noteMild' as const
  if (celsius >= 6) return 'noteCool' as const
  return 'noteCold' as const
}

export default function App() {
  const [locale, setLocale] = useState<Locale>(() => detectLocale())
  const [unit, setUnit] = useState<Unit>('c')
  const [query, setQuery] = useState('')
  const [results, setResults] = useState<GeoResult[] | null>(null)
  const [searching, setSearching] = useState(false)
  const [searchError, setSearchError] = useState<string | null>(null)
  const [locating, setLocating] = useState(false)
  const [place, setPlace] = useState<Place | null>(null)
  const [forecast, setForecast] = useState<Forecast | null>(null)
  const [loading, setLoading] = useState(false)
  const [weatherError, setWeatherError] = useState<string | null>(null)
  const [recent, setRecent] = useState<Place[]>(readRecent)

  const t = ui[locale]

  useEffect(() => {
    window.localStorage.setItem('skycheck-locale', locale)
    document.documentElement.setAttribute('lang', locale)
  }, [locale])

  useEffect(() => {
    if (getStoredConsent() === 'granted') loadAnalytics()
  }, [])

  useEffect(() => {
    window.localStorage.setItem('skycheck-recent', JSON.stringify(recent))
  }, [recent])

  async function loadWeather(next: Place) {
    setPlace(next)
    setResults(null)
    setQuery('')
    setLoading(true)
    setWeatherError(null)
    try {
      const data = await fetchForecast(next.latitude, next.longitude)
      setForecast(data)
    } catch {
      setWeatherError(t.weatherError)
      setForecast(null)
    } finally {
      setLoading(false)
    }
  }

  function selectPlace(result: GeoResult) {
    const next: Place = { name: result.name, country: result.country, admin1: result.admin1, latitude: result.latitude, longitude: result.longitude }
    setRecent(prev => [next, ...prev.filter(item => item.name !== next.name || item.country !== next.country)].slice(0, 5))
    loadWeather(next)
  }

  async function handleSearch(event: React.FormEvent) {
    event.preventDefault()
    const trimmed = query.trim()
    if (!trimmed) return
    setSearching(true)
    setSearchError(null)
    try {
      const found = await searchPlaces(trimmed, locale)
      setResults(found)
    } catch {
      setSearchError(t.searchError)
      setResults([])
    } finally {
      setSearching(false)
    }
  }

  function useMyLocation() {
    if (!('geolocation' in navigator)) {
      setWeatherError(t.locationUnsupported)
      return
    }
    setLocating(true)
    navigator.geolocation.getCurrentPosition(
      position => {
        setLocating(false)
        loadWeather({ name: t.currentLocationLabel, latitude: position.coords.latitude, longitude: position.coords.longitude, isCurrentLocation: true })
      },
      () => {
        setLocating(false)
        setWeatherError(t.locationDenied)
      },
      { timeout: 10000 },
    )
  }

  const currentInfo = forecast ? getWeatherInfo(forecast.current.weatherCode, locale) : null

  return <div className="app-shell">
    <header>
      <h1 className="brand"><span className="brand-mark">☀️</span><div><strong>SkyCheck</strong><small>{t.brandTagline}</small></div></h1>
      <div className="header-actions">
        <div className="unit-switch" role="group" aria-label={t.unitLabel}>
          <button className={unit === 'c' ? 'active' : ''} onClick={() => setUnit('c')}>°C</button>
          <button className={unit === 'f' ? 'active' : ''} onClick={() => setUnit('f')}>°F</button>
        </div>
        <div className="locale-switch" role="group" aria-label="Language">
          {locales.map(item => (
            <button key={item.id} className={locale === item.id ? 'active' : ''} onClick={() => setLocale(item.id)}>{item.label}</button>
          ))}
        </div>
      </div>
    </header>

    <main>
      <p className="intro">{t.intro}</p>

      <form className="search-row" onSubmit={handleSearch}>
        <input
          type="text"
          value={query}
          onChange={event => setQuery(event.target.value)}
          placeholder={t.searchPlaceholder}
          aria-label={t.searchPlaceholder}
        />
        <button type="submit" className="primary" disabled={searching}>{t.searchButton}</button>
        <button type="button" className="ghost" onClick={useMyLocation} disabled={locating}>{locating ? t.locating : `📍 ${t.useLocation}`}</button>
      </form>

      {searchError && <p className="error">{searchError}</p>}

      {results && <ul className="results">
        {results.length === 0 && <li className="no-results">{t.noResults}</li>}
        {results.map(result => (
          <li key={result.id}>
            <button onClick={() => selectPlace(result)}>{placeLabel({ name: result.name, country: result.country, admin1: result.admin1, latitude: 0, longitude: 0 })}</button>
          </li>
        ))}
      </ul>}

      {recent.length > 0 && <div className="recent">
        <div className="recent-head"><span>{t.recentLabel}</span><button className="clear-link" onClick={() => setRecent([])}>{t.clearRecent}</button></div>
        <div className="recent-chips">
          {recent.map(item => <button key={`${item.name}-${item.country}`} className="chip" onClick={() => loadWeather(item)}>{item.name}</button>)}
        </div>
      </div>}

      {weatherError && <p className="error">{weatherError}</p>}
      {loading && <p className="loading">{t.loading}</p>}

      {!place && !loading && <div className="empty-state">
        <span>✦</span>
        <h2>{t.emptyTitle}</h2>
        <p>{t.emptyBody}</p>
      </div>}

      {place && forecast && currentInfo && !loading && <section className="weather-card">
        <div className="place-name">{placeLabel(place)}</div>
        <div className="current-row">
          <span className="current-icon">{currentInfo.icon}</span>
          <span className="current-temp">{toDisplayTemp(forecast.current.temperature, unit)}°</span>
          <span className="current-label">{currentInfo.label}</span>
        </div>
        <p className="human-note">{t[noteKeyFor(forecast.current.weatherCode, forecast.current.temperature)]}</p>
        <div className="detail-row">
          <div className="detail"><span>{t.feelsLike}</span><strong>{toDisplayTemp(forecast.current.feelsLike, unit)}°</strong></div>
          <div className="detail"><span>{t.humidity}</span><strong>{Math.round(forecast.current.humidity)}%</strong></div>
          <div className="detail"><span>{t.wind}</span><strong>{Math.round(forecast.current.windSpeed)} km/h</strong></div>
        </div>

        <h3 className="forecast-title">{t.forecastTitle}</h3>
        <div className="forecast-grid">
          {forecast.daily.map((day, index) => {
            const info = getWeatherInfo(day.weatherCode, locale)
            const [y, m, d] = day.date.split('-').map(Number)
            const label = index === 0 ? t.todayLabel : new Intl.DateTimeFormat(bcp47[locale], { weekday: 'short' }).format(new Date(y, m - 1, d))
            return <div className="forecast-day" key={day.date}>
              <span className="day-label">{label}</span>
              <span className="day-icon">{info.icon}</span>
              <span className="day-temps"><strong>{toDisplayTemp(day.max, unit)}°</strong> / {toDisplayTemp(day.min, unit)}°</span>
            </div>
          })}
        </div>
      </section>}
    </main>

    <footer>
      <span>{t.footerTagline}</span>
      <a href="https://vibe-portfolio-one.vercel.app/" target="_blank" rel="noreferrer">Created by Bruno Rendeiro</a>
      <span className="powered-badge">⚡ Powered by AI</span>
    </footer>
    <CookieConsent locale={locale} />
  </div>
}
