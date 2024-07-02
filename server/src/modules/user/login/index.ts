import bcrypt from 'bcrypt'
import config from '@server/config'
import jsonwebtoken from 'jsonwebtoken'
import logger from '@server/logger'
import { publicProcedure } from '@server/trpc'
import { User } from '@server/entities'
import { TRPCError } from '@trpc/server'
import { userSchema } from '@server/entities/user'
import { prepareTokenPayload } from '../tokenPayload'

const { expiresIn, tokenKey } = config.auth

export default publicProcedure
  .input(
    userSchema.pick({
      email: true,
      password: true,
    })
  )
  .mutation(async ({ input: { email, password }, ctx: { db } }) => {
    const user = (await db.getRepository(User).findOne({
      select: {
        id: true,
        password: true,
        role: true,
        permissions: true,
        isApproved: true,
        firstName: true,
        lastName: true,
        email: true,
      },
      where: {
        email,
      },
    })) as
      | Pick<
          User,
          | 'id'
          | 'password'
          | 'role'
          | 'permissions'
          | 'isApproved'
          | 'firstName'
          | 'lastName'
          | 'email'
        >
      | undefined

    if (!user) {
      logger.error('Could not find user with email %s', email)
      throw new TRPCError({
        code: 'UNAUTHORIZED',
        message: 'Incorrect email or password. Try again.',
      })
    }

    if (!user.isApproved) {
      logger.error('User %s is not approved', email)
      throw new TRPCError({
        code: 'UNAUTHORIZED',
        message: 'Your account is pending approval',
      })
    }

    const passwordMatch = await bcrypt.compare(password, user.password)

    if (!passwordMatch) {
      logger.error('Incorrect password for user %s', email)
      throw new TRPCError({
        code: 'UNAUTHORIZED',
        message: 'Incorrect email or password. Try again.',
      })
    }

    const payload = prepareTokenPayload({
      id: user.id,
      role: user.role,
      permissions: user.permissions,
      email: user.email,
      firstName: user.firstName,
      lastName: user.lastName,
    })

    const accessToken = jsonwebtoken.sign(payload, tokenKey, {
      expiresIn,
    })

    return {
      accessToken,
      userRole: user.role,
      userPermissions: user.permissions,
      userFirstName: user.firstName,
      userLastName: user.lastName,
      userEmail: user.email,
    }
  })
