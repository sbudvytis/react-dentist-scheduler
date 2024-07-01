import { validates } from '@server/utils/validation'
import {
  Column,
  Entity,
  OneToMany,
  PrimaryGeneratedColumn,
  Unique,
} from 'typeorm'
import { z } from 'zod'
import { Appointment } from './appointment'

@Entity()
export class User {
  @PrimaryGeneratedColumn('increment')
  id: number

  @Unique(['email'])
  @Column('text')
  email: string

  @Column('text')
  firstName: string

  @Column('text')
  lastName: string

  @Column('text', { select: false })
  password: string

  @Column('boolean', { default: false })
  isApproved: boolean

  @Column('text')
  role: string

  @Column('text', { array: true, default: [] })
  permissions: string[]

  @OneToMany(() => Appointment, (appointment) => appointment.user, {
    cascade: ['insert'],
  })
  appointments: Appointment[]
}

export type UserBare = Omit<User, 'appointments'>

export const userSchema = validates<UserBare>().with({
  id: z.number().int().positive(),
  email: z.string().trim().toLowerCase().email(),
  firstName: z.string().min(1).max(64),
  lastName: z.string().min(1).max(64),
  password: z
    .string()
    .min(8, 'Password must contain at least 8 characters')
    .max(64),
  isApproved: z.boolean(),
  role: z.string().min(1).max(64),
  permissions: z.array(z.string().min(1).max(64)),
})

export const userInsertSchema = userSchema.omit({ id: true })

export type UserInsert = z.infer<typeof userInsertSchema>

export type AuthUser = Pick<
  User,
  'id' | 'role' | 'permissions' | 'firstName' | 'lastName' | 'email'
>

export const authUserSchema = validates<AuthUser>().with({
  id: z.number().int().positive(),
  role: z.string().min(1).max(64),
  permissions: z.array(z.string().min(1).max(64)),
  firstName: z.string().min(1).max(64),
  lastName: z.string().min(1).max(64),
  email: z.string().trim().toLowerCase().email(),
})
