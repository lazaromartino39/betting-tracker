import type { NextApiRequest, NextApiResponse } from 'next'
import jwt from 'jsonwebtoken'
import { createClient } from '@supabase/supabase-js'

interface GoogleTokenPayload {
  email: string
  name: string
  picture?: string
  email_verified?: boolean
}

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' })
  }

  const { credential } = req.body

  if (!credential) {
    return res.status(400).json({ error: 'No credential provided' })
  }

  try {
    // Decode the JWT token from Google (in production, you should verify it)
    const decoded = jwt.decode(credential) as GoogleTokenPayload | null

    if (!decoded || !decoded.email) {
      return res.status(400).json({ error: 'Invalid token' })
    }

    const supabaseUrl = 'https://yxptbsqclewafboygpzu.supabase.co'
    const supabaseKey = process.env.SUPABASE_SERVICE_ROLE_KEY || process.env.SUPABASE_KEY || ''

    if (!supabaseKey) {
      return res.status(500).json({ error: 'Database not configured' })
    }

    const supabase = createClient(supabaseUrl, supabaseKey, {
      auth: { persistSession: false, autoRefreshToken: false },
    })

    // Try to find existing user
    const { data: existingUser } = await supabase
      .from('User')
      .select('*')
      .eq('email', decoded.email)
      .single()

    let user = existingUser

    // If user doesn't exist, create one
    if (!existingUser) {
      const username = decoded.name?.replace(/\s+/g, '').toLowerCase() || decoded.email.split('@')[0]

      const { data: newUser, error } = await supabase
        .from('User')
        .insert([{
          email: decoded.email,
          username,
          password: '', // Google users don't have passwords
        }])
        .select()
        .single()

      if (error) {
        return res.status(400).json({ error: error.message })
      }

      user = newUser
    }

    // Create JWT token
    const token = jwt.sign(
      {
        userId: user.id,
        email: user.email,
        username: user.username,
      },
      process.env.JWT_SECRET || 'secret',
      { expiresIn: '30d' }
    )

    res.status(200).json({
      token,
      userId: user.id,
      username: user.username,
      email: user.email,
      isNewUser: !existingUser,
    })
  } catch (error: any) {
    console.error('Google auth error:', error)
    res.status(500).json({ error: error.message || 'Google authentication failed' })
  }
}
