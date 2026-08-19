import Navbar from '@/components/Navbar'

export default function Groups() {
  const username = 'jdbets'
  const isLoggedIn = true

  const groups = [
    { id: 'g1', name: 'Sunday Squad', members: 5, profit: '+$2,140', avatars: ['JD', 'SJ', 'FP', 'PQ', 'MK'], active: true },
    { id: 'g2', name: 'PickIt Bros VIP', members: 12, profit: '+$4,820', avatars: ['PB', 'JD', 'SJ'], active: false },
    { id: 'g3', name: 'Office Parlay', members: 4, profit: '-$180', avatars: ['TK', 'RL', 'AN'], active: false },
  ]

  const pooledBets = [
    { matchup: 'Chiefs @ Bills', pick: 'Bills -2.5', odds: '-110', pooledStake: '$250 (5 × $50)', status: 'Won', addedBy: 'jdbets' },
    { matchup: 'Lakers @ Celtics', pick: 'Under 218.5', odds: '-105', pooledStake: '$125 (5 × $25)', status: 'Pending', addedBy: 'sharpshooterjay' },
    { matchup: 'UFC 305: Silva vs Cruz', pick: 'Silva ML', odds: '+145', pooledStake: '$150 (5 × $30)', status: 'Won', addedBy: 'fadethepublic' },
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

  const getProfitColor = (profit: string) => profit.startsWith('+') ? '#16C172' : '#E4342F'

  return (
    <div style={{ minHeight: '100vh', background: '#0B0B0C', color: '#F2F1EE', fontFamily: "'Inter', sans-serif" }}>
      <Navbar isLoggedIn={isLoggedIn} username={username} />

      <div style={{ maxWidth: '1180px', margin: '0 auto', padding: '40px 32px' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '24px', flexWrap: 'wrap', gap: '14px' }}>
          <div>
            <div style={{ fontFamily: "'Anton', sans-serif", fontSize: '30px' }}>GROUPS</div>
            <div style={{ color: '#98979C', fontSize: '14px', marginTop: '4px' }}>
              Pool bets and track the record together.
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
            + Create Group
          </button>
        </div>

        {/* GROUPS GRID */}
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '16px', marginBottom: '32px' }}>
          {groups.map((group) => (
            <div key={group.id} style={{
              cursor: 'pointer',
              background: '#141416',
              border: group.active ? '1px solid #E4342F' : '1px solid rgba(255,255,255,0.08)',
              borderRadius: '12px',
              padding: '20px',
              transition: 'border-color 0.2s',
            }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '14px' }}>
                <div style={{ fontWeight: 700, fontSize: '16px' }}>{group.name}</div>
                <div style={{ fontSize: '12px', color: '#66656a' }}>{group.members} members</div>
              </div>

              <div style={{ display: 'flex', marginBottom: '14px' }}>
                {group.avatars.map((avatar, i) => (
                  <div key={i} style={{
                    width: '28px',
                    height: '28px',
                    borderRadius: '50%',
                    background: '#1D1D20',
                    border: '2px solid #141416',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    fontSize: '10px',
                    fontWeight: 700,
                    marginLeft: i > 0 ? '-8px' : 0,
                    color: '#c9c8cc',
                  }}>
                    {avatar}
                  </div>
                ))}
              </div>

              <div style={{ fontSize: '13px', color: '#66656a', fontWeight: 600 }}>
                Group Profit
              </div>
              <div style={{
                fontFamily: "'Anton', sans-serif",
                fontSize: '22px',
                color: getProfitColor(group.profit),
              }}>
                {group.profit}
              </div>
            </div>
          ))}
        </div>

        {/* POOLED BETS */}
        <div style={{
          background: '#141416',
          border: '1px solid rgba(255,255,255,0.08)',
          borderRadius: '12px',
          padding: '26px',
        }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '6px', flexWrap: 'wrap', gap: '10px' }}>
            <div style={{ fontWeight: 700, fontSize: '18px' }}>Sunday Squad — Pooled Bets</div>
            <div style={{ display: 'flex', gap: '10px' }}>
              <button style={{
                cursor: 'pointer',
                fontSize: '13px',
                fontWeight: 700,
                border: '1px solid rgba(255,255,255,0.16)',
                padding: '9px 16px',
                borderRadius: '8px',
                background: 'transparent',
                color: '#F2F1EE',
              }}>
                Invite Members
              </button>
              <button style={{
                cursor: 'pointer',
                fontSize: '13px',
                fontWeight: 700,
                background: '#16C172',
                color: '#0B0B0C',
                padding: '9px 16px',
                borderRadius: '8px',
                border: 'none',
              }}>
                + Add Bet Together
              </button>
            </div>
          </div>

          <div style={{ color: '#66656a', fontSize: '13px', marginBottom: '18px' }}>
            Everyone chips in, one shared slip, split evenly on settle.
          </div>

          {pooledBets.map((bet, i) => {
            const badgeStyles = getBadgeStyles(bet.status)
            return (
              <div key={i} style={{
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'space-between',
                padding: '14px 0',
                borderBottom: i < pooledBets.length - 1 ? '1px solid rgba(255,255,255,0.06)' : 'none',
                flexWrap: 'wrap',
                gap: '10px',
              }}>
                <div>
                  <div style={{ fontWeight: 600, fontSize: '14px' }}>
                    {bet.matchup}
                  </div>
                  <div style={{ color: '#98979C', fontSize: '13px', marginTop: '3px' }}>
                    {bet.pick} · {bet.odds} · Added by {bet.addedBy} · Pool {bet.pooledStake}
                  </div>
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
            )
          })}
        </div>
      </div>
    </div>
  )
}
