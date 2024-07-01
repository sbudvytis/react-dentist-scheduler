import { authContext } from '@tests/utils/context'
import { fakeUser } from '@server/entities/tests/fakes'
import { createTestDatabase } from '@tests/utils/database'
import { User } from '@server/entities'
import patientRouter from '..'

it('should allow to create a patient with dentist role', async () => {
  const db = await createTestDatabase()
  const user = await db.getRepository(User).save(fakeUser({ role: 'dentist' }))
  const { create } = patientRouter.createCaller(authContext({ db }, user))

  const patientCreated = await create({
    firstName: 'John',
    lastName: 'Doe',
    contactNumber: '1234567890',
  })

  expect(patientCreated).toMatchObject({
    patientId: expect.any(Number),
    firstName: 'John',
    lastName: 'Doe',
    contactNumber: '1234567890',
  })
})

it('should allow to create a patient with VIEW_ALL_SCHEDULES permission', async () => {
  const db = await createTestDatabase()
  const user = await db
    .getRepository(User)
    .save(fakeUser({ role: 'staff', permissions: ['VIEW_ALL_SCHEDULES'] }))
  const { create } = patientRouter.createCaller(authContext({ db }, user))

  const patientCreated = await create({
    firstName: 'John',
    lastName: 'Doe',
    contactNumber: '1234567890',
  })

  expect(patientCreated).toMatchObject({
    patientId: expect.any(Number),
    firstName: 'John',
    lastName: 'Doe',
    contactNumber: '1234567890',
  })
})

it('should not allow to create a patient for a user without the required role or permissions', async () => {
  const db = await createTestDatabase()
  const user = await db.getRepository(User).save(fakeUser({ role: 'patient' }))
  const { create } = patientRouter.createCaller(authContext({ db }, user))

  await expect(
    create({
      firstName: 'John',
      lastName: 'Doe',
      contactNumber: '1234567890',
    })
  ).rejects.toMatchObject({
    code: 'FORBIDDEN',
    message:
      'Permission denied. You do not have the required role or permissions to add a patient.',
  })
})
