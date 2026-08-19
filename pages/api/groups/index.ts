import type { NextApiRequest, NextApiResponse } from 'next'
import { PrismaClient } from '@prisma/client'
import jwt from 'jsonwebtoken'

const prisma = new PrismaClient()

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  try {
    const token = req.headers.authorization?.split(' ')[1]
    if (!token) {
      return res.status(401).json({ error: 'No token provided' })
    }

    const decoded = jwt.verify(token, process.env.JWT_SECRET || 'secret') as any

    if (req.method === 'GET') {
      const groups = await prisma.group.findMany({
        include: {
          members: true,
        },
      })
      return res.json(groups)
    }

    if (req.method === 'POST') {
      const { name, description, image } = req.body

      if (!name) {
        return res.status(400).json({ error: 'Group name required' })
      }

      const group = await prisma.group.create({
        data: {
          name,
          description: description || '',
          image: image || '',
          members: {
            create: {
              userId: decoded.userId,
            },
          },
        },
      })

      res.status(201).json(group)
    } else {
      res.status(405).json({ error: 'Method not allowed' })
    }
  } catch (error) {
    console.error(error)
    res.status(401).json({ error: 'Unauthorized' })
  }
}
