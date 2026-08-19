import type { NextApiRequest, NextApiResponse } from 'next'
import { prisma } from '@/lib/prisma'

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== 'GET') {
    return res.status(405).json({ error: 'Method not allowed' })
  }

  const { sort = 'winRate' } = req.query

  try {
    const users = await prisma.user.findMany({
      select: {
        id: true,
        username: true,
        bets: true,
      },
    })

    const leaderboard = users
      .map(user => {
        const totalBets = user.bets.length
        const wins = user.bets.filter(b => b.status === 'won').length
        const losses = user.bets.filter(b => b.status === 'lost').length
        const winRate = totalBets > 0 ? Math.round((wins / totalBets) * 100) : 0
        const totalWagered = user.bets.reduce((sum, b) => sum + b.wagerAmount, 0)
        const totalWon = user.bets
          .filter(b => b.status === 'won')
          .reduce((sum, b) => sum + b.potentialWin, 0)

        return {
          id: user.id,
          username: user.username,
          totalBets,
          wins,
          losses,
          winRate,
          totalWagered,
          totalWon,
        }
      })
      .filter(u => u.totalBets > 0)
      .sort((a, b) => {
        if (sort === 'winRate') return b.winRate - a.winRate
        if (sort === 'totalWons') return b.wins - a.wins
        if (sort === 'mostBets') return b.totalBets - a.totalBets
        return 0
      })
      .map((u, idx) => ({ ...u, rank: idx + 1 }))

    res.json(leaderboard)
  } catch (error) {
    console.error(error)
    res.status(500).json({ error: 'An error occurred' })
  }
}
