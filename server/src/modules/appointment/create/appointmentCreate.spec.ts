import { authContext } from '@tests/utils/context'
import {
  fakeUser,
  fakeSchedule,
  fakePatient,
} from '@server/entities/tests/fakes'
import { createTestDatabase } from '@tests/utils/database'
import { User, Schedule, Patient } from '@server/entities'
import { TRPCError } from '@trpc/server'
import appointmentRouter from '..'

it('should create an appointment', async () => {
  const db = await createTestDatabase()
  const user = await db.getRepository(User).save(fakeUser({ role: 'dentist' }))
  const schedule = await db
    .getRepository(Schedule)
    .save(fakeSchedule({ userId: user.id }))
  const patient = await db.getRepository(Patient).save(fakePatient())

  const { create } = appointmentRouter.createCaller(authContext({ db }, user))

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
  }

  const appointmentCreated = await create(appointmentData)

  expect(appointmentCreated).toMatchObject({
    id: expect.any(Number),
    userId: user.id,
    title: 'Checkup',
    start: new Date('2099-06-27 09:57:55'),
    end: new Date('2099-06-27 10:57:55'),
    notes: 'checkup',
    email: 'john@doe.com',
    patient: {
      firstName: patient.firstName,
      lastName: patient.lastName,
      contactNumber: patient.contactNumber,
    },
    schedule: {
      slotMinTime: schedule.slotMinTime,
      slotMaxTime: schedule.slotMaxTime,
      weekends: schedule.weekends,
      view: schedule.view,
    },
  })
})

it('should not create a new patient if the patient already exists', async () => {
  const db = await createTestDatabase()
  const user = await db.getRepository(User).save(fakeUser({ role: 'dentist' }))
  const schedule = await db
    .getRepository(Schedule)
    .save(fakeSchedule({ userId: user.id }))
  const patient = await db.getRepository(Patient).save(fakePatient())

  const { create } = appointmentRouter.createCaller(authContext({ db }, user))

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
  }

  const appointmentCreated = await create(appointmentData)

  expect(appointmentCreated).toMatchObject({
    id: expect.any(Number),
    userId: user.id,
    title: 'Checkup',
    start: new Date('2099-06-27 09:57:55'),
    end: new Date('2099-06-27 10:57:55'),
    notes: 'checkup',
    email: 'john@doe.com',
    patient: {
      firstName: patient.firstName,
      lastName: patient.lastName,
      contactNumber: patient.contactNumber,
    },
    schedule: {
      slotMinTime: schedule.slotMinTime,
      slotMaxTime: schedule.slotMaxTime,
      weekends: schedule.weekends,
      view: schedule.view,
    },
  })

  const patients = await db.getRepository(Patient).find()
  expect(patients.length).toBe(1)
})

it('should throw an error when unauthorized person creates appointment', async () => {
  const db = await createTestDatabase()
  const user = await db.getRepository(User).save(fakeUser({ role: 'staff' }))
  const patient = await db.getRepository(Patient).save(fakePatient())
  const { create } = appointmentRouter.createCaller(authContext({ db }, user))

  try {
    await create({
      title: 'Checkup',
      start: new Date('2099-06-27 09:57:55'),
      end: new Date('2099-06-27 10:57:55'),
      notes: 'checkup',
      email: 'john@doe.com',
      scheduleId: 1,
      patient: {
        firstName: patient.firstName,
        lastName: patient.lastName,
        contactNumber: patient.contactNumber,
      },
    })
  } catch (error) {
    expect((error as Error).message).toEqual(
      'Permission denied. You do not have the required role or permissions to add an appointment.'
    )
  }
})

it('should throw an error when patient data is not provided', async () => {
  const db = await createTestDatabase()
  const user = await db.getRepository(User).save(fakeUser({ role: 'dentist' }))
  const { create } = appointmentRouter.createCaller(authContext({ db }, user))

  try {
    await create({
      title: 'Checkup',
      start: new Date('2099-06-27 09:57:55'),
      end: new Date('2099-06-27 10:57:55'),
      notes: 'checkup',
      email: 'john@doe.com',
      scheduleId: 1,
      patient: {
        firstName: '',
        lastName: '',
        contactNumber: '',
      },
    })
  } catch (error) {
    expect((error as TRPCError).code).toEqual('BAD_REQUEST')
  }
})

it('should throw an error when dentist schedule is not found', async () => {
  const db = await createTestDatabase()
  const user = await db.getRepository(User).save(fakeUser({ role: 'dentist' }))
  const patient = await db.getRepository(Patient).save(fakePatient())
  const { create } = appointmentRouter.createCaller(authContext({ db }, user))

  try {
    await create({
      title: 'Checkup',
      start: new Date('2099-06-27 09:57:55'),
      end: new Date('2099-06-27 10:57:55'),
      notes: 'checkup',
      email: 'john@doe.com',
      scheduleId: 1,
      patient: {
        firstName: patient.firstName,
        lastName: patient.lastName,
        contactNumber: patient.contactNumber,
      },
    })
  } catch (error) {
    expect((error as TRPCError).code).toEqual('NOT_FOUND')
  }
})
