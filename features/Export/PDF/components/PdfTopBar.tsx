import { RefreshCw, Share2 } from "lucide-react-native";
import * as React from "react";
import {
  ActivityIndicator,
  Platform,
  Pressable,
  Text,
  TextInput,
  View,
} from "react-native";

type Props = {
  title?: string;
  clientName: string;
  onClientNameChange: (v: string) => void;
  onRefresh: () => void;
  onShare: () => void;
  shareLoading?: boolean;
  children?: React.ReactNode;
};

export function PdfTopBar({
  title = "Program PDF Preview",
  clientName,
  onClientNameChange,
  onRefresh,
  onShare,
  shareLoading = false,
  children,
}: Props) {
  return (
    <View
      style={{
        paddingTop: Platform.OS === "ios" ? 12 : 8,
        paddingHorizontal: 12,
        paddingBottom: 8,
        backgroundColor: "#0E1A26",
        borderBottomWidth: 1,
        borderBottomColor: "#132233",
      }}
    >
      <Text
        style={{
          color: "#ECEDEE",
          fontSize: 16,
          fontWeight: "700",
          marginBottom: 6,
        }}
      >
        {title}
      </Text>

      <View style={{ marginBottom: 8 }}>{children}</View>

      <View
        style={{
          flexDirection: "row",
          alignItems: "center",
          gap: 8,
          marginBottom: 6,
        }}
      />

      <View style={{ flexDirection: "row", alignItems: "center", gap: 8 }}>
        <Pressable
          onPress={onRefresh}
          style={{
            padding: 8,
            borderRadius: 8,
            backgroundColor: "#122133",
            borderWidth: 1,
            borderColor: "#132233",
          }}
        >
          <RefreshCw size={20} color="#ECEDEE" />
        </Pressable>

        <Pressable
          onPress={onShare}
          disabled={shareLoading} // ← NEW
          style={{
            padding: 8,
            borderRadius: 8,
            backgroundColor: "#122133",
            borderWidth: 1,
            borderColor: "#132233",
            opacity: shareLoading ? 0.6 : 1, // ← subtle disabled look
          }}
        >
          {shareLoading ? (
            <ActivityIndicator size="small" color="#ECEDEE" />
          ) : (
            <Share2 size={20} color="#ECEDEE" />
          )}
        </Pressable>

        <TextInput
          value={clientName}
          onChangeText={onClientNameChange}
          placeholder="Client Name"
          placeholderTextColor="#9BA1A6"
          style={{
            flex: 1,
            color: "#ECEDEE",
            paddingVertical: 8,
            paddingHorizontal: 12,
            backgroundColor: "#122133",
            borderRadius: 8,
            borderWidth: 1,
            borderColor: "#132233",
          }}
        />
      </View>
    </View>
  );
}
