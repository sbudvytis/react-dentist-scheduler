import { v4 as uuidv4 } from 'uuid'
import { authenticatedProcedure } from '@server/trpc/authenticatedProcedure'
import { TRPCError } from '@trpc/server'
import { User } from '@server/entities'
import { userSchema } from '@server/entities/user'
import { sendPasswordSetupEmail } from '@server/services/email'
import logger from '@server/logger'
import config from '@server/config'

const addUserSchema = userSchema.pick({
  email: true,
  firstName: true,
  lastName: true,
  role: true,
})

export default authenticatedProcedure
  .input(addUserSchema)
  .mutation(
    async ({
      input: { email, role, firstName, lastName },
      ctx: { authUser, db },
    }) => {
      if (!authUser || authUser.role !== 'admin') {
        throw new TRPCError({
          code: 'FORBIDDEN',
          message: 'Permission denied. Only admins can add users.',
        })
      }

      // Check if a user with the same email already exists
      const existingUser = await db
        .getRepository(User)
        .findOne({ where: { email } })
      if (existingUser) {
        throw new TRPCError({
          code: 'BAD_REQUEST',
          message: 'User with this email already exists',
        })
      }

      let defaultPermissions: string[] = []

      if (role === 'receptionist') {
        defaultPermissions = [
          'VIEW_APPOINTMENTS',
          'MANAGE_APPOINTMENTS',
          'VIEW_ALL_SCHEDULES',
        ]
      } else if (role === 'dentist') {
        defaultPermissions = [
          'VIEW_APPOINTMENTS',
          'MANAGE_APPOINTMENTS',
          'VIEW_SCHEDULE',
          'MANAGE_SCHEDULE',
        ]
      }

      try {
        const setupToken = uuidv4() // Generates unique token
        const setupTokenExpiresAt = new Date(Date.now() + 1000 * 60 * 60 * 24) // Token expires in 24 hours

        // Create the user and associate with the admin's clinic, setting isApproved to false
        const user = await db.getRepository(User).save({
          email,
          role,
          firstName,
          lastName,
          clinic: { clinicId: authUser.clinicId },
          permissions: defaultPermissions,
          isApproved: false,
          setupToken,
          setupTokenExpiresAt,
        })

        // Sends password setup email in the background
        const setupLink = `${
          config.clientUrl
        }/set-password/${setupToken}?email=${encodeURIComponent(email)}`
        sendPasswordSetupEmail(user.email, setupLink).catch((error) => {
          logger.error('Error sending email:', error)
        })

        return {
          id: user.id,
          email: user.email,
          role: user.role,
          firstName: user.firstName,
          lastName: user.lastName,
          permissions: user.permissions,
        }
      } catch (error) {
        if (!(error instanceof Error)) {
          throw error
        }

        if (error.message.includes('duplicate key')) {
          throw new TRPCError({
            code: 'BAD_REQUEST',
            message: 'User with this email already exists',
          })
        }

        throw error
      }
    }
  )
