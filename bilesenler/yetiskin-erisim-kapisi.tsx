import MaterialCommunityIcons from "@expo/vector-icons/MaterialCommunityIcons";
import { useState } from "react";
import { Alert, Pressable, StyleSheet, Text, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

import { useTarayici } from "@/lib/tarayici/baglam";

export function YetiskinErisimKapisi() {
  const { ayariDegistir } = useTarayici();
  const [yasOnayi, yasOnayiAyarla] = useState(false);
  const [uyumOnayi, uyumOnayiAyarla] = useState(false);
  const devamEt = () => {
    if (!yasOnayi || !uyumOnayi) return;
    ayariDegistir("yetiskinErisimOnayi", true);
    ayariDegistir("yetiskinUyumOnayi", true);
  };
  const reddet = () => Alert.alert("Erişim kapalı", "Bu tarayıcı yetişkinlere yöneliktir. 18 yaşından küçüksen veya koşulları kabul etmiyorsan uygulamayı kapatmalısın.");
  return <View style={styles.ekran}><SafeAreaView style={styles.guvenliAlan}><View style={styles.amblem}><MaterialCommunityIcons name="zodiac-scorpio" color="#FF6A2A" size={37} /></View><Text style={styles.baslik}>Yetişkin erişimi</Text><Text style={styles.altBaslik}>Bu tarayıcı yalnızca 18 yaş ve üzerindeki kullanıcılar içindir.</Text><View style={styles.bilgiKarti}><MaterialCommunityIcons name="shield-lock-outline" color="#FFB000" size={24} /><Text style={styles.bilgiMetni}>Akrep içerik barındırmaz veya üretmez. Kullanıcı kendi aramasını Google ya da Yandex üzerinde başlatır. Reşit olmayanlar, rıza dışı veya hukuka aykırı içerik kesinlikle kabul edilmez.</Text></View><OnaySatiri secili={yasOnayi} onPress={() => yasOnayiAyarla((onceki) => !onceki)} metin="18 yaşında veya daha büyüğüm." /><OnaySatiri secili={uyumOnayi} onPress={() => uyumOnayiAyarla((onceki) => !onceki)} metin="Yalnızca yaşadığım yerde yasal olan yetişkin içeriğine erişeceğimi; yerel kurallardan sorumlu olduğumu kabul ediyorum." /><Pressable accessibilityLabel="Yetişkin erişimine devam et" disabled={!yasOnayi || !uyumOnayi} onPress={devamEt} style={({ pressed }) => [styles.devamButonu, (!yasOnayi || !uyumOnayi || pressed) && styles.devreDisi]}><Text style={styles.devamMetni}>18+ olarak devam et</Text><MaterialCommunityIcons name="arrow-right" color="#0B0E12" size={19} /></Pressable><Pressable accessibilityLabel="Yetişkin erişimini reddet" onPress={reddet} style={({ pressed }) => [styles.reddetButonu, pressed && styles.basili]}><Text style={styles.reddetMetni}>Uygun değilim</Text></Pressable><Text style={styles.altNot}>Bu onay yalnızca yerel bir erişim kapısıdır. Bazı ülkeler güçlü yaş güvencesi veya kimlik doğrulaması gerektirebilir; hedef pazarda yayınlamadan önce uzman hukuk incelemesi ve uygun doğrulama sağlayıcısı gerekir.</Text></SafeAreaView></View>;
}

function OnaySatiri({ secili, onPress, metin }: { secili: boolean; onPress: () => void; metin: string }) {
  return <Pressable accessibilityRole="checkbox" accessibilityState={{ checked: secili }} onPress={onPress} style={({ pressed }) => [styles.onaySatiri, pressed && styles.basili]}><View style={[styles.kutu, secili && styles.kutuSecili]}>{secili ? <MaterialCommunityIcons name="check" color="#09110B" size={16} /> : null}</View><Text style={styles.onayMetni}>{metin}</Text></Pressable>;
}

const styles = StyleSheet.create({ ekran: { flex: 1, backgroundColor: "#080B10" }, guvenliAlan: { flex: 1, paddingHorizontal: 25, justifyContent: "center" }, amblem: { width: 70, height: 70, borderRadius: 24, alignItems: "center", justifyContent: "center", backgroundColor: "rgba(255,106,42,0.14)", marginBottom: 20 }, baslik: { color: "#F6F8FB", fontSize: 27, lineHeight: 34, fontWeight: "900" }, altBaslik: { color: "#B4C0CE", fontSize: 14, lineHeight: 20, marginTop: 6 }, bilgiKarti: { marginTop: 24, flexDirection: "row", gap: 13, borderRadius: 20, padding: 16, borderWidth: 1, borderColor: "rgba(255,176,0,0.25)", backgroundColor: "rgba(255,176,0,0.08)" }, bilgiMetni: { flex: 1, color: "#E9D6A3", fontSize: 12, lineHeight: 18 }, onaySatiri: { flexDirection: "row", gap: 12, marginTop: 18, alignItems: "flex-start" }, kutu: { width: 24, height: 24, borderRadius: 8, marginTop: 1, borderWidth: 1.5, borderColor: "#7D8997", alignItems: "center", justifyContent: "center" }, kutuSecili: { borderColor: "#83DBA5", backgroundColor: "#83DBA5" }, onayMetni: { flex: 1, color: "#D7E0E9", fontSize: 13, lineHeight: 19 }, devamButonu: { height: 52, borderRadius: 18, backgroundColor: "#FF6A2A", marginTop: 27, alignItems: "center", justifyContent: "center", flexDirection: "row", gap: 9 }, devamMetni: { color: "#0B0E12", fontWeight: "900", fontSize: 14 }, reddetButonu: { height: 44, alignItems: "center", justifyContent: "center", marginTop: 8 }, reddetMetni: { color: "#B4C0CE", fontSize: 13, fontWeight: "700" }, altNot: { color: "#7C899A", fontSize: 10, lineHeight: 15, marginTop: 18, textAlign: "center" }, devreDisi: { opacity: 0.42 }, basili: { opacity: 0.72, transform: [{ scale: 0.98 }] } });
