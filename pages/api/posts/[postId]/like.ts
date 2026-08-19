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
    const { postId } = req.query

    if (req.method === 'POST') {
      await prisma.like.create({
        data: {
          userId: decoded.userId,
          postId: postId as string,
        },
      })
      return res.status(201).json({ message: 'Liked' })
    }

    if (req.method === 'DELETE') {
      await prisma.like.deleteMany({
        where: {
          userId: decoded.userId,
          postId: postId as string,
        },
      })
      return res.json({ message: 'Unliked' })
    }

    res.status(405).json({ error: 'Method not allowed' })
  } catch (error) {
    console.error(error)
    res.status(400).json({ error: 'An error occurred' })
  }
}
