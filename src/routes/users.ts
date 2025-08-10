import { Router } from 'express'
import prisma from '../lib/prisma'

const router = Router()

router.get('/', async (_req, res, next) => {
  try {
    const users = await prisma.user.findMany({ orderBy: { id: 'asc' } })
    res.json(users)
  } catch (err) {
    next(err)
  }
})

router.post('/', async (req, res, next) => {
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


