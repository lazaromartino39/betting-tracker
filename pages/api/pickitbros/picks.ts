import type { NextApiRequest, NextApiResponse } from 'next'
import { createClient } from '@supabase/supabase-js'

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== 'GET') {
    return res.status(405).json({ error: 'Method not allowed' })
  }

  try {
    const supabase = createClient(
      'https://yxptbsqclewafboygpzu.supabase.co',
      process.env.SUPABASE_KEY || ''
    )

    const { data: picks, error } = await supabase
      .from('Bet')
      .select('*')
      .in('status', ['pending', 'won', 'lost'])
      .order('createdAt', { ascending: false })
      .limit(20)

    if (error) {
      return res.status(500).json({ error: error.message })
    }

    const stats = {
      totalPicks: picks?.length || 0,
      wins: picks?.filter(p => p.status === 'won').length || 0,
      losses: picks?.filter(p => p.status === 'lost').length || 0,
      winRate: picks && picks.length > 0 ? Math.round((picks.filter(p => p.status === 'won').length / picks.length) * 100) : 0,
      consecutiveWins: 0,
      monthlyWins: picks?.filter(p => p.status === 'won' && new Date(p.createdAt) > new Date(Date.now() - 30 * 24 * 60 * 60 * 1000)).length || 0,
    }

    let streak = 0
    if (picks) {
      for (const pick of picks) {
        if (pick.status === 'won') streak++
        else break
      }
    }
    stats.consecutiveWins = streak

    res.json({
      picks: (picks || []).map(p => ({
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
  } catch (error: any) {
    res.status(500).json({ error: error.message })
  }
}
