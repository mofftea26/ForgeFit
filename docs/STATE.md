# State Management (Zustand)

## Store: `useProgramStore`

- `programs: Program[]`

### Actions

- `addProgram(title?)`
- `updateProgram(id, patch)`
- `removeProgram(id)`
- `replaceAll(items)`
- `addDay(programId, phaseId, day)`
- `updateDay(programId, dayId, patch)`
- `removeDay(programId, dayId)`

### Persistence

- `persist()` with AsyncStorage (`forgefit_programs_v1`).

## Principles

- Immutable updates.
- Zod ensures type safety.
- Program `updatedAt` refreshed on every change.
