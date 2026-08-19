import type { NextApiRequest, NextApiResponse } from 'next'

export default function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' })
  }

  const { email, username, password } = req.body

  if (!email || !username || !password) {
    return res.status(400).json({ error: 'Missing fields' })
  }

  // Generate a fake token for now
  const token = 'test-token-' + Date.now()
  const userId = Math.floor(Math.random() * 1000000)

  res.status(201).json({
    token,
    userId: String(userId),
    message: 'Test signup - database not connected yet'
  })
}
