import type { NextApiRequest, NextApiResponse } from 'next'
import jwt from 'jsonwebtoken'
import { prisma } from '@/lib/prisma'

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== 'GET') {
    return res.status(405).json({ error: 'Method not allowed' })
  }

  try {
    const token = req.headers.authorization?.split(' ')[1]
    let userId = null

    if (token) {
      try {
        const decoded = jwt.verify(token, process.env.JWT_SECRET || 'secret') as any
        userId = decoded.userId
      } catch (err) {
        // Token invalid, just show public feed
      }
    }

    // Get user's following list
    let followingIds: string[] = []
    if (userId) {
      const user = await prisma.user.findUnique({
        where: { id: userId },
        select: { following: true },
      })
      followingIds = user?.following?.map(f => f.followingId) || []
    }

    // Get posts from followed users or all public posts
    const posts = await prisma.post.findMany({
      where: userId ? { userId: { in: [...followingIds, userId] } } : {},
      include: {
        user: {
          select: { id: true, username: true, avatar: true },
        },
        likes: true,
        bets: true,
      },
      orderBy: { createdAt: 'desc' },
      take: 50,
    })

    res.json(posts)
  } catch (error) {
    console.error(error)
    res.status(500).json({ error: 'An error occurred' })
  }
}
