import type { NextApiRequest, NextApiResponse } from 'next'
import axios from 'axios'

const ODDS_API_BASE = 'https://api.the-odds-api.com/v4'

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== 'GET') {
    return res.status(405).json({ error: 'Method not allowed' })
  }

  const apiKey = process.env.ODDS_API_KEY
  if (!apiKey) {
    return res.status(500).json({ error: 'API key not configured' })
  }

  try {
    const response = await axios.get(`${ODDS_API_BASE}/sports`, {
      params: { api_key: apiKey },
    })

    res.json(response.data)
  } catch (error) {
    console.error(error)
    res.status(500).json({ error: 'Failed to fetch sports' })
  }
}
