import type { NextApiRequest, NextApiResponse } from 'next'

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  res.status(200).json({
    status: 'ok',
    environment: {
      hasDatabase: !!process.env.DATABASE_URL,
      hasDatabaseValue: process.env.DATABASE_URL ? process.env.DATABASE_URL.substring(0, 50) + '...' : 'NOT SET',
      hasJwtSecret: !!process.env.JWT_SECRET,
      hasOddsKey: !!process.env.ODDS_API_KEY,
      hasApiUrl: !!process.env.NEXT_PUBLIC_API_URL,
      hasAdminId: !!process.env.ADMIN_USER_ID,
    }
  })
}
