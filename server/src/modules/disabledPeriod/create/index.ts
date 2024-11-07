import { DisabledPeriod } from '@server/entities/disabledPeriod'
import { authenticatedProcedure } from '@server/trpc/authenticatedProcedure'
import { TRPCError } from '@trpc/server'
import { z } from 'zod'
import logger from '@server/logger'
import { Schedule } from '@server/entities'

const disabledPeriodSchema = z.object({
  startDate: z.string(), // Date format should be validated as needed (e.g., 'YYYY-MM-DD')
  endDate: z.string(), // Allow for both single-day and multi-day blocking
  reason: z.string().optional(),
  scheduleId: z.number(),
})

export default authenticatedProcedure
  .input(disabledPeriodSchema)
  .mutation(async ({ input: disabledPeriodData, ctx: { authUser, db } }) => {
    // Check if the authenticated user is a dentist
    if (!authUser || authUser.role !== 'dentist') {
      throw new TRPCError({
        code: 'FORBIDDEN',
        message:
          'Permission denied. You do not have the required role or permissions to block days.',
      })
    }

    // Find the schedule associated with the disabled period
    const scheduleRepository = db.getRepository(Schedule)
    const schedule = await scheduleRepository.findOne({
      where: { scheduleId: disabledPeriodData.scheduleId, userId: authUser.id },
    })

    if (!schedule) {
      throw new TRPCError({
        code: 'NOT_FOUND',
        message: 'Schedule not found or you do not have access to it.',
      })
    }

    // Prepare disabled period data
    const disabledPeriod = {
      ...disabledPeriodData,
      schedule: { scheduleId: schedule.scheduleId }, // Link to the schedule
    }

    // Save the disabled period in the database
    const disabledPeriodCreated = await db
      .getRepository(DisabledPeriod)
      .save(disabledPeriod)

    logger.info(
      `disabled period created successfully from ${disabledPeriodCreated.startDate} to ${disabledPeriodCreated.endDate}`
    )

    return disabledPeriodCreated
  })
