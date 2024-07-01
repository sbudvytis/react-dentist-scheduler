import { authContext } from '@tests/utils/context'
import { fakeUser } from '@server/entities/tests/fakes'
import { createTestDatabase } from '@tests/utils/database'
import { User } from '@server/entities'
import userRouter from '..'

it('should remove a user if user has right permission', async () => {
  const db = await createTestDatabase()

  const adminUser = await db
    .getRepository(User)
    .save(fakeUser({ permissions: ['APPROVE_USERS'], isApproved: true }))

  const userToRemove = await db.getRepository(User).save(fakeUser())

  const { remove } = userRouter.createCaller(authContext({ db }, adminUser))

  const removalResult = await remove({ id: userToRemove.id })

  expect(removalResult).toEqual({
    success: true,
    message: 'user removed successfully',
  })
})

it('should not allow to remove a user if user does not have permission', async () => {
  const db = await createTestDatabase()

  const user = await db
    .getRepository(User)
    .save(fakeUser({ permissions: ['VIEW_APPOINTMENTS'] }))

  const userToRemove = await db.getRepository(User).save(fakeUser())

  const { remove } = userRouter.createCaller(authContext({ db }, user))

  await expect(remove({ id: userToRemove.id })).rejects.toThrow(
    'Permission denied. You do not have the required role or permissions to remove a user.'
  )
})

it('should not allow to remove a user if user does not exist', async () => {
  const db = await createTestDatabase()

  const user = await db
    .getRepository(User)
    .save(fakeUser({ permissions: ['APPROVE_USERS'] }))

  const { remove } = userRouter.createCaller(authContext({ db }, user))

  await expect(remove({ id: 999 })).rejects.toThrow('User not found.')
})
