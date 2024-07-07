import {
  Appointment,
  appointmentInsertSchema,
} from '@server/entities/appointment'
import config from '@server/config'
import { Patient } from '@server/entities/patient'
import { Schedule } from '@server/entities/schedule'
import { authenticatedProcedure } from '@server/trpc/authenticatedProcedure'
import { TRPCError } from '@trpc/server'
import nodemailer from 'nodemailer'
import moment from 'moment'
import logger from '@server/logger'

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

    // Sends email to the patient
    setImmediate(async () => {
      const transporter = nodemailer.createTransport({
        host: 'smtp.hostinger.com',
        port: 465,
        secure: true,
        auth: {
          user: config.sendEmail.email,
          pass: config.sendEmail.emailPassword,
        },
        authMethod: 'PLAIN',
      })

      // Function to format the date and time
      moment.locale('en-gb')
      const formatDateTime = (date: Date) => moment(date).format('LLLL')

      try {
        const formattedStart = formatDateTime(appointmentCreated.start)
        const formattedEnd = moment(appointmentCreated.end).format('LT')
        const info = await transporter.sendMail({
          from: `Dentist scheduler <${config.sendEmail.email}>`,
          to: appointmentData.email,
          subject: 'New Appointment',
          html: `
            <h1>Appointment Details</h1>
            <p><strong>Scheduled for:</strong> ${appointmentCreated.title}</p>
            <p><strong>Day and time:</strong> ${formattedStart} — ${formattedEnd}</p>
            <p><strong>Additional notes:</strong> ${appointmentCreated.notes}</p>
          `,
        })
        logger.info('Message sent: %s', info.messageId)
      } catch (error) {
        logger.error('Error sending email:', error)
      }
    })

    return appointmentCreated
  })
