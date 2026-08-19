import type { NextApiRequest, NextApiResponse } from 'next'
import bcrypt from 'bcryptjs'
import jwt from 'jsonwebtoken'
import { createClient } from '@supabase/supabase-js'

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' })
  }

  const { email, username, password } = req.body

  if (!email || !username || !password) {
    return res.status(400).json({ error: 'Missing fields' })
  }

  try {
    const supabaseUrl = 'https://yxptbsqclewafboygpzu.supabase.co'
    const supabaseKey = process.env.SUPABASE_KEY || ''

    if (!supabaseKey) {
      return res.status(500).json({ error: 'Database not configured' })
    }

    const supabase = createClient(supabaseUrl, supabaseKey)

    const hashedPassword = await bcrypt.hash(password, 10)

    const { data, error } = await supabase
      .from('User')
      .insert([{ email, username, password: hashedPassword }])
      .select()

    if (error) {
      return res.status(400).json({ error: error.message })
    }

    const user = data?.[0]
    if (!user) {
      return res.status(400).json({ error: 'Failed to create user' })
    }

    const token = jwt.sign(
      { userId: user.id, email: user.email },
      process.env.JWT_SECRET || 'secret',
      { expiresIn: '7d' }
    )

    res.status(201).json({ token, userId: user.id })
  } catch (error: any) {
    res.status(500).json({ error: error.message })
  }
}
