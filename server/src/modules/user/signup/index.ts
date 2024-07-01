import bcrypt from 'bcrypt'
import { publicProcedure } from '@server/trpc'
import { User } from '@server/entities'
import config from '@server/config'
import { userSchema } from '@server/entities/user'
import { TRPCError } from '@trpc/server'

export default publicProcedure
  .input(
    userSchema.pick({
      email: true,
      password: true,
      firstName: true,
      lastName: true,
      role: true,
    })
  )
  .mutation(
    async ({
      input: { email, password, role, firstName, lastName },
      ctx: { db },
    }) => {
      const hash = await bcrypt.hash(password, config.auth.passwordCost)

      let defaultPermissions: string[] = []

      if (role === 'staff') {
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
        const isFirstUser = (await db.getRepository(User).count()) === 0

        const user = await db.getRepository(User).save({
          email,
          password: hash,
          role,
          firstName,
          lastName,
          permissions: isFirstUser
            ? [...defaultPermissions, 'APPROVE_USERS']
            : defaultPermissions,
          isApproved: isFirstUser,
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
