# ForgeFit

ForgeFit is a **React Native + Expo** mobile app designed for **program building, workout planning, and tracking**.  
It follows a **feature-based architecture** with strong **type safety (Zod)**, **state management (Zustand)**, and **modern UI patterns**.

---

## ⚡ Quick Start

Get the app running in 3 steps:

````bash
# 1. Clone the repo
git clone https://github.com/mofftea26/ForgeFit.git
cd ForgeFit

# 2. Install dependencies
pnpm install

# 3. Run in Expo
pnpm start


## 🚀 Tech Stack

- **Expo SDK 54** (React Native 0.81, React 19)
- **Expo Router** for navigation
- **Zustand** for state management
- **Zod** for validation & types
- **Formik** for forms
- **Lucide + Ionicons** for icons
- **Expo modules**: image picker, haptics, linear gradient, fonts
- **Reanimated + Gesture Handler** for gestures and animations

---

## 📂 Documentation

This repo ships with a full `/docs` folder for maintainers and contributors:

- [Architecture](./docs/ARCHITECTURE.md)
- [Folder Structure](./docs/FOLDER_STRUCTURE.md)
- [Design Patterns](./docs/PATTERNS.md)
- [Features](./docs/FEATURES.md)
- [Screens](./docs/SCREENS.md)
- [Libraries](./docs/LIBRARIES.md)
- [State Management](./docs/STATE.md)
- [Types & Validation](./docs/TYPES_AND_VALIDATION.md)
- [Theming](./docs/THEMING.md)
- [Components](./docs/COMPONENTS.md)
- [Assets](./docs/ASSETS.md)
- [Typography](./docs/TYPOGRAPHY.md)

---

## 🛠 Development

### Requirements

- Node.js (LTS)
- pnpm
- Expo CLI
- Android Studio / Xcode for native builds

### Scripts

```bash
# Start metro bundler
pnpm start

# Reset project (custom script)
pnpm reset-project

# Run on device
pnpm android
pnpm ios

# Web preview
pnpm web

# Lint code
pnpm lint

# EAS builds
pnpm eas-Android
pnpm eas-Ios
````
