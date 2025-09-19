# ForgeFit – Architecture

ForgeFit is built with **React Native + Expo Router** using a **feature-based architecture**.  
The app separates **domain (entities)**, **features**, **UI components**, and **state management** to ensure scalability.

## Principles

- **Feature-first** organization: screens and flows are grouped by feature, not by tech.
- **Domain-driven**: `entities/` contains Zod schemas and factories for strong types.
- **Composable UI**: small, reusable primitives (`TextField`, `Button`, `BottomSheet`) instead of monoliths.
- **Predictable state**: Zustand store, schema-validated, persisted with AsyncStorage.
- **SOLID practices**: small files, single responsibility, open to extension, hooks extracted for effects.
- **Expo ecosystem**: minimal native code, leveraging SDK modules for images, haptics, fonts, etc.
