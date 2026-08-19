import Navbar from '@/components/Navbar'

export default function Odds() {
  return (
    <div style={{ minHeight: '100vh', background: '#0B0B0C', color: '#F2F1EE', fontFamily: "'Inter', sans-serif" }}>
      <Navbar isLoggedIn={false} />
      <div style={{ maxWidth: '1240px', margin: '0 auto', padding: '40px 32px' }}>
        <div style={{ fontFamily: "'Anton', sans-serif", fontSize: '30px', marginBottom: '20px' }}>
          LIVE ODDS
        </div>
        <div style={{ background: '#141416', border: '1px solid rgba(255,255,255,0.08)', borderRadius: '12px', padding: '40px', textAlign: 'center', color: '#98979C' }}>
          Live odds integration coming soon. Real-time lines from 250+ sportsbooks.
        </div>
      </div>
    </div>
  )
}
