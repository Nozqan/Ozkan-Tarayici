import MaterialCommunityIcons from "@expo/vector-icons/MaterialCommunityIcons";
import { useEffect, useState } from "react";
import { Pressable, StyleSheet, TextInput, View } from "react-native";
import { dokunsalGeriBildirim } from "./akrep-ui";

export function AdresCubugu({ deger, yukleniyor, onGonder, onYildiz, yildizli }: { deger: string; yukleniyor: boolean; onGonder: (girdi: string) => void; onYildiz?: () => void; yildizli?: boolean }) {
  const [girdi, girdiAyarla] = useState(deger);
  useEffect(() => { girdiAyarla(deger); }, [deger]);
  return <View style={styles.disKapsayici}><View style={styles.cubuk}><MaterialCommunityIcons name={yukleniyor ? "reload" : "shield-check-outline"} size={18} color={yukleniyor ? "#FFB000" : "#27D17F"} /><TextInput accessibilityLabel="Adres veya arama alanı" autoCapitalize="none" autoCorrect={false} keyboardType="url" onChangeText={girdiAyarla} onSubmitEditing={() => { dokunsalGeriBildirim("hafif"); onGonder(girdi); }} placeholder="Ara veya adres gir" placeholderTextColor="#7C899A" returnKeyType="go" style={styles.girdi} value={girdi} />{onYildiz ? <Pressable accessibilityLabel={yildizli ? "Yer iminden çıkar" : "Yer imlerine ekle"} onPress={() => { dokunsalGeriBildirim("secim"); onYildiz(); }} style={({ pressed }) => [styles.yildiz, pressed && styles.basili]}><MaterialCommunityIcons name={yildizli ? "star" : "star-outline"} size={19} color={yildizli ? "#FFB000" : "#A8B3C2"} /></Pressable> : null}</View></View>;
}

const styles = StyleSheet.create({ disKapsayici: { paddingHorizontal: 18, paddingTop: 10, paddingBottom: 8, backgroundColor: "#080B10" }, cubuk: { minHeight: 50, flexDirection: "row", alignItems: "center", gap: 10, paddingLeft: 15, paddingRight: 7, backgroundColor: "#121821", borderColor: "rgba(246, 248, 251, 0.13)", borderWidth: 1, borderRadius: 25 }, girdi: { flex: 1, minHeight: 44, color: "#F6F8FB", fontSize: 15, lineHeight: 20, fontWeight: "600" }, yildiz: { width: 40, height: 40, alignItems: "center", justifyContent: "center", borderRadius: 20 }, basili: { opacity: 0.65, transform: [{ scale: 0.96 }] } });
