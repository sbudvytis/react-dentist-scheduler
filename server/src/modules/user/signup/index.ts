import bcrypt from 'bcrypt'
import { publicProcedure } from '@server/trpc'
import { User, Clinic } from '@server/entities'
import config from '@server/config'
import { userSchema } from '@server/entities/user'
import { TRPCError } from '@trpc/server'
import { z } from 'zod'

// Define a schema for the clinic input
const clinicSchema = z.object({
  name: z.string().min(1).max(100),
  address: z.string().optional(),
  contactNumber: z.string().optional(),
})

// Extend the user schema to include clinic information
const signupSchema = userSchema
  .pick({
    email: true,
    password: true,
    firstName: true,
    lastName: true,
    role: true,
  })
  .extend({
    clinic: clinicSchema,
  })

export default publicProcedure
  .input(signupSchema)
  .mutation(
    async ({
      input: { email, password, role, firstName, lastName, clinic },
      ctx: { db },
    }) => {
      let hash: string | null = null
      if (password) {
        hash = await bcrypt.hash(password, config.auth.passwordCost)
      }

      let defaultPermissions: string[] = []

      if (role === 'admin') {
        defaultPermissions = [
          'VIEW_APPOINTMENTS',
          'MANAGE_APPOINTMENTS',
          'VIEW_SCHEDULE',
          'MANAGE_SCHEDULE',
          'VIEW_ALL_SCHEDULES',
        ]
      }

      try {
        // Create the clinic
        const newClinic = await db.getRepository(Clinic).save({
          name: clinic.name,
          address: clinic.address,
          contactNumber: clinic.contactNumber,
        })

        // Create the user and associate with the clinic
        const user = await db.getRepository(User).save({
          email,
          password: hash,
          role,
          firstName,
          lastName,
          clinic: newClinic,
          permissions: [...defaultPermissions, 'APPROVE_USERS'],
          isApproved: true,
        })

        return {
          id: user.id,
          email: user.email,
          role: user.role,
          firstName: user.firstName,
          lastName: user.lastName,
          permissions: user.permissions,
          clinic: {
            id: newClinic.clinicId,
            name: newClinic.name,
          },
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
