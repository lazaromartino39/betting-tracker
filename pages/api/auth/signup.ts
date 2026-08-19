import type { NextApiRequest, NextApiResponse } from 'next'

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' })
  }

  try {
    const { email, username, password } = req.body

    if (!email || !username || !password) {
      return res.status(400).json({ error: 'Missing fields' })
    }

    // Import Prisma inside handler to avoid client caching issues
    const { PrismaClient } = await import('@prisma/client')
    const prisma = new PrismaClient()

    const { default: bcrypt } = await import('bcryptjs')
    const { default: jwt } = await import('jsonwebtoken')

    const hashedPassword = await bcrypt.hash(password, 10)

    const user = await prisma.user.create({
      data: { email, username, password: hashedPassword }
    })

    const token = jwt.sign(
      { userId: String(user.id), email },
      process.env.JWT_SECRET || 'secret',
      { expiresIn: '7d' }
    )

    prisma.$disconnect()

    return res.status(201).json({ token, userId: String(user.id) })
  } catch (error: any) {
    console.error('SIGNUP ERROR:', error)
    return res.status(500).json({
      error: 'Signup error',
      details: error.message || 'Unknown error',
      type: error.code
    })
  }
}
