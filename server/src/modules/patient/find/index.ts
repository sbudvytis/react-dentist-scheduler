import { Patient } from '@server/entities/patient'
import { authenticatedProcedure } from '@server/trpc/authenticatedProcedure'
import { z } from 'zod'

const inputSchema = z.object({
  page: z.number().optional(),
  pageSize: z.number().optional(),
  all: z.boolean().optional(),
})

export default authenticatedProcedure
  .input(inputSchema)
  .query(async ({ input, ctx: { authUser, db } }) => {
    const { page = 0, pageSize = 1, all = false } = input
    const userPermissions = authUser.permissions || []
    const userRole = authUser.role || ''
    const canViewAllPatients = userPermissions.includes('VIEW_ALL_SCHEDULES')

    let skip
    let take

    if (all) {
      skip = 0
      take = undefined
    } else {
      skip = page * pageSize
      take = pageSize
    }

    const patientRepository = db.getRepository(Patient)

    // Get total count for pagination
    const totalPatients = await patientRepository.count()

    let patients: Patient[] = []
    const patientQueryOptions = {
      order: { patientId: 'DESC' as const },
      relations: ['appointments'],
      skip,
      take,
    }

    if (canViewAllPatients) {
      patients = await patientRepository.find(patientQueryOptions)
    } else if (userRole === 'dentist') {
      patients = await patientRepository.find(patientQueryOptions)
    }

    return { patients, totalPatients }
  })
