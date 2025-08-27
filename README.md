# AI-Powered Mental Health App

This is a code bundle for AI-Powered Mental Health App. The original project is available at https://www.figma.com/design/0anmaU48uP4XvfQw1Vy4li/AI-Powered-Mental-Health-App.

## Project Overview

This is an AI-powered mental health application designed to support users in managing their mental well-being using interactive tools and AI-driven features.

## Running the code

Run `npm i` to install the dependencies.

Run `npm run dev` to start the development server.

## Building for Production

Run `npm run build` to create a production build.

## Mobile App

This project uses Capacitor for mobile deployment. The Android project is located in the `android` directory.

To build the Android APK:
1. Run `npm run build` to create the web build
2. Run `npx cap sync` to sync the web build with the Android project
3. Run `npx cap open android` to open the project in Android Studio
4. Build the APK in Android Studio

The generated APK will be named "AI Mental Wellness App.apk".