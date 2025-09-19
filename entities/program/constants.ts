import {
  Activity,
  ArrowDown,
  Dumbbell,
  Layers,
  LucideIcon,
  Mountain,
  PauseCircle,
  Repeat,
  Shuffle,
  Timer,
  Weight,
} from "lucide-react-native";
import { SetType } from "./types";

export const SetTypes: Record<
  SetType,
  {
    title: string;
    description: string;
    icon: LucideIcon;
  }
> = {
  lightWarmup: {
    title: "Light Warm-up Set",
    description: "Prepare muscles with very light load.",
    icon: Dumbbell,
  },
  heavyWarmup: {
    title: "Heavy Warm-up Set",
    description: "Heavier prep set before working weight.",
    icon: Weight,
  },
  working: {
    title: "Working Set",
    description: "Main training set at prescribed load.",
    icon: Activity,
  },
  drop: {
    title: "Drop Set",
    description: "Reduce weight after failure and continue reps.",
    icon: ArrowDown,
  },
  restPause: {
    title: "Rest-Pause Set",
    description: "Take short pauses inside a set to extend volume.",
    icon: PauseCircle,
  },
  cluster: {
    title: "Cluster Set",
    description: "Break reps into small clusters with brief rests.",
    icon: Repeat,
  },
  backOff: {
    title: "Back-off Set",
    description: "Lower load after top sets for more volume.",
    icon: Layers,
  },
  density: {
    title: "Density Set",
    description: "Maximize work in a fixed time frame.",
    icon: Timer,
  },
  peak: {
    title: "Peak Set",
    description: "Single heavy set close to max effort.",
    icon: Mountain,
  },
  variableMuscleAction: {
    title: "Variable Muscle Action Set",
    description: "Alternate concentric, eccentric, and isometric actions.",
    icon: Shuffle,
  },
};
