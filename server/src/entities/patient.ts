import { validates } from '@server/utils/validation'
import { Column, Entity, OneToMany, PrimaryGeneratedColumn } from 'typeorm'
import { z } from 'zod'
import { Appointment } from './appointment'

@Entity()
export class Patient {
  @PrimaryGeneratedColumn('increment')
  patientId: number

  @Column('text')
  firstName: string

  @Column('text')
  lastName: string

  @Column('text')
  contactNumber: string

  @OneToMany(() => Appointment, (appointment) => appointment.patient, {
    cascade: ['insert'],
  })
  appointments: Appointment[]
}

export type PatientBare = Omit<Patient, 'appointments'>

export const patientSchema = validates<PatientBare>().with({
  patientId: z.number().int().positive(),
  firstName: z.string().trim().min(2).max(100),
  lastName: z.string().trim().min(2).max(100),
  contactNumber: z.string().trim().min(2).max(100),
})

export const patientInsertSchema = patientSchema.omit({ patientId: true })

export type PatientInsert = z.infer<typeof patientInsertSchema>
