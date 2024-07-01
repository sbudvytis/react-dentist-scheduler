import { TRPCError } from '@trpc/server'
import z from 'zod'
import { Schedule } from '@server/entities'
import { authenticatedProcedure } from '@server/trpc/authenticatedProcedure'
import provideRepos from '../provideRepos'

export const scheduleIdOwnerProcedure = authenticatedProcedure
  .use(provideRepos({ Schedule }))
  .input(
    z.object({
      id: z.number(),
    })
  )
  .use(async ({ input: { id }, ctx: { authUser, repos }, next }) => {
    const schedule = await repos.Schedule.findOne({
      select: {
        scheduleId: true,
      },
      where: {
        scheduleId: id,
      },
    })

    if (!schedule) {
      throw new TRPCError({
        code: 'NOT_FOUND',
        message: 'Schedule not found',
      })
    }

    if (schedule.scheduleId !== authUser.id) {
      throw new TRPCError({
        code: 'UNAUTHORIZED',
        message: 'Schedule does not belong to the user',
      })
    }

    return next()
  })
