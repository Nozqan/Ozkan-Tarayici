import MaterialCommunityIcons from "@expo/vector-icons/MaterialCommunityIcons";
import { Pressable, StyleSheet, Text, View } from "react-native";

export function GuvenlikRozeti({ url, engellenenIstekSayisi, gorselEngelleme, onPress }: { url: string; engellenenIstekSayisi: number; gorselEngelleme: boolean; onPress?: () => void }) {
  const https = /^https:\/\//i.test(url);
  const etiket = https ? "HTTPS korumalı" : "Yerel sayfa";
  return <Pressable accessibilityLabel={`${etiket}. Site izinlerini görüntüle`} onPress={onPress} style={({ pressed }) => [styles.rozeti, pressed && styles.basili]}><MaterialCommunityIcons name={https ? "lock-check-outline" : "shield-outline"} size={16} color={https ? "#67DEA2" : "#A8B3C2"} /><View style={styles.metinler}><Text numberOfLines={1} style={styles.baslik}>{etiket}</Text><Text numberOfLines={1} style={styles.alt}>{engellenenIstekSayisi} engel{gorselEngelleme ? " · görseller kapalı" : ""}</Text></View></Pressable>;
}

const styles = StyleSheet.create({ rozeti: { minWidth: 54, maxWidth: 116, height: 38, paddingHorizontal: 6, borderRadius: 13, gap: 4, flexDirection: "row", alignItems: "center", backgroundColor: "rgba(103,222,162,0.08)" }, metinler: { flex: 1 }, baslik: { color: "#DCEBE1", fontSize: 8, fontWeight: "900" }, alt: { color: "#88A995", fontSize: 7, fontWeight: "700", marginTop: 1 }, basili: { opacity: 0.7, transform: [{ scale: 0.97 }] } });
