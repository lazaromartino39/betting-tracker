import Navbar from '@/components/Navbar'

export default function Analytics() {
  return (
    <div style={{ minHeight: '100vh', background: '#0B0B0C', color: '#F2F1EE', fontFamily: "'Inter', sans-serif" }}>
      <Navbar isLoggedIn={true} username="jdbets" />
      <div style={{ maxWidth: '1240px', margin: '0 auto', padding: '40px 32px' }}>
        <div style={{ fontFamily: "'Anton', sans-serif", fontSize: '30px', marginBottom: '20px' }}>
          ANALYTICS
        </div>
        <div style={{ background: '#141416', border: '1px solid rgba(255,255,255,0.08)', borderRadius: '12px', padding: '40px', textAlign: 'center', color: '#98979C' }}>
          Detailed betting analytics, ROI tracking, and profit trends by sport coming soon.
        </div>
      </div>
    </div>
  )
}
