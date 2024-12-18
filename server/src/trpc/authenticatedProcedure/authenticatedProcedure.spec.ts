import { authContext, requestContext } from '@tests/utils/context'
import { router } from '..'
import { authenticatedProcedure } from '.'

const routes = router({
  testCall: authenticatedProcedure.query(() => 'passed'),
})

const VALID_TOKEN = 'valid-token'

vi.mock('jsonwebtoken', () => ({
  default: {
    verify: (token: string) => {
      if (token !== VALID_TOKEN) throw new Error('Invalid token')

      return {
        user: {
          id: 2,
          clinicId: 1,
          firstName: 'John',
          lastName: 'Doe',
          email: 'valid@email.com',
          role: 'dentist',
          permissions: ['VIEW_APPOINTMENTS'],
        },
      }
    },
  },
}))

const db = {} as any
const authenticated = routes.createCaller(authContext({ db }))

it('should pass if user is already authenticated', async () => {
  const response = await authenticated.testCall()

  expect(response).toEqual('passed')
})

it('should pass if user provides a valid token', async () => {
  const usingValidToken = routes.createCaller({
    db,
    req: {
      header: () => `Bearer ${VALID_TOKEN}`,
    } as any,
  })

  const response = await usingValidToken.testCall()

  expect(response).toEqual('passed')
})

it('should throw an error if user is not logged in', async () => {
  const unauthenticated = routes.createCaller(requestContext({ db }))

  await expect(unauthenticated.testCall()).rejects.toThrow(
    /login|log in|logged in|authenticate|unauthorized/i
  )
})

it('should throw an error if it is run without access to headers', async () => {
  const invalidToken = routes.createCaller(
    requestContext({
      db,
      req: undefined as any,
    })
  )

  await expect(invalidToken.testCall()).rejects.toThrow(/Express/i)
})

it('should throw an error if user provides invalid token', async () => {
  const invalidToken = routes.createCaller(
    requestContext({
      db,
      req: {
        header: () => 'Bearer invalid-token',
      } as any,
    })
  )

  await expect(invalidToken.testCall()).rejects.toThrow(/token/i)
})
