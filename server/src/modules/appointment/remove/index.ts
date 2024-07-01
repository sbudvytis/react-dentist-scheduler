import { Appointment, appointmentSchema } from '@server/entities/appointment'
import { authenticatedProcedure } from '@server/trpc/authenticatedProcedure'
import { TRPCError } from '@trpc/server'

export default authenticatedProcedure
  .input(appointmentSchema)
  .mutation(async ({ input: { id }, ctx: { authUser, db } }) => {
    // Checks if the authenticated user has the required role and permissions
    const userPermissions = authUser?.permissions || []

    if (
      !authUser ||
      (authUser.role !== 'dentist' &&
        !userPermissions.includes('VIEW_ALL_SCHEDULES'))
    ) {
      throw new TRPCError({
        code: 'FORBIDDEN',
        message:
          'Permission denied. You do not have the required role or permissions to delete an appointment.',
      })
    }

    // Fetches the existing appointment from the database
    const existingAppointment = await db.getRepository(Appointment).findOne({
      where: { id },
    })

    if (!existingAppointment) {
      throw new TRPCError({
        code: 'NOT_FOUND',
        message: 'Appointment not found.',
      })
    }

    // Deletes the appointment from the database
    await db.getRepository(Appointment).delete(id)

    return { success: true, message: 'Appointment deleted successfully' }
  })
