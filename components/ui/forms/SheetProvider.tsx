import { useThemeColor } from "@/hooks/use-theme-color";
import React, { createContext, useContext, useMemo, useState } from "react";
import { FlatList, Modal, Pressable, Text, View } from "react-native";

type Item<T> = { label: string; value: T; description?: string };
type SheetPayload<T> = {
  title?: string;
  items: Item<T>[];
  value?: T;
  onSelect: (v: T) => void;
};

const Ctx = createContext<{
  openSelect: <T extends string | number>(p: SheetPayload<T>) => void;
}>({ openSelect: () => {} });

export const useSheet = () => useContext(Ctx);

export const SheetProvider: React.FC<React.PropsWithChildren> = ({
  children,
}) => {
  const [open, setOpen] = useState(false);
  const [payload, setPayload] = useState<SheetPayload<any> | null>(null);

  const bg = useThemeColor({}, "background");
  const text = useThemeColor({}, "text");
  const outline = useThemeColor({}, "outline");
  const tint = useThemeColor({}, "primarySoft");
  const muted = useThemeColor({}, "muted");

  function openSelect<T extends string | number>(p: SheetPayload<T>) {
    setPayload(p);
    setOpen(true);
  }

  const close = () => {
    setOpen(false);
  };

  const ctx = useMemo(() => ({ openSelect }), []);

  return (
    <Ctx.Provider value={ctx}>
      {children}
      <Modal
        visible={open}
        animationType="slide"
        transparent
        onRequestClose={close}
      >
        <Pressable
          onPress={close}
          style={{ flex: 1, backgroundColor: "#0007" }}
        />
        <View
          style={{
            maxHeight: "70%",
            backgroundColor: bg,
            borderTopLeftRadius: 16,
            borderTopRightRadius: 16,
            padding: 12,
          }}
        >
          <View
            style={{
              height: 4,
              width: 40,
              backgroundColor: outline,
              borderRadius: 4,
              alignSelf: "center",
              marginBottom: 12,
            }}
          />
          {payload?.title ? (
            <Text
              style={{
                color: text,
                fontFamily: "Syne_700Bold",
                fontSize: 18,
                marginBottom: 8,
              }}
            >
              {payload.title}
            </Text>
          ) : null}
          <FlatList
            data={payload?.items ?? []}
            keyExtractor={(it) => String(it.value)}
            renderItem={({ item }) => {
              const active = payload?.value === item.value;
              return (
                <Pressable
                  onPress={() => {
                    payload?.onSelect(item.value);
                    close();
                  }}
                  style={{
                    padding: 12,
                    borderRadius: 12,
                    backgroundColor: active ? tint : "transparent",
                    marginVertical: 4,
                  }}
                >
                  <Text
                    style={{
                      color: active ? "#fff" : text,
                      fontFamily: "WorkSans_600SemiBold",
                      fontSize: 16,
                    }}
                  >
                    {item.label}
                  </Text>
                  {item.description ? (
                    <Text
                      style={{
                        color: active ? "#fff" : muted,
                        fontFamily: "WorkSans_400Regular",
                        fontSize: 12,
                      }}
                    >
                      {item.description}
                    </Text>
                  ) : null}
                </Pressable>
              );
            }}
          />
          <Pressable
            onPress={close}
            style={{
              padding: 12,
              alignItems: "center",
              borderRadius: 12,
              borderWidth: 1,
              borderColor: outline,
              marginTop: 8,
            }}
          >
            <Text style={{ color: text, fontFamily: "WorkSans_600SemiBold" }}>
              Cancel
            </Text>
          </Pressable>
        </View>
      </Modal>
    </Ctx.Provider>
  );
};
