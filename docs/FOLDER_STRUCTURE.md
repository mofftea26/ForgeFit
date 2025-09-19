# Folder Structure

app/ # Expo Router entry (screens & navigation)
assets/ # Images, fonts
components/ # Shared UI (buttons, inputs, typography)
constants/ # Theme tokens, global constants
entities/
program/ # Domain types (zod), constants (SetTypes), factories
features/ # Feature modules (Home, Create, ProgramEditor, etc.)
hooks/ # Reusable hooks (theme, effects, haptics)
stores/ # Zustand store(s)
scripts/ # Helper scripts (reset-project)
docs/ # Project documentation

- **UI** → `components/`
- **Features** → self-contained (screen logic + subcomponents)
- **Domain** → `entities/`
- **State** → `stores/`
