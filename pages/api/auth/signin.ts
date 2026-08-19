import type { NextApiRequest, NextApiResponse } from 'next'
import bcrypt from 'bcryptjs'
import jwt from 'jsonwebtoken'
import { createClient } from '@supabase/supabase-js'

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' })
  }

  const { email, password } = req.body

  if (!email || !password) {
    return res.status(400).json({ error: 'Missing email or password' })
  }

  try {
    const supabaseUrl = 'https://yxptbsqclewafboygpzu.supabase.co'
    // Use service role key to bypass RLS
    const supabaseKey = process.env.SUPABASE_SERVICE_ROLE_KEY || process.env.SUPABASE_KEY || ''

    if (!supabaseKey) {
      return res.status(500).json({ error: 'Database not configured' })
    }

    const supabase = createClient(supabaseUrl, supabaseKey, {
      auth: {
        persistSession: false,
        autoRefreshToken: false,
      },
    })

    const { data, error } = await supabase
      .from('User')
      .select('*')
      .eq('email', email)
      .single()

    if (error || !data) {
      return res.status(401).json({ error: 'Invalid email or password' })
    }

    const isValid = await bcrypt.compare(password, data.password)
    if (!isValid) {
      return res.status(401).json({ error: 'Invalid email or password' })
    }

    const token = jwt.sign(
      { userId: data.id, email: data.email, username: data.username },
      process.env.JWT_SECRET || 'secret',
      { expiresIn: '30d' }
    )

    res.json({
      token,
      userId: data.id,
      username: data.username,
      email: data.email,
    })
  } catch (error: any) {
    res.status(500).json({ error: error.message })
  }
}
