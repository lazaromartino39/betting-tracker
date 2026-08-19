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

    // Just return success without hitting database
    res.status(201).json({
      success: true,
      message: 'Test passed - API is working',
      received: { email, username }
    })
  } catch (error: any) {
    res.status(500).json({
      error: 'Test failed',
      message: error.message
    })
  }
}
