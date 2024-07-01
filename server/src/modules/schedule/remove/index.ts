import { Schedule, scheduleSchema } from '@server/entities/schedule'
import { authenticatedProcedure } from '@server/trpc/authenticatedProcedure'
import { TRPCError } from '@trpc/server'
import logger from '@server/logger'

export default authenticatedProcedure
  .input(scheduleSchema)
  .mutation(async ({ input: { scheduleId }, ctx: { authUser, db } }) => {
    if (!authUser || authUser.role !== 'dentist') {
      logger.error(
        'User does not have the required permissions to delete a schedule.'
      )
      throw new TRPCError({
        code: 'FORBIDDEN',
        message:
          'Permission denied. You do not have the required permissions to delete a schedule.',
      })
    }

    const existingSchedule = await db.getRepository(Schedule).findOne({
      where: { scheduleId },
    })

    if (!existingSchedule) {
      logger.error(`Schedule not found with ID: ${scheduleId}`)
      throw new TRPCError({
        code: 'NOT_FOUND',
        message: 'Schedule not found.',
      })
    }

    if (existingSchedule.userId !== authUser.id) {
      throw new TRPCError({
        code: 'FORBIDDEN',
        message: 'You do not have the right to delete this schedule.',
      })
    }

    await db.getRepository(Schedule).delete(scheduleId)
    logger.info(`Schedule deleted successfully with ID: ${scheduleId}`)

    return { success: true, message: 'Schedule deleted successfully' }
  })
