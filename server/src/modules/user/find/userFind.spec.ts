import { authContext } from '@tests/utils/context'
import { fakeUser } from '@server/entities/tests/fakes'
import { createTestDatabase } from '@tests/utils/database'
import { User } from '@server/entities'
import userRouter from '..'

it('should find users who are not approved', async () => {
  const db = await createTestDatabase()

  const adminUser = await db
    .getRepository(User)
    .save(fakeUser({ permissions: ['APPROVE_USERS'], isApproved: true }))

  const userToFind = await db
    .getRepository(User)
    .save(fakeUser({ isApproved: false }))

  const { find } = userRouter.createCaller(authContext({ db }, adminUser))

  const usersFound = await find()

  expect(usersFound).toEqual(
    expect.arrayContaining([
      expect.objectContaining({
        id: userToFind.id,
        isApproved: false,
      }),
    ])
  )
})
