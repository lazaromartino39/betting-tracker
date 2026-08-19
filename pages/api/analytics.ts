import type { NextApiRequest, NextApiResponse } from 'next'
import { PrismaClient } from '@prisma/client'
import jwt from 'jsonwebtoken'

const prisma = new PrismaClient()

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== 'GET') {
    return res.status(405).json({ error: 'Method not allowed' })
  }

  try {
    const token = req.headers.authorization?.split(' ')[1]
    if (!token) {
      return res.status(401).json({ error: 'No token provided' })
    }

    const decoded = jwt.verify(token, process.env.JWT_SECRET || 'secret') as any

    const bets = await prisma.bet.findMany({
      where: { userId: decoded.userId },
    })

    const totalBets = bets.length
    const wins = bets.filter(b => b.status === 'won').length
    const losses = bets.filter(b => b.status === 'lost').length
    const winRate = totalBets > 0 ? Math.round((wins / totalBets) * 100) : 0
    const totalWagered = bets.reduce((sum, b) => sum + b.wagerAmount, 0)
    const totalWon = bets.filter(b => b.status === 'won').reduce((sum, b) => sum + b.potentialWin, 0)
    const avgOdds = totalBets > 0 ? bets.reduce((sum, b) => sum + b.odds, 0) / totalBets : 0

    // By sport
    const bySport: Record<string, any> = {}
    bets.forEach(bet => {
      if (!bySport[bet.sport]) {
        bySport[bet.sport] = { wins: 0, losses: 0, wagered: 0 }
      }
      if (bet.status === 'won') bySport[bet.sport].wins++
      if (bet.status === 'lost') bySport[bet.sport].losses++
      bySport[bet.sport].wagered += bet.wagerAmount
    })

    // By bet type
    const byBetType: Record<string, any> = {}
    bets.forEach(bet => {
      if (!byBetType[bet.betType]) {
        byBetType[bet.betType] = { wins: 0, losses: 0, wagered: 0 }
      }
      if (bet.status === 'won') byBetType[bet.betType].wins++
      if (bet.status === 'lost') byBetType[bet.betType].losses++
      byBetType[bet.betType].wagered += bet.wagerAmount
    })

    // Top sport
    const topSport = Object.entries(bySport).sort(
      ([, a], [, b]) => (b.wins / (b.wins + b.losses)) - (a.wins / (a.wins + a.losses))
    )[0]?.[0] || 'N/A'

    res.json({
      totalBets,
      wins,
      losses,
      winRate,
      totalWagered,
      totalWon,
      avgOdds,
      topSport,
      bestPerformer: 'You',
      bySport,
      byBetType,
      monthlyTrend: [],
    })
  } catch (error) {
    console.error(error)
    res.status(401).json({ error: 'Unauthorized' })
  }
}
