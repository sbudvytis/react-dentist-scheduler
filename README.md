## Dentist scheduler application

<p align="center">
<img src="https://github.com/sbudvytis/react-dentist-scheduler/blob/main/client/src/assets/preview.png">
</p>

This is a scheduler application designed for dentists to manage their time, appointments, and schedules. The primary users are dental clinics where dentists and staff members collaborate to manage appointments and patient data. Dental clinics can sign up and manage their clinic data, including users (dentists and receptionists), patients, schedules, appointments, and more.

When a new clinic signs up, the first user in that clinic is granted super admin permissions, allowing them to add new users to their clinic.

## Features

- Dental clinics can create a new account, and their data will be kept separate from other clinics using the same dentist scheduler system.
- The first user created upon clinic sign-up is granted permission to add users to their system. The new users receive an email with a link to create their password. Users can have two different roles: dentist and receptionist.
- Each role has distinct permissions:
  - Dentist role can:
    - Create and manage their own schedules.
    - Create and manage their own appointments.
    - Mark/unmark disabled days (e.g., holidays, sick days).
  - Receptionist role can:
    - View all schedules created by dentists.
    - Select and interact with specific schedules.
    - Create and manage appointments for specific dentists.
    - View all patients in the system and their appointment history.
  - Receptionist role restrictions:
    - Cannot create or manage schedules.
- When an appointment is created, users can view all relevant information at a glance (patient details, appointment details).
- Upon successful appointment creation, the patient receives an email with the appointment details.

## Setup

1. Clone the repository or download the source code files:

```bash
git clone https://github.com/sbudvytis/react-dentist-scheduler.git
```

2. Install all the packages:

```bash
npm install
```

3. Since it is a monorepo project with a full back-end, you must create a database named `react-bookings`.

4. Setup `.env` files in `client` and `server` based on `.env.example` files.

## Running the server

In development mode:

```bash
npm run dev
```

In production mode:

```bash
npm run build
```

## Running the client

In development mode:

```bash
npm run dev
```

In production mode:

```bash
npm run build
```

```bash
npm run preview
```

## Tests

```bash

# front end unit tests
npm run test:watch -w client


# back end tests with an in-memory database
npm test -w server
```

## Auto email send

If you want to test this feature, where user can send an automated email when appointment created, you must provide your email credentials:

```bash
host: 'your email provider',
port: port (usualy 465),
auth: {
  user: email address (from .env file),
  pass: password (from .env file),
}
```
