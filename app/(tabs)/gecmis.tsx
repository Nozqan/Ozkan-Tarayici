import MaterialCommunityIcons from "@expo/vector-icons/MaterialCommunityIcons";
import { router as expoRouter } from "expo-router";
import { Alert, FlatList, Pressable, StyleSheet, Text, View } from "react-native";
import { BolumBasligi, BosDurum, CamKart, YuvarlakButon } from "@/bilesenler/akrep-ui";
import { useTarayici } from "@/lib/tarayici/baglam";
import { zamanEtiketi } from "@/lib/tarayici/modeller";

const router = {
  push: (rota: string) => expoRouter.push(rota as never),
};

export default function GecmisEkrani() {
  const { durum, gecmisiTemizle, sekmeAc } = useTarayici();
  const temizlemeOnayi = () => Alert.alert("Geçmiş temizlensin mi?", "Normal sekmelerdeki yerel ziyaret kayıtları silinecek. Gizli sekmeler zaten kaydedilmez.", [{ text: "Vazgeç", style: "cancel" }, { text: "Temizle", style: "destructive", onPress: gecmisiTemizle }]);
  return <View style={styles.ekran}><FlatList contentContainerStyle={styles.icerik} data={durum.gecmis} keyExtractor={(item) => item.id} ListHeaderComponent={<BolumBasligi baslik="Geçmiş" aciklama="Yalnızca normal sekmelerden kaydedilir" sag={durum.gecmis.length ? <Pressable onPress={temizlemeOnayi}><Text style={styles.temizle}>Temizle</Text></Pressable> : undefined} />} ListEmptyComponent={<BosDurum icon="history" baslik="Geçmiş boş" aciklama="Normal sekmelerde açtığın sayfalar burada görünür. Gizli sekmeler listeye eklenmez." style={styles.bosDurum} />} renderItem={({ item }) => <CamKart style={styles.kart}><Pressable onPress={() => { sekmeAc(item.url); router.push("/tarayici"); }} style={({ pressed }) => [styles.kartIcerik, pressed && styles.basili]}><View style={styles.simge}><MaterialCommunityIcons name="web" color="#FF6A2A" size={19} /></View><View style={styles.metinler}><Text numberOfLines={1} style={styles.baslik}>{item.baslik}</Text><Text numberOfLines={1} style={styles.url}>{item.url}</Text></View><Text style={styles.zaman}>{zamanEtiketi(item.ziyaretZamani)}</Text></Pressable></CamKart>} ListFooterComponent={durum.gecmis.length ? <YuvarlakButon icon="trash-can-outline" etiket="Tüm geçmişi temizle" tur="tehlike" onPress={temizlemeOnayi} style={styles.altButon} /> : null} /></View>;
}

const styles = StyleSheet.create({ ekran: { flex: 1, backgroundColor: "#080B10" }, icerik: { paddingHorizontal: 18, paddingBottom: 28 }, temizle: { color: "#FF9AA2", fontSize: 13, fontWeight: "800", paddingVertical: 4 }, kart: { marginTop: 10, padding: 8 }, kartIcerik: { minHeight: 54, flexDirection: "row", alignItems: "center", gap: 12 }, simge: { width: 40, height: 40, borderRadius: 14, justifyContent: "center", alignItems: "center", backgroundColor: "rgba(255, 106, 42, 0.1)" }, metinler: { flex: 1 }, baslik: { color: "#F6F8FB", fontSize: 14, lineHeight: 19, fontWeight: "800" }, url: { color: "#A8B3C2", fontSize: 11, lineHeight: 15, marginTop: 2 }, zaman: { color: "#7C899A", fontSize: 10, fontWeight: "700" }, bosDurum: { marginTop: 24 }, altButon: { marginTop: 24 }, basili: { opacity: 0.7, transform: [{ scale: 0.98 }] } });
