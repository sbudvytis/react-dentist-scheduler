import { router } from '../trpc'
import user from './user'
import schedule from './schedule'
import appointment from './appointment'
import patient from './patient'

export const appRouter = router({
  user,
  schedule,
  appointment,
  patient,
})

export type AppRouter = typeof appRouter
