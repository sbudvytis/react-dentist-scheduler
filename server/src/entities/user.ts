import { validates } from '@server/utils/validation'
import {
  Column,
  Entity,
  JoinColumn,
  ManyToOne,
  OneToMany,
  PrimaryGeneratedColumn,
  Unique,
} from 'typeorm'
import { z } from 'zod'
import { Appointment } from './appointment'
import { Clinic } from './clinic'

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

  @Column('text', { select: false, nullable: true })
  password: string | null

  @Column('boolean', { default: false })
  isApproved: boolean

  @Column('text')
  role: string

  @Column('text', { nullable: true })
  setupToken: string | null

  @Column({ type: 'timestamp', nullable: true })
  setupTokenExpiresAt: Date | null

  @Column('text', { array: true, default: [] })
  permissions: string[]

  @ManyToOne(() => Clinic, (clinic) => clinic.users)
  @JoinColumn({ name: 'clinic_id' })
  clinic: Clinic

  @OneToMany(() => Appointment, (appointment) => appointment.user, {
    cascade: ['insert'],
  })
  appointments: Appointment[]
}

export type UserBare = Omit<User, 'appointments' | 'clinic'>

export const userSchema = validates<UserBare>().with({
  id: z.number().int().positive(),
  email: z.string().trim().toLowerCase().email(),
  firstName: z.string().min(1).max(64),
  lastName: z.string().min(1).max(64),
  password: z
    .string()
    .min(8, 'Password must contain at least 8 characters')
    .max(64)
    .nullable(), // Use nullable instead of optional
  isApproved: z.boolean(),
  role: z.string().min(1).max(64),
  setupToken: z.string().nullable(),
  setupTokenExpiresAt: z.date().nullable(),
  permissions: z.array(z.string().min(1).max(64)),
})

export const userInsertSchema = userSchema.omit({ id: true })

export type UserInsert = z.infer<typeof userInsertSchema>

export type AuthUser = Pick<
  User,
  'id' | 'role' | 'permissions' | 'firstName' | 'lastName' | 'email'
> & {
  clinicId: number
}

export const authUserSchema = validates<AuthUser>().with({
  id: z.number().int().positive(),
  role: z.string().min(1).max(64),
  permissions: z.array(z.string().min(1).max(64)),
  firstName: z.string().min(1).max(64),
  lastName: z.string().min(1).max(64),
  email: z.string().trim().toLowerCase().email(),
  clinicId: z.number().int().positive(),
})
