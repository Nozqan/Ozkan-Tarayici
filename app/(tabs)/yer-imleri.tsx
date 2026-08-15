import MaterialCommunityIcons from "@expo/vector-icons/MaterialCommunityIcons";
import { router as expoRouter } from "expo-router";
import { useState } from "react";
import { FlatList, Pressable, StyleSheet, Text, TextInput, View } from "react-native";
import { BolumBasligi, BosDurum, CamKart, YuvarlakButon } from "@/bilesenler/akrep-ui";
import { useTarayici } from "@/lib/tarayici/baglam";
import { zamanEtiketi } from "@/lib/tarayici/modeller";

const router = {
  push: (rota: string) => expoRouter.push(rota as never),
};

export default function YerImleriEkrani() {
  const { durum, sekmeAc, yerImiSil } = useTarayici();
  const [arama, aramaAyarla] = useState("");
  const sorgu = arama.trim().toLocaleLowerCase("tr-TR");
  const kayitlar = durum.yerImleri.filter((item) => `${item.baslik} ${item.url}`.toLocaleLowerCase("tr-TR").includes(sorgu));
  return <View style={styles.ekran}><FlatList contentContainerStyle={styles.icerik} data={kayitlar} keyExtractor={(item) => item.id} ListHeaderComponent={<><BolumBasligi baslik="Yer imleri" aciklama="Kaydedilen sayfaların yerel listesi" /><View style={styles.arama}><MaterialCommunityIcons name="magnify" size={19} color="#A8B3C2" /><TextInput accessibilityLabel="Yer imlerinde ara" onChangeText={aramaAyarla} placeholder="Yer imlerinde ara" placeholderTextColor="#7C899A" style={styles.girdi} value={arama} /></View></>} ListEmptyComponent={<BosDurum icon="star-outline" baslik="Yer imi bulunamadı" aciklama="Açık bir sayfadaki yıldız düğmesine dokunarak sayfayı kaydedebilirsin." style={styles.bosDurum} />} renderItem={({ item }) => <CamKart style={styles.kart}><Pressable onPress={() => { sekmeAc(item.url); router.push("/tarayici"); }} style={({ pressed }) => [styles.kartIcerik, pressed && styles.basili]}><View style={styles.simge}><MaterialCommunityIcons name="star" color="#FFB000" size={19} /></View><View style={styles.metinler}><Text numberOfLines={1} style={styles.baslik}>{item.baslik}</Text><Text numberOfLines={1} style={styles.url}>{item.url}</Text><Text style={styles.tarih}>{zamanEtiketi(item.olusturulma)} kaydedildi</Text></View></Pressable><Pressable accessibilityLabel="Yer imini sil" onPress={() => yerImiSil(item.id)} style={({ pressed }) => [styles.silButonu, pressed && styles.basili]}><MaterialCommunityIcons name="trash-can-outline" color="#FF9AA2" size={18} /></Pressable></CamKart>} ListFooterComponent={<YuvarlakButon icon="tab-plus" etiket="Açık sayfayı kaydet" onPress={() => router.push("/tarayici")} style={styles.altButon} />} /></View>;
}

const styles = StyleSheet.create({ ekran: { flex: 1, backgroundColor: "#080B10" }, icerik: { paddingHorizontal: 18, paddingBottom: 28 }, arama: { flexDirection: "row", alignItems: "center", gap: 10, minHeight: 48, paddingHorizontal: 15, borderRadius: 20, backgroundColor: "#121821", borderWidth: 1, borderColor: "rgba(168, 179, 194, 0.14)" }, girdi: { flex: 1, minHeight: 44, color: "#F6F8FB", fontSize: 14, lineHeight: 19 }, kart: { marginTop: 10, padding: 8, flexDirection: "row", alignItems: "center" }, kartIcerik: { flex: 1, flexDirection: "row", gap: 12, alignItems: "center", minHeight: 56 }, simge: { width: 40, height: 40, borderRadius: 14, backgroundColor: "rgba(255, 176, 0, 0.12)", justifyContent: "center", alignItems: "center" }, metinler: { flex: 1 }, baslik: { color: "#F6F8FB", fontSize: 14, lineHeight: 19, fontWeight: "800" }, url: { color: "#A8B3C2", fontSize: 11, lineHeight: 15, marginTop: 2 }, tarih: { color: "#7C899A", fontSize: 10, lineHeight: 14, marginTop: 2 }, silButonu: { width: 40, height: 40, borderRadius: 15, alignItems: "center", justifyContent: "center" }, bosDurum: { marginTop: 24 }, altButon: { marginTop: 24 }, basili: { opacity: 0.7, transform: [{ scale: 0.98 }] } });
