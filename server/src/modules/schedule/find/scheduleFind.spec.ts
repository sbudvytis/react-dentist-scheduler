import { authContext } from '@tests/utils/context'
import { Clinic, Schedule, User } from '@server/entities'
import {
  fakeClinic,
  fakeSchedule,
  fakeUser,
} from '@server/entities/tests/fakes'
import { createTestDatabase } from '@tests/utils/database'
import router from '..'

it('should return a list of schedules', async () => {
  const db = await createTestDatabase()
  const clinic = await db.getRepository(Clinic).save(fakeClinic())
  const user = await db
    .getRepository(User)
    .save(fakeUser({ role: 'staff', clinicId: clinic.clinicId }))
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
    fakeSchedule({
      scheduleId: 2,
      userId: user.id,
      slotMinTime: '08:00:00:00',
      slotMaxTime: '17:00:00:00',
      weekends: true,
      view: 'timeGridWeek',
    }),
  ])

  const userSchedules = await find({ page: 0, pageSize: 2, latest: false })

  expect(userSchedules.schedules).toHaveLength(2)
  expect(userSchedules.schedules[0]).toMatchObject({
    scheduleId: expect.any(Number),
    userId: user.id,
    slotMinTime: '08:00:00:00',
    slotMaxTime: '17:00:00:00',
    weekends: true,
    view: 'timeGridWeek',
  })
})
