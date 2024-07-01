import {
  Appointment,
  appointmentInsertSchema,
} from '@server/entities/appointment'
import { Patient } from '@server/entities/patient'
import { Schedule } from '@server/entities/schedule'
import { authenticatedProcedure } from '@server/trpc/authenticatedProcedure'
import { TRPCError } from '@trpc/server'

export default authenticatedProcedure
  .input(appointmentInsertSchema.omit({ userId: true }))
  .mutation(async ({ input: appointmentData, ctx: { authUser, db } }) => {
    const userPermissions = authUser.permissions || []
    const userRole = authUser.role || ''

    // Checks if the user has the required permission to add an appointment
    const canCreateAppointment =
      userRole === 'dentist' || userPermissions.includes('VIEW_ALL_SCHEDULES')

    if (!authUser || !canCreateAppointment) {
      throw new TRPCError({
        code: 'FORBIDDEN',
        message:
          'Permission denied. You do not have the required role or permissions to add an appointment.',
      })
    }

    // Checks if the patient data is provided
    if (!appointmentData.patient) {
      throw new TRPCError({
        code: 'BAD_REQUEST',
        message: 'Patient data is required for creating an appointment.',
      })
    }

    // Find the dentist's schedule
    const dentistSchedule = await db
      .getRepository(Schedule)
      .createQueryBuilder('Schedule')
      .innerJoinAndSelect('Schedule.user', 'user')
      .andWhere('Schedule.scheduleId = :scheduleId', {
        scheduleId: appointmentData.scheduleId,
      })
      .getOne()

    if (!dentistSchedule) {
      throw new TRPCError({
        code: 'NOT_FOUND',
        message: 'Dentist schedule not found.',
      })
    }

    // Check if patient already exists
    let patient = await db
      .getRepository(Patient)
      .createQueryBuilder('patient')
      .where('patient.firstName = :firstName', {
        firstName: appointmentData.patient.firstName,
      })
      .andWhere('patient.lastName = :lastName', {
        lastName: appointmentData.patient.lastName,
      })
      .andWhere('patient.contactNumber = :contactNumber', {
        contactNumber: appointmentData.patient.contactNumber,
      })
      .getOne()

    if (!patient) {
      patient = db.getRepository(Patient).create(appointmentData.patient)
      patient = await db.getRepository(Patient).save(patient)
    }

    const appointment = db.getRepository(Appointment).create({
      ...appointmentData,
      userId: authUser.id,
      patient,
      schedule: dentistSchedule,
    })

    const appointmentCreated = await db
      .getRepository(Appointment)
      .save(appointment)

    return appointmentCreated
  })
