import { authContext } from '@tests/utils/context'
import {
  fakeUser,
  fakePatient,
  fakeSchedule,
  fakeClinic,
} from '@server/entities/tests/fakes'
import { createTestDatabase } from '@tests/utils/database'
import { User, Patient, Schedule, Clinic } from '@server/entities'
import appointmentRouter from '..'

it('should edit a dentists appointment', async () => {
  const db = await createTestDatabase()
  const clinic = await db.getRepository(Clinic).save(fakeClinic())
  const user = await db
    .getRepository(User)
    .save(fakeUser({ role: 'dentist', clinicId: clinic.clinicId }))
  const schedule = await db
    .getRepository(Schedule)
    .save(fakeSchedule({ userId: user.id }))
  const patient = await db.getRepository(Patient).save(fakePatient())
  const { create, edit } = appointmentRouter.createCaller(
    authContext({ db }, user)
  )

  const appointmentData = {
    title: 'Checkup',
    start: new Date('2099-06-27 09:57:55'),
    end: new Date('2099-06-27 10:57:55'),
    notes: 'checkup',
    email: 'john@doe.com',
    scheduleId: schedule.scheduleId,
    patient: {
      firstName: patient.firstName,
      lastName: patient.lastName,
      contactNumber: patient.contactNumber,
    },
    schedule: {
      view: schedule.view,
      weekends: schedule.weekends,
      slotMinTime: schedule.slotMinTime,
      slotMaxTime: schedule.slotMaxTime,
    },
  }

  const appointmentCreated = await create(appointmentData)

  const editedAppointmentData = {
    id: appointmentCreated.id,
    userId: user.id,
    title: 'Checkup',
    start: new Date('2099-06-27 09:57:55'),
    end: new Date('2099-06-27 10:57:55'),
    notes: 'checkup',
    email: 'john@doe.com',
  }

  const editedAppointment = await edit(editedAppointmentData)

  expect(editedAppointment).toMatchObject({
    id: appointmentCreated.id,
    userId: user.id,
    title: 'Checkup',
    start: new Date('2099-06-27 09:57:55'),
    end: new Date('2099-06-27 10:57:55'),
    notes: 'checkup',
    email: 'john@doe.com',
  })
})

it('should not allow to edit if appointment not found', async () => {
  const db = await createTestDatabase()
  const user = await db.getRepository(User).save(fakeUser({ role: 'dentist' }))
  const { edit } = appointmentRouter.createCaller(authContext({ db }, user))

  const editedAppointmentData = {
    id: 1,
    userId: user.id,
    title: 'Checkup',
    start: new Date('2099-06-27 09:57:55'),
    end: new Date('2099-06-27 10:57:55'),
    notes: 'checkup',
    email: 'john@doe.com',
  }

  await expect(edit(editedAppointmentData)).rejects.toThrow(
    'Appointment not found.'
  )
})

it('should not allow to edit if user does not required role or permissions', async () => {
  const db = await createTestDatabase()
  const user = await db.getRepository(User).save(fakeUser({ role: 'patient' }))
  const { edit } = appointmentRouter.createCaller(authContext({ db }, user))

  const editedAppointmentData = {
    id: 1,
    userId: user.id,
    title: 'Checkup',
    start: new Date('2099-06-27 09:57:55'),
    end: new Date('2099-06-27 10:57:55'),
    notes: 'checkup',
    email: 'john@doe.com',
  }

  await expect(edit(editedAppointmentData)).rejects.toThrow(
    'Permission denied. You do not have the required role or permissions to edit an appointment.'
  )
})
