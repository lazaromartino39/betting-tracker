import type { NextApiRequest, NextApiResponse } from 'next'
import jwt from 'jsonwebtoken'
import { prisma } from '@/lib/prisma'

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  try {
    const token = req.headers.authorization?.split(' ')[1]
    if (!token) {
      return res.status(401).json({ error: 'No token provided' })
    }

    const decoded = jwt.verify(token, process.env.JWT_SECRET || 'secret') as any

    if (req.method === 'GET') {
      const posts = await prisma.post.findMany({
        include: {
          user: {
            select: { id: true, username: true, avatar: true },
          },
          likes: true,
          bets: true,
        },
        orderBy: { createdAt: 'desc' },
      })
      return res.json(posts)
    }

    if (req.method === 'POST') {
      const { content, groupId } = req.body

      if (!content) {
        return res.status(400).json({ error: 'Content required' })
      }

      const post = await prisma.post.create({
        data: {
          content,
          userId: decoded.userId,
          groupId: groupId || undefined,
        },
        include: {
          user: {
            select: { id: true, username: true, avatar: true },
          },
        },
      })

      res.status(201).json(post)
    } else {
      res.status(405).json({ error: 'Method not allowed' })
    }
  } catch (error) {
    console.error(error)
    res.status(401).json({ error: 'Unauthorized' })
  }
}
