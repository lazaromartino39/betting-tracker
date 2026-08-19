import type { NextApiRequest, NextApiResponse } from 'next'

export default function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method === 'POST') {
    return res.status(201).json({ message: 'Liked' })
  }
  if (req.method === 'DELETE') {
    return res.json({ message: 'Unliked' })
  }
  res.status(405).json({ error: 'Method not allowed' })
}
