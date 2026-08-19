import type { NextApiRequest, NextApiResponse } from 'next'
import jwt from 'jsonwebtoken'

export default function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== 'GET') {
    return res.status(405).json({ error: 'Method not allowed' })
  }

  try {
    const token = req.headers.authorization?.split(' ')[1]
    if (!token) {
      return res.status(401).json({ error: 'No token' })
    }

    const decoded = jwt.verify(token, process.env.JWT_SECRET || 'secret') as any
    res.json({
      id: decoded.userId,
      username: 'user',
      email: decoded.email,
      name: 'User',
    })
  } catch (error) {
    res.status(401).json({ error: 'Unauthorized' })
  }
}
