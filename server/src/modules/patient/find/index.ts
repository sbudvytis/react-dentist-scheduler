import { Patient, type PatientBare } from '@server/entities/patient'
import { authenticatedProcedure } from '@server/trpc/authenticatedProcedure'

export default authenticatedProcedure.query(
  async ({ ctx: { authUser, db } }) => {
    const userPermissions = authUser.permissions || []
    const userRole = authUser.role || ''
    const canViewAllPatients = userPermissions.includes('VIEW_ALL_SCHEDULES')

    let patients: PatientBare[] = []

    if (canViewAllPatients) {
      patients = (await db.getRepository(Patient).find({
        order: { patientId: 'DESC' },
      })) as PatientBare[]
    } else if (userRole === 'dentist') {
      patients = (await db.getRepository(Patient).find({
        order: { patientId: 'DESC' },
      })) as PatientBare[]
    }
    return patients
  }
)
