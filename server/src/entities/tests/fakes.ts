import type { User } from '@server/entities/user'
import type { Schedule } from '@server/entities/schedule'
import type { Patient } from '@server/entities/patient'
import type { Appointment } from '@server/entities/appointment'
import { random } from '@tests/utils/random'

const randomId = () => random.integer({ min: 1, max: 2147483647 })

/**
 * Generates a fake project with some default test data.
 * @param overrides Any properties that should be different from default fake data.
 */
export const fakeClinic = () => ({
  clinicId: randomId(),
  name: 'Doe Clinic',
  address: '123 Main St',
  contactNumber: '1234567890',
})

/**
 * Generates a fake user with some default test data.
 * @param overrides Any properties that should be different from default fake data.
 */
export const fakeUser = <T extends Partial<User>>(overrides: T = {} as T) => ({
  id: randomId(),
  clinicId: randomId(),
  email: random.email(),
  firstName: 'John',
  lastName: 'Doe',
  password: 'Password.123!',
  role: 'dentist',
  permissions: ['VIEW_APPOINTMENTS'],
  isApproved: true,
  ...overrides,
})

/**
 * Generates a fake user with some default test data.
 * @param overrides Any properties that should be different from default fake data.
 */
export const fakeUserSignUp = <T extends Partial<User>>(
  overrides: T = {} as T
) => ({
  id: randomId(),
  clinicId: randomId(),
  email: random.email(),
  firstName: 'John',
  lastName: 'Doe',
  password: 'Password.123!',
  role: 'admin',
  permissions: ['VIEW_APPOINTMENTS'],
  isApproved: true,
  ...overrides,
})

/**
 * Generates a fake project with some default test data.
 * @param overrides Any properties that should be different from default fake data.
 */
export const fakeSchedule = <T extends Partial<Schedule>>(
  overrides: T = {} as T
) => ({
  scheduleId: randomId(),
  userId: randomId(),
  clinicId: randomId(),
  slotMinTime: '08:00:00:00',
  slotMaxTime: '17:00:00:00',
  weekends: true,
  view: 'timeGridWeek',
  ...overrides,
})

/**
 * Generates a fake project with some default test data.
 * @param overrides Any properties that should be different from default fake data.
 */
export const fakePatient = <T extends Partial<Patient>>(
  overrides: T = {} as T
) => ({
  patientId: randomId(),
  clinicId: randomId(),
  firstName: 'John',
  lastName: 'Doe',
  contactNumber: '1234567890',
  ...overrides,
})

/**
 * Generates a fake project with some default test data.
 * @param overrides Any properties that should be different from default fake data.
 */
export const fakeAppointment = <T extends Partial<Appointment>>(
  overrides: T = {} as T
) => ({
  id: 1,
  userId: randomId(),
  patientId: randomId(),
  clinicId: 1,
  scheduleId: 1,
  title: 'Checkup',
  start: new Date('2099-06-27 09:57:55'),
  end: new Date('2099-06-27 10:57:55'),
  notes: 'checkup',
  email: 'john@doe.com',
  ...overrides,
})
