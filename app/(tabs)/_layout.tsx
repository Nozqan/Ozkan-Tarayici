import MaterialCommunityIcons from "@expo/vector-icons/MaterialCommunityIcons";
import { Tabs } from "expo-router";
import { Platform } from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";

export default function SekmeYerlesimi() {
  const alanlar = useSafeAreaInsets();
  const altBosluk = Platform.OS === "web" ? 10 : Math.max(alanlar.bottom, 9);
  return <Tabs screenOptions={{ headerShown: false, tabBarActiveTintColor: "#FF6A2A", tabBarInactiveTintColor: "#8D9AAC", tabBarStyle: { height: 60 + altBosluk, paddingTop: 8, paddingBottom: altBosluk, backgroundColor: "#0C1118", borderTopColor: "rgba(168, 179, 194, 0.16)" }, tabBarLabelStyle: { fontSize: 10, fontWeight: "700" } }}><Tabs.Screen name="index" options={{ title: "Ana Sayfa", tabBarIcon: ({ color, size }) => <MaterialCommunityIcons name="compass-outline" size={size} color={color} /> }} /><Tabs.Screen name="sekmeler" options={{ title: "Sekmeler", tabBarIcon: ({ color, size }) => <MaterialCommunityIcons name="tab" size={size} color={color} /> }} /><Tabs.Screen name="yer-imleri" options={{ title: "Yer İmleri", tabBarIcon: ({ color, size }) => <MaterialCommunityIcons name="star-outline" size={size} color={color} /> }} /><Tabs.Screen name="gecmis" options={{ title: "Geçmiş", tabBarIcon: ({ color, size }) => <MaterialCommunityIcons name="history" size={size} color={color} /> }} /><Tabs.Screen name="ayarlar" options={{ title: "Ayarlar", tabBarIcon: ({ color, size }) => <MaterialCommunityIcons name="cog-outline" size={size} color={color} /> }} /></Tabs>;
}
