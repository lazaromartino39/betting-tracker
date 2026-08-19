import { useRouter } from 'next/router'
import Link from 'next/link'

interface NavbarProps {
  isLoggedIn?: boolean
  username?: string
}

export default function Navbar({ isLoggedIn = false, username = 'jdbets' }: NavbarProps) {
  const router = useRouter()
  const isHomePage = router.pathname === '/'
  const isAuthPage = router.pathname === '/signin' || router.pathname === '/signup'

  const navLinks = [
    { label: 'Dashboard', href: '/dashboard', page: 'dashboard' },
    { label: 'Live Odds', href: '/odds', page: 'odds' },
    { label: 'Social', href: '/feed', page: 'feed' },
    { label: 'Groups', href: '/groups', page: 'groups' },
    { label: 'Analytics', href: '/analytics', page: 'analytics' },
  ]

  const isActive = (href: string) => router.pathname === href

  return (
    <nav style={{
      position: 'sticky',
      top: 0,
      zIndex: 50,
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'space-between',
      gap: '16px',
      padding: '0 32px',
      height: '72px',
      background: 'rgba(11,11,12,0.85)',
      backdropFilter: 'blur(10px)',
      borderBottom: '1px solid rgba(255,255,255,0.08)',
    }}>
      <div style={{ display: 'flex', alignItems: 'center', gap: '36px' }}>
        <Link href="/">
          <div style={{
            cursor: 'pointer',
            display: 'flex',
            alignItems: 'baseline',
            fontFamily: "'Anton', sans-serif",
            letterSpacing: '0.5px',
            fontSize: '24px',
            lineHeight: 1,
          }}>
            <span style={{ color: '#F2F1EE' }}>PICKIT</span>
            <span style={{ color: '#E4342F' }}>TRACKER</span>
          </div>
        </Link>

        {/* Always show nav links */}
        <div style={{ display: 'flex', gap: '28px' }}>
          {navLinks.map(link => (
            <Link key={link.href} href={link.href}>
              <span style={{
                cursor: 'pointer',
                fontSize: '14px',
                fontWeight: 600,
                color: isActive(link.href) ? '#F2F1EE' : '#98979C',
                paddingBottom: '6px',
                borderBottom: `2px solid ${isActive(link.href) ? '#E4342F' : 'transparent'}`,
                transition: 'all 0.2s',
              }}>
                {link.label}
              </span>
            </Link>
          ))}
        </div>
      </div>

      <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
        {!isLoggedIn ? (
          <>
            <Link href="/signin">
              <span style={{ cursor: 'pointer', fontSize: '14px', fontWeight: 600, color: '#F2F1EE' }}>
                Log In
              </span>
            </Link>
            <Link href="/signup">
              <span style={{
                cursor: 'pointer',
                fontSize: '14px',
                fontWeight: 700,
                color: '#0B0B0C',
                background: '#E4342F',
                padding: '10px 20px',
                borderRadius: '6px',
              }}>
                Sign Up Free
              </span>
            </Link>
          </>
        ) : (
          <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
            <Link href="/settings">
              <div style={{
                display: 'flex',
                alignItems: 'center',
                gap: '10px',
                cursor: 'pointer',
                padding: '8px 12px',
                borderRadius: '6px',
                transition: 'background 0.2s',
              }}
              onMouseEnter={(e) => e.currentTarget.style.background = 'rgba(255,255,255,0.05)'}
              onMouseLeave={(e) => e.currentTarget.style.background = 'transparent'}
              >
                <div style={{
                  width: '34px',
                  height: '34px',
                  borderRadius: '50%',
                  background: '#1D1D20',
                  border: '1px solid #16C172',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  fontFamily: "'Anton', sans-serif",
                  fontSize: '13px',
                  color: '#16C172',
                }}>
                  {username.substring(0, 2).toUpperCase()}
                </div>
                <span style={{ fontSize: '14px', fontWeight: 600 }}>{username}</span>
              </div>
            </Link>
          </div>
        )}
      </div>
    </nav>
  )
}
