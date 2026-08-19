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
    const { userId } = req.query

    if (req.method === 'POST') {
      await prisma.relationship.create({
        data: {
          followerId: decoded.userId,
          followingId: userId as string,
        },
      })
      return res.status(201).json({ message: 'Following' })
    }

    if (req.method === 'DELETE') {
      await prisma.relationship.deleteMany({
        where: {
          followerId: decoded.userId,
          followingId: userId as string,
        },
      })
      return res.json({ message: 'Unfollowed' })
    }

    res.status(405).json({ error: 'Method not allowed' })
  } catch (error) {
    console.error(error)
    res.status(400).json({ error: 'An error occurred' })
  }
}
