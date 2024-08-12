# GymCheck

### Functional Requirements

**Users:**

- Users should be able to create an account;
- Users should be able to authenticate;
- Users should be able to get list of all check-ins;
- Users should be able to search for gyms based on their current location;
- Users should be able to search for a gym by name;
- Users should be able to check in to a specific gym;

**App:**

- The app should be able to retrieve a logged in user's profile information;
- The app should be able to calculate and retrieve the total number of check-ins for a logged-in user;
- The app should be able to verify the validity of a user's check-in;
- The app should be able to register a new gym;

### Business Requirements

- The app should prevent the registration of duplicate email addresses;
- Users should not be able to check-in more than once per day;
- Users should only be able to check-in at a gym if ther location is within 100 meters of the gym;
- Check-in should be validated within 20 minutes of creation;
- Check-in should be validated by an administrator;
- A gym should be registered by an administrator;

### Non-Functional Requirements

- User passwords should be stored using strong cryptographic hash algorithms;
- All data should be persisted to a PostgresSQL database;
- Lists of data should be returned with a default page size of 20 items;
- User authentication should be implemented using JWT (JSON Web Token);
