import { authContext } from '@tests/utils/context'
import { fakeClinic, fakeUser } from '@server/entities/tests/fakes'
import { createTestDatabase } from '@tests/utils/database'
import { Clinic, User } from '@server/entities'
import scheduleRouter from '..'

it('should edit a dentists schedule', async () => {
  const db = await createTestDatabase()
  const clinic = await db.getRepository(Clinic).save(fakeClinic())
  const user = await db
    .getRepository(User)
    .save(fakeUser({ role: 'dentist', clinicId: clinic.clinicId }))
  const { create, edit } = scheduleRouter.createCaller(
    authContext({ db }, user)
  )

  const scheduleCreated = await create({
    slotMinTime: '08:00:00:00',
    slotMaxTime: '17:00:00:00',
    weekends: true,
    view: 'timeGridWeek',
  })

  const scheduleEdited = await edit({
    scheduleId: scheduleCreated.scheduleId,
    userId: user.id,
    slotMinTime: '08:00:00:00',
    slotMaxTime: '17:00:00:00',
    weekends: true,
    view: 'timeGridWeek',
  })

  expect(scheduleEdited).toMatchObject({
    scheduleId: scheduleCreated.scheduleId,
    userId: user.id,
    slotMinTime: '08:00:00:00',
    slotMaxTime: '17:00:00:00',
    weekends: true,
    view: 'timeGridWeek',
  })
})

it("should deny a staff member from editing a dentist's schedule", async () => {
  const db = await createTestDatabase()
  const clinic = await db.getRepository(Clinic).save(fakeClinic())
  const dentistUser = await db
    .getRepository(User)
    .save(fakeUser({ role: 'dentist', clinicId: clinic.clinicId }))
  const staffUser = await db
    .getRepository(User)
    .save(fakeUser({ role: 'staff', clinicId: clinic.clinicId }))
  const { create } = scheduleRouter.createCaller(
    authContext({ db }, dentistUser)
  )

  const scheduleCreated = await create({
    slotMinTime: '08:00:00:00',
    slotMaxTime: '17:00:00:00',
    weekends: true,
    view: 'timeGridWeek',
  })

  const { edit: editSchedule } = scheduleRouter.createCaller(
    authContext({ db }, staffUser)
  )

  try {
    await editSchedule({
      scheduleId: scheduleCreated.scheduleId,
      userId: staffUser.id,
      slotMinTime: '08:00:00:00',
      slotMaxTime: '17:00:00:00',
      weekends: true,
      view: 'timeGridWeek',
    })
  } catch (error) {
    expect((error as Error).message).toEqual(
      'Permission denied. You do not have the required permissions to edit a schedule.'
    )
  }
})
