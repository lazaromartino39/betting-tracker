import Navbar from '@/components/Navbar'

export default function PickItBros() {
  return (
    <div style={{ minHeight: '100vh', background: '#0B0B0C', color: '#F2F1EE', fontFamily: "'Inter', sans-serif" }}>
      <Navbar isLoggedIn={false} />

      <div style={{
        padding: '64px 32px 48px',
        textAlign: 'center',
        background: 'radial-gradient(circle at 50% 0%, rgba(228,52,47,0.16), transparent 55%), #0B0B0C',
        borderBottom: '1px solid rgba(255,255,255,0.08)',
      }}>
        <img src="/assets/pickitbros-logo.jpg" alt="PickIt Bros" style={{
          width: '96px',
          height: '96px',
          borderRadius: '50%',
          objectFit: 'cover',
          border: '2px solid rgba(255,255,255,0.2)',
          margin: '0 auto 18px',
          display: 'block',
        }} />
        <h1 style={{ fontFamily: "'Anton', sans-serif", fontSize: '44px', margin: '0 0 12px' }}>
          <span style={{ color: '#E4342F' }}>PICKIT</span> <span style={{ color: '#16C172' }}>BROS</span>
        </h1>
        <p style={{ color: '#98979C', fontSize: '16px', maxWidth: '480px', margin: '0 auto' }}>
          Championship picks across NFL, NBA & UFC — tracked live, settled in public, free to follow.
        </p>
      </div>

      <div style={{ maxWidth: '1180px', margin: '0 auto', padding: '40px 32px' }}>
        <div style={{
          background: '#141416',
          border: '1px solid rgba(255,255,255,0.08)',
          borderRadius: '12px',
          padding: '40px',
          textAlign: 'center',
          color: '#98979C',
        }}>
          Championship pick tracking and analytics coming soon. Premium access launching Q4 2026.
        </div>
      </div>
    </div>
  )
}
