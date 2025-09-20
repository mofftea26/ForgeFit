import type { Series } from "@/entities/program/zod";
import React, { memo } from "react";
import { FlatList, View } from "react-native";
import { SeriesCard } from "./SeriesCard";

export const SeriesList: React.FC<{ series: Series[] }> = memo(({ series }) => {
  return (
    <FlatList
      data={series}
      keyExtractor={(s) => s.id}
      ItemSeparatorComponent={() => <View style={{ height: 12 }} />}
      renderItem={({ item, index }) => (
        <SeriesCard series={item} index={index} />
      )}
      scrollEnabled={false}
    />
  );
});

SeriesList.displayName = "SeriesList";
