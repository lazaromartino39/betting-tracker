import type { NextApiRequest, NextApiResponse } from 'next'

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  try {
    const apiKey = process.env.ODDS_API_KEY
    if (!apiKey) {
      return res.status(500).json({ error: 'Odds API key not configured' })
    }

    const { sport = 'upcoming' } = req.query

    // Fetch real odds from The Odds API
    const response = await fetch(
      `https://api.the-odds-api.com/v4/sports/${sport}/odds/?apiKey=${apiKey}&regions=us&markets=h2h,spreads,totals&oddsFormat=american`,
      { next: { revalidate: 60 } }
    )

    if (!response.ok) {
      return res.status(response.status).json({ error: 'Failed to fetch odds' })
    }

    const data = await response.json()

    // Format odds with sportsbook data
    const formattedOdds = data.events?.map((event: any) => ({
      id: event.id,
      sport: event.sport_key,
      away_team: event.away_team,
      home_team: event.home_team,
      commence_time: event.commence_time,
      bookmakers: event.bookmakers?.map((book: any) => ({
        name: book.title,
        markets: book.markets?.map((market: any) => ({
          key: market.key,
          outcomes: market.outcomes,
        })),
      })),
    })) || []

    res.status(200).json({
      sport,
      events: formattedOdds.slice(0, 10), // Top 10 games
      total: formattedOdds.length,
    })
  } catch (error: any) {
    console.error('Odds fetch error:', error)
    res.status(500).json({ error: error.message })
  }
}
