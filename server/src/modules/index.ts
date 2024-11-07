import { router } from '../trpc'
import user from './user'
import schedule from './schedule'
import appointment from './appointment'
import patient from './patient'
import disabledPeriod from './disabledPeriod'
import clinic from './clinic'

export const appRouter = router({
  user,
  schedule,
  appointment,
  patient,
  disabledPeriod,
  clinic,
})

export type AppRouter = typeof appRouter
