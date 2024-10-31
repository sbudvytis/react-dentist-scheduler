import { Schedule, type ScheduleWithUser } from '@server/entities/schedule'
import { authenticatedProcedure } from '@server/trpc/authenticatedProcedure'
import { z } from 'zod'

const inputSchema = z.object({
  page: z.number().optional(),
  pageSize: z.number().optional(),
  latest: z.boolean().optional(),
  all: z.boolean().optional(),
  scheduleId: z.number().optional(),
})

export default authenticatedProcedure
  .input(inputSchema)
  .query(async ({ input, ctx: { authUser, db } }) => {
    const {
      page = 0,
      pageSize = 2,
      latest = false,
      all = false,
      scheduleId,
    } = input
    const userId = authUser.id

    const userPermissions = authUser.permissions || []
    const userRole = authUser.role || ''

    const canViewAllSchedules = userPermissions.includes('VIEW_ALL_SCHEDULES')

    // pagination
    let skip
    let take

    if (all) {
      skip = 0
      take = undefined
    } else if (latest) {
      skip = 0
      take = 1
    } else {
      skip = page * pageSize
      take = pageSize
    }

    let schedulesQuery = db
      .getRepository(Schedule)
      .createQueryBuilder('schedule')
      .leftJoinAndSelect('schedule.user', 'user') // Join the user who created the schedule
      .leftJoinAndSelect('user.clinic', 'clinic') // Join the clinic related to the user

    if (scheduleId) {
      // Filter by a specific scheduleId if provided
      schedulesQuery = schedulesQuery.where(
        'schedule.scheduleId = :scheduleId',
        { scheduleId }
      )
    } else if (canViewAllSchedules) {
      // If the user has the permission to view all schedules,
      // ensure they can only view schedules from dentists in their own clinic
      schedulesQuery = schedulesQuery.where(
        'user.role = :role AND clinic.clinicId = :clinicId', // Filter for dentists and same clinic
        { role: 'dentist', clinicId: authUser.clinicId }
      )
    } else if (userRole === 'dentist') {
      // Dentists can only view their own schedules
      schedulesQuery = schedulesQuery.where(
        'user.id = :userId AND clinic.clinicId = :clinicId',
        { userId, clinicId: authUser.clinicId }
      )
    } else {
      // Other users can only view their own schedules
      schedulesQuery = schedulesQuery.where({ userId })
    }

    schedulesQuery = schedulesQuery
      .orderBy('schedule.scheduleId', 'DESC')
      .skip(skip)
      .take(take)

    const schedules = (await schedulesQuery.getMany()) as ScheduleWithUser[]

    const total = await db.getRepository(Schedule).count({
      where: canViewAllSchedules
        ? { user: { role: 'dentist', clinic: { clinicId: authUser.clinicId } } } // Count only dentists' schedules in the same clinic
        : { userId },
    })

    return { schedules, total }
  })
