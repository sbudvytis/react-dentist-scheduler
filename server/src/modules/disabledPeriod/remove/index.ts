// module to remove a disabled period from database
import {
  DisabledPeriod,
  DisabledPeriodSchema,
} from '@server/entities/disabledPeriod'
import { authenticatedProcedure } from '@server/trpc/authenticatedProcedure'
import { TRPCError } from '@trpc/server'
import logger from '@server/logger'

export default authenticatedProcedure
  .input(DisabledPeriodSchema)
  .mutation(async ({ input: { id }, ctx: { db, authUser } }) => {
    if (!authUser || authUser.role !== 'dentist') {
      logger.error(
        'User does not have the required permissions to delete a schedule.'
      )
      throw new TRPCError({
        code: 'FORBIDDEN',
        message:
          'Permission denied. You do not have the required permissions to delete a schedule.',
      })
    }

    const disabledPeriod = await db
      .getRepository(DisabledPeriod)
      .findOne({ where: { id } })

    if (!disabledPeriod) {
      throw new TRPCError({
        code: 'NOT_FOUND',
        message: 'Disabled period not found',
      })
    }

    await db.getRepository(DisabledPeriod).remove(disabledPeriod)

    return { success: true, message: 'Disabled period removed successfully' }
  })
