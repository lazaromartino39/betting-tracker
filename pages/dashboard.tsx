import { useEffect, useState } from 'react'
import { useRouter } from 'next/router'
import Navbar from '@/components/Navbar'
import RealOddsTicker from '@/components/RealOddsTicker'
import FloatingOdds from '@/components/FloatingOdds'
import Link from 'next/link'

interface User {
  userId: string
  username: string
  email: string
}

export default function Dashboard() {
  const router = useRouter()
  const [user, setUser] = useState<User | null>(null)
  const [isLoggedIn, setIsLoggedIn] = useState(false)

  useEffect(() => {
    const token = localStorage.getItem('token')
    const userData = localStorage.getItem('user')

    if (!token) {
      router.push('/signin')
      return
    }

    if (userData) {
      try {
        const parsed = JSON.parse(userData)
        setUser(parsed)
        setIsLoggedIn(true)
      } catch {
        router.push('/signin')
      }
    }
  }, [router])

  if (!user) {
    return <div style={{ background: '#0B0B0C', minHeight: '100vh' }} />
  }

  const username = user.username

  const dashboardStats = [
    { label: 'Net Profit', value: '+$1,240', color: '#16C172' },
    { label: 'Win Rate', value: '58.3%', color: '#16C172' },
    { label: 'Current Streak', value: 'W4', color: '#16C172' },
    { label: 'ROI', value: '+12.1%', color: '#16C172' },
  ]

  const recentBets = [
    { matchup: 'Chiefs @ Bills', pick: 'Bills -2.5', odds: '-110', stake: '$50', status: 'Won', payout: '+$95.45' },
    { matchup: 'Lakers @ Celtics', pick: 'Over 218.5', odds: '-105', stake: '$25', status: 'Lost', payout: '-$25.00' },
    { matchup: 'UFC 305: Silva vs Cruz', pick: 'Silva ML', odds: '+145', stake: '$30', status: 'Won', payout: '+$43.50' },
    { matchup: 'Dodgers @ Padres', pick: 'Dodgers ML', odds: '-160', stake: '$40', status: 'Pending', payout: '—' },
    { matchup: 'Man City vs Arsenal', pick: 'BTTS Yes', odds: '+120', stake: '$20', status: 'Won', payout: '+$24.00' },
  ]

  const leaderboard = [
    { rank: 1, name: 'PickIt Bros', record: '112-64', profit: '+$4,820', initials: 'PB', avatarBorder: '#16C172' },
    { rank: 2, name: 'sharpshooterjay', record: '98-71', profit: '+$3,110', initials: 'SJ', avatarBorder: 'rgba(255,255,255,0.2)' },
    { rank: 3, name: 'jdbets (you)', record: '86-62', profit: '+$1,240', initials: 'JD', avatarBorder: '#E4342F' },
    { rank: 4, name: 'fadethepublic', record: '80-70', profit: '+$980', initials: 'FP', avatarBorder: 'rgba(255,255,255,0.2)' },
    { rank: 5, name: 'parlayqueen', record: '75-68', profit: '+$740', initials: 'PQ', avatarBorder: 'rgba(255,255,255,0.2)' },
  ]

  const getBadgeStyles = (status: string) => {
    switch (status) {
      case 'Won':
        return { bg: 'rgba(22,193,114,0.15)', color: '#16C172' }
      case 'Lost':
        return { bg: 'rgba(228,52,47,0.15)', color: '#E4342F' }
      default:
        return { bg: 'rgba(255,255,255,0.08)', color: '#9B9B9C' }
    }
  }

  return (
    <div style={{ minHeight: '100vh', background: '#0B0B0C', color: '#F2F1EE', fontFamily: "'Inter', sans-serif", position: 'relative', overflow: 'hidden' }}>
      <RealOddsTicker />
      <Navbar isLoggedIn={isLoggedIn} username={username} />
      <FloatingOdds />

      <div style={{ maxWidth: '1240px', margin: '0 auto', padding: '40px 32px' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end', marginBottom: '28px', flexWrap: 'wrap', gap: '14px' }}>
          <div>
            <div style={{ fontFamily: "'Anton', sans-serif", fontSize: '30px' }}>
              WELCOME BACK, {username.toUpperCase()}
            </div>
            <div style={{ color: '#98979C', fontSize: '14px', marginTop: '4px' }}>
              Tuesday, August 18 · Week 24
            </div>
          </div>
          <button style={{
            cursor: 'pointer',
            background: '#E4342F',
            color: '#0B0B0C',
            fontWeight: 700,
            fontSize: '14px',
            padding: '13px 22px',
            borderRadius: '8px',
            border: 'none',
          }}>
            + Log a Bet
          </button>
        </div>

        {/* STATS GRID */}
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: '16px', marginBottom: '28px' }}>
          {dashboardStats.map((stat, i) => (
            <div key={i} style={{
              background: '#141416',
              border: '1px solid rgba(255,255,255,0.08)',
              borderRadius: '12px',
              padding: '22px',
            }}>
              <div style={{ color: '#98979C', fontSize: '13px', fontWeight: 600 }}>
                {stat.label}
              </div>
              <div style={{
                fontFamily: "'Anton', sans-serif",
                fontSize: '28px',
                marginTop: '8px',
                color: stat.color,
              }}>
                {stat.value}
              </div>
            </div>
          ))}
        </div>

        {/* MAIN CONTENT */}
        <div style={{ display: 'grid', gridTemplateColumns: '1.6fr 1fr', gap: '20px' }}>
          {/* RECENT BETS */}
          <div style={{
            background: '#141416',
            border: '1px solid rgba(255,255,255,0.08)',
            borderRadius: '12px',
            padding: '26px',
          }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '18px' }}>
              <div style={{ fontWeight: 700, fontSize: '17px' }}>Recent Bets</div>
              <Link href="/analytics">
                <span style={{ cursor: 'pointer', color: '#16C172', fontSize: '13px', fontWeight: 600 }}>
                  View analytics →
                </span>
              </Link>
            </div>

            {recentBets.map((bet, i) => {
              const badgeStyles = getBadgeStyles(bet.status)
              return (
                <div key={i} style={{
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'space-between',
                  padding: '14px 0',
                  borderBottom: i < recentBets.length - 1 ? '1px solid rgba(255,255,255,0.06)' : 'none',
                }}>
                  <div>
                    <div style={{ fontWeight: 600, fontSize: '14px' }}>
                      {bet.matchup}
                    </div>
                    <div style={{ color: '#98979C', fontSize: '13px', marginTop: '3px' }}>
                      {bet.pick} · {bet.odds} · Stake {bet.stake}
                    </div>
                  </div>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '14px' }}>
                    <div style={{ fontWeight: 700, fontSize: '14px', color: badgeStyles.color }}>
                      {bet.payout}
                    </div>
                    <div style={{
                      fontSize: '12px',
                      fontWeight: 700,
                      padding: '5px 12px',
                      borderRadius: '100px',
                      background: badgeStyles.bg,
                      color: badgeStyles.color,
                    }}>
                      {bet.status}
                    </div>
                  </div>
                </div>
              )
            })}
          </div>

          {/* SIDEBAR */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
            {/* LEADERBOARD */}
            <div style={{
              background: '#141416',
              border: '1px solid rgba(255,255,255,0.08)',
              borderRadius: '12px',
              padding: '24px',
            }}>
              <div style={{ fontWeight: 700, fontSize: '17px', marginBottom: '16px' }}>
                Leaderboard
              </div>

              {leaderboard.map((leader, i) => (
                <div key={i} style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: '12px',
                  padding: '10px 0',
                  borderBottom: i < leaderboard.length - 1 ? '1px solid rgba(255,255,255,0.06)' : 'none',
                }}>
                  <div style={{
                    width: '22px',
                    fontFamily: "'Anton', sans-serif",
                    color: '#66656a',
                    fontSize: '14px',
                  }}>
                    {leader.rank}
                  </div>
                  <div style={{
                    width: '32px',
                    height: '32px',
                    borderRadius: '50%',
                    background: '#1D1D20',
                    border: `1px solid ${leader.avatarBorder}`,
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    fontSize: '11px',
                    fontWeight: 700,
                    color: leader.avatarBorder,
                  }}>
                    {leader.initials}
                  </div>
                  <div style={{ flex: 1 }}>
                    <div style={{ fontSize: '13px', fontWeight: 600 }}>
                      {leader.name}
                    </div>
                    <div style={{ fontSize: '12px', color: '#66656a' }}>
                      {leader.record}
                    </div>
                  </div>
                  <div style={{ fontSize: '13px', fontWeight: 700, color: '#16C172' }}>
                    {leader.profit}
                  </div>
                </div>
              ))}
            </div>

            {/* TOP BETTOR */}
            <div style={{
              background: 'linear-gradient(135deg, rgba(228,52,47,0.14), rgba(22,193,114,0.08))',
              border: '1px solid rgba(255,255,255,0.1)',
              borderRadius: '12px',
              padding: '22px',
            }}>
              <div style={{ fontSize: '13px', color: '#98979C', fontWeight: 700, marginBottom: '8px' }}>
                TOP BETTOR THIS WEEK
              </div>
              <div style={{ fontWeight: 700, fontSize: '16px' }}>
                PickIt Bros — +$4,820
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
