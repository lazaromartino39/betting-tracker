import { useEffect, useState } from 'react'

interface OddsItem {
  id: string
  matchup: string
  homeTeam: string
  awayTeam: string
  odds: string
  sportsbook: string
  line: string
  sport: string
}

export default function FloatingOdds() {
  const [odds, setOdds] = useState<OddsItem[]>([])
  const [isOpen, setIsOpen] = useState(true)
  const [currentIndex, setCurrentIndex] = useState(0)
  const [currentSport, setCurrentSport] = useState(0)

  const sports = [
    { key: 'americanfootball_nfl', label: '🏈 NFL' },
    { key: 'basketball_nba', label: '🏀 NBA' },
    { key: 'baseball_mlb', label: '⚾ MLB' },
    { key: 'soccer_epl', label: '⚽ EPL' },
    { key: 'mma_ufc', label: '🥊 UFC' },
    { key: 'basketball_ncaa', label: '🏀 NCAA' },
  ]

  useEffect(() => {
    const fetchOdds = async () => {
      try {
        const sport = sports[currentSport].key
        const response = await fetch(`/api/odds/real-odds?sport=${sport}`)
        const data = await response.json()

        if (data.events && data.events.length > 0) {
          const formatted = data.events.slice(0, 8).map((event: any) => {
            const book = event.bookmakers?.[0]
            const h2h = book?.markets?.find((m: any) => m.key === 'h2h')
            const homeOdds = h2h?.outcomes?.[1]

            return {
              id: event.id,
              matchup: `${event.away_team} @ ${event.home_team}`,
              homeTeam: event.home_team,
              awayTeam: event.away_team,
              odds: homeOdds ? `${homeOdds.price > 0 ? '+' : ''}${homeOdds.price}` : 'N/A',
              sportsbook: book?.title || 'Top Book',
              line: 'ML',
              sport: sport,
            }
          })
          setOdds(formatted)
          setCurrentIndex(0)
        }
      } catch (error) {
        console.error('Failed to fetch floating odds:', error)
      }
    }

    fetchOdds()
    const interval = setInterval(fetchOdds, 1000) // Update EVERY SECOND
    return () => clearInterval(interval)
  }, [currentSport])

  if (!isOpen || odds.length === 0) {
    return (
      <button
        onClick={() => setIsOpen(true)}
        style={{
          position: 'fixed',
          bottom: '24px',
          right: '24px',
          zIndex: 40,
          width: '50px',
          height: '50px',
          borderRadius: '50%',
          background: '#E4342F',
          border: 'none',
          color: '#F2F1EE',
          fontSize: '24px',
          cursor: 'pointer',
          boxShadow: '0 8px 16px rgba(0,0,0,0.3)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          transition: 'all 0.3s ease',
        }}
        onMouseEnter={(e) => {
          e.currentTarget.style.transform = 'scale(1.1)'
          e.currentTarget.style.boxShadow = '0 12px 24px rgba(228,52,47,0.4)'
        }}
        onMouseLeave={(e) => {
          e.currentTarget.style.transform = 'scale(1)'
          e.currentTarget.style.boxShadow = '0 8px 16px rgba(0,0,0,0.3)'
        }}
      >
        📊
      </button>
    )
  }

  const current = odds[currentIndex]
  const hasMultiple = odds.length > 1

  return (
    <div
      style={{
        position: 'fixed',
        bottom: '24px',
        right: '24px',
        zIndex: 50,
        width: '320px',
        background: '#141416',
        border: '1px solid rgba(228,52,47,0.3)',
        borderRadius: '12px',
        padding: '16px',
        boxShadow: '0 12px 32px rgba(0,0,0,0.4)',
        fontFamily: "'Inter', sans-serif",
        color: '#F2F1EE',
        animation: 'slideIn 0.3s ease',
      }}
    >
      <style>{`
        @keyframes slideIn {
          from {
            opacity: 0;
            transform: translateY(20px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }
        @keyframes pulse {
          0%, 100% { opacity: 1; }
          50% { opacity: 0.4; }
        }
      `}</style>

      {/* Header */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '14px' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
          <div style={{ fontSize: '12px', fontWeight: 700, color: '#16C172', letterSpacing: '1px' }}>
            LIVE
          </div>
          <div style={{ fontSize: '12px', fontWeight: 600, color: '#E4342F', animation: 'pulse 1s infinite' }}>
            ●
          </div>
        </div>
        <button
          onClick={() => setIsOpen(false)}
          style={{
            background: 'transparent',
            border: 'none',
            color: '#98979C',
            cursor: 'pointer',
            fontSize: '18px',
            padding: 0,
          }}
        >
          ✕
        </button>
      </div>

      {/* Sport Selector */}
      <div style={{ display: 'flex', gap: '6px', marginBottom: '14px', flexWrap: 'wrap' }}>
        {sports.map((sport, idx) => (
          <button
            key={sport.key}
            onClick={() => setCurrentSport(idx)}
            style={{
              padding: '5px 10px',
              borderRadius: '6px',
              border: idx === currentSport ? '1.5px solid #E4342F' : '1px solid rgba(255,255,255,0.1)',
              background: idx === currentSport ? 'rgba(228,52,47,0.2)' : 'transparent',
              color: idx === currentSport ? '#E4342F' : '#98979C',
              fontSize: '11px',
              fontWeight: 600,
              cursor: 'pointer',
              transition: 'all 0.2s',
            }}
          >
            {sport.label}
          </button>
        ))}
      </div>

      {/* Matchup */}
      <div style={{ marginBottom: '12px' }}>
        <div style={{ fontSize: '13px', fontWeight: 600, marginBottom: '4px' }}>
          {current.matchup}
        </div>
        <div style={{ fontSize: '11px', color: '#98979C' }}>
          {current.sportsbook}
        </div>
      </div>

      {/* Odds Display */}
      <div
        style={{
          background: 'rgba(228,52,47,0.1)',
          border: '1px solid rgba(228,52,47,0.2)',
          borderRadius: '8px',
          padding: '12px',
          marginBottom: '12px',
          display: 'grid',
          gridTemplateColumns: '1fr 1fr',
          gap: '12px',
        }}
      >
        <div style={{ textAlign: 'center' }}>
          <div style={{ fontSize: '11px', color: '#98979C', marginBottom: '4px' }}>
            {current.awayTeam}
          </div>
          <div style={{ fontSize: '16px', fontWeight: 700, color: '#16C172' }}>
            {current.odds}
          </div>
        </div>
        <div style={{ textAlign: 'center' }}>
          <div style={{ fontSize: '11px', color: '#98979C', marginBottom: '4px' }}>
            vs
          </div>
          <div style={{ fontSize: '14px', fontWeight: 600, color: '#E4342F' }}>
            LIVE
          </div>
        </div>
      </div>

      {/* Navigation */}
      {hasMultiple && (
        <div style={{ display: 'flex', gap: '4px', justifyContent: 'center', flexWrap: 'wrap' }}>
          {odds.map((_, idx) => (
            <button
              key={idx}
              onClick={() => setCurrentIndex(idx)}
              style={{
                width: '5px',
                height: '5px',
                borderRadius: '50%',
                background: idx === currentIndex ? '#E4342F' : 'rgba(255,255,255,0.15)',
                border: 'none',
                cursor: 'pointer',
                transition: 'all 0.15s ease',
              }}
            />
          ))}
        </div>
      )}

      {/* Footer */}
      <div style={{ marginTop: '12px', paddingTop: '12px', borderTop: '1px solid rgba(255,255,255,0.08)' }}>
        <a
          href="/odds"
          style={{
            fontSize: '12px',
            color: '#16C172',
            textDecoration: 'none',
            fontWeight: 600,
            cursor: 'pointer',
            transition: 'color 0.2s',
          }}
          onMouseEnter={(e) => (e.currentTarget.style.color = '#1fe085')}
          onMouseLeave={(e) => (e.currentTarget.style.color = '#16C172')}
        >
          View all odds →
        </a>
      </div>
    </div>
  )
}
