import { Patient, patientSchema } from '@server/entities/patient'
import { authenticatedProcedure } from '@server/trpc/authenticatedProcedure'
import { TRPCError } from '@trpc/server'

// edit patient data
export default authenticatedProcedure
  .input(patientSchema)
  .mutation(async ({ input: updatedPatientData, ctx: { authUser, db } }) => {
    // Checks if the authenticated user has the required role and permissions
    const userPermissions = authUser.permissions || []
    const userRole = authUser.role || ''

    // Checks if the user has the required permission to edit a patient
    const canEditPatient =
      userRole === 'dentist' || userPermissions.includes('VIEW_ALL_SCHEDULES')

    if (!authUser || !canEditPatient) {
      throw new TRPCError({
        code: 'FORBIDDEN',
        message:
          'Permission denied. You do not have the required role or permissions to edit a patient.',
      })
    }

    // Fetches the existing patient from the database
    const existingPatient = await db.getRepository(Patient).findOne({
      where: { patientId: updatedPatientData.patientId },
    })

    if (!existingPatient) {
      throw new TRPCError({
        code: 'NOT_FOUND',
        message: 'Patient not found.',
      })
    }

    // Updates the existing patient with the new data
    const updatedPatient = db
      .getRepository(Patient)
      .merge(existingPatient, updatedPatientData)

    // Saves the updated patient to the database
    const patientEdited = await db.getRepository(Patient).save(updatedPatient)

    return patientEdited
  })
