import { useState, useEffect } from 'react'
import { useRouter } from 'next/router'
import Navbar from '@/components/Navbar'
import LiveOddsTicker from '@/components/LiveOddsTicker'
import GoogleSignIn from '@/components/GoogleSignIn'
import Link from 'next/link'

export default function Signup() {
  const router = useRouter()
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  const [formData, setFormData] = useState({ email: '', username: '', password: '' })

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value })
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    setError('')

    try {
      const res = await fetch('/api/auth/signup', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData),
      })

      if (!res.ok) {
        const data = await res.json()
        throw new Error(data.error || 'Signup failed')
      }

      const data = await res.json()
      localStorage.setItem('token', data.token)
      localStorage.setItem('user', JSON.stringify({
        userId: data.userId,
        username: data.username,
        email: data.email,
      }))
      router.push('/dashboard')
    } catch (err) {
      setError(err instanceof Error ? err.message : 'An error occurred')
    } finally {
      setLoading(false)
    }
  }


  return (
    <div style={{ minHeight: '100vh', background: '#0B0B0C', color: '#F2F1EE', position: 'relative', overflow: 'hidden' }}>
      <LiveOddsTicker />

      <Navbar isLoggedIn={false} />

      <div style={{
        display: 'grid',
        gridTemplateColumns: '1.1fr 1fr',
        minHeight: 'calc(100vh - 72px)',
        position: 'relative',
        zIndex: 10,
      }}>
        {/* LEFT SIDE */}
        <div style={{
          position: 'relative',
          background: 'radial-gradient(circle at 30% 20%, rgba(228,52,47,0.22), transparent 55%), radial-gradient(circle at 80% 80%, rgba(22,193,114,0.18), transparent 50%), #0B0B0C',
          padding: '64px',
          display: 'flex',
          flexDirection: 'column',
          justifyContent: 'center',
        }}>
          <div style={{ fontFamily: "'Anton', sans-serif", fontSize: '44px', lineHeight: 1.05, maxWidth: '440px' }}>
            JOIN THE SQUAD<br />
            <span style={{ color: '#16C172' }}>ALREADY WINNING.</span>
          </div>

          <div style={{ marginTop: '40px', display: 'flex', flexDirection: 'column', gap: '16px', maxWidth: '380px' }}>
            <div style={{
              background: 'rgba(255,255,255,0.04)',
              border: '1px solid rgba(255,255,255,0.1)',
              borderRadius: '10px',
              padding: '18px 20px',
            }}>
              <div style={{ fontSize: '14px', color: '#c9c8cc', lineHeight: 1.5 }}>
                "Finally a place to actually track our group chat picks instead of screenshotting Venmo."
              </div>
              <div style={{ marginTop: '10px', fontSize: '13px', color: '#98979C', fontWeight: 600 }}>
                — sharpshooterjay
              </div>
            </div>

            <div style={{ display: 'flex', gap: '14px' }}>
              <div style={{
                flex: 1,
                background: 'rgba(255,255,255,0.04)',
                border: '1px solid rgba(255,255,255,0.1)',
                borderRadius: '10px',
                padding: '16px',
                textAlign: 'center',
              }}>
                <div style={{ fontFamily: "'Anton', sans-serif", fontSize: '24px', color: '#16C172' }}>
                  12,800+
                </div>
                <div style={{ fontSize: '12px', color: '#98979C' }}>Bets Logged</div>
              </div>
              <div style={{
                flex: 1,
                background: 'rgba(255,255,255,0.04)',
                border: '1px solid rgba(255,255,255,0.1)',
                borderRadius: '10px',
                padding: '16px',
                textAlign: 'center',
              }}>
                <div style={{ fontFamily: "'Anton', sans-serif", fontSize: '24px', color: '#E4342F' }}>
                  2,400+
                </div>
                <div style={{ fontSize: '12px', color: '#98979C' }}>Active Bettors</div>
              </div>
            </div>
          </div>
        </div>

        {/* RIGHT SIDE */}
        <div style={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          padding: '48px',
        }}>
          <div style={{ width: '100%', maxWidth: '380px' }}>
            <div style={{
              display: 'flex',
              background: '#141416',
              border: '1px solid rgba(255,255,255,0.08)',
              borderRadius: '10px',
              padding: '4px',
              marginBottom: '28px',
            }}>
              <Link href="/signin">
                <div style={{
                  flex: 1,
                  textAlign: 'center',
                  padding: '11px',
                  borderRadius: '7px',
                  cursor: 'pointer',
                  fontWeight: 700,
                  fontSize: '14px',
                  color: '#98979C',
                }}>
                  Log In
                </div>
              </Link>
              <div style={{
                flex: 1,
                textAlign: 'center',
                padding: '11px',
                borderRadius: '7px',
                cursor: 'pointer',
                fontWeight: 700,
                fontSize: '14px',
                background: '#E4342F',
                color: '#0B0B0C',
              }}>
                Sign Up
              </div>
            </div>

            <div style={{ fontFamily: "'Anton', sans-serif", fontSize: '26px', marginBottom: '6px' }}>
              Create your account
            </div>
            <div style={{ color: '#98979C', fontSize: '14px', marginBottom: '26px' }}>
              Start tracking your picks in under a minute.
            </div>

            <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '14px' }}>
              {error && (
                <div style={{
                  background: 'rgba(228,52,47,0.15)',
                  color: '#E4342F',
                  padding: '12px',
                  borderRadius: '8px',
                  fontSize: '13px',
                }}>
                  {error}
                </div>
              )}

              <div>
                <div style={{ fontSize: '13px', fontWeight: 600, color: '#c9c8cc', marginBottom: '6px' }}>
                  Username
                </div>
                <input
                  type="text"
                  name="username"
                  placeholder="jdbets"
                  value={formData.username}
                  onChange={handleChange}
                  required
                  style={{
                    width: '100%',
                    background: '#141416',
                    border: '1px solid rgba(255,255,255,0.12)',
                    borderRadius: '8px',
                    padding: '13px 14px',
                    color: '#F2F1EE',
                    fontSize: '14px',
                    fontFamily: 'inherit',
                  }}
                />
              </div>

              <div>
                <div style={{ fontSize: '13px', fontWeight: 600, color: '#c9c8cc', marginBottom: '6px' }}>
                  Email
                </div>
                <input
                  type="email"
                  name="email"
                  placeholder="you@email.com"
                  value={formData.email}
                  onChange={handleChange}
                  required
                  style={{
                    width: '100%',
                    background: '#141416',
                    border: '1px solid rgba(255,255,255,0.12)',
                    borderRadius: '8px',
                    padding: '13px 14px',
                    color: '#F2F1EE',
                    fontSize: '14px',
                    fontFamily: 'inherit',
                  }}
                />
              </div>

              <div>
                <div style={{ fontSize: '13px', fontWeight: 600, color: '#c9c8cc', marginBottom: '6px' }}>
                  Password
                </div>
                <input
                  type="password"
                  name="password"
                  placeholder="••••••••"
                  value={formData.password}
                  onChange={handleChange}
                  required
                  style={{
                    width: '100%',
                    background: '#141416',
                    border: '1px solid rgba(255,255,255,0.12)',
                    borderRadius: '8px',
                    padding: '13px 14px',
                    color: '#F2F1EE',
                    fontSize: '14px',
                    fontFamily: 'inherit',
                  }}
                />
              </div>

              <button
                type="submit"
                disabled={loading}
                style={{
                  cursor: 'pointer',
                  textAlign: 'center',
                  marginTop: '6px',
                  background: '#E4342F',
                  color: '#0B0B0C',
                  fontWeight: 700,
                  fontSize: '15px',
                  padding: '14px',
                  borderRadius: '8px',
                  border: 'none',
                  opacity: loading ? 0.6 : 1,
                }}
              >
                {loading ? 'Creating Account...' : 'Create Account'}
              </button>

              <div style={{ display: 'flex', alignItems: 'center', gap: '10px', margin: '6px 0', color: '#66656a', fontSize: '12px' }}>
                <div style={{ flex: 1, height: '1px', background: 'rgba(255,255,255,0.1)' }} />
                OR
                <div style={{ flex: 1, height: '1px', background: 'rgba(255,255,255,0.1)' }} />
              </div>

              <div id="google-signin-button" style={{ display: 'flex', justifyContent: 'center' }} />
              <GoogleSignIn
                onError={(err) => setError(err)}
                onSuccess={(token, user) => {
                  localStorage.setItem('token', token)
                  localStorage.setItem('user', JSON.stringify(user))
                  router.push('/dashboard')
                }}
              />
            </form>
          </div>
        </div>
      </div>
    </div>
  )
}
