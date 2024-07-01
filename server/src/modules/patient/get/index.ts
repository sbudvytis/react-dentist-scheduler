import {
  Patient,
  patientSchema,
  type PatientBare,
} from '@server/entities/patient'
import { authenticatedProcedure } from '@server/trpc/authenticatedProcedure'
import { TRPCError } from '@trpc/server'

export default authenticatedProcedure
  .input(patientSchema.shape.patientId)
  .query(async ({ input: ptId, ctx: { db } }) => {
    const patient = (await db.getRepository(Patient).findOne({
      where: { patientId: ptId },
    })) as PatientBare

    if (!patient) {
      throw new TRPCError({
        code: 'NOT_FOUND',
        message: `Patient was not found`,
      })
    }

    return patient
  })
