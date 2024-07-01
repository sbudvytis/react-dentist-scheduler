import { authContext } from '@tests/utils/context'
import { createTestDatabase } from '@tests/utils/database'
import { fakeUser, fakeSchedule } from '@server/entities/tests/fakes'
import { User, Schedule } from '@server/entities'
import { router } from '..'
import { scheduleIdOwnerProcedure } from '.'

const routes = router({
  testCall: scheduleIdOwnerProcedure.query(() => 'passed'),
})

const db = await createTestDatabase()

const [userOne, userTwo] = await db
  .getRepository(User)
  .save([fakeUser(), fakeUser()])

const [scheduleOne] = await db
  .getRepository(Schedule)
  .save([
    fakeSchedule({ userId: userOne.id }),
    fakeSchedule({ userId: userTwo.id }),
  ])

const authenticated = routes.createCaller(authContext({ db }, userOne))

it('should pass if schedule belongs to the user', async () => {
  const response = await authenticated.testCall({ id: scheduleOne.scheduleId })

  expect(response).toEqual('passed')
})

it('should throw an error if id is not provided', async () => {
  await expect((authenticated.testCall as any)({})).rejects.toThrow(/id/i)
})

it('should throw an error if user provides a non-existing id', async () => {
  await expect('Schedule not found')
})

it('should throw an error if user provides null id', async () => {
  await expect(authenticated.testCall({ id: null as any })).rejects.toThrow(
    /id/i
  )
})

it('should throw an error if schedule does not belong to the user', async () => {
  await expect('Schedule does not belong to the user')
})
