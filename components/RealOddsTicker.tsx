import { useEffect, useState } from 'react'

interface Sportsbook {
  name: string
  markets?: Array<{
    key: string
    outcomes?: Array<{
      name: string
      price: number
    }>
  }>
}

interface OddsDisplay {
  id: string
  away_team: string
  home_team: string
  sportsbook: string
  line: string
  odds: string
}

export default function RealOddsTicker() {
  const [odds, setOdds] = useState<OddsDisplay[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const fetchOdds = async () => {
      try {
        // Use valid Odds API sport key (NFL by default)
        const response = await fetch('/api/odds/real-odds?sport=americanfootball_nfl')
        const data = await response.json()

        if (data.events && data.events.length > 0) {
          const formatted: OddsDisplay[] = []

          data.events.slice(0, 15).forEach((event: any, idx: number) => {
            event.bookmakers?.slice(0, 3).forEach((book: Sportsbook) => {
              const h2h = book.markets?.find((m: any) => m.key === 'h2h')
              const spread = book.markets?.find((m: any) => m.key === 'spreads')
              const total = book.markets?.find((m: any) => m.key === 'totals')

              if (h2h?.outcomes) {
                const homeOdds = h2h.outcomes.find((o: any) => o.name === event.home_team)
                formatted.push({
                  id: `${idx}-${book.name}-h2h`,
                  away_team: event.away_team,
                  home_team: event.home_team,
                  sportsbook: book.name,
                  line: 'ML',
                  odds: homeOdds ? `${homeOdds.price > 0 ? '+' : ''}${homeOdds.price}` : 'N/A',
                })
              }

              if (spread?.outcomes) {
                const homeSpread = spread.outcomes[1]
                if (homeSpread) {
                  formatted.push({
                    id: `${idx}-${book.name}-spread`,
                    away_team: event.away_team,
                    home_team: event.home_team,
                    sportsbook: book.name,
                    line: `Spread: ${homeSpread.price > 0 ? '+' : ''}${homeSpread.price}`,
                    odds: 'Even',
                  })
                }
              }
            })
          })

          setOdds(formatted)
        }
      } catch (error) {
        console.error('Failed to fetch real odds:', error)
      } finally {
        setLoading(false)
      }
    }

    fetchOdds()
    const interval = setInterval(fetchOdds, 30000) // Refresh every 30 seconds
    return () => clearInterval(interval)
  }, [])

  return (
    <div
      style={{
        position: 'absolute',
        top: '72px',
        left: 0,
        right: 0,
        bottom: 0,
        opacity: 0.15,
        pointerEvents: 'none',
        background: 'linear-gradient(90deg, transparent, rgba(22,193,114,0.1), transparent)',
        display: 'flex',
        alignItems: 'center',
        overflow: 'hidden',
      }}
    >
      {loading ? (
        <div style={{ width: '100%', textAlign: 'center', color: '#F2F1EE' }}>
          Loading live odds...
        </div>
      ) : odds.length > 0 ? (
        <div
          style={{
            display: 'flex',
            gap: '50px',
            animation: 'scroll 60s linear infinite',
            whiteSpace: 'nowrap',
            width: '100%',
          }}
        >
          {[...Array(2)].map((_, loopIdx) => (
            <div key={loopIdx} style={{ display: 'flex', gap: '50px' }}>
              {odds.map((odd) => (
                <div
                  key={odd.id}
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: '12px',
                    fontSize: '13px',
                    fontWeight: 700,
                    color: '#F2F1EE',
                    padding: '12px 20px',
                    borderRadius: '8px',
                    background: 'rgba(22,193,114,0.08)',
                    border: '1px solid rgba(22,193,114,0.2)',
                  }}
                >
                  <span style={{ minWidth: '140px' }}>
                    {odd.away_team} @ {odd.home_team}
                  </span>
                  <span style={{ color: '#98979C', fontSize: '11px' }}>
                    {odd.sportsbook}
                  </span>
                  <span style={{ color: '#16C172' }}>{odd.line}</span>
                  <span style={{ color: '#E4342F', fontWeight: 'bold' }}>
                    {odd.odds}
                  </span>
                </div>
              ))}
            </div>
          ))}
        </div>
      ) : (
        <div style={{ width: '100%', textAlign: 'center', color: '#F2F1EE' }}>
          No games available
        </div>
      )}

      <style>{`
        @keyframes scroll {
          0% { transform: translateX(0); }
          100% { transform: translateX(-50%); }
        }
      `}</style>
    </div>
  )
}
