## 📱 Wallpaper Gallery App (Expo + TypeScript)

A cross-platform mobile app built with **React Native (Expo)** that displays a grid of beautiful wallpapers from **Pixabay**. Users can view, download, and share images, with support for infinite scrolling, category filters, and light/dark themes.

### Features

- Browse wallpapers from [Pixabay API](https://pixabay.com/api/)
- Infinite scroll to load more images
- Filter wallpapers by categories (nature, space, abstract, etc.)
- Toggle between light and dark themes
- Download wallpaper to device gallery
- Share wallpaper via native share options
- Fullscreen image preview with download/share actions

---

### Tech Stack

- **React Native (Expo SDK)**
- **TypeScript**
- **Expo MediaLibrary, FileSystem, Sharing**
- **Pixabay API**

---

### Getting Started

#### Prerequisites

- Node.js ≥ 20
- Expo CLI or use `npx`
- `eas-cli` for building `.apk`

#### 1. Clone the repository

```bash
git clone https://github.com/abdur-shobur/wallpaper-app.git
cd wallpaper-app
```

#### 2. Install dependencies

```bash
npm install

```

#### 3. Start the Expo app

```bash
npx expo web
```

Scan the QR code with the Expo Go app (on Android/iOS) or run on an emulator.

---

### API Key Setup

This app uses the **Pixabay API**. You need to insert your API key in `App.tsx`:

```ts
const API_KEY = 'YOUR_PIXABAY_API_KEY';
```

Get your free API key from [pixabay.com/api/docs](https://pixabay.com/api/docs/).

---

### Building APK (Local Install)

To generate a local `.apk` for Android:

1. Install EAS CLI:

```bash
npm install -g eas-cli
```

2. Configure build settings:

```bash
eas build:configure
```

3. Build the APK:

```bash
eas build --platform android --local --output apk
```

4. Find the APK in the `./dist` folder and install it on your device.

---

### Folder Structure

```
.
├── app/layout.tsx      # Layout
├── app/index.tsx       # Main application file
├── assets/             # App assets (optional)
├── eas.json            # EAS build config
├── package.json        # Project metadata
└── README.md           # You're here!
```

---

### Screenshots

- The image `screenshot.jpg`

  ![Screenshot](https://github.com/Abdur-Shobur/wallpaper-app/blob/main/screenshot.jpg)

---

### License

MIT License. Feel free to use and modify.

---

### Author

Abdur Shobur

---
