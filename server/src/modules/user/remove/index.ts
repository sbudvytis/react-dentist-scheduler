import { User, userSchema } from '@server/entities/user'
import { authenticatedProcedure } from '@server/trpc/authenticatedProcedure'
import { TRPCError } from '@trpc/server'
import logger from '@server/logger'

export default authenticatedProcedure
  .input(userSchema.pick({ id: true }))
  .mutation(async ({ input: { id }, ctx: { authUser, db } }) => {
    const userPermissions = authUser.permissions || []

    const canRemoveUsers = userPermissions.includes('APPROVE_USERS')
    if (!canRemoveUsers) {
      logger.error(
        'User does not have the required permissions to remove a user.'
      )
      throw new TRPCError({
        code: 'FORBIDDEN',
        message:
          'Permission denied. You do not have the required role or permissions to remove a user.',
      })
    }

    const user = await db.getRepository(User).findOne({ where: { id } })

    if (!user) {
      throw new TRPCError({
        code: 'NOT_FOUND',
        message: 'User not found.',
      })
    }

    await db.getRepository(User).delete(id)
    logger.info(`User removed successfully with ID: ${id}`)

    return { success: true, message: 'user removed successfully' }
  })
