import { authContext } from '@tests/utils/context'
import { fakeUser } from '@server/entities/tests/fakes'
import { createTestDatabase } from '@tests/utils/database'
import { User } from '@server/entities'
import scheduleRouter from '..'

it('should create a dentists schedule', async () => {
  const db = await createTestDatabase()
  const user = await db.getRepository(User).save(fakeUser({ role: 'dentist' }))
  const { create } = scheduleRouter.createCaller(authContext({ db }, user))

  const scheduleCreated = await create({
    slotMinTime: '08:00:00:00',
    slotMaxTime: '17:00:00:00',
    weekends: true,
    view: 'timeGridWeek',
  })

  expect(scheduleCreated).toMatchObject({
    scheduleId: expect.any(Number),
    userId: user.id,
    slotMinTime: '08:00:00:00',
    slotMaxTime: '17:00:00:00',
    weekends: true,
    view: 'timeGridWeek',
  })
})

it('should throw an error when staff tries to create a schedule', async () => {
  const db = await createTestDatabase()
  const user = await db.getRepository(User).save(fakeUser({ role: 'staff' }))
  const { create } = scheduleRouter.createCaller(authContext({ db }, user))

  try {
    await create({
      slotMinTime: '08:00:00:00',
      slotMaxTime: '17:00:00:00',
      weekends: true,
      view: 'timeGridWeek',
    })
  } catch (error) {
    expect((error as Error).message).toEqual(
      'Permission denied. You do not have the required role or permissions to add a schedule.'
    )
  }
})
