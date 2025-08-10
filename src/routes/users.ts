import { Router, Request, Response, NextFunction } from 'express'
import prisma from '../lib/prisma'

const router = Router()

router.get('/', async (_req: Request, res: Response, next: NextFunction) => {
  try {
    const users = await prisma.user.findMany({ orderBy: { id: 'asc' } })
    res.json(users)
  } catch (err) {
    next(err)
  }
})

router.post('/', async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { email, name } = req.body as { email: string; name?: string | null }
    const user = await prisma.user.create({
      data: { email, name: name ?? null },
    })
    res.status(201).json(user)
  } catch (err) {
    next(err)
  }
})

export default router