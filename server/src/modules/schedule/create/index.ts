import { Schedule, scheduleInsertSchema } from '@server/entities/schedule'
import { authenticatedProcedure } from '@server/trpc/authenticatedProcedure'
import { TRPCError } from '@trpc/server'
import logger from '@server/logger'

export default authenticatedProcedure
  .input(scheduleInsertSchema.omit({ userId: true }))
  .mutation(async ({ input: scheduleData, ctx: { authUser, db } }) => {
    // Checks if the authenticated user has the required role and permissions to add a schedule
    if (!authUser || authUser.role !== 'dentist') {
      throw new TRPCError({
        code: 'FORBIDDEN',
        message:
          'Permission denied. You do not have the required role or permissions to add a schedule.',
      })
    }

    const schedule = {
      ...scheduleData,
      userId: authUser.id,
    }

    const scheduleCreated = await db.getRepository(Schedule).save(schedule)

    logger.info(
      `Schedule created successfully with ID: ${scheduleCreated.scheduleId}`
    )

    return scheduleCreated
  })
