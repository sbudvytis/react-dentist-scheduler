import { validates } from '@server/utils/validation'
import {
  Column,
  Entity,
  JoinColumn,
  ManyToOne,
  OneToMany,
  PrimaryGeneratedColumn,
} from 'typeorm'
import { z } from 'zod'
import { User } from './user'
import { Appointment } from './appointment'
import { Clinic } from './clinic'

@Entity()
export class Schedule {
  @PrimaryGeneratedColumn('increment')
  scheduleId: number

  @Column('integer')
  userId: number

  @ManyToOne(() => User, (user) => user.appointments)
  @JoinColumn()
  user: User

  @ManyToOne(() => Clinic, (clinic) => clinic.schedules)
  @JoinColumn({ name: 'clinic_id' })
  clinic: Clinic

  @OneToMany(() => Appointment, (appointment) => appointment.schedule, {
    cascade: ['insert'],
  })
  appointments: Appointment[]

  @Column('text')
  view: string

  @Column('boolean')
  weekends: boolean

  @Column('text', { array: true, default: [], nullable: true })
  blockedDays: string[] | null

  @Column('text', { nullable: true })
  slotMinTime: string

  @Column('text', { nullable: true })
  slotMaxTime: string
}

export type ScheduleBare = Omit<Schedule, 'user' | 'appointments' | 'clinic'>
export type ScheduleWithUser = ScheduleBare & { user: User }

export const scheduleSchema = validates<ScheduleBare>().with({
  scheduleId: z.number().int().positive(),
  userId: z.number().int().positive(),
  view: z.string(),
  weekends: z.boolean(),
  blockedDays: z.array(z.string()).nullable(),
  slotMinTime: z.string(),
  slotMaxTime: z.string(),
})

export const scheduleInsertSchema = scheduleSchema.omit({ scheduleId: true })

export type ScheduleInsert = z.infer<typeof scheduleInsertSchema>
