import { Stack } from "expo-router";
import { StatusBar } from "expo-status-bar";
import { TarayiciSaglayici } from "@/lib/tarayici/baglam";

export default function KokYerlesimi() {
  return <TarayiciSaglayici><StatusBar style="light" /><Stack screenOptions={{ headerShown: false, animation: "fade", contentStyle: { backgroundColor: "#080B10" } }}><Stack.Screen name="(tabs)" /><Stack.Screen name="tarayici" /><Stack.Screen name="gizlilik" /><Stack.Screen name="vpn" /><Stack.Screen name="yapay-zeka" /><Stack.Screen name="indirmeler" /></Stack></TarayiciSaglayici>;
}
