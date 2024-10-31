import { authContext } from '@tests/utils/context'
import { fakeClinic, fakeUser } from '@server/entities/tests/fakes'
import { createTestDatabase } from '@tests/utils/database'
import { Clinic, User } from '@server/entities'
import scheduleRouter from '..'

it('should get a dentists schedule by id', async () => {
  const db = await createTestDatabase()
  const clinic = await db.getRepository(Clinic).save(fakeClinic())
  const user = await db
    .getRepository(User)
    .save(fakeUser({ role: 'dentist', clinicId: clinic.clinicId }))
  const { create, get } = scheduleRouter.createCaller(authContext({ db }, user))

  const scheduleCreated = await create({
    slotMinTime: '08:00:00:00',
    slotMaxTime: '17:00:00:00',
    weekends: true,
    view: 'timeGridWeek',
  })

  const scheduleGot = await get(scheduleCreated.scheduleId)

  expect(scheduleGot).toMatchObject({
    scheduleId: scheduleCreated.scheduleId,
    userId: user.id,
    slotMinTime: '08:00:00:00',
    slotMaxTime: '17:00:00:00',
    weekends: true,
    view: 'timeGridWeek',
  })
})

it('should throw an error when schedule is not found', async () => {
  const db = await createTestDatabase()
  const user = await db.getRepository(User).save(fakeUser({ role: 'dentist' }))
  const { get } = scheduleRouter.createCaller(authContext({ db }, user))

  try {
    await get(999)
  } catch (error) {
    expect(error).toMatchObject({
      code: 'NOT_FOUND',
      message: 'Schedule was not found',
    })
  }
})
