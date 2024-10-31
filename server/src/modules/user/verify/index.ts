import bcrypt from 'bcrypt'
import { publicProcedure } from '@server/trpc'
import { TRPCError } from '@trpc/server'
import { User } from '@server/entities'
import config from '@server/config'
import { MoreThan } from 'typeorm'
import { z } from 'zod'

export default publicProcedure
  .input(z.object({ token: z.string(), password: z.string() }))
  .mutation(async ({ input: { token, password }, ctx: { db } }) => {
    // Find user by setup token and ensure it hasn't expired
    const user = await db.getRepository(User).findOne({
      where: { setupToken: token, setupTokenExpiresAt: MoreThan(new Date()) },
    })

    if (!user) {
      throw new TRPCError({
        code: 'BAD_REQUEST',
        message: 'Invalid or expired token',
      })
    }

    // Hash the new password
    const hashedPassword = await bcrypt.hash(password, config.auth.passwordCost)

    // Update user details
    user.password = hashedPassword
    user.setupToken = null
    user.setupTokenExpiresAt = null
    user.isApproved = true

    // Save the updated user to the database
    await db.getRepository(User).save(user)

    return { success: true }
  })
