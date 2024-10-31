import { authContext } from '@tests/utils/context'
import {
  fakeAppointment,
  fakeSchedule,
  fakeUser,
} from '@server/entities/tests/fakes'
import { createTestDatabase } from '@tests/utils/database'
import { User, Appointment, Schedule } from '@server/entities'
import appointmentRouter from '..'

it('should find appointments if user has right permissions or role', async () => {
  const db = await createTestDatabase()
  const user = await db
    .getRepository(User)
    .save(fakeUser({ role: 'dentist', permissions: ['VIEW_ALL_SCHEDULES'] }))
  const { find } = appointmentRouter.createCaller(authContext({ db }, user))

  const [schedule] = await db.getRepository(Schedule).save([
    fakeSchedule({
      scheduleId: 1,
      userId: user.id,
      slotMinTime: '08:00:00:00',
      slotMaxTime: '17:00:00:00',
      weekends: true,
      view: 'timeGridWeek',
    }),
  ])

  await db.getRepository(Appointment).save([
    fakeAppointment({
      schedule,
      userId: user.id,
      title: 'Checkup',
      start: new Date('2099-06-27 09:57:55'),
      end: new Date('2099-06-27 10:57:55'),
      notes: 'checkup',
      email: 'john@doe.com',
    }),
    fakeAppointment({
      schedule,
      userId: user.id,
      title: 'Checkup',
      start: new Date('2099-06-27 09:57:55'),
      end: new Date('2099-06-27 10:57:55'),
      notes: 'checkup',
      email: 'john@doe.com',
    }),
  ])

  const result = await find({ scheduleId: schedule.scheduleId })

  expect(result).toHaveLength(2)
  expect(result).toEqual(expect.arrayContaining([]))
})

it('should throw FORBIDDEN error if user does not have right permissions or role', async () => {
  const db = await createTestDatabase()
  const user = await db.getRepository(User).save(fakeUser({ role: 'patient' }))
  const { find } = appointmentRouter.createCaller(authContext({ db }, user))

  const [schedule] = await db.getRepository(Schedule).save([
    fakeSchedule({
      scheduleId: 1,
      userId: user.id,
      slotMinTime: '08:00:00:00',
      slotMaxTime: '17:00:00:00',
      weekends: true,
      view: 'timeGridWeek',
    }),
  ])

  await db.getRepository(Appointment).save([
    fakeAppointment({
      schedule,
      userId: user.id,
      title: 'Checkup',
      start: new Date('2099-06-27 09:57:55'),
      end: new Date('2099-06-27 10:57:55'),
      notes: 'checkup',
      email: 'john@doe.com',
    }),
    fakeAppointment({
      schedule,
      userId: user.id,
      title: 'Checkup',
      start: new Date('2099-06-27 09:57:55'),
      end: new Date('2099-06-27 10:57:55'),
      notes: 'checkup',
      email: 'john@doe.com',
    }),
  ])

  await expect(find({ scheduleId: schedule.scheduleId })).rejects.toThrow(
    'Permission denied. You do not have the required role or permissions to find appointments.'
  )
})
