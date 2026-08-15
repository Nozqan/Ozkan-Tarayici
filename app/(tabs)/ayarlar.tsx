import MaterialCommunityIcons from "@expo/vector-icons/MaterialCommunityIcons";
import { router as expoRouter } from "expo-router";
import { FlatList, Pressable, StyleSheet, Switch, Text, View } from "react-native";
import { BolumBasligi, CamKart } from "@/bilesenler/akrep-ui";
import { useTarayici } from "@/lib/tarayici/baglam";

const router = {
  push: (rota: string) => expoRouter.push(rota as never),
};

type AyarSatiri = { id: string; icon: React.ComponentProps<typeof MaterialCommunityIcons>["name"]; baslik: string; aciklama: string; ayar?: "httpsZorunlu" | "reklamEngelleme" | "takipKoruma" | "guvenliDns" | "masaustuGorunumu"; rota?: "/gizlilik" | "/vpn" | "/yapay-zeka" | "/indirmeler"; renk: string };

const ayarlar: AyarSatiri[] = [
  { id: "https", icon: "lock-check-outline", baslik: "HTTPS zorunlu modu", aciklama: "Mümkün olduğunda güvenli bağlantıyı tercih eder.", ayar: "httpsZorunlu", renk: "#27D17F" },
  { id: "reklam", icon: "shield-off-outline", baslik: "Reklam engelleme", aciklama: "Filtre motoru kurulmadan etkin koruma iddiası yapılmaz.", ayar: "reklamEngelleme", renk: "#FFB000" },
  { id: "takip", icon: "incognito", baslik: "Takip koruması", aciklama: "Gelişmiş filtre katmanı sonraki sürümdedir.", ayar: "takipKoruma", renk: "#FFB000" },
  { id: "dns", icon: "dns-outline", baslik: "Güvenli DNS", aciklama: "DoH sağlayıcısı yapılandırılmadan etkin değildir.", ayar: "guvenliDns", renk: "#FFB000" },
  { id: "masaustu", icon: "monitor-cellphone", baslik: "Masaüstü görünümü", aciklama: "Web motoru bağlandığında kullanıcı ajanına uygulanır.", ayar: "masaustuGorunumu", renk: "#A8B3C2" },
  { id: "gizlilik", icon: "shield-lock-outline", baslik: "Gizlilik merkezi", aciklama: "İzinler ve koruma davranışları", rota: "/gizlilik", renk: "#FF6A2A" },
  { id: "vpn", icon: "vpn", baslik: "VPN merkezi", aciklama: "Gerçek WireGuard motoru ve gateway durumu", rota: "/vpn", renk: "#FFB000" },
  { id: "ai", icon: "creation", baslik: "Yapay zekâ merkezi", aciklama: "İzinli sayfa analizi ve entegrasyon hazırlığı", rota: "/yapay-zeka", renk: "#FF6A2A" },
  { id: "indirmeler", icon: "download-box-outline", baslik: "İndirme merkezi", aciklama: "Gerçek indirme görevleri ve dosya durumu için hazırlık", rota: "/indirmeler", renk: "#5B9DFF" },
];

export default function AyarlarEkrani() {
  const { durum, ayariDegistir } = useTarayici();
  return <View style={styles.ekran}><FlatList contentContainerStyle={styles.icerik} data={ayarlar} keyExtractor={(item) => item.id} ListHeaderComponent={<><BolumBasligi baslik="Ayarlar" aciklama="Tercihler cihazında yerel olarak saklanır" /><CamKart style={styles.profilKart}><View style={styles.profilSimge}><MaterialCommunityIcons name="zodiac-scorpio" color="#FF6A2A" size={25} /></View><View style={styles.profilMetinleri}><Text style={styles.profilBaslik}>Akrep Tarayıcı</Text><Text style={styles.profilAciklama}>İlk sürüm · Yerel profil</Text></View><Text style={styles.surum}>v0.1</Text></CamKart></>} renderItem={({ item }) => <CamKart style={styles.ayarKart}><View style={styles.ayarIcerik}><View style={[styles.ayarSimge, { backgroundColor: `${item.renk}1A` }]}><MaterialCommunityIcons name={item.icon} size={20} color={item.renk} /></View><View style={styles.ayarMetinleri}><Text style={styles.ayarBaslik}>{item.baslik}</Text><Text style={styles.ayarAciklama}>{item.aciklama}</Text></View>{item.ayar ? <Switch trackColor={{ false: "#34404E", true: "#FF8B5B" }} thumbColor={durum.ayarlar[item.ayar] ? "#FF6A2A" : "#D7DEE7"} value={durum.ayarlar[item.ayar]} onValueChange={(deger) => ayariDegistir(item.ayar!, deger)} /> : null}{item.rota ? <Pressable accessibilityLabel={`${item.baslik} aç`} onPress={() => router.push(item.rota!)} style={({ pressed }) => [styles.gecisButonu, pressed && styles.basili]}><MaterialCommunityIcons name="chevron-right" color="#A8B3C2" size={22} /></Pressable> : null}</View></CamKart>} ListFooterComponent={<Text style={styles.altNot}>Bir koruma tercihini açmak, ilgili motor veya sağlayıcı kurulmadan tek başına korumanın aktif olduğu anlamına gelmez.</Text>} /></View>;
}

const styles = StyleSheet.create({ ekran: { flex: 1, backgroundColor: "#080B10" }, icerik: { paddingHorizontal: 18, paddingBottom: 30 }, profilKart: { padding: 16, flexDirection: "row", alignItems: "center", gap: 12, marginBottom: 8 }, profilSimge: { width: 48, height: 48, borderRadius: 17, backgroundColor: "rgba(255, 106, 42, 0.13)", alignItems: "center", justifyContent: "center" }, profilMetinleri: { flex: 1 }, profilBaslik: { color: "#F6F8FB", fontSize: 16, lineHeight: 21, fontWeight: "900" }, profilAciklama: { color: "#A8B3C2", fontSize: 12, lineHeight: 17, marginTop: 2 }, surum: { color: "#FFB000", fontSize: 11, fontWeight: "800" }, ayarKart: { marginTop: 10, paddingHorizontal: 14, paddingVertical: 10 }, ayarIcerik: { minHeight: 48, flexDirection: "row", alignItems: "center", gap: 12 }, ayarSimge: { width: 42, height: 42, borderRadius: 14, justifyContent: "center", alignItems: "center" }, ayarMetinleri: { flex: 1 }, ayarBaslik: { color: "#F6F8FB", fontSize: 14, lineHeight: 19, fontWeight: "800" }, ayarAciklama: { color: "#A8B3C2", fontSize: 11, lineHeight: 15, marginTop: 2 }, gecisButonu: { width: 38, height: 38, alignItems: "center", justifyContent: "center", borderRadius: 14 }, altNot: { color: "#7C899A", fontSize: 11, lineHeight: 16, textAlign: "center", paddingHorizontal: 16, marginTop: 22 }, basili: { opacity: 0.68, transform: [{ scale: 0.96 }] } });
