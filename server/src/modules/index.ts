import { router } from '../trpc'
import user from './user'
import schedule from './schedule'
import appointment from './appointment'
import patient from './patient'
import blockedPeriod from './blockedPeriod'

export const appRouter = router({
  user,
  schedule,
  appointment,
  patient,
  blockedPeriod,
})

export type AppRouter = typeof appRouter
