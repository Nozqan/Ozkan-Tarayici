import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { Stack } from "expo-router";
import { StatusBar } from "expo-status-bar";
import { useState } from "react";

import { TarayiciSaglayici } from "@/lib/tarayici/baglam";
import { createTRPCClient, trpc } from "@/lib/trpc";

export default function KokYerlesimi() {
  const [queryClient] = useState(() => new QueryClient());
  const [trpcClient] = useState(() => createTRPCClient());
  return <trpc.Provider client={trpcClient} queryClient={queryClient}><QueryClientProvider client={queryClient}><TarayiciSaglayici><StatusBar style="light" /><Stack screenOptions={{ headerShown: false, animation: "fade", contentStyle: { backgroundColor: "#080B10" } }}><Stack.Screen name="(tabs)" /><Stack.Screen name="tarayici" /><Stack.Screen name="gizlilik" /><Stack.Screen name="vpn" /><Stack.Screen name="yapay-zeka" /><Stack.Screen name="indirmeler" /></Stack></TarayiciSaglayici></QueryClientProvider></trpc.Provider>;
}
