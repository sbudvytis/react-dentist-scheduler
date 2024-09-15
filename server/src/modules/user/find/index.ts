import { User, type UserBare } from '@server/entities/user'
import { authenticatedProcedure } from '@server/trpc/authenticatedProcedure'

export default authenticatedProcedure.query(
  async ({ ctx: { authUser, db } }) => {
    const userPermissions = authUser.permissions || []
    const canViewAllUsers = userPermissions.includes('APPROVE_USERS')

    let users: UserBare[] = []

    if (canViewAllUsers) {
      // Retrieve all users, both approved and unapproved
      users = (await db.getRepository(User).find()) as UserBare[]
    } else {
      // Retrieve only unapproved users
      users = (await db
        .getRepository(User)
        .find({ where: { isApproved: false } })) as UserBare[]
    }

    return users
  }
)
