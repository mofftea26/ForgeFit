import { ProgramPdfPreview } from "@/features/Export/PDF/components/ProgramPdfPreviewer";
import { useProgramStore } from "@/stores";
import { useLocalSearchParams } from "expo-router";

export default function ExportPdfScreen() {
  const { id } = useLocalSearchParams<{ id: string }>();
  const program = useProgramStore((s) => s.programs.find((p) => p.id === id));

  if (!program) return null;

  return <ProgramPdfPreview programId={id} />;
}
