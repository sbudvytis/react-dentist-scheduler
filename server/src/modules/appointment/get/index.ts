import { Appointment, appointmentSchema } from '@server/entities/appointment'

import { authenticatedProcedure } from '@server/trpc/authenticatedProcedure'

export default authenticatedProcedure
  .input(appointmentSchema.shape.id)
  .query(async ({ input: scheduleId, ctx: { db } }) => {
    const appointments = await db
      .getRepository(Appointment)
      .createQueryBuilder('appointment')
      .innerJoinAndSelect('appointment.schedule', 'schedule')
      .where('schedule.scheduleId = :scheduleId', { scheduleId })
      .getMany()

    return appointments
  })
