import type { NextApiRequest, NextApiResponse } from 'next'

export default function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method === 'GET') {
    return res.json([])
  }
  if (req.method === 'POST') {
    return res.status(201).json({ id: 1, message: 'Group created' })
  }
  res.status(405).json({ error: 'Method not allowed' })
}
