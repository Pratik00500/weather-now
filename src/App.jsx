import { useEffect, useMemo, useState } from "react";

const GEO_URL = "https://geocoding-api.open-meteo.com/v1/search";
const WX_URL = "https://api.open-meteo.com/v1/forecast";

const WEATHER_CODE = {0:"Clear sky",1:"Mainly clear",2:"Partly cloudy",3:"Overcast",45:"Fog",48:"Depositing rime fog",51:"Light drizzle",53:"Moderate drizzle",55:"Dense drizzle",56:"Light freezing drizzle",57:"Dense freezing drizzle",61:"Slight rain",63:"Moderate rain",65:"Heavy rain",66:"Light freezing rain",67:"Heavy freezing rain",71:"Slight snow fall",73:"Moderate snow fall",75:"Heavy snow fall",77:"Snow grains",80:"Rain showers",81:"Moderate rain showers",82:"Violent rain showers",85:"Snow showers",86:"Heavy snow showers",95:"Thunderstorm",96:"Thunderstorm with slight hail",99:"Thunderstorm with heavy hail"};

export default function App() {
  const [query, setQuery] = useState("");
  const [choices, setChoices] = useState([]);
  const [selected, setSelected] = useState(null);
  const [weather, setWeather] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  async function searchCity(name) {
    setError(""); setChoices([]); setSelected(null); setWeather(null);
    const n = name.trim();
    if (!n) { setError("Please enter a city name."); return; }
    try {
      setLoading(true);
      const url = new URL(GEO_URL);
      url.searchParams.set("name", n);
      url.searchParams.set("count", "5");
      url.searchParams.set("language", "en");
      url.searchParams.set("format", "json");
      const res = await fetch(url.toString());
      if (!res.ok) throw new Error("Geocoding request failed");
      const data = await res.json();
      if (!data?.results?.length) { setError("No matching cities found."); return; }
      setChoices(data.results);
    } catch { setError("Network error. Please try again."); }
    finally { setLoading(false); }
  }

  async function fetchWeather(lat, lon) {
    setError(""); setWeather(null);
    try {
      setLoading(true);
      const url = new URL(WX_URL);
      url.searchParams.set("latitude", String(lat));
      url.searchParams.set("longitude", String(lon));
      url.searchParams.set("current", ["temperature_2m","relative_humidity_2m","wind_speed_10m","wind_direction_10m","weather_code"].join(","));
      url.searchParams.set("timezone", "auto");
      const res = await fetch(url.toString());
      if (!res.ok) throw new Error("Weather request failed");
      const data = await res.json();
      if (!data?.current) { setError("Weather data unavailable."); return; }
      setWeather(data.current);
    } catch { setError("Network error. Please try again."); }
    finally { setLoading(false); }
  }

  useEffect(() => { if (selected) fetchWeather(selected.latitude, selected.longitude); }, [selected]);

  const headerSubtitle = useMemo(() => "Quick current weather by city for outdoor plans.", []);

  return (<div className="mx-auto max-w-3xl px-4 py-8">
 <header className="mb-6 text-center">
  <h1 className="flex items-center justify-center text-4xl font-extrabold tracking-tight text-slate-900">
    <img 
      src="/logo.jpg" 
      alt="Logo" 
      className="w-10 h-10 mr-2 inline-block rounded" 
    />
    Weather <span className="text-indigo-600 ml-1">Now</span>
  </h1>
  <p className="mt-2 text-slate-600">{headerSubtitle}</p>
</header>


    <section className="card">
      <form onSubmit={(e)=>{e.preventDefault();searchCity(query);}} className="flex flex-col gap-3 sm:flex-row">
        <input className="input" placeholder="Enter city" value={query} onChange={e=>setQuery(e.target.value)} aria-label="City name"/>
        <button type="submit" className="btn btn-primary">{loading?"Searching…":"Search"}</button>
      </form>
      {error && <p className="mt-3 rounded-md bg-red-50 p-3 text-sm text-red-700">{error}</p>}
      {choices.length>0 && <div className="mt-4"><p className="mb-2 text-sm text-slate-600">Select a location:</p><ul className="grid gap-2 sm:grid-cols-2">{choices.map(c=>(<li key={c.id}><button className="btn w-full rounded-xl border border-slate-200 bg-slate-50 px-4 py-3 text-left hover:bg-slate-100" onClick={()=>setSelected(c)}><div className="flex items-center justify-between gap-3"><div><p className="font-semibold text-slate-800">{c.name}{c.admin1?`, ${c.admin1}`:""}</p><p className="text-sm text-slate-600">{c.country} • {c.latitude.toFixed(2)}, {c.longitude.toFixed(2)}</p></div><span className="badge">{c.timezone}</span></div></button></li>))}</ul></div>}
    </section>

    {selected && <section className="mt-6 card"><div className="mb-3 flex flex-wrap items-center justify-between gap-2"><div><h2 className="text-xl font-bold text-slate-900">{selected.name}{selected.admin1?`, ${selected.admin1}`:""} · {selected.country}</h2><p className="text-sm text-slate-600">Lat {selected.latitude.toFixed(2)} · Lon {selected.longitude.toFixed(2)} · TZ {selected.timezone}</p></div><span className="badge">Current</span></div>
      {!weather && <p className="text-slate-600">{loading?"Loading current weather…":"Select a location to view weather."}</p>}
      {weather && <div className="grid gap-4 sm:grid-cols-2"><div className="rounded-xl bg-indigo-50 p-4"><p className="text-sm uppercase tracking-wide text-indigo-700">Temperature</p><p className="mt-1 text-4xl font-bold text-indigo-900">{Math.round(weather.temperature_2m)}°C</p><p className="text-sm text-indigo-800">{WEATHER_CODE[weather.weather_code] ?? "—"}</p></div><div className="rounded-xl bg-slate-100 p-4"><p className="text-sm uppercase tracking-wide text-slate-700">Humidity</p><p className="mt-1 text-3xl font-semibold text-slate-900">{weather.relative_humidity_2m}%</p></div><div className="rounded-xl bg-slate-100 p-4"><p className="text-sm uppercase tracking-wide text-slate-700">Wind Speed</p><p className="mt-1 text-3xl font-semibold text-slate-900">{Math.round(weather.wind_speed_10m)} km/h</p></div><div className="rounded-xl bg-slate-100 p-4"><p className="text-sm uppercase tracking-wide text-slate-700">Wind Direction</p><p className="mt-1 text-3xl font-semibold text-slate-900">{weather.wind_direction_10m}°</p></div></div>}
      {weather && weather.time && <p className="mt-4 text-right text-xs text-slate-500">Updated: {new Date(weather.time).toLocaleString()}</p>}
    </section>}

    <footer className="mt-8 text-center text-xs text-slate-500"><p>Data by <a className="underline" href="https://open-meteo.com/" target="_blank" rel="noreferrer">Open‑Meteo</a> · Built for Jamie</p></footer>
  </div>);
}