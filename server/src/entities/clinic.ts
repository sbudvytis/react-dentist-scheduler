import { validates } from '@server/utils/validation'
import { Column, Entity, OneToMany, PrimaryGeneratedColumn } from 'typeorm'
import { z } from 'zod'
import { User } from './user'
import { Schedule } from './schedule'
import { Patient } from './patient'
import { Appointment } from './appointment'

@Entity()
export class Clinic {
  @PrimaryGeneratedColumn('increment')
  clinicId: number

  @Column('text')
  name: string

  @Column('text', { nullable: true })
  address: string

  @Column('text', { nullable: true })
  contactNumber: string

  @OneToMany(() => User, (user) => user.clinic)
  users: User[]

  @OneToMany(() => Schedule, (schedule) => schedule.clinic)
  schedules: Schedule[]

  @OneToMany(() => Patient, (patient) => patient.clinic)
  patients: Patient[]

  @OneToMany(() => Appointment, (appointment) => appointment.clinic)
  appointments: Appointment[]
}

export type ClinicBare = Omit<
  Clinic,
  'appointments' | 'users' | 'schedules' | 'patients'
>

export const clinicSchema = validates<ClinicBare>().with({
  clinicId: z.number().int().positive(),
  name: z.string().trim().min(2).max(100),
  address: z.string().trim().min(2).max(100),
  contactNumber: z.string().trim().min(2).max(100),
})

export const clinicInsertSchema = clinicSchema.omit({ clinicId: true })

export type ClinicInsert = z.infer<typeof clinicInsertSchema>
