import { Link } from 'react-router-dom'

export default function Navbar() {
  return (
    <nav className="w-full border-b bg-white/70 backdrop-blur supports-[backdrop-filter]:bg-white/60">
      <div className="max-w-6xl mx-auto px-4 h-14 flex items-center justify-between">
        <Link to="/" className="font-bold text-xl">LiveShop</Link>
        <div className="flex items-center gap-4 text-sm">
          <Link to="/" className="hover:text-blue-600">Home</Link>
          <Link to="/test" className="hover:text-blue-600">System Test</Link>
          <Link to="/seller" className="hover:text-blue-600">Seller</Link>
        </div>
      </div>
    </nav>
  )
}
