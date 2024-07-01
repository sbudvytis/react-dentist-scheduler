import { Schedule, scheduleSchema } from '@server/entities/schedule'
import { authenticatedProcedure } from '@server/trpc/authenticatedProcedure'
import { TRPCError } from '@trpc/server'

export default authenticatedProcedure
  .input(scheduleSchema)
  .mutation(async ({ input: updatedScheduleData, ctx: { authUser, db } }) => {
    // Checks if the authenticated user has the required role and permissions
    if (!authUser || authUser.role !== 'dentist') {
      throw new TRPCError({
        code: 'FORBIDDEN',
        message:
          'Permission denied. You do not have the required permissions to edit a schedule.',
      })
    }

    // Fetches the existing schedule from the database
    const existingSchedule = await db.getRepository(Schedule).findOne({
      where: { scheduleId: updatedScheduleData.scheduleId },
    })

    if (!existingSchedule) {
      throw new TRPCError({
        code: 'NOT_FOUND',
        message: 'schedule not found.',
      })
    }

    // Checks if the authenticated user has the right to edit this schedule
    if (existingSchedule.userId !== authUser.id) {
      throw new TRPCError({
        code: 'FORBIDDEN',
        message: 'You do not have the right to edit this schedule.',
      })
    }

    // Updates the existing schedule with the new data
    const updatedSchedule = db
      .getRepository(Schedule)
      .merge(existingSchedule, updatedScheduleData)

    // Saves the updated schedule to the database
    const scheduleEdited = await db
      .getRepository(Schedule)
      .save(updatedSchedule)

    return scheduleEdited
  })
