import MaterialCommunityIcons from "@expo/vector-icons/MaterialCommunityIcons";
import * as Haptics from "expo-haptics";
import { PropsWithChildren } from "react";
import { Platform, Pressable, StyleProp, StyleSheet, Text, View, ViewStyle } from "react-native";

type SimgeAdi = React.ComponentProps<typeof MaterialCommunityIcons>["name"];

export function dokunsalGeriBildirim(tur: "hafif" | "orta" | "secim" = "hafif") {
  if (Platform.OS === "web") return;
  if (tur === "secim") { Haptics.selectionAsync(); return; }
  Haptics.impactAsync(tur === "orta" ? Haptics.ImpactFeedbackStyle.Medium : Haptics.ImpactFeedbackStyle.Light);
}

export function CamKart({ children, style }: PropsWithChildren<{ style?: StyleProp<ViewStyle> }>) { return <View style={[styles.camKart, style]}>{children}</View>; }

export function BolumBasligi({ baslik, aciklama, sag }: { baslik: string; aciklama?: string; sag?: React.ReactNode }) {
  return <View style={styles.baslikSatiri}><View style={styles.baslikMetinleri}><Text style={styles.bolumBasligi}>{baslik}</Text>{aciklama ? <Text style={styles.bolumAciklamasi}>{aciklama}</Text> : null}</View>{sag}</View>;
}

export function YuvarlakButon({ icon, etiket, onPress, tur = "ikincil", disabled = false, style }: { icon: SimgeAdi; etiket: string; onPress: () => void; tur?: "birincil" | "ikincil" | "tehlike"; disabled?: boolean; style?: StyleProp<ViewStyle> }) {
  const renk = tur === "birincil" ? "#080B10" : tur === "tehlike" ? "#FF7D87" : "#F6F8FB";
  return <Pressable accessibilityRole="button" accessibilityLabel={etiket} disabled={disabled} onPress={() => { dokunsalGeriBildirim(tur === "tehlike" ? "orta" : "hafif"); onPress(); }} style={({ pressed }) => [styles.yuvarlakButon, tur === "birincil" && styles.birincilButon, tur === "tehlike" && styles.tehlikeButon, disabled && styles.devreDisi, pressed && !disabled && styles.basili, style]}><MaterialCommunityIcons name={icon} size={18} color={renk} /><Text style={[styles.yuvarlakButonMetni, { color: renk }]}>{etiket}</Text></Pressable>;
}

export function DurumRozeti({ metin, ton = "nötr" }: { metin: string; ton?: "nötr" | "uyari" | "basari" | "hata" }) {
  const tonStili = ton === "uyari" ? styles.uyariRozeti : ton === "basari" ? styles.basariRozeti : ton === "hata" ? styles.hataRozeti : styles.notrRozeti;
  const metinStili = ton === "uyari" ? styles.uyariMetni : ton === "basari" ? styles.basariMetni : ton === "hata" ? styles.hataMetni : styles.notrMetni;
  return <View style={[styles.rozet, tonStili]}><Text style={[styles.rozetMetni, metinStili]}>{metin}</Text></View>;
}

export function SimgeliSatir({ icon, baslik, aciklama, onPress, sagMetin, iconRengi = "#FF6A2A" }: { icon: SimgeAdi; baslik: string; aciklama: string; onPress?: () => void; sagMetin?: string; iconRengi?: string }) {
  const icerik = <><View style={[styles.satirSimge, { backgroundColor: `${iconRengi}20` }]}><MaterialCommunityIcons name={icon} color={iconRengi} size={20} /></View><View style={styles.satirMetinleri}><Text style={styles.satirBasligi}>{baslik}</Text><Text style={styles.satirAciklamasi}>{aciklama}</Text></View>{sagMetin ? <Text style={styles.sagMetin}>{sagMetin}</Text> : null}{onPress ? <MaterialCommunityIcons name="chevron-right" color="#A8B3C2" size={22} /> : null}</>;
  if (!onPress) return <View style={styles.simgeliSatir}>{icerik}</View>;
  return <Pressable accessibilityRole="button" accessibilityLabel={baslik} onPress={() => { dokunsalGeriBildirim("hafif"); onPress(); }} style={({ pressed }) => [styles.simgeliSatir, pressed && styles.satirBasili]}>{icerik}</Pressable>;
}

