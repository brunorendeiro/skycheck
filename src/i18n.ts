export type Locale = 'pt' | 'en' | 'de'

export const locales: { id: Locale; label: string }[] = [
  { id: 'pt', label: 'PT' },
  { id: 'en', label: 'EN' },
  { id: 'de', label: 'DE' },
]

export function detectLocale(): Locale {
  const stored = window.localStorage.getItem('skycheck-locale')
  if (stored === 'pt' || stored === 'en' || stored === 'de') return stored
  const browser = navigator.language.slice(0, 2).toLowerCase()
  if (browser === 'de') return 'de'
  if (browser === 'pt') return 'pt'
  return 'en'
}

type UiStrings = {
  brandTagline: string
  intro: string
  searchPlaceholder: string
  searchButton: string
  useLocation: string
  locating: string
  currentLocationLabel: string
  recentLabel: string
  clearRecent: string
  unitLabel: string
  feelsLike: string
  humidity: string
  wind: string
  forecastTitle: string
  todayLabel: string
  loading: string
  noResults: string
  searchError: string
  weatherError: string
  locationDenied: string
  locationUnsupported: string
  emptyTitle: string
  emptyBody: string
  footerTagline: string
}

export const ui: Record<Locale, UiStrings> = {
  pt: {
    brandTagline: 'O tempo em qualquer lugar',
    intro: 'Procura uma cidade ou usa a tua localização para ver a temperatura e a previsão dos próximos dias. Sem contas, sem chaves de API.',
    searchPlaceholder: 'Procurar uma cidade…',
    searchButton: 'Procurar',
    useLocation: 'Usar a minha localização',
    locating: 'A localizar…',
    currentLocationLabel: 'A tua localização',
    recentLabel: 'Pesquisas recentes',
    clearRecent: 'Limpar',
    unitLabel: 'Unidade',
    feelsLike: 'Sensação',
    humidity: 'Humidade',
    wind: 'Vento',
    forecastTitle: 'Próximos dias',
    todayLabel: 'Hoje',
    loading: 'A obter dados do tempo…',
    noResults: 'Nenhum lugar encontrado. Tenta outro nome.',
    searchError: 'Não foi possível procurar agora. Tenta novamente.',
    weatherError: 'Não foi possível obter o tempo agora. Tenta novamente.',
    locationDenied: 'Não foi possível aceder à tua localização. Verifica as permissões do browser.',
    locationUnsupported: 'O teu browser não suporta geolocalização.',
    emptyTitle: 'Ainda sem localização escolhida.',
    emptyBody: 'Procura uma cidade ou usa a tua localização para começar.',
    footerTagline: 'Dados de open-meteo.com · sem contas · sem chaves de API',
  },
  en: {
    brandTagline: 'The weather, anywhere',
    intro: "Search a city or use your location to see the temperature and the next few days' forecast. No accounts, no API keys.",
    searchPlaceholder: 'Search a city…',
    searchButton: 'Search',
    useLocation: 'Use my location',
    locating: 'Locating…',
    currentLocationLabel: 'Your location',
    recentLabel: 'Recent searches',
    clearRecent: 'Clear',
    unitLabel: 'Unit',
    feelsLike: 'Feels like',
    humidity: 'Humidity',
    wind: 'Wind',
    forecastTitle: 'Coming days',
    todayLabel: 'Today',
    loading: 'Fetching weather data…',
    noResults: 'No place found. Try another name.',
    searchError: "Couldn't search right now. Try again.",
    weatherError: "Couldn't fetch the weather right now. Try again.",
    locationDenied: "Couldn't access your location. Check your browser permissions.",
    locationUnsupported: "Your browser doesn't support geolocation.",
    emptyTitle: 'No location picked yet.',
    emptyBody: 'Search a city or use your location to get started.',
    footerTagline: 'Data from open-meteo.com · no accounts · no API keys',
  },
  de: {
    brandTagline: 'Das Wetter, überall',
    intro: 'Suche eine Stadt oder nutze deinen Standort, um Temperatur und Vorhersage der nächsten Tage zu sehen. Keine Konten, keine API-Schlüssel.',
    searchPlaceholder: 'Stadt suchen…',
    searchButton: 'Suchen',
    useLocation: 'Meinen Standort verwenden',
    locating: 'Standort wird ermittelt…',
    currentLocationLabel: 'Dein Standort',
    recentLabel: 'Letzte Suchen',
    clearRecent: 'Löschen',
    unitLabel: 'Einheit',
    feelsLike: 'Gefühlt',
    humidity: 'Luftfeuchtigkeit',
    wind: 'Wind',
    forecastTitle: 'Nächste Tage',
    todayLabel: 'Heute',
    loading: 'Wetterdaten werden geladen…',
    noResults: 'Kein Ort gefunden. Versuch einen anderen Namen.',
    searchError: 'Suche gerade nicht möglich. Versuch es erneut.',
    weatherError: 'Wetter gerade nicht abrufbar. Versuch es erneut.',
    locationDenied: 'Zugriff auf deinen Standort nicht möglich. Prüfe die Browser-Berechtigungen.',
    locationUnsupported: 'Dein Browser unterstützt keine Geolokalisierung.',
    emptyTitle: 'Noch kein Standort ausgewählt.',
    emptyBody: 'Suche eine Stadt oder nutze deinen Standort, um loszulegen.',
    footerTagline: 'Daten von open-meteo.com · keine Konten · keine API-Schlüssel',
  },
}
