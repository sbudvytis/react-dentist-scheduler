import { Appointment, type AppointmentBare } from '@server/entities/appointment'
import { authenticatedProcedure } from '@server/trpc/authenticatedProcedure'
import { TRPCError } from '@trpc/server'
import { z } from 'zod'

const GetAppointmentsInput = z.object({
  scheduleId: z.number(),
})

export default authenticatedProcedure
  .input(GetAppointmentsInput)
  .query(async ({ input, ctx: { authUser, db } }) => {
    const { scheduleId } = input
    const userRole = authUser.role || ''
    const userPermissions = authUser.permissions || []

    const canFindAppointments =
      userRole === 'dentist' || userPermissions.includes('VIEW_ALL_SCHEDULES')

    let appointments

    const queryBuilder = db
      .getRepository(Appointment)
      .createQueryBuilder('Appointment')

    if (canFindAppointments) {
      appointments = (await queryBuilder
        .leftJoinAndSelect('Appointment.patient', 'patient')
        .where('Appointment.schedule_id = :scheduleId', { scheduleId })
        .orderBy('Appointment.id', 'DESC')
        .getMany()) as AppointmentBare[]
    } else {
      throw new TRPCError({
        code: 'FORBIDDEN',
        message:
          'Permission denied. You do not have the required role or permissions to find appointments.',
      })
    }

    return appointments
  })
