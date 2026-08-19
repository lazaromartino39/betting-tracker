import type { NextApiRequest, NextApiResponse } from 'next'
import { PrismaClient } from '@prisma/client'
import jwt from 'jsonwebtoken'

const prisma = new PrismaClient()

function getTokenFromRequest(req: NextApiRequest): string | null {
  const token = req.headers.authorization?.split(' ')[1]
  return token || null
}

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  try {
    const token = getTokenFromRequest(req)
    if (!token) {
      return res.status(401).json({ error: 'No token provided' })
    }

    const decoded = jwt.verify(token, process.env.JWT_SECRET || 'secret') as any

    if (req.method === 'GET') {
      const bets = await prisma.bet.findMany({
        where: { userId: decoded.userId },
        orderBy: { createdAt: 'desc' },
      })
      return res.json(bets)
    }

    if (req.method === 'POST') {
      const { sport, league, event, eventId, betType, selection, odds, wagerAmount, postId } = req.body

      if (!sport || !event || !betType || !selection || !odds || !wagerAmount) {
        return res.status(400).json({ error: 'Missing required fields' })
      }

      const bet = await prisma.bet.create({
        data: {
          userId: decoded.userId,
          sport,
          league: league || '',
          event,
          eventId: eventId || '',
          betType,
          selection,
          odds,
          wagerAmount,
          potentialWin: wagerAmount * odds,
          postId: postId || undefined,
        },
      })

      res.status(201).json(bet)
    } else {
      res.status(405).json({ error: 'Method not allowed' })
    }
  } catch (error) {
    console.error(error)
    res.status(401).json({ error: 'Unauthorized' })
  }
}
