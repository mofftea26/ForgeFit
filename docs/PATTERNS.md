# Design Patterns

- **Feature Modules**: encapsulated screens + subcomponents.
- **Domain Entities**: all types & validation via Zod.
- **Factories**: `blankProgram`, `blankDay`, `blankSeries` ensure safe defaults.
- **Unidirectional Data Flow**: UI → `onChange` → store action → schema validation → re-render.
- **Immutability**: always replace arrays/objects, no mutation.
- **Hooks Extraction**: every `useEffect` pulled into a named `useX` hook.
- **Presentational vs Container**: dumb UI in `components/`, stateful logic in `features/` or `stores/`.
