import type { NextApiRequest, NextApiResponse } from 'next'
import jwt from 'jsonwebtoken'

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  const { code } = req.query

  if (!code) {
    return res.status(400).json({ error: 'No authorization code received' })
  }

  try {
    // Exchange code for token
    const tokenResponse = await fetch('https://oauth2.googleapis.com/token', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        client_id: process.env.GOOGLE_CLIENT_ID,
        client_secret: process.env.GOOGLE_CLIENT_SECRET,
        code: code as string,
        redirect_uri: `${process.env.NEXT_PUBLIC_API_URL}/api/auth/google/callback`,
        grant_type: 'authorization_code',
      }),
    })

    const tokenData = await tokenResponse.json()

    if (!tokenResponse.ok) {
      return res.status(400).json({ error: 'Failed to exchange code for token' })
    }

    // Get user info
    const userResponse = await fetch('https://www.googleapis.com/oauth2/v2/userinfo', {
      headers: { Authorization: `Bearer ${tokenData.access_token}` },
    })

    const userData = await userResponse.json()

    // Create JWT token
    const token = jwt.sign(
      {
        userId: userData.id,
        email: userData.email,
        username: userData.name?.replace(/\s+/g, '').toLowerCase() || userData.email.split('@')[0],
      },
      process.env.JWT_SECRET || 'secret'
    )

    // Redirect to dashboard with token in query
    res.redirect(`/dashboard?token=${token}`)
  } catch (error) {
    console.error('Google OAuth error:', error)
    res.status(500).json({ error: 'OAuth callback failed' })
  }
}
