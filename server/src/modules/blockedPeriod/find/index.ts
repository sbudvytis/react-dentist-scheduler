import {
  BlockedPeriod,
  type BlockedPeriodBare,
} from '@server/entities/blockedPeriod' // Adjust the import path according to your structure
import { authenticatedProcedure } from '@server/trpc/authenticatedProcedure'
import { TRPCError } from '@trpc/server'
import { z } from 'zod'

const GetBlockedPeriodsInput = z.object({
  scheduleId: z.number(),
})

export default authenticatedProcedure
  .input(GetBlockedPeriodsInput)
  .query(async ({ input, ctx: { authUser, db } }) => {
    const { scheduleId } = input
    const userRole = authUser.role || ''
    const userPermissions = authUser.permissions || []

    // Define permissions for accessing blocked periods
    const canFindBlockedPeriods =
      userRole === 'dentist' || userPermissions.includes('VIEW_ALL_SCHEDULES')

    let blockedPeriods

    const queryBuilder = db
      .getRepository(BlockedPeriod)
      .createQueryBuilder('BlockedPeriod')

    if (canFindBlockedPeriods) {
      blockedPeriods = (await queryBuilder
        .where('BlockedPeriod.schedule_id = :scheduleId', { scheduleId })
        .orderBy('BlockedPeriod.id', 'DESC')
        .getMany()) as BlockedPeriodBare[]
    } else {
      throw new TRPCError({
        code: 'FORBIDDEN',
        message:
          'Permission denied. You do not have the required role or permissions to find blocked periods.',
      })
    }

    return blockedPeriods
  })
