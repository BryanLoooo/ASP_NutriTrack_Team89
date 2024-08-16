# ASP_NutriTrack_Team89

## Getting Started

This project uses Expo for development. To run the project, please use the following command:

```
npm expo run
```

### Important Note

Please use `npm expo run` instead of other commands like `npm start` or `expo start`. This ensures that the project runs correctly with all necessary configurations as Firebase's User Authentication only works in a development build/native environment. If you wish to run the command `npm expo run`, you will need to set this up by configuring an AVD (Android Virtual Device), which can be done by downloading Android Studio and installing the neccessary SDK and tools. If you do not wish to go through this process, just **comment out the login and sign up pages in App.js**.

## Prerequisites

Make sure you have the following installed:
- Node.js
- npm (Node Package Manager)
- Expo CLI

## Installation

1. Clone the repository
2. Navigate to the project directory
3. Install dependencies:
   ```
   npm install
   ```

## Running the Project

To start the project, run:

```
npm expo run
```

This will start the Expo development server and provide you with options to run the app on various platforms (iOS simulator, Android emulator, or web).

## Testing Login

To test the login functionality, you can use the following credentials:

- Email: test@gmail.com
- Password: 123456

Alternatively, you can create a new account entirely.
