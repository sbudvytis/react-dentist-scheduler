import { Patient, patientInsertSchema } from '@server/entities/patient'
import { authenticatedProcedure } from '@server/trpc/authenticatedProcedure'
import { TRPCError } from '@trpc/server'

export default authenticatedProcedure
  .input(patientInsertSchema)
  .mutation(async ({ input: patientData, ctx: { authUser, db } }) => {
    const userPermissions = authUser.permissions || []
    const userRole = authUser.role || ''

    // Checks if the authenticated user has the required role and permissions
    const canCreatePatient =
      userRole === 'dentist' || userPermissions.includes('VIEW_ALL_SCHEDULES')

    if (!authUser || !canCreatePatient) {
      throw new TRPCError({
        code: 'FORBIDDEN',
        message:
          'Permission denied. You do not have the required role or permissions to add a patient.',
      })
    }

    const patient = db.getRepository(Patient).create(patientData)
    const patientCreated = await db.getRepository(Patient).save(patient)
    return patientCreated
  })
