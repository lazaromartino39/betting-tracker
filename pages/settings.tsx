import { useEffect, useState } from 'react'
import { useRouter } from 'next/router'
import Navbar from '@/components/Navbar'
import Link from 'next/link'

interface User {
  userId: string
  username: string
  email: string
}

export default function Settings() {
  const router = useRouter()
  const [user, setUser] = useState<User | null>(null)
  const [isLoggedIn, setIsLoggedIn] = useState(false)
  const [showLogoutConfirm, setShowLogoutConfirm] = useState(false)

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

  const handleLogout = () => {
    localStorage.removeItem('token')
    localStorage.removeItem('user')
    router.push('/')
  }

  if (!user) {
    return <div style={{ background: '#0B0B0C', minHeight: '100vh' }} />
  }

  return (
    <div style={{ minHeight: '100vh', background: '#0B0B0C', color: '#F2F1EE', fontFamily: "'Inter', sans-serif" }}>
      <Navbar isLoggedIn={isLoggedIn} username={user.username} />

      <div style={{ maxWidth: '1000px', margin: '0 auto', padding: '40px 32px' }}>
        <div style={{ fontFamily: "'Anton', sans-serif", fontSize: '30px', marginBottom: '40px' }}>
          SETTINGS
        </div>

        {/* Profile Section */}
        <div style={{
          background: '#141416',
          border: '1px solid rgba(255,255,255,0.08)',
          borderRadius: '12px',
          padding: '32px',
          marginBottom: '24px',
        }}>
          <div style={{ fontSize: '18px', fontWeight: 700, marginBottom: '24px' }}>
            Profile Information
          </div>

          <div style={{ display: 'grid', gap: '20px', maxWidth: '500px' }}>
            <div>
              <div style={{ fontSize: '13px', fontWeight: 600, color: '#c9c8cc', marginBottom: '8px' }}>
                Username
              </div>
              <div style={{
                background: '#0B0B0C',
                border: '1px solid rgba(255,255,255,0.12)',
                borderRadius: '8px',
                padding: '13px 14px',
                color: '#F2F1EE',
                fontSize: '14px',
              }}>
                {user.username}
              </div>
            </div>

            <div>
              <div style={{ fontSize: '13px', fontWeight: 600, color: '#c9c8cc', marginBottom: '8px' }}>
                Email
              </div>
              <div style={{
                background: '#0B0B0C',
                border: '1px solid rgba(255,255,255,0.12)',
                borderRadius: '8px',
                padding: '13px 14px',
                color: '#F2F1EE',
                fontSize: '14px',
              }}>
                {user.email}
              </div>
            </div>

            <div>
              <div style={{ fontSize: '13px', fontWeight: 600, color: '#c9c8cc', marginBottom: '8px' }}>
                User ID
              </div>
              <div style={{
                background: '#0B0B0C',
                border: '1px solid rgba(255,255,255,0.12)',
                borderRadius: '8px',
                padding: '13px 14px',
                color: '#98979C',
                fontSize: '13px',
                fontFamily: 'monospace',
              }}>
                {user.userId}
              </div>
            </div>
          </div>
        </div>

        {/* Preferences Section */}
        <div style={{
          background: '#141416',
          border: '1px solid rgba(255,255,255,0.08)',
          borderRadius: '12px',
          padding: '32px',
          marginBottom: '24px',
        }}>
          <div style={{ fontSize: '18px', fontWeight: 700, marginBottom: '24px' }}>
            Preferences
          </div>

          <div style={{ display: 'grid', gap: '16px', maxWidth: '500px' }}>
            <label style={{ display: 'flex', alignItems: 'center', gap: '12px', cursor: 'pointer' }}>
              <input type="checkbox" defaultChecked style={{ width: '18px', height: '18px' }} />
              <span style={{ fontSize: '14px' }}>Email notifications for bet results</span>
            </label>

            <label style={{ display: 'flex', alignItems: 'center', gap: '12px', cursor: 'pointer' }}>
              <input type="checkbox" defaultChecked style={{ width: '18px', height: '18px' }} />
              <span style={{ fontSize: '14px' }}>Show profile publicly</span>
            </label>

            <label style={{ display: 'flex', alignItems: 'center', gap: '12px', cursor: 'pointer' }}>
              <input type="checkbox" style={{ width: '18px', height: '18px' }} />
              <span style={{ fontSize: '14px' }}>Allow friend requests</span>
            </label>
          </div>
        </div>

        {/* Logout Section */}
        <div style={{
          background: 'rgba(228,52,47,0.1)',
          border: '1px solid rgba(228,52,47,0.3)',
          borderRadius: '12px',
          padding: '32px',
        }}>
          <div style={{ fontSize: '18px', fontWeight: 700, marginBottom: '16px', color: '#E4342F' }}>
            Logout
          </div>
          <div style={{ color: '#98979C', fontSize: '14px', marginBottom: '20px' }}>
            You will be logged out and returned to the home page. Your data will be saved.
          </div>

          {!showLogoutConfirm ? (
            <button
              onClick={() => setShowLogoutConfirm(true)}
              style={{
                cursor: 'pointer',
                background: '#E4342F',
                color: '#0B0B0C',
                fontWeight: 700,
                fontSize: '14px',
                padding: '13px 22px',
                borderRadius: '8px',
                border: 'none',
              }}
            >
              Logout
            </button>
          ) : (
            <div style={{ display: 'flex', gap: '12px' }}>
              <button
                onClick={handleLogout}
                style={{
                  cursor: 'pointer',
                  background: '#E4342F',
                  color: '#0B0B0C',
                  fontWeight: 700,
                  fontSize: '14px',
                  padding: '13px 22px',
                  borderRadius: '8px',
                  border: 'none',
                }}
              >
                Yes, Logout
              </button>
              <button
                onClick={() => setShowLogoutConfirm(false)}
                style={{
                  cursor: 'pointer',
                  background: 'transparent',
                  color: '#F2F1EE',
                  fontWeight: 700,
                  fontSize: '14px',
                  padding: '13px 22px',
                  borderRadius: '8px',
                  border: '1px solid rgba(255,255,255,0.14)',
                }}
              >
                Cancel
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
