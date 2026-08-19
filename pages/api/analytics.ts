import type { NextApiRequest, NextApiResponse } from 'next'

export default function handler(req: NextApiRequest, res: NextApiResponse) {
  res.json({
    totalBets: 0,
    wins: 0,
    losses: 0,
    winRate: 0,
    totalWagered: 0,
    totalWon: 0,
    avgOdds: 0,
    topSport: 'N/A',
    bySport: {},
    byBetType: {},
    monthlyTrend: [],
  })
}
