# Types & Validation

### Entities (Zod)

- **Program** → id, title, goal, phases[], createdAt, updatedAt
- **Phase** → id, title, days[]
- **Day** (union):
  - RestDay
  - WorkoutDay (title, duration, series[], targetMuscleGroups[], equipment[])
- **Series** → id, label (A, B, C…), items[]
- **Exercise** → id, title, sets[], tempo[], trainerNote?
- **Set** → id, type (SetType), reps, rest

### Validation

- Tuples enforce tempo `[ecc, bottom, con, top]`.
- Factories (`blankX`) guarantee safe defaults.
- Discriminated unions (`type: "rest"|"workout"`) avoid ambiguity.
