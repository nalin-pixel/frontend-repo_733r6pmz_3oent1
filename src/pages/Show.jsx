import { useEffect, useMemo, useState } from 'react'
import { useParams } from 'react-router-dom'

const API = import.meta.env.VITE_BACKEND_URL || 'http://localhost:8000'

export default function ShowPage() {
  const { id } = useParams()
  const [items, setItems] = useState([])
  const [auction, setAuction] = useState(null)
  const [messages, setMessages] = useState([])
  const [bidAmount, setBidAmount] = useState('')
  const [name, setName] = useState('Guest')

  const fetchAll = async () => {
    const [itemsRes, auctionRes, msgsRes] = await Promise.all([
      fetch(`${API}/shows/${id}/items`).then(r=>r.json()),
      fetch(`${API}/shows/${id}/auctions/current`).then(r=>r.json()),
      fetch(`${API}/shows/${id}/messages`).then(r=>r.json()),
    ])
    setItems(itemsRes)
    setAuction(auctionRes.auction)
    setMessages(msgsRes)
  }

  useEffect(() => {
    fetchAll()
    const t = setInterval(fetchAll, 3000)
    return () => clearInterval(t)
  }, [id])

  const placeBid = async () => {
    if (!auction) return
    const res = await fetch(`${API}/auctions/${auction.id}/bids`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ user_id: name, amount: parseFloat(bidAmount) })
    })
    if (res.ok) {
      setBidAmount('')
      fetchAll()
    } else {
      const data = await res.json().catch(()=>({detail:'Error'}))
      alert(data.detail || 'Failed to bid')
    }
  }

  const sendMessage = async (text) => {
    if (!text) return
    await fetch(`${API}/shows/${id}/messages`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ user_id: name, text })
    })
    await fetchAll()
  }

  const currentPrice = auction?.current_price ?? auction?.starting_price

  return (
    <div className="max-w-6xl mx-auto p-4 grid lg:grid-cols-[2fr,1fr] gap-6">
      <div>
        <div className="aspect-video rounded-lg bg-black/80 grid place-items-center text-white">
          <div className="text-center">
            <div className="text-2xl font-bold">Live Stream</div>
            <div className="text-sm opacity-80">Simulated for MVP</div>
          </div>
        </div>

        <div className="mt-4">
          <div className="flex items-center justify-between mb-2">
            <div className="text-lg font-semibold">Items</div>
          </div>
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-3">
            {items.map(it => (
              <div key={it.id} className="border rounded-lg overflow-hidden bg-white">
                <div className="h-28 bg-gradient-to-br from-amber-200 to-pink-200" />
                <div className="p-3">
                  <div className="font-medium">{it.title}</div>
                  <div className="text-sm text-gray-600">Start ${it.start_price}</div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      <div className="space-y-4">
        <div className="border rounded-lg p-4 bg-white">
          <div className="flex items-center justify-between mb-2">
            <div className="font-semibold">Live Auction</div>
            <div className="text-sm text-gray-600">{auction ? 'Live' : 'No live auction'}</div>
          </div>
          {auction ? (
            <div className="space-y-3">
              <div className="text-2xl font-bold">${currentPrice}</div>
              <div className="flex gap-2">
                <input value={bidAmount} onChange={e=>setBidAmount(e.target.value)} type="number" min="0" className="flex-1 border rounded px-3 py-2" placeholder="Your bid" />
                <button onClick={placeBid} className="bg-blue-600 text-white px-4 rounded">Bid</button>
              </div>
              <div className="text-xs text-gray-500">Highest bid wins when timer ends.</div>
            </div>
          ) : (
            <div className="text-sm text-gray-600">No auction currently running.</div>
          )}
        </div>

        <div className="border rounded-lg p-4 bg-white">
          <div className="font-semibold mb-2">Chat</div>
          <div className="h-64 overflow-auto border rounded p-2 bg-gray-50">
            {messages.map(m => (
              <div key={m.id} className="text-sm mb-1"><span className="font-semibold">{m.user_id || 'Anon'}:</span> {m.text}</div>
            ))}
          </div>
          <ChatInput onSend={sendMessage} name={name} setName={setName} />
        </div>
      </div>
    </div>
  )}

function ChatInput({ onSend, name, setName }){
  const [text, setText] = useState('')
  return (
    <div className="mt-2 flex gap-2">
      <input value={name} onChange={e=>setName(e.target.value)} className="w-32 border rounded px-2" placeholder="Name" />
      <input value={text} onChange={e=>setText(e.target.value)} className="flex-1 border rounded px-2" placeholder="Say something" />
      <button onClick={()=>{ onSend(text); setText('') }} className="bg-gray-800 text-white px-3 rounded">Send</button>
    </div>
  )
}
