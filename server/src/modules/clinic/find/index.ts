import { Clinic } from '@server/entities/clinic'
import { authenticatedProcedure } from '@server/trpc/authenticatedProcedure'
import { TRPCError } from '@trpc/server'
import { z } from 'zod'

const GetClinicByIdInput = z.object({
  clinicId: z.number(),
})

export default authenticatedProcedure
  .input(GetClinicByIdInput)
  .query(async ({ input, ctx: { authUser, db } }) => {
    const { clinicId } = input

    // Check if the authenticated user is part of the clinic
    if (authUser.clinicId !== clinicId) {
      throw new TRPCError({
        code: 'FORBIDDEN',
        message: 'You are not authorized to access this clinic.',
      })
    }

    // Query the clinic information
    const clinic = await db.getRepository(Clinic).findOne({
      where: { clinicId },
    })

    if (!clinic) {
      throw new TRPCError({
        code: 'NOT_FOUND',
        message: 'Clinic not found.',
      })
    }

    return clinic
  })
