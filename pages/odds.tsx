import { useEffect, useState } from 'react'
import Navbar from '@/components/Navbar'
import Link from 'next/link'

interface Outcome {
  name: string
  price: number
}

interface Market {
  key: string
  outcomes?: Outcome[]
}

interface Bookmaker {
  title: string
  markets?: Market[]
}

interface Game {
  id: string
  away_team: string
  home_team: string
  commence_time: string
  bookmakers?: Bookmaker[]
}

interface OddsData {
  sport: string
  events: Game[]
  total: number
}

export default function Odds() {
  const [odds, setOdds] = useState<Game[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const fetchOdds = async () => {
      setLoading(true)
      try {
        const response = await fetch(`/api/odds/real-odds?sport=americanfootball_nfl`)
        const data: OddsData = await response.json()
        setOdds(data.events || [])
      } catch (error) {
        console.error('Failed to fetch odds:', error)
      } finally {
        setLoading(false)
      }
    }

    fetchOdds()
    const interval = setInterval(fetchOdds, 30000)
    return () => clearInterval(interval)
  }, [])

  return (
    <div style={{ minHeight: '100vh', background: '#0B0B0C', color: '#F2F1EE', fontFamily: "'Inter', sans-serif" }}>
      <Navbar isLoggedIn={false} />

      <div style={{ maxWidth: '1400px', margin: '0 auto', padding: '40px 32px' }}>
        <div style={{ fontFamily: "'Anton', sans-serif", fontSize: '30px', marginBottom: '20px' }}>
          LIVE ODDS
        </div>

        {loading && odds.length === 0 ? (
          <div style={{
            background: '#141416',
            border: '1px solid rgba(255,255,255,0.08)',
            borderRadius: '12px',
            padding: '40px',
            textAlign: 'center',
            color: '#98979C',
          }}>
            Loading real odds from 250+ sportsbooks...
          </div>
        ) : odds.length === 0 ? (
          <div style={{
            background: '#141416',
            border: '1px solid rgba(255,255,255,0.08)',
            borderRadius: '12px',
            padding: '40px',
            textAlign: 'center',
            color: '#98979C',
          }}>
            No games available at this time
          </div>
        ) : (
          <div>
            {odds.map((game) => (
              <div
                key={game.id}
                style={{
                  background: '#141416',
                  border: '1px solid rgba(255,255,255,0.08)',
                  borderRadius: '12px',
                  padding: '24px',
                  marginBottom: '16px',
                }}
              >
                <div style={{ marginBottom: '16px' }}>
                  <div style={{
                    fontWeight: 700,
                    fontSize: '18px',
                    marginBottom: '6px',
                  }}>
                    {game.away_team} @ {game.home_team}
                  </div>
                  <div style={{ fontSize: '12px', color: '#98979C' }}>
                    {new Date(game.commence_time).toLocaleString()}
                  </div>
                </div>

                {game.bookmakers && game.bookmakers.length > 0 ? (
                  <div style={{ overflowX: 'auto' }}>
                    <table style={{
                      width: '100%',
                      borderCollapse: 'collapse',
                      fontSize: '12px',
                    }}>
                      <thead>
                        <tr style={{ borderBottom: '1px solid rgba(255,255,255,0.08)' }}>
                          <th style={{ textAlign: 'left', padding: '12px 0', color: '#98979C', fontWeight: 600 }}>
                            Sportsbook
                          </th>
                          <th style={{ textAlign: 'center', padding: '12px 0', color: '#98979C', fontWeight: 600 }}>
                            {game.away_team} ML
                          </th>
                          <th style={{ textAlign: 'center', padding: '12px 0', color: '#98979C', fontWeight: 600 }}>
                            {game.home_team} ML
                          </th>
                          <th style={{ textAlign: 'center', padding: '12px 0', color: '#98979C', fontWeight: 600 }}>
                            Spread
                          </th>
                          <th style={{ textAlign: 'center', padding: '12px 0', color: '#98979C', fontWeight: 600 }}>
                            Total
                          </th>
                        </tr>
                      </thead>
                      <tbody>
                        {game.bookmakers.slice(0, 5).map((book, bIdx) => {
                          const h2h = book.markets?.find((m: Market) => m.key === 'h2h')
                          const spreads = book.markets?.find((m: Market) => m.key === 'spreads')
                          const totals = book.markets?.find((m: Market) => m.key === 'totals')

                          const awayML = h2h?.outcomes?.[0]
                          const homeML = h2h?.outcomes?.[1]
                          const homeSpread = spreads?.outcomes?.[1]
                          const totalOver = totals?.outcomes?.[0]
                          const totalUnder = totals?.outcomes?.[1]

                          return (
                            <tr key={bIdx} style={{ borderBottom: '1px solid rgba(255,255,255,0.06)' }}>
                              <td style={{ padding: '12px 0', color: '#F2F1EE', fontWeight: 600 }}>
                                {book.title}
                              </td>
                              <td style={{ textAlign: 'center', padding: '12px 0', color: '#16C172' }}>
                                {awayML ? `${awayML.price > 0 ? '+' : ''}${awayML.price}` : 'N/A'}
                              </td>
                              <td style={{ textAlign: 'center', padding: '12px 0', color: '#16C172' }}>
                                {homeML ? `${homeML.price > 0 ? '+' : ''}${homeML.price}` : 'N/A'}
                              </td>
                              <td style={{ textAlign: 'center', padding: '12px 0', color: '#E4342F' }}>
                                {homeSpread ? `${homeSpread.price > 0 ? '+' : ''}${homeSpread.price}` : 'N/A'}
                              </td>
                              <td style={{ textAlign: 'center', padding: '12px 0', color: '#98979C', fontSize: '11px' }}>
                                {totalOver && totalUnder
                                  ? `O${totalOver.price} / U${totalUnder.price}`
                                  : 'N/A'}
                              </td>
                            </tr>
                          )
                        })}
                      </tbody>
                    </table>
                  </div>
                ) : (
                  <div style={{ color: '#98979C', fontSize: '12px' }}>
                    No odds available for this game
                  </div>
                )}
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  )
}
