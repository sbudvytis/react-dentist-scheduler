import { authContext } from '@tests/utils/context'
import { Schedule, User } from '@server/entities'
import { fakeSchedule, fakeUser } from '@server/entities/tests/fakes'
import { createTestDatabase } from '@tests/utils/database'
import router from '..'

it('should return a list of schedules', async () => {
  const db = await createTestDatabase()
  const [user] = await db.getRepository(User).save([fakeUser()])
  const { find } = router.createCaller(authContext({ db }, user))

  await db.getRepository(Schedule).save([
    fakeSchedule({
      scheduleId: 1,
      userId: user.id,
      slotMinTime: '08:00:00:00',
      slotMaxTime: '17:00:00:00',
      weekends: true,
      view: 'timeGridWeek',
    }),
  ])

  const userSchedules = await find({ page: 0, pageSize: 2, latest: false })

  expect(userSchedules.schedules).toHaveLength(1)
  expect(userSchedules.schedules[0]).toMatchObject({
    scheduleId: expect.any(Number),
    userId: user.id,
    slotMinTime: '08:00:00:00',
    slotMaxTime: '17:00:00:00',
    weekends: true,
    view: 'timeGridWeek',
  })
})
