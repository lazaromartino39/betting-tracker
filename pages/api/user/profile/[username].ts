import type { NextApiRequest, NextApiResponse } from 'next'

export default function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== 'GET') {
    return res.status(405).json({ error: 'Method not allowed' })
  }

  res.json({
    id: 1,
    username: 'user',
    email: 'user@example.com',
    name: 'User',
    bets: [],
    followers: [],
    following: [],
  })
}
