import { validates } from '@server/utils/validation'
import {
  Column,
  Entity,
  JoinColumn,
  ManyToOne,
  PrimaryGeneratedColumn,
} from 'typeorm'
import { z } from 'zod'
import {
  Patient,
  patientInsertSchema,
  patientSchema,
  type PatientBare,
} from './patient'
import { User } from './user'
import { Schedule } from './schedule'
import { Clinic } from './clinic'

@Entity()
export class Appointment {
  @PrimaryGeneratedColumn('increment')
  id: number

  @Column('integer')
  userId: number

  @ManyToOne(() => User, (user) => user.appointments)
  @JoinColumn()
  user: User

  @ManyToOne(() => Patient, (patient) => patient.appointments)
  @JoinColumn({ name: 'patient_id' })
  patient: Patient

  @ManyToOne(() => Schedule, (schedule) => schedule.appointments)
  @JoinColumn({ name: 'schedule_id' })
  schedule: Schedule

  @ManyToOne(() => Clinic, (clinic) => clinic.appointments)
  @JoinColumn({ name: 'clinic_id' })
  clinic: Clinic

  @Column('text')
  title: string

  @Column('timestamp')
  start: Date

  @Column('timestamp')
  end: Date

  @Column('text', { nullable: true })
  notes: string

  @Column('text')
  email: string
}

export type AppointmentBare = Omit<
  Appointment,
  'user' | 'patient' | 'schedule' | 'clinic'
> & {
  patient?: PatientBare
}

export const appointmentSchema = validates<AppointmentBare>().with({
  id: z.number().int().positive(),
  userId: z.number().int().positive(),
  title: z.string().trim().min(2).max(50),
  start: z.date(),
  end: z.date(),
  notes: z.string().trim().min(2).max(100),
  email: z.string().trim().toLowerCase().email(),
  patient: patientSchema.optional(),
})

export const appointmentInsertSchema = appointmentSchema
  .omit({
    id: true,
  })
  .extend({
    patient: patientInsertSchema,
    scheduleId: z.number().int().positive().nullable(),
  })

export type AppointmentInsert = z.infer<typeof appointmentInsertSchema>
