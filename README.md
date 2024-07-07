## Dentist scheduler application

<p align="center">
<img src="">
</p>

This is a scheduler application designed for dentists to manage their time, appointments and schedules. Potential users are dental clinics
where dentists and staff members work together to manage their appointments and patient data. Users can sign up and choose a role,
which includes different permissions. Upon signing up, the very first user with `Id 1` also gets permission to approve other users.

## Features

- Users can create an account and choose a role (dentist or staff).
- Every other user apart from the very first must wait for approval, that way we prevent outside users to reach the application.
- Each role has different permissions.
  - Dentist role can:
    - Create and manage their own schedules.
    - Create and manage their own appointments.
  - Staff role can:
    - Can see all the schedules created by dentists.
    - Can select which schedule interact to.
    - Can create and manage appointments to a specific dentist.
  - Staff role do not have permission to:
    - Create and manage schedules.
- When appointment is created, users can see all of the info at glance (patient data, appointment data).
- If appointment created successfully, patient will get an email with appointment details.

## Setup

1. Clone the repository or download the source code files:

```bash
git clone https://github.com/TuringCollegeSubmissions/sbudvy-WD.4B.4.4.git
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
