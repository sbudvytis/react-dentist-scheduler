## Dentist scheduler application

<p align="center">
<img src="https://github.com/sbudvytis/booking-project/blob/master/client/src/assets/preview.png">
</p>

This is a scheduler application designed for dentists to manage their time, appointments and schedules. Potential users are dental clinics
where dentists and staff members work together to manage their appointments and patient data. Users can sign up and choose a role,
which includes different permissions. Upon signing up, the very first user with `Id 1` also gets permission to approve users.

## Features

- Users can create an account and choose a role (dentist or staff).
- Every other user apart from the very first must wait for approval, that way we prevent outside users to reach the application.
- Each role has different permissions.
  - Dentist role can:
    - Create and manage their own schedules.
    - Create and manage their own appointments.
    - View previous schedules with their appointments.
  - Staff role can:
    - Can see all the schedules created by dentists.
    - Can select which schedule interact to.
    - Can create and manage appointments to a specific dentist.
  - Staff role do not have permission to:
    - Create and manage schedules.
    - Approve other users.
- When appointment is created, users can see all of the info at glance (patient data, appointment data).
- If appointment created successfully, patient will get an email with appointment details.
- Schedule ends the day after last day of schedule. Then, user can create a new schedule and old schedule
  appears in `View previous schedules` section.

## Setup

1. Clone the repository or download the source code files:

```bash
git clone https://github.com/TuringCollegeSubmissions/sbudvy-BE.4.4.git
```

2. Install all the packages:

```bash
npm install
```

3. This project uses postgreSQL database, so you must create one named `bookings`.

4. Setup `.env` files in `client` and `server` based on `.env.example` files.

## Running the server

In development mode:

```bash
npm run dev
```

## Running the client

In development mode:

```bash
npm run dev
```

## Tests

```bash

# front end unit tests
npm run test:unit -w client

# front end E2E tests
npm run test:e2e -w client

# back end tests with an in-memory database (database must have a user with id 1, email: dentist@fake.com and password: 12345678)
npm test -w server
```

## Auto email send

If you want to test this feature, where user can send an automated email when appointment created, you must provide your email credentials:

```bash
host: 'your email provider',
port: port (usualy 465),
auth: {
  user: email address,
  pass: password,
}
```

## Deployed application

You can visit this web application by going to the link <https://dentist-scheduler.p779ahj5b93b6.eu-central-1.cs.amazonlightsail.com/>

Login with a test user (so you could approve your user) using these credentials:

```bash
email address: dentist@fake.com
password: 12345678
```

## Personal repo

You can see all commit history, actions and pipelines of this project on my personal repo

```bash
https://github.com/sbudvytis/booking-project.git
```
