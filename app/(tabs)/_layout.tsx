import { Tabs } from "expo-router";

export default function SekmeYerlesimi() {
  return <Tabs screenOptions={{ headerShown: false, tabBarStyle: { display: "none" } }}><Tabs.Screen name="index" options={{ title: "Ana Sayfa" }} /><Tabs.Screen name="sekmeler" options={{ title: "Sekmeler" }} /><Tabs.Screen name="yer-imleri" options={{ title: "Yer İmleri" }} /><Tabs.Screen name="gecmis" options={{ title: "Geçmiş" }} /><Tabs.Screen name="ayarlar" options={{ title: "Ayarlar" }} /></Tabs>;
}
