import { authContext } from '@tests/utils/context'
import { fakeUser } from '@server/entities/tests/fakes'
import { createTestDatabase } from '@tests/utils/database'
import { User } from '@server/entities'
import userRouter from '..'

it('should approve a user', async () => {
  const db = await createTestDatabase()

  const adminUser = await db
    .getRepository(User)
    .save(fakeUser({ permissions: ['APPROVE_USERS'], isApproved: true }))

  const userToApprove = await db
    .getRepository(User)
    .save(fakeUser({ role: 'dentist', isApproved: false }))

  const { approve } = userRouter.createCaller(authContext({ db }, adminUser))

  const userApproved = await approve({ id: userToApprove.id })

  expect(userApproved).toMatchObject({
    id: userToApprove.id,
    isApproved: true,
  })
})

it('should not allow to approve if user does not have permission', async () => {
  const db = await createTestDatabase()

  const user = await db
    .getRepository(User)
    .save(fakeUser({ permissions: ['VIEW_APPOINTMENTS'] }))

  const userToApprove = await db.getRepository(User).save(fakeUser())

  const { approve } = userRouter.createCaller(authContext({ db }, user))

  await expect(approve({ id: userToApprove.id })).rejects.toThrow(
    'Permission denied. You do not have the required role or permissions to approve a user.'
  )
})

it('should not allow to approve if user does not exist', async () => {
  const db = await createTestDatabase()

  const user = await db
    .getRepository(User)
    .save(fakeUser({ permissions: ['APPROVE_USERS'] }))

  const { approve } = userRouter.createCaller(authContext({ db }, user))

  await expect(approve({ id: 999 })).rejects.toThrow('User not found.')
})
