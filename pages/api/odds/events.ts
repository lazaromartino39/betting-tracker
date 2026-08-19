import type { NextApiRequest, NextApiResponse } from 'next'
import axios from 'axios'

const ODDS_API_BASE = 'https://api.the-odds-api.com/v4'

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== 'GET') {
    return res.status(405).json({ error: 'Method not allowed' })
  }

  const { sport } = req.query
  const apiKey = process.env.ODDS_API_KEY

  if (!apiKey) {
    return res.status(500).json({ error: 'API key not configured' })
  }

  if (!sport) {
    return res.status(400).json({ error: 'Sport parameter required' })
  }

  try {
    const response = await axios.get(`${ODDS_API_BASE}/sports/${sport}/events`, {
      params: {
        api_key: apiKey,
        limit: 50,
      },
    })

    res.json(response.data)
  } catch (error) {
    console.error(error)
    res.status(500).json({ error: 'Failed to fetch events' })
  }
}
