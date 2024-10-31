import { Patient } from '@server/entities/patient'
import { authenticatedProcedure } from '@server/trpc/authenticatedProcedure'
import { z } from 'zod'

const inputSchema = z.object({
  page: z.number().optional(),
  pageSize: z.number().optional(),
  all: z.boolean().optional(),
  searchTerm: z.string().optional(),
})

export default authenticatedProcedure
  .input(inputSchema)
  .query(async ({ input, ctx: { db, authUser } }) => {
    const { page = 0, pageSize = 1, all = false, searchTerm = '' } = input

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

    let query = patientRepository
      .createQueryBuilder('patient')
      .leftJoinAndSelect('patient.appointments', 'appointments')
      .leftJoin('patient.clinic', 'clinic') // Join the clinic table
      .where('clinic.clinicId = :clinicId', { clinicId: authUser.clinicId }) // Filter by the currently logged-in admin's clinic
      .orderBy('patient.patientId', 'DESC')
      .skip(skip)
      .take(take)

    if (searchTerm) {
      query = query.andWhere(
        'patient.firstName ILIKE :searchTerm OR patient.lastName ILIKE :searchTerm OR patient.contactNumber ILIKE :searchTerm',
        { searchTerm: `%${searchTerm}%` }
      )
    }

    const [patients, totalPatients] = await query.getManyAndCount()

    return { patients, totalPatients }
  })
