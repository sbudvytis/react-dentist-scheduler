import {
  DisabledPeriod,
  type DisabledPeriodBare,
} from '@server/entities/disabledPeriod' // Adjust the import path according to your structure
import { authenticatedProcedure } from '@server/trpc/authenticatedProcedure'
import { TRPCError } from '@trpc/server'
import { z } from 'zod'

const GetDisabledPeriodsInput = z.object({
  scheduleId: z.number(),
})

export default authenticatedProcedure
  .input(GetDisabledPeriodsInput)
  .query(async ({ input, ctx: { authUser, db } }) => {
    const { scheduleId } = input
    const userRole = authUser.role || ''
    const userPermissions = authUser.permissions || []

    const canFindDisabledPeriods =
      userRole === 'dentist' || userPermissions.includes('VIEW_ALL_SCHEDULES')

    let disabledPeriods

    const queryBuilder = db
      .getRepository(DisabledPeriod)
      .createQueryBuilder('DisabledPeriod')

    if (canFindDisabledPeriods) {
      disabledPeriods = (await queryBuilder
        .where('DisabledPeriod.schedule_id = :scheduleId', { scheduleId })
        .orderBy('DisabledPeriod.id', 'DESC')
        .getMany()) as DisabledPeriodBare[]
    } else {
      throw new TRPCError({
        code: 'FORBIDDEN',
        message:
          'Permission denied. You do not have the required role or permissions to find disabled periods.',
      })
    }

    return disabledPeriods
  })
