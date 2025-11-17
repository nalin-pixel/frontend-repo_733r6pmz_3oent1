import { useEffect, useState } from 'react'

const API = import.meta.env.VITE_BACKEND_URL || 'http://localhost:8000'

export default function Home() {
  const [shows, setShows] = useState([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    fetch(`${API}/shows`)
      .then(r => r.json())
      .then(setShows)
      .catch(() => setShows([]))
      .finally(() => setLoading(false))
  }, [])

  return (
    <div className="max-w-6xl mx-auto p-4">
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-2xl font-bold">Live now & upcoming</h1>
        <a href="/seller" className="text-sm bg-blue-600 text-white px-3 py-2 rounded">Create Show</a>
      </div>

      {loading ? (
        <p>Loading…</p>
      ) : (
        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {shows.map(s => (
            <a key={s.id} href={`/show/${s.id}`} className="block border rounded-lg overflow-hidden bg-white hover:shadow-md transition">
              <div className="h-40 bg-gradient-to-br from-purple-200 to-blue-200" />
              <div className="p-4">
                <div className="text-sm text-gray-500 mb-1">{s.status}</div>
                <div className="font-semibold">{s.title}</div>
                {s.description && <div className="text-sm text-gray-600 line-clamp-2">{s.description}</div>}
              </div>
            </a>
          ))}
        </div>
      )}
    </div>
  )
}
