import { User, type UserBare } from '@server/entities/user'
import { authenticatedProcedure } from '@server/trpc/authenticatedProcedure'

export default authenticatedProcedure.query(
  async ({ ctx: { db, authUser } }) => {
    const userPermissions = authUser.permissions || []
    const canViewAllUsers = userPermissions.includes('APPROVE_USERS')

    const userRepository = db.getRepository(User)

    // Start the query by joining the clinic table to filter by clinicId
    let query = userRepository
      .createQueryBuilder('user')
      .leftJoinAndSelect('user.clinic', 'clinic')
      .where('clinic.clinicId = :clinicId', { clinicId: authUser.clinicId })

    if (!canViewAllUsers) {
      // If the user cannot view all users, only retrieve unapproved users
      query = query.andWhere('user.isApproved = :isApproved', {
        isApproved: false,
      })
    }

    // Execute the query to get users for the specific clinic
    const users = (await query.getMany()) as UserBare[]

    return users
  }
)
