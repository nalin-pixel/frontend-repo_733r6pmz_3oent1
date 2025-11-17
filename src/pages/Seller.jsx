import { useState } from 'react'

const API = import.meta.env.VITE_BACKEND_URL || 'http://localhost:8000'

export default function Seller() {
  const [title, setTitle] = useState('My First Show')
  const [desc, setDesc] = useState('Welcome to my live shop!')
  const [showId, setShowId] = useState('')
  const [itemTitle, setItemTitle] = useState('Cool Item')
  const [startPrice, setStartPrice] = useState(10)
  const [duration, setDuration] = useState(60)

  const createShow = async () => {
    const res = await fetch(`${API}/shows`, { method: 'POST', headers: {'Content-Type':'application/json'}, body: JSON.stringify({ title, description: desc, status:'scheduled' }) })
    const data = await res.json()
    setShowId(data.id)
  }

  const addItem = async () => {
    if (!showId) return alert('Create a show first')
    await fetch(`${API}/items`, { method: 'POST', headers: {'Content-Type':'application/json'}, body: JSON.stringify({ show_id: showId, title: itemTitle, start_price: parseFloat(startPrice) }) })
    alert('Item added')
  }

  const startAuction = async () => {
    if (!showId) return alert('Create a show first')
    // naive: get first item of the show
    const items = await fetch(`${API}/shows/${showId}/items`).then(r=>r.json())
    if (!items.length) return alert('Add an item first')
    const res = await fetch(`${API}/shows/${showId}/auctions/start`, { method:'POST', headers:{'Content-Type':'application/json'}, body: JSON.stringify({ item_id: items[0].id, starting_price: parseFloat(startPrice), duration_seconds: parseInt(duration) }) })
    const data = await res.json()
    if (data.id) alert('Auction started')
  }

  return (
    <div className="max-w-3xl mx-auto p-4 space-y-6">
      <div className="text-2xl font-bold">Seller Dashboard (MVP)</div>

      <div className="border rounded-lg p-4 bg-white space-y-3">
        <div className="font-semibold">Create Show</div>
        <input value={title} onChange={e=>setTitle(e.target.value)} className="w-full border rounded px-3 py-2" placeholder="Title" />
        <textarea value={desc} onChange={e=>setDesc(e.target.value)} className="w-full border rounded px-3 py-2" placeholder="Description" />
        <button onClick={createShow} className="bg-blue-600 text-white px-4 py-2 rounded">Create</button>
        {showId && <div className="text-sm text-gray-600">Show ID: {showId} — <a href={`/show/${showId}`} className="text-blue-600">Open</a></div>}
      </div>

      <div className="border rounded-lg p-4 bg-white space-y-3">
        <div className="font-semibold">Add Item</div>
        <input value={itemTitle} onChange={e=>setItemTitle(e.target.value)} className="w-full border rounded px-3 py-2" placeholder="Item title" />
        <div className="flex gap-3">
          <input value={startPrice} onChange={e=>setStartPrice(e.target.value)} type="number" className="border rounded px-3 py-2" placeholder="Start price" />
          <input value={duration} onChange={e=>setDuration(e.target.value)} type="number" className="border rounded px-3 py-2" placeholder="Duration (s)" />
        </div>
        <div className="flex gap-2">
          <button onClick={addItem} className="bg-gray-800 text-white px-4 py-2 rounded">Add Item</button>
          <button onClick={startAuction} className="bg-green-600 text-white px-4 py-2 rounded">Start Auction</button>
        </div>
      </div>
    </div>
  )
}
