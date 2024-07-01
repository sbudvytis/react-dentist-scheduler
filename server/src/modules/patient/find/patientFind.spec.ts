import { authContext } from '@tests/utils/context'
import { fakePatient } from '@server/entities/tests/fakes'
import { createTestDatabase } from '@tests/utils/database'
import { Patient } from '@server/entities'
import patientRouter from '..'

it('should give a list of patients', async () => {
  const db = await createTestDatabase()
  const { find } = patientRouter.createCaller(authContext({ db }))

  await db.getRepository(Patient).save([
    fakePatient({
      patientId: 1,
      firstName: 'John',
      lastName: 'Doe',
      contactNumber: '1234567890',
    }),
  ])

  const patients = await find()

  expect(patients).toHaveLength(1)
  expect(patients[0]).toMatchObject({
    patientId: 1,
    firstName: 'John',
    lastName: 'Doe',
    contactNumber: '1234567890',
  })
})
