import type { AuthUser } from '@server/entities/user'
import z from 'zod'

const tokenPayloadSchema = z.object({
  user: z.object({
    id: z.number(),
    role: z.string(),
    permissions: z.array(z.string()),
    firstName: z.string(),
    lastName: z.string(),
    email: z.string().email(),
    clinicId: z.number(),
  }),
})

type TokenPayload = z.infer<typeof tokenPayloadSchema>

/**
 * Prepares the token payload for the given user.
 * @param user The authenticated user.
 * @returns The token payload containing the user information.
 */
export function prepareTokenPayload(user: AuthUser): TokenPayload {
  return tokenPayloadSchema.parse({ user })
}

/**
 * Parses the payload of a verified JWT token.
 * @param tokenVerified - The verified JWT token.
 * @returns The parsed token payload.
 */
export function parseTokenPayload(tokenVerified: unknown): TokenPayload {
  return tokenPayloadSchema.parse(tokenVerified)
}
