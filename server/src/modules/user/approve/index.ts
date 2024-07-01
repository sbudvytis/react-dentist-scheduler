import { User, userSchema } from '@server/entities/user'
import { authenticatedProcedure } from '@server/trpc/authenticatedProcedure'
import { TRPCError } from '@trpc/server'
import logger from '@server/logger'

export default authenticatedProcedure
  .input(userSchema.pick({ id: true }))
  .mutation(async ({ input: { id }, ctx: { authUser, db } }) => {
    const userPermissions = authUser.permissions || []

    const canApproveUsers = userPermissions.includes('APPROVE_USERS')

    if (!canApproveUsers) {
      throw new TRPCError({
        code: 'FORBIDDEN',
        message:
          'Permission denied. You do not have the required role or permissions to approve a user.',
      })
    }

    const user = await db.getRepository(User).findOne({ where: { id } })

    if (!user) {
      throw new TRPCError({
        code: 'NOT_FOUND',
        message: 'User not found.',
      })
    }
    user.isApproved = true
    logger.info(`User approved successfully with ID: ${user.id}`)

    const userApproved = await db.getRepository(User).save(user)

    return userApproved
  })
