import { validates } from '@server/utils/validation'
import {
  Column,
  Entity,
  JoinColumn,
  ManyToOne,
  PrimaryGeneratedColumn,
} from 'typeorm'
import { z } from 'zod'
import { Schedule } from './schedule'

@Entity()
export class BlockedPeriod {
  @PrimaryGeneratedColumn('increment')
  id: number

  @Column('date')
  startDate: string

  @Column('date')
  endDate: string

  @Column('text')
  reason: string

  @ManyToOne(() => Schedule, (schedule) => schedule.blockedPeriods)
  @JoinColumn({ name: 'schedule_id' })
  schedule: Schedule
}
export type BlockedPeriodBare = Omit<BlockedPeriod, 'schedule'>

export const BlockedPeriodSchema = validates<BlockedPeriodBare>().with({
  id: z.number(),
  startDate: z.string(),
  endDate: z.string(),
  reason: z.string(),
})
