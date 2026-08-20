import { useEffect, useState } from 'react'

interface Odd {
  id: string
  team: string
  odd: number
  move: 'up' | 'down' | 'stable'
  change: string
}

export default function LiveOddsTicker() {
  const [odds, setOdds] = useState<Odd[]>([
    { id: '1', team: 'Chiefs', odd: -110, move: 'down', change: '-2.5' },
    { id: '2', team: 'Bills', odd: -110, move: 'up', change: '+3.2' },
    { id: '3', team: 'Lakers', odd: 165, move: 'up', change: '+4.1' },
    { id: '4', team: 'Celtics', odd: -190, move: 'down', change: '-1.8' },
    { id: '5', team: 'Silva ML', odd: 145, move: 'stable', change: '+0.5' },
    { id: '6', team: 'Arsenal', odd: 160, move: 'down', change: '-2.3' },
  ])

  // Simulate live odds movement
  useEffect(() => {
    const interval = setInterval(() => {
      setOdds(prevOdds =>
        prevOdds.map(odd => {
          const randomMove = Math.random()
          let newMove: 'up' | 'down' | 'stable' = 'stable'
          let newChange = odd.change

          if (randomMove > 0.7) {
            newMove = 'up'
            newChange = '+' + (Math.random() * 3).toFixed(1)
          } else if (randomMove < 0.3) {
            newMove = 'down'
            newChange = '-' + (Math.random() * 3).toFixed(1)
          }

          return { ...odd, move: newMove, change: newChange }
        })
      )
    }, 2000)

    return () => clearInterval(interval)
  }, [])

  const getMoveColor = (move: string) => {
    if (move === 'up') return '#16C172'
    if (move === 'down') return '#E4342F'
    return '#98979C'
  }

  const getMoveSymbol = (move: string) => {
    if (move === 'up') return '▲'
    if (move === 'down') return '▼'
    return '—'
  }

  return (
    <div style={{
      position: 'absolute',
      top: '72px',
      left: 0,
      right: 0,
      bottom: 0,
      opacity: 0.12,
      pointerEvents: 'none',
      background: 'linear-gradient(90deg, transparent, rgba(22,193,114,0.05), transparent)',
      display: 'flex',
      alignItems: 'center',
      overflow: 'hidden',
    }}>
      <div style={{
        display: 'flex',
        gap: '60px',
        animation: 'scroll 40s linear infinite',
        whiteSpace: 'nowrap',
        width: '100%',
      }}>
        {[...Array(2)].map((_, loopIdx) => (
          <div key={loopIdx} style={{ display: 'flex', gap: '60px' }}>
            {odds.map(odd => (
              <div
                key={odd.id}
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: '12px',
                  fontSize: '16px',
                  fontWeight: 700,
                  color: '#F2F1EE',
                  padding: '12px 20px',
                  borderRadius: '8px',
                  background: `rgba(22,193,114,0.1)`,
                  border: '1px solid rgba(22,193,114,0.2)',
                  transition: 'all 0.3s ease',
                }}
              >
                <span style={{ minWidth: '120px' }}>{odd.team}</span>
                <span style={{ color: '#98979C', fontSize: '14px' }}>
                  {odd.odd > 0 ? '+' : ''}{odd.odd}
                </span>
                <span
                  style={{
                    color: getMoveColor(odd.move),
                    fontSize: '18px',
                    fontWeight: 'bold',
                    animation: odd.move !== 'stable' ? 'pulse 0.6s ease-in-out' : 'none',
                  }}
                >
                  {getMoveSymbol(odd.move)}
                </span>
                <span style={{ color: getMoveColor(odd.move), fontSize: '12px' }}>
                  {odd.change}
                </span>
              </div>
            ))}
          </div>
        ))}
      </div>

      <style>{`
        @keyframes scroll {
          0% { transform: translateX(0); }
          100% { transform: translateX(-50%); }
        }
        @keyframes pulse {
          0%, 100% { opacity: 1; }
          50% { opacity: 0.5; }
        }
      `}</style>
    </div>
  )
}
