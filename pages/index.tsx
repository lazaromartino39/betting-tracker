import Navbar from '@/components/Navbar'
import Link from 'next/link'

export default function Home() {
  return (
    <div style={{ minHeight: '100vh', background: '#0B0B0C', color: '#F2F1EE', fontFamily: "'Inter', sans-serif" }}>
      <Navbar isLoggedIn={false} />

      {/* HERO */}
      <div style={{
        position: 'relative',
        padding: '96px 32px 88px',
        textAlign: 'center',
        overflow: 'hidden',
        background: 'radial-gradient(circle at 50% -10%, rgba(228,52,47,0.18), transparent 55%), radial-gradient(circle at 85% 110%, rgba(22,193,114,0.14), transparent 50%), #0B0B0C',
      }}>
        <div style={{
          position: 'absolute',
          inset: 0,
          backgroundImage: 'repeating-linear-gradient(115deg, rgba(255,255,255,0.025) 0px, rgba(255,255,255,0.025) 1px, transparent 1px, transparent 42px)',
          pointerEvents: 'none',
        }} />

        <div style={{ position: 'relative', maxWidth: '780px', margin: '0 auto' }}>
          <div style={{
            display: 'inline-flex',
            alignItems: 'center',
            gap: '8px',
            background: 'rgba(22,193,114,0.1)',
            border: '1px solid rgba(22,193,114,0.3)',
            color: '#16C172',
            fontSize: '13px',
            fontWeight: 700,
            padding: '8px 16px',
            borderRadius: '100px',
            marginBottom: '28px',
          }}>
            <span style={{
              width: '7px',
              height: '7px',
              borderRadius: '50%',
              background: '#16C172',
              animation: 'livePulse 1.6s infinite',
            }} />
            LIVE ODDS · 2,400+ BETTORS TRACKING NOW
          </div>

          <h1 style={{
            fontFamily: "'Anton', sans-serif",
            fontSize: '76px',
            lineHeight: 0.98,
            margin: '0 0 22px',
            letterSpacing: '0.5px',
          }}>
            TRACK YOUR PICKS.<br />
            <span style={{ color: '#E4342F' }}>PROVE YOUR EDGE.</span>
          </h1>

          <p style={{
            fontSize: '19px',
            color: '#98979C',
            maxWidth: '560px',
            margin: '0 auto 36px',
            lineHeight: 1.5,
          }}>
            Log every bet, follow live odds across every book, and build a public record the whole squad can see. No spreadsheets. No excuses.
          </p>

          <div style={{ display: 'flex', gap: '14px', justifyContent: 'center', flexWrap: 'wrap' }}>
            <Link href="/signup">
              <span style={{
                cursor: 'pointer',
                background: '#E4342F',
                color: '#0B0B0C',
                fontWeight: 700,
                fontSize: '16px',
                padding: '16px 32px',
                borderRadius: '8px',
                display: 'inline-block',
              }}>
                Start Tracking Free
              </span>
            </Link>
            <Link href="/odds">
              <span style={{
                cursor: 'pointer',
                background: 'transparent',
                color: '#F2F1EE',
                fontWeight: 700,
                fontSize: '16px',
                padding: '16px 32px',
                borderRadius: '8px',
                border: '1px solid rgba(255,255,255,0.18)',
                display: 'inline-block',
              }}>
                See Live Odds
              </span>
            </Link>
          </div>
        </div>
      </div>

      {/* STATS STRIP */}
      <div style={{
        display: 'grid',
        gridTemplateColumns: 'repeat(4, 1fr)',
        borderTop: '1px solid rgba(255,255,255,0.08)',
        borderBottom: '1px solid rgba(255,255,255,0.08)',
      }}>
        {[
          { value: '128K+', label: 'Bets Tracked', color: '#F2F1EE' },
          { value: '2,400+', label: 'Active Bettors', color: '#F2F1EE' },
          { value: '54.2%', label: 'Avg Win Rate', color: '#16C172' },
          { value: '9', label: 'Sports Covered', color: '#F2F1EE' },
        ].map((stat, i) => (
          <div key={i} style={{
            padding: '28px 12px',
            textAlign: 'center',
            borderRight: i < 3 ? '1px solid rgba(255,255,255,0.08)' : 'none',
          }}>
            <div style={{
              fontFamily: "'Anton', sans-serif",
              fontSize: '32px',
              color: stat.color,
            }}>
              {stat.value}
            </div>
            <div style={{ fontSize: '13px', color: '#98979C', marginTop: '6px', fontWeight: 600 }}>
              {stat.label}
            </div>
          </div>
        ))}
      </div>

      {/* FEATURES */}
      <div style={{ padding: '88px 32px', maxWidth: '1180px', margin: '0 auto' }}>
        <div style={{ textAlign: 'center', marginBottom: '52px' }}>
          <div style={{ color: '#E4342F', fontWeight: 700, fontSize: '13px', letterSpacing: '1.5px', marginBottom: '10px' }}>
            WHY PICKITTRACKER
          </div>
          <h2 style={{ fontFamily: "'Anton', sans-serif", fontSize: '38px', margin: 0 }}>
            EVERYTHING YOUR BETTING GROUP NEEDS
          </h2>
        </div>

        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '20px' }}>
          {[
            { icon: '📈', title: 'Live Odds', desc: 'Real-time lines across every major book, updated as they move.' },
            { icon: '👥', title: 'Social Feed', desc: "Follow your group's picks, react in real time, settle up in public." },
            { icon: '📊', title: 'Analytics', desc: 'ROI, win rate, and profit trends broken down by sport and bet type.' },
          ].map((f, i) => (
            <div key={i} style={{
              background: '#141416',
              border: '1px solid rgba(255,255,255,0.08)',
              borderRadius: '12px',
              padding: '30px',
            }}>
              <div style={{
                width: '44px',
                height: '44px',
                borderRadius: '10px',
                background: i === 0 ? 'rgba(228,52,47,0.15)' : i === 1 ? 'rgba(22,193,114,0.15)' : 'rgba(228,52,47,0.15)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                fontSize: '20px',
                marginBottom: '18px',
              }}>
                {f.icon}
              </div>
              <div style={{ fontWeight: 700, fontSize: '18px', marginBottom: '8px' }}>
                {f.title}
              </div>
              <div style={{ color: '#98979C', fontSize: '14px', lineHeight: 1.55 }}>
                {f.desc}
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* PICKIT BROS */}
      <div style={{ padding: '0 32px 96px' }}>
        <div style={{
          maxWidth: '1180px',
          margin: '0 auto',
          position: 'relative',
          borderRadius: '20px',
          overflow: 'hidden',
          background: 'linear-gradient(135deg, rgba(228,52,47,0.14), rgba(22,193,114,0.10))',
          border: '1px solid rgba(255,255,255,0.1)',
          padding: '56px 48px',
          textAlign: 'center',
        }}>
          <img src="/assets/pickitbros-logo.jpg" alt="PickIt Bros" style={{
            width: '96px',
            height: '96px',
            borderRadius: '50%',
            objectFit: 'cover',
            border: '2px solid rgba(255,255,255,0.2)',
            margin: '0 auto 20px',
            display: 'block',
          }} />

          <div style={{ color: '#98979C', fontSize: '13px', fontWeight: 700, letterSpacing: '2px', marginBottom: '14px' }}>
            POWERED BY PICKITTRACKER
          </div>

          <h2 style={{ fontFamily: "'Anton', sans-serif", fontSize: '46px', margin: '0 0 16px', letterSpacing: '0.5px' }}>
            FOLLOW THE <span style={{ color: '#E4342F' }}>PICKIT</span><span style={{ color: '#16C172' }}>BROS</span>
          </h2>

          <p style={{ color: '#c9c8cc', fontSize: '17px', maxWidth: '560px', margin: '0 auto 30px', lineHeight: 1.55 }}>
            NFL. NBA. UFC. Every pick they make, tracked live and settled in public. Premium access is coming — right now, following along is <strong style={{ color: '#16C172' }}>100% free</strong>.
          </p>

          <Link href="/pickitbros">
            <span style={{
              cursor: 'pointer',
              display: 'inline-block',
              background: '#16C172',
              color: '#0B0B0C',
              fontWeight: 700,
              fontSize: '16px',
              padding: '16px 34px',
              borderRadius: '8px',
            }}>
              See PickIt Bros Picks →
            </span>
          </Link>
        </div>
      </div>

      {/* FOOTER */}
      <div style={{
        borderTop: '1px solid rgba(255,255,255,0.08)',
        padding: '32px',
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center',
        maxWidth: '1180px',
        margin: '0 auto',
        color: '#66656a',
        fontSize: '13px',
      }}>
        <div style={{ fontFamily: "'Anton', sans-serif", color: '#98979C' }}>
          PICKIT<span style={{ color: '#E4342F' }}>TRACKER</span>
        </div>
        <div>© 2026 PickItTracker. Bet responsibly. 21+.</div>
      </div>
    </div>
  )
}
