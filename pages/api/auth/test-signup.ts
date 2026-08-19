import type { NextApiRequest, NextApiResponse } from 'next'
import jwt from 'jsonwebtoken'

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' })
  }

  try {
    // Create a test token (simulating successful signup)
    const testUser = {
      userId: '123456789',
      email: 'test@pickittracker.com',
      username: 'testuser',
    }

    const token = jwt.sign(testUser, process.env.JWT_SECRET || 'secret')

    res.status(200).json({
      success: true,
      message: 'Test account created',
      token,
      user: testUser,
    })
  } catch (error) {
    console.error('Test signup error:', error)
    res.status(500).json({ error: 'Failed to create test account' })
  }
}
