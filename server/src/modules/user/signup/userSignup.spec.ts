import { createTestDatabase } from '@tests/utils/database'
import { User } from '@server/entities'
import { fakeUser } from '@server/entities/tests/fakes'
import usersRouter from '..'

const db = await createTestDatabase()
const userRepository = db.getRepository(User)
const { signup } = usersRouter.createCaller({ db })

it('should save a user', async () => {
  const user = fakeUser()

  const response = await signup(user)

  const userCreated = (await userRepository.findOneOrFail({
    select: {
      id: true,
      email: true,
      password: true,
    },
    where: {
      email: user.email,
    },
  })) as Pick<User, 'id' | 'email' | 'password'>

  expect(userCreated).toEqual({
    id: expect.any(Number),
    email: user.email,
    password: expect.not.stringContaining(user.password),
  })

  expect(userCreated.password).toHaveLength(60)

  expect(response).toEqual({
    id: expect.any(Number),
    email: user.email,
    firstName: user.firstName,
    lastName: user.lastName,
    role: user.role,
    permissions: expect.any(Array),
  })

  expect(response.id).toEqual(userCreated!.id)
})

it('should require a valid email', async () => {
  await expect(
    signup({
      firstName: 'John',
      lastName: 'Doe',
      email: 'user-email-invalid',
      password: 'password.123',
      role: 'Dentist',
    })
  ).rejects.toThrow(/email/i)
})

it('should require a password with at least 8 characters', async () => {
  await expect(
    signup({
      firstName: 'John',
      lastName: 'Doe',
      email: 'user2@domain.com',
      password: 'pas.123',
      role: 'Dentist',
    })
  ).rejects.toThrow(/password/i)
})

it('throws an error for invalid email', async () => {
  await expect(
    signup({
      firstName: 'John',
      lastName: 'Doe',
      email: 'not-an-email',
      password: 'some-password',
      role: 'Dentist',
    })
  ).rejects.toThrow(/email/)
})

it('stores lowercased email', async () => {
  const user = fakeUser()
  await signup({
    ...user,
    email: user.email.toUpperCase(),
    role: 'Dentist',
  })

  await expect(
    userRepository.findOneByOrFail({
      email: user.email,
    })
  ).resolves.not.toBeNull()
})

it('stores email with trimmed whitespace', async () => {
  const user = fakeUser()
  await signup({
    ...user,
    email: ` \t ${user.email}\t `,
    role: 'Dentist',
  })

  await expect(
    userRepository.findOneByOrFail({
      email: user.email,
    })
  ).resolves.not.toBeNull()
})
