import type { NextApiRequest, NextApiResponse } from 'next'
import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient()
const ADMIN_USER_ID = process.env.ADMIN_USER_ID || 'admin' // Set this to your user ID

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  try {
    if (req.method === 'GET') {
      // Get all featured picks from admin
      const picks = await prisma.bet.findMany({
        where: {
          userId: ADMIN_USER_ID,
          status: { in: ['pending', 'won', 'lost'] },
        },
        orderBy: { createdAt: 'desc' },
        take: 20,
      })

      const stats = {
        totalPicks: picks.length,
        wins: picks.filter(p => p.status === 'won').length,
        losses: picks.filter(p => p.status === 'lost').length,
        winRate: picks.length > 0 ? Math.round((picks.filter(p => p.status === 'won').length / picks.length) * 100) : 0,
        consecutiveWins: 0,
        monthlyWins: picks.filter(p => p.status === 'won' && new Date(p.createdAt) > new Date(Date.now() - 30 * 24 * 60 * 60 * 1000)).length,
      }

      // Calculate consecutive wins
      let streak = 0
      for (const pick of picks) {
        if (pick.status === 'won') {
          streak++
        } else {
          break
        }
      }
      stats.consecutiveWins = streak

      res.json({
        picks: picks.map(p => ({
          id: p.id,
          event: p.event,
          selection: p.selection,
          odds: p.odds,
          sport: p.sport,
          status: p.status,
          confidence: p.odds >= 2 ? 'HIGH' : p.odds >= 1.5 ? 'MEDIUM' : 'LOW',
          analysis: p.oddsAtTime || 'Championship pick by PickIt Bros',
          createdAt: p.createdAt,
        })),
        stats,
      })
    } else {
      res.status(405).json({ error: 'Method not allowed' })
    }
  } catch (error) {
    console.error(error)
    res.status(500).json({ error: 'An error occurred' })
  }
}
