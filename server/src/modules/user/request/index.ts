import { TRPCError } from '@trpc/server'
import { publicProcedure } from '@server/trpc'
import { User } from '@server/entities'
import { sendPasswordSetupEmail } from '@server/services/email'
import logger from '@server/logger'
import config from '@server/config'
import { v4 as uuidv4 } from 'uuid'
import { z } from 'zod'

export default publicProcedure
  .input(
    z.object({
      email: z.string().email(),
    })
  )
  .mutation(async ({ input: { email }, ctx: { db } }) => {
    // Find the user with the provided email
    const user = await db.getRepository(User).findOne({ where: { email } })

    if (!user) {
      throw new TRPCError({
        code: 'NOT_FOUND',
        message: 'User not found',
      })
    }

    // Generate a new setup token and set the expiration (24 hours)
    const setupToken = uuidv4()
    const setupTokenExpiresAt = new Date(Date.now() + 1000 * 60 * 60 * 24) // 24 hours expiration

    try {
      // Update user with new token and expiration
      user.setupToken = setupToken
      user.setupTokenExpiresAt = setupTokenExpiresAt
      await db.getRepository(User).save(user)

      // Create the setup link
      const setupLink = `${
        config.clientUrl
      }/set-password/${setupToken}?email=${encodeURIComponent(email)}`

      // Send the new setup link via email
      sendPasswordSetupEmail(user.email, setupLink).catch((error) => {
        logger.error('Error sending email:', error)
      })

      return {
        success: true,
        message: 'A new setup link has been sent to your email.',
      }
    } catch (error) {
      if (!(error instanceof Error)) {
        throw error
      }

      throw new TRPCError({
        code: 'INTERNAL_SERVER_ERROR',
        message: 'An error occurred while generating a new setup link.',
      })
    }
  })
