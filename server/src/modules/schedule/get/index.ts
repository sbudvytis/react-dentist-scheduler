import {
  Schedule,
  scheduleSchema,
  type ScheduleBare,
} from '@server/entities/schedule'
import { authenticatedProcedure } from '@server/trpc/authenticatedProcedure'
import { TRPCError } from '@trpc/server'

export default authenticatedProcedure
  .input(scheduleSchema.shape.scheduleId)
  .query(async ({ input: schId, ctx: { authUser, db } }) => {
    const schedule = (await db.getRepository(Schedule).findOne({
      where: { scheduleId: schId },
    })) as ScheduleBare

    if (!schedule) {
      throw new TRPCError({
        code: 'NOT_FOUND',
        message: `Schedule was not found`,
      })
    }

    if (schedule.userId !== authUser.id) {
      throw new TRPCError({
        code: 'FORBIDDEN',
        message: `You are not allowed to access this schedule.`,
      })
    }

    return schedule
  })
