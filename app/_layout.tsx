import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { Stack } from "expo-router";
import { StatusBar } from "expo-status-bar";
import { useState } from "react";

import { TarayiciSaglayici, useTarayici } from "@/lib/tarayici/baglam";
import { createTRPCClient, trpc } from "@/lib/trpc";
import { YetiskinErisimKapisi } from "@/bilesenler/yetiskin-erisim-kapisi";

export default function KokYerlesimi() {
  const [queryClient] = useState(() => new QueryClient());
  const [trpcClient] = useState(() => createTRPCClient());
  return <trpc.Provider client={trpcClient} queryClient={queryClient}><QueryClientProvider client={queryClient}><TarayiciSaglayici><UygulamaIcerigi /></TarayiciSaglayici></QueryClientProvider></trpc.Provider>;
}

function UygulamaIcerigi() {
  const { durum, yuklendi } = useTarayici();
  if (!yuklendi) return null;
  if (!durum.ayarlar.yetiskinErisimOnayi) return <YetiskinErisimKapisi />;
  return <><StatusBar style="light" /><Stack screenOptions={{ headerShown: false, animation: "fade", contentStyle: { backgroundColor: "#080B10" } }}><Stack.Screen name="(tabs)" /><Stack.Screen name="tarayici" /><Stack.Screen name="gizlilik" /><Stack.Screen name="vpn" /><Stack.Screen name="yapay-zeka" /><Stack.Screen name="indirmeler" /><Stack.Screen name="yetiskin-uyum" /></Stack></>;
}
