import MaterialCommunityIcons from "@expo/vector-icons/MaterialCommunityIcons";
import { router } from "expo-router";
import { FlatList, StyleSheet, Switch, Text, View } from "react-native";

import { BolumBasligi, CamKart, DurumRozeti, YuvarlakButon } from "@/bilesenler/akrep-ui";
import { useTarayici } from "@/lib/tarayici/baglam";

const korumalar = [
  { id: "httpsZorunlu", icon: "lock-check-outline" as const, baslik: "HTTPS zorunlu modu", aciklama: "Şifrelenmemiş üst seviye bağlantıları açmadan engeller.", renk: "#27D17F" },
  { id: "reklamEngelleme", icon: "shield-off-outline" as const, baslik: "Reklam engelleme", aciklama: "Bilinen reklam alanlarını ve sayfa içi reklam öğelerini WebView oturumunda engeller.", renk: "#27D17F" },
  { id: "takipKoruma", icon: "incognito" as const, baslik: "Takip koruması", aciklama: "Takip parametrelerini temizler ve bilinen takip yollarını engeller.", renk: "#27D17F" },
] as const;

export default function GizlilikEkrani() {
  const { durum, ayariDegistir } = useTarayici();
  const etkin = korumalar.filter((item) => durum.ayarlar[item.id]).length;
  return <View style={styles.ekran}><FlatList contentContainerStyle={styles.icerik} data={korumalar} keyExtractor={(item) => item.id} ListHeaderComponent={<><BolumBasligi baslik="Gizlilik merkezi" aciklama="Akrep içindeki WebView koruma durumu" /><CamKart style={styles.anaKart}><View style={styles.kalkan}><MaterialCommunityIcons name="shield-check-outline" color="#68DC9A" size={29} /></View><View style={styles.anaMetinler}><Text style={styles.anaBaslik}>Koruma açık</Text><Text style={styles.anaAciklama}>{etkin}/3 koruma etkin. Bu motor yalnızca Akrep Tarayıcı WebView oturumundaki trafiği ve sayfa öğelerini etkiler.</Text></View><DurumRozeti metin="WebView" ton="basari" /></CamKart></>} renderItem={({ item }) => <CamKart style={styles.kart}><View style={styles.kartIcerik}><View style={[styles.simge, { backgroundColor: `${item.renk}1A` }]}><MaterialCommunityIcons name={item.icon} color={item.renk} size={20} /></View><View style={styles.metinler}><Text style={styles.baslik}>{item.baslik}</Text><Text style={styles.aciklama}>{item.aciklama}</Text></View><Switch trackColor={{ false: "#34404E", true: "#4DBD78" }} thumbColor={durum.ayarlar[item.id] ? "#68DC9A" : "#D7DEE7"} value={durum.ayarlar[item.id]} onValueChange={(deger) => ayariDegistir(item.id, deger)} /></View></CamKart>} ListFooterComponent={<Text style={styles.altNot}>Cihaz genelinde DNS yönlendirme, VPN tüneli veya diğer uygulamaların trafiğine müdahale bu sürümde yapılmaz.</Text>} ListFooterComponentStyle={styles.footer}><YuvarlakButon icon="arrow-left" etiket="Ayarlar’a dön" onPress={() => router.back()} style={styles.altButon} /></FlatList></View>;
}

const styles = StyleSheet.create({ ekran: { flex: 1, backgroundColor: "#080B10" }, icerik: { paddingHorizontal: 18, paddingBottom: 30 }, anaKart: { padding: 17, flexDirection: "row", alignItems: "center", gap: 12, marginBottom: 8 }, kalkan: { width: 51, height: 51, borderRadius: 18, justifyContent: "center", alignItems: "center", backgroundColor: "rgba(104,220,154,0.12)" }, anaMetinler: { flex: 1 }, anaBaslik: { color: "#F6F8FB", fontSize: 16, lineHeight: 21, fontWeight: "900" }, anaAciklama: { color: "#A8B3C2", fontSize: 11, lineHeight: 16, marginTop: 3 }, kart: { marginTop: 10, padding: 14 }, kartIcerik: { minHeight: 48, flexDirection: "row", alignItems: "center", gap: 12 }, simge: { width: 42, height: 42, borderRadius: 14, justifyContent: "center", alignItems: "center" }, metinler: { flex: 1 }, baslik: { color: "#F6F8FB", fontSize: 14, lineHeight: 19, fontWeight: "800" }, aciklama: { color: "#A8B3C2", fontSize: 11, lineHeight: 16, marginTop: 2 }, footer: { alignItems: "center" }, altNot: { color: "#7C899A", textAlign: "center", fontSize: 11, lineHeight: 16, marginTop: 22, paddingHorizontal: 16 }, altButon: { marginTop: 15 } });
