import { authContext } from '@tests/utils/context'
import { fakeClinic, fakePatient, fakeUser } from '@server/entities/tests/fakes'
import { createTestDatabase } from '@tests/utils/database'
import { User, Patient, Clinic } from '@server/entities'
import patientRouter from '..'

it('should find patients if user belongs to the specific clinic', async () => {
  const db = await createTestDatabase()
  const clinic = await db.getRepository(Clinic).save(fakeClinic())
  const user = await db
    .getRepository(User)
    .save(fakeUser({ role: 'staff', clinicId: clinic.clinicId }))
  const { find } = patientRouter.createCaller(authContext({ db }, user))

  await db.getRepository(Patient).save([
    fakePatient({
      clinic,
      firstName: 'John',
      lastName: 'Doe',
      contactNumber: '1234567890',
    }),
    fakePatient({
      clinic,
      firstName: 'Jane',
      lastName: 'Doe',
      contactNumber: '0987654321',
    }),
  ])

  const input = {
    page: 0,
    pageSize: 10,
    all: false,
    searchTerm: '',
  }

  const result = await find(input)

  const expectedPatients = [
    {
      firstName: 'John',
      lastName: 'Doe',
      contactNumber: '1234567890',
    },
    {
      firstName: 'Jane',
      lastName: 'Doe',
      contactNumber: '0987654321',
    },
  ]
  expect(result.patients).toHaveLength(2)
  expect(result.patients).toEqual(
    expect.arrayContaining([
      expect.objectContaining(expectedPatients[0]),
      expect.objectContaining(expectedPatients[1]),
    ])
  )
  expect(result.totalPatients).toBe(2)
})
