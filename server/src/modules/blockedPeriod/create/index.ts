import { BlockedPeriod } from '@server/entities/blockedPeriod'
import { authenticatedProcedure } from '@server/trpc/authenticatedProcedure'
import { TRPCError } from '@trpc/server'
import { z } from 'zod'
import logger from '@server/logger'
import { Schedule } from '@server/entities'

const blockedPeriodSchema = z.object({
  startDate: z.string(), // Date format should be validated as needed (e.g., 'YYYY-MM-DD')
  endDate: z.string(), // Allow for both single-day and multi-day blocking
  reason: z.string().optional(),
  scheduleId: z.number(),
})

export default authenticatedProcedure
  .input(blockedPeriodSchema)
  .mutation(async ({ input: blockedPeriodData, ctx: { authUser, db } }) => {
    // Check if the authenticated user is a dentist
    if (!authUser || authUser.role !== 'dentist') {
      throw new TRPCError({
        code: 'FORBIDDEN',
        message:
          'Permission denied. You do not have the required role or permissions to block days.',
      })
    }

    // Find the schedule associated with the blocked period
    const scheduleRepository = db.getRepository(Schedule)
    const schedule = await scheduleRepository.findOne({
      where: { scheduleId: blockedPeriodData.scheduleId, userId: authUser.id },
    })

    if (!schedule) {
      throw new TRPCError({
        code: 'NOT_FOUND',
        message: 'Schedule not found or you do not have access to it.',
      })
    }

    // Prepare blocked period data
    const blockedPeriod = {
      ...blockedPeriodData,
      schedule: { scheduleId: schedule.scheduleId }, // Link to the schedule
    }

    // Save the blocked period in the database
    const blockedPeriodCreated = await db
      .getRepository(BlockedPeriod)
      .save(blockedPeriod)

    logger.info(
      `Blocked period created successfully from ${blockedPeriodCreated.startDate} to ${blockedPeriodCreated.endDate}`
    )

    return blockedPeriodCreated
  })