export function BosDurum({ icon, baslik, aciklama, style }: { icon: SimgeAdi; baslik: string; aciklama: string; style?: StyleProp<ViewStyle> }) {
  return <View style={[styles.bosDurum, style]}><View style={styles.bosSimge}><MaterialCommunityIcons name={icon} size={28} color="#FFB000" /></View><Text style={styles.bosBaslik}>{baslik}</Text><Text style={styles.bosAciklama}>{aciklama}</Text></View>;
}

const styles = StyleSheet.create({
  camKart: { backgroundColor: "rgba(18, 24, 33, 0.94)", borderWidth: 1, borderColor: "rgba(168, 179, 194, 0.15)", borderRadius: 24 },
  baslikSatiri: { flexDirection: "row", justifyContent: "space-between", alignItems: "flex-start", marginTop: 24, marginBottom: 12 },
  baslikMetinleri: { flex: 1, paddingRight: 12 },
  bolumBasligi: { color: "#F6F8FB", fontSize: 18, lineHeight: 23, fontWeight: "800" },
  bolumAciklamasi: { color: "#A8B3C2", fontSize: 13, lineHeight: 19, marginTop: 3 },
  yuvarlakButon: { minHeight: 44, borderRadius: 22, flexDirection: "row", alignItems: "center", justifyContent: "center", gap: 8, paddingHorizontal: 15, backgroundColor: "#1B2633", borderWidth: 1, borderColor: "rgba(246, 248, 251, 0.1)" },
  birincilButon: { backgroundColor: "#FF6A2A", borderColor: "#FF8B5B" }, tehlikeButon: { backgroundColor: "rgba(255, 77, 90, 0.14)", borderColor: "rgba(255, 77, 90, 0.4)" }, devreDisi: { opacity: 0.45 }, basili: { opacity: 0.86, transform: [{ scale: 0.97 }] }, yuvarlakButonMetni: { fontSize: 13, lineHeight: 18, fontWeight: "800" },
  rozet: { borderRadius: 999, paddingHorizontal: 9, paddingVertical: 5, alignSelf: "flex-start" }, notrRozeti: { backgroundColor: "rgba(168, 179, 194, 0.12)" }, uyariRozeti: { backgroundColor: "rgba(255, 176, 0, 0.15)" }, basariRozeti: { backgroundColor: "rgba(39, 209, 127, 0.14)" }, hataRozeti: { backgroundColor: "rgba(255, 77, 90, 0.14)" }, rozetMetni: { fontSize: 11, lineHeight: 14, fontWeight: "800" }, notrMetni: { color: "#A8B3C2" }, uyariMetni: { color: "#FFC457" }, basariMetni: { color: "#73E5AA" }, hataMetni: { color: "#FF9AA2" },
  simgeliSatir: { flexDirection: "row", alignItems: "center", gap: 12, paddingVertical: 14 }, satirBasili: { opacity: 0.72 }, satirSimge: { width: 42, height: 42, borderRadius: 14, alignItems: "center", justifyContent: "center" }, satirMetinleri: { flex: 1 }, satirBasligi: { color: "#F6F8FB", fontSize: 15, lineHeight: 20, fontWeight: "700" }, satirAciklamasi: { color: "#A8B3C2", fontSize: 12, lineHeight: 17, marginTop: 2 }, sagMetin: { color: "#FFB000", fontSize: 12, fontWeight: "800" },
  bosDurum: { alignItems: "center", paddingHorizontal: 28, paddingVertical: 34 }, bosSimge: { width: 58, height: 58, borderRadius: 21, alignItems: "center", justifyContent: "center", backgroundColor: "rgba(255, 176, 0, 0.1)", marginBottom: 14 }, bosBaslik: { color: "#F6F8FB", fontSize: 17, lineHeight: 22, fontWeight: "800", textAlign: "center" }, bosAciklama: { color: "#A8B3C2", fontSize: 13, lineHeight: 19, textAlign: "center", marginTop: 6 },
});
