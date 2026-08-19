import type { NextApiRequest, NextApiResponse } from 'next'
import bcrypt from 'bcryptjs'
import jwt from 'jsonwebtoken'
import { prisma } from '@/lib/prisma'

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' })
  }

  const { email, username, password } = req.body

  if (!email || !username || !password) {
    return res.status(400).json({ error: 'Missing required fields' })
  }

  try {
    console.log('Signup attempt:', { email, username })

    const existing = await prisma.user.findFirst({
      where: { OR: [{ email }, { username }] },
    })

    if (existing) {
      return res.status(409).json({ error: 'Email or username already exists' })
    }

    const hashedPassword = await bcrypt.hash(password, 10)

    const user = await prisma.user.create({
      data: {
        id: Math.random().toString(36).substr(2, 9),
        email,
        username,
        password: hashedPassword,
      },
    })

    const token = jwt.sign(
      { userId: user.id, email: user.email },
      process.env.JWT_SECRET || 'secret',
      { expiresIn: '7d' }
    )

    res.status(201).json({ token, userId: user.id })
  } catch (error: any) {
    console.error('Signup error:', error)
    res.status(500).json({
      error: 'Signup failed',
      details: error.message,
      code: error.code
    })
  }
}
