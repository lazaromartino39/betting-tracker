import type { NextApiRequest, NextApiResponse } from 'next'
import { prisma } from '@/lib/prisma'

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  try {
    // Test database connection
    await prisma.user.findFirst()

    res.status(200).json({
      status: 'ok',
      database: 'connected',
      env: {
        hasDatabase: !!process.env.DATABASE_URL,
        hasJwtSecret: !!process.env.JWT_SECRET,
        hasOddsKey: !!process.env.ODDS_API_KEY,
      }
    })
  } catch (error: any) {
    res.status(500).json({
      status: 'error',
      database: 'failed to connect',
      error: error.message,
      env: {
        hasDatabase: !!process.env.DATABASE_URL,
        hasJwtSecret: !!process.env.JWT_SECRET,
        hasOddsKey: !!process.env.ODDS_API_KEY,
      }
    })
  }
}
