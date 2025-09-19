import { useRouter } from "expo-router";
import React from "react";
import { ScrollView, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

import { H1, H2 } from "@/components/ui/Typography";
import { useThemeColor } from "@/hooks/use-theme-color";
import { useProgramStore } from "@/stores";

import { EditProgramSheet } from "./components/EditProgramSheet";
import { EmptyPrograms } from "./components/EmptyPrograms";
import { FAB } from "./components/FAB";
import { Hero } from "./components/Hero";
import { ProgramCard } from "./components/ProgramCard";

export function HomeScreen() {
  const bg = useThemeColor({}, "background");
  const text = useThemeColor({}, "text");
  const outline = useThemeColor({}, "outline");
  const router = useRouter();

  const programs = useProgramStore((s) => s.programs);
  const removeProgram = useProgramStore((s) => s.removeProgram);
  const hasPrograms = programs.length > 0;

  const [editingId, setEditingId] = React.useState<string | null>(null);

  const editingProgram = programs.find((p) => p.id === editingId) ?? null;

  const goCreate = () => router.push("/programs/create");

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: bg }}>
      <ScrollView
        contentContainerStyle={{ padding: 16, gap: 16, paddingBottom: 96 }}
      >
        {!hasPrograms ? (
          <Hero onPrimary={goCreate} />
        ) : (
          <View style={{ gap: 8 }}>
            <View>
              <H1 style={{ color: text }}>ForgeFit</H1>
              <H2 color="primary">Forge Yourself</H2>
            </View>
            <View
              style={{
                height: 1,
                backgroundColor: outline,
                opacity: 0.6,
                marginTop: 4,
              }}
            />
          </View>
        )}

        <View style={{ gap: 12 }}>
          {hasPrograms ? (
            programs.map((p) => (
              <ProgramCard
                key={p.id}
                program={p}
                onPress={() => router.push(`/programs/${p.id}`)}
                onEdit={() => setEditingId(p.id)}
                onDelete={() => removeProgram(p.id)}
              />
            ))
          ) : (
            <EmptyPrograms />
          )}
        </View>
      </ScrollView>

      <FAB onPress={goCreate} />

      {/* Centralized program editing */}
      <EditProgramSheet
        program={editingProgram}
        onClose={() => setEditingId(null)}
      />
    </SafeAreaView>
  );
}
