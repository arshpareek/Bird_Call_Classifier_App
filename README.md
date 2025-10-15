# Bird Voice Classifier App

## About the Project

This Android app utilizes a convolutional neural network architecture (EfficientNet) paired with native audio-processing libraries (Essentia) to identify almost 200 species of bird sounds directly on the device. On-device inference not just ensures privacy of audio data collected by the device's microphone, but also helps improve usability of the app in regions with limited internet access. 

## Libraries Used

- React Native
- Essentia
- Keras
- TFLite

## Get started

1. Install dependencies

   ```bash
   npm install
   ```

2. Start the app

   ```bash
   npx expo start
   ```

In the output, you'll find options to open the app in a

- [development build](https://docs.expo.dev/develop/development-builds/introduction/)
- [Android emulator](https://docs.expo.dev/workflow/android-studio-emulator/)
- [iOS simulator](https://docs.expo.dev/workflow/ios-simulator/)
- [Expo Go](https://expo.dev/go), a limited sandbox for trying out app development with Expo

You can start developing by editing the files inside the **app** directory. This project uses [file-based routing](https://docs.expo.dev/router/introduction).

