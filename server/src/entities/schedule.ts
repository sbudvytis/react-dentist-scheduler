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

@Entity()
export class Schedule {
  @PrimaryGeneratedColumn('increment')
  scheduleId: number

  @Column('integer')
  userId: number

  @ManyToOne(() => User, (user) => user.appointments)
  @JoinColumn()
  user: User

  @OneToMany(() => Appointment, (appointment) => appointment.schedule, {
    cascade: ['insert'],
  })
  appointments: Appointment[]

  @Column('text')
  view: string

  @Column('boolean')
  weekends: boolean

  @Column('text', { nullable: true })
  slotMinTime?: string

  @Column('text', { nullable: true })
  slotMaxTime?: string
}

export type ScheduleBare = Omit<Schedule, 'user' | 'appointments'>
export type ScheduleWithUser = ScheduleBare & { user: User }

export const scheduleSchema = validates<ScheduleBare>().with({
  scheduleId: z.number().int().positive(),
  userId: z.number().int().positive(),
  view: z.string(),
  weekends: z.boolean(),
  slotMinTime: z.string().optional(),
  slotMaxTime: z.string().optional(),
})

export const scheduleInsertSchema = scheduleSchema.omit({ scheduleId: true })

export type ScheduleInsert = z.infer<typeof scheduleInsertSchema>
