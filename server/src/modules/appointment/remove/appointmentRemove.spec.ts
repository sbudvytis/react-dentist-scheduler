import { authContext } from '@tests/utils/context'
import { fakeUser } from '@server/entities/tests/fakes'
import { createTestDatabase } from '@tests/utils/database'
import { User, Appointment } from '@server/entities'
import appointmentRouter from '..'

it('should remove an appointment', async () => {
  const db = await createTestDatabase()
  const user = await db.getRepository(User).save(fakeUser({ role: 'dentist' }))
  const { remove } = appointmentRouter.createCaller(authContext({ db }, user))

  const appointment = await db.getRepository(Appointment).save({
    userId: user.id,
    title: 'Checkup',
    start: new Date('2099-06-27 09:57:55'),
    end: new Date('2099-06-27 10:57:55'),
    notes: 'checkup',
    email: 'john@doe.com',
  })

  const result = await remove({
    id: appointment.id,
    userId: user.id,
    title: 'Checkup',
    start: new Date('2099-06-27 09:57:55'),
    end: new Date('2099-06-27 10:57:55'),
    notes: 'checkup',
    email: 'john@doe.com',
  })

  expect(result).toEqual({
    success: true,
    message: 'Appointment deleted successfully',
  })
  expect(
    await db
      .getRepository(Appointment)
      .findOne({ where: { id: appointment.id } })
  )
})

it('should remove an appointment with permission VIEW_ALL_SCHEDULES', async () => {
  const db = await createTestDatabase()
  const user = await db
    .getRepository(User)
    .save(fakeUser({ role: 'staff', permissions: ['VIEW_ALL_SCHEDULES'] }))
  const { remove } = appointmentRouter.createCaller(authContext({ db }, user))

  const appointment = await db.getRepository(Appointment).save({
    userId: user.id,
    title: 'Checkup',
    start: new Date('2099-06-27 09:57:55'),
    end: new Date('2099-06-27 10:57:55'),
    notes: 'checkup',
    email: 'john@doe.com',
  })

  const result = await remove({
    id: appointment.id,
    userId: user.id,
    title: 'Checkup',
    start: new Date('2099-06-27 09:57:55'),
    end: new Date('2099-06-27 10:57:55'),
    notes: 'checkup',
    email: 'john@doe.com',
  })

  expect(result).toEqual({
    success: true,
    message: 'Appointment deleted successfully',
  })
  expect(
    await db
      .getRepository(Appointment)
      .findOne({ where: { id: appointment.id } })
  )
})

it('should not allow to remove if appointment not found', async () => {
  const db = await createTestDatabase()
  const user = await db.getRepository(User).save(fakeUser({ role: 'dentist' }))
  const { remove } = appointmentRouter.createCaller(authContext({ db }, user))

  const appointment = await db.getRepository(Appointment).save({
    userId: user.id,
    title: 'Checkup',
    start: new Date('2099-06-27 09:57:55'),
    end: new Date('2099-06-27 10:57:55'),
    notes: 'checkup',
    email: 'john@doe.com',
  })

  await expect(
    remove({
      id: appointment.id + 1,
      userId: user.id,
      title: 'Checkup',
      start: new Date('2099-06-27 09:57:55'),
      end: new Date('2099-06-27 10:57:55'),
      notes: 'checkup',
      email: 'john@doe.com',
    })
  ).rejects.toThrow('Appointment not found.')
})

it('should not allow to remove if user does not required role or permissions', async () => {
  const db = await createTestDatabase()
  const user = await db.getRepository(User).save(fakeUser({ role: 'patient' }))
  const { remove } = appointmentRouter.createCaller(authContext({ db }, user))

  const appointment = await db.getRepository(Appointment).save({
    userId: user.id,
    title: 'Checkup',
    start: new Date('2099-06-27 09:57:55'),
    end: new Date('2099-06-27 10:57:55'),
    notes: 'checkup',
    email: 'john@doe.com',
  })

  await expect(
    remove({
      id: appointment.id,
      userId: user.id,
      title: 'Checkup',
      start: new Date('2099-06-27 09:57:55'),
      end: new Date('2099-06-27 10:57:55'),
      notes: 'checkup',
      email: 'john@doe.com',
    })
  ).rejects.toThrow(
    'Permission denied. You do not have the required role or permissions to delete an appointment.'
  )
})
