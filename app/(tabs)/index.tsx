import MaterialCommunityIcons from "@expo/vector-icons/MaterialCommunityIcons";
import { router as expoRouter } from "expo-router";
import { useMemo, useState } from "react";
import { FlatList, ImageBackground, Modal, Pressable, StyleSheet, Text, TextInput, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

import { dokunsalGeriBildirim } from "@/bilesenler/akrep-ui";
import { useTarayici } from "@/lib/tarayici/baglam";

const ARKA_PLAN = "/manus-storage/akrep-yeni-sekme-arka-plan_c72f368d.jpg";
const router = { push: (rota: string) => expoRouter.push(rota as never) };

const hizliEylemler = [
  { id: "indirmeler", ad: "İndirmeler", icon: "download-outline" as const, rota: "/indirmeler", renk: "#6FE5B6" },
  { id: "gizlilik", ad: "Gizlilik", icon: "shield-check-outline" as const, rota: "/gizlilik", renk: "#FF9F70" },
  { id: "ai", ad: "AI araçları", icon: "creation" as const, rota: "/yapay-zeka", renk: "#C5B4FF" },
];

export default function AnaSayfa() {
  const { durum, sekmeAc, gecmisiTemizle } = useTarayici();
  const [girdi, girdiAyarla] = useState("");
  const [menuAcik, menuAcikAyarla] = useState(false);
  const korumaMetni = useMemo(() => {
    const etkin = [durum.ayarlar.httpsZorunlu, durum.ayarlar.reklamEngelleme, durum.ayarlar.takipKoruma].filter(Boolean).length;
    return `${etkin}/3 web koruması etkin`;
  }, [durum.ayarlar]);

  const aramayiBaslat = () => {
    if (!girdi.trim()) return;
    dokunsalGeriBildirim("hafif");
    sekmeAc(girdi);
    girdiAyarla("");
    router.push("/tarayici");
  };

  const gizliSekmeAc = () => {
    dokunsalGeriBildirim("orta");
    sekmeAc(undefined, "gizli");
    router.push("/tarayici");
  };

  const menuyeGit = (rota: string) => {
    menuAcikAyarla(false);
    router.push(rota);
  };

  return <ImageBackground source={{ uri: ARKA_PLAN }} resizeMode="cover" style={styles.ekran}><View style={styles.koyuKatman} /><SafeAreaView edges={["top", "left", "right"]} style={styles.guvenliAlan}><View style={styles.ustCubuk}><Pressable accessibilityLabel="Akrep ana sayfa" onPress={() => expoRouter.replace("/(tabs)" as never)} style={({ pressed }) => [styles.ustSimge, pressed && styles.basili]}><MaterialCommunityIcons name="zodiac-scorpio" color="#FFFFFF" size={24} /></Pressable><View style={styles.ustSag}><Pressable accessibilityLabel="Sekme merkezi" onPress={() => menuyeGit("/(tabs)/sekmeler")} style={({ pressed }) => [styles.sekmeRozeti, pressed && styles.basili]}><Text style={styles.sekmeSayisi}>{durum.sekmeler.length}</Text></Pressable><Pressable accessibilityLabel="Tarayıcı menüsünü aç" onPress={() => menuAcikAyarla(true)} style={({ pressed }) => [styles.ustSimge, pressed && styles.basili]}><MaterialCommunityIcons name="dots-vertical" color="#FFFFFF" size={24} /></Pressable></View></View><View style={styles.markaAlani}><Text style={styles.marka}>Akrep</Text><Text style={styles.markaAlt}>Hızlı, sakin ve kontrol sende.</Text></View><View style={styles.aramaKapsayici}><MaterialCommunityIcons name="magnify" size={23} color="#FF6A2A" /><TextInput accessibilityLabel="Ara veya URL gir" autoCapitalize="none" autoCorrect={false} onChangeText={girdiAyarla} onSubmitEditing={aramayiBaslat} placeholder="Ara veya URL gir" placeholderTextColor="#6F737B" returnKeyType="go" style={styles.aramaGirdisi} value={girdi} /><Pressable accessibilityLabel="Aramayı başlat" onPress={aramayiBaslat} style={({ pressed }) => [styles.aramaEylemi, pressed && styles.basili]}><MaterialCommunityIcons name="arrow-up-right" size={20} color="#202124" /></Pressable></View><View style={styles.modSatiri}><Pressable accessibilityLabel="AI modu" onPress={() => router.push("/yapay-zeka")} style={({ pressed }) => [styles.modButonu, pressed && styles.basili]}><MaterialCommunityIcons name="creation" color="#2E3137" size={21} /><Text style={styles.modButonMetni}>AI Modu</Text></Pressable><Pressable accessibilityLabel="Gizli modda yeni sekme aç" onPress={gizliSekmeAc} style={({ pressed }) => [styles.modButonu, pressed && styles.basili]}><MaterialCommunityIcons name="incognito" color="#2E3137" size={22} /><Text style={styles.modButonMetni}>Gizli mod</Text></Pressable></View><View style={styles.hizliAlan}><Text style={styles.hizliBaslik}>Hızlı erişim</Text><FlatList horizontal contentContainerStyle={styles.hizliListe} data={hizliEylemler} keyExtractor={(item) => item.id} showsHorizontalScrollIndicator={false} renderItem={({ item }) => <Pressable accessibilityLabel={item.ad} onPress={() => router.push(item.rota)} style={({ pressed }) => [styles.hizliOge, pressed && styles.basili]}><View style={[styles.hizliSimge, { backgroundColor: `${item.renk}20` }]}><MaterialCommunityIcons name={item.icon} color={item.renk} size={22} /></View><Text numberOfLines={1} style={styles.hizliMetin}>{item.ad}</Text></Pressable>} /></View><Pressable accessibilityLabel="Güvenlik ayrıntılarını incele" onPress={() => router.push("/gizlilik")} style={({ pressed }) => [styles.guvenlikKarti, pressed && styles.basili]}><View style={styles.guvenlikUst}><Text style={styles.guvenlikEtiket}>Akrep Güvenlik</Text><MaterialCommunityIcons name="shield-check" color="#16833E" size={18} /></View><View style={styles.guvenlikGovde}><View style={styles.onaySimge}><MaterialCommunityIcons name="check" size={23} color="#16833E" /></View><View style={styles.guvenlikMetinleri}><Text style={styles.guvenlikBaslik}>Gezinme koruman hazır</Text><Text style={styles.guvenlikAciklama}>{korumaMetni}. Engellenen istek: {durum.engellenenIstekSayisi}.</Text></View></View><View style={styles.inceleSatiri}><Text style={styles.inceleMetni}>İncele</Text><MaterialCommunityIcons name="arrow-right" color="#FFFFFF" size={17} /></View></Pressable></SafeAreaView><TarayiciMenusu acik={menuAcik} onKapat={() => menuAcikAyarla(false)} onYeniSekme={() => { menuAcikAyarla(false); sekmeAc(); router.push("/tarayici"); }} onGizliSekme={gizliSekmeAc} onGecmisiTemizle={() => { gecmisiTemizle(); menuAcikAyarla(false); }} onGit={menuyeGit} /></ImageBackground>;
}

function TarayiciMenusu({ acik, onKapat, onYeniSekme, onGizliSekme, onGecmisiTemizle, onGit }: { acik: boolean; onKapat: () => void; onYeniSekme: () => void; onGizliSekme: () => void; onGecmisiTemizle: () => void; onGit: (rota: string) => void }) {
  const eylemler = [
    { id: "yeni", icon: "plus-box-outline" as const, ad: "Yeni sekme", onPress: onYeniSekme },
    { id: "gizli", icon: "incognito" as const, ad: "Yeni gizli sekme", onPress: onGizliSekme },
    { id: "sekmeler", icon: "tab" as const, ad: "Sekmeler", onPress: () => onGit("/(tabs)/sekmeler") },
    { id: "gecmis", icon: "history" as const, ad: "Geçmiş", onPress: () => onGit("/(tabs)/gecmis") },
    { id: "temizle", icon: "trash-can-outline" as const, ad: "Geçmişi temizle", onPress: onGecmisiTemizle },
    { id: "indirme", icon: "download-outline" as const, ad: "İndirilenler", onPress: () => onGit("/indirmeler") },
    { id: "yerimi", icon: "star-outline" as const, ad: "Yer imleri", onPress: () => onGit("/(tabs)/yer-imleri") },
    { id: "gizlilik", icon: "shield-check-outline" as const, ad: "Gizlilik", onPress: () => onGit("/gizlilik") },
    { id: "ayarlar", icon: "cog-outline" as const, ad: "Ayarlar", onPress: () => onGit("/(tabs)/ayarlar") },
  ];
  return <Modal animationType="fade" transparent visible={acik} onRequestClose={onKapat}><Pressable accessibilityLabel="Menüyü kapat" onPress={onKapat} style={styles.menuPerdesi}><Pressable onPress={(olay) => olay.stopPropagation()} style={styles.menuPaneli}>{eylemler.map((eylem, indeks) => <View key={eylem.id}>{indeks === 3 || indeks === 5 ? <View style={styles.menuAyirac} /> : null}<Pressable accessibilityLabel={eylem.ad} onPress={eylem.onPress} style={({ pressed }) => [styles.menuSatiri, pressed && styles.menuBasili]}><View style={styles.menuSimge}><MaterialCommunityIcons name={eylem.icon} color="#32372D" size={22} /></View><Text style={styles.menuMetni}>{eylem.ad}</Text><MaterialCommunityIcons name="chevron-right" color="#8D9386" size={20} /></Pressable></View>)}</Pressable></Pressable></Modal>;
}

const styles = StyleSheet.create({
  ekran: { flex: 1, backgroundColor: "#092116" }, koyuKatman: { ...StyleSheet.absoluteFillObject, backgroundColor: "rgba(4,16,10,0.35)" }, guvenliAlan: { flex: 1, paddingHorizontal: 20 }, ustCubuk: { height: 46, flexDirection: "row", alignItems: "center", justifyContent: "space-between" }, ustSag: { flexDirection: "row", alignItems: "center", gap: 8 }, ustSimge: { width: 37, height: 37, justifyContent: "center", alignItems: "center", borderRadius: 18, backgroundColor: "rgba(0,0,0,0.14)" }, sekmeRozeti: { width: 33, height: 33, alignItems: "center", justifyContent: "center", borderRadius: 11, borderWidth: 1.5, borderColor: "#FFFFFF", backgroundColor: "rgba(0,0,0,0.16)" }, sekmeSayisi: { color: "#FFFFFF", fontWeight: "900", fontSize: 11 }, markaAlani: { alignItems: "center", marginTop: 18, marginBottom: 24 }, marka: { color: "#FFFFFF", fontSize: 47, lineHeight: 53, letterSpacing: -1.8, fontWeight: "500" }, markaAlt: { color: "rgba(255,255,255,0.86)", fontSize: 11, lineHeight: 15, fontWeight: "700", marginTop: 2 }, aramaKapsayici: { height: 62, paddingLeft: 19, paddingRight: 8, alignItems: "center", flexDirection: "row", gap: 10, borderRadius: 32, backgroundColor: "#FFFFFF", shadowColor: "#031307", shadowOpacity: 0.24, shadowRadius: 13, elevation: 7 }, aramaGirdisi: { flex: 1, minHeight: 48, color: "#2E3137", fontSize: 16, lineHeight: 21, fontWeight: "500" }, aramaEylemi: { width: 42, height: 42, borderRadius: 21, alignItems: "center", justifyContent: "center", backgroundColor: "#F0F3EE" }, modSatiri: { flexDirection: "row", gap: 10, marginTop: 13 }, modButonu: { flex: 1, height: 48, borderRadius: 25, backgroundColor: "rgba(255,255,255,0.96)", alignItems: "center", justifyContent: "center", flexDirection: "row", gap: 9 }, modButonMetni: { color: "#2E3137", fontSize: 14, fontWeight: "700" }, hizliAlan: { minHeight: 122, paddingTop: 14, paddingBottom: 12, marginTop: 18, borderRadius: 23, backgroundColor: "rgba(248,251,238,0.94)" }, hizliBaslik: { color: "#3B473D", fontSize: 11, fontWeight: "800", letterSpacing: 0.3, marginLeft: 17, marginBottom: 8 }, hizliListe: { paddingHorizontal: 15, gap: 16 }, hizliOge: { width: 58, alignItems: "center", gap: 7 }, hizliSimge: { width: 45, height: 45, borderRadius: 23, alignItems: "center", justifyContent: "center" }, hizliMetin: { color: "#3B473D", fontSize: 9, lineHeight: 12, fontWeight: "700", textAlign: "center" }, guvenlikKarti: { marginTop: 16, padding: 16, borderRadius: 25, backgroundColor: "rgba(250,255,241,0.96)", shadowColor: "#031307", shadowOpacity: 0.18, shadowRadius: 13, elevation: 5 }, guvenlikUst: { flexDirection: "row", alignItems: "center", justifyContent: "space-between" }, guvenlikEtiket: { color: "#39433B", fontSize: 12, fontWeight: "800" }, guvenlikGovde: { flexDirection: "row", alignItems: "center", gap: 13, marginTop: 13 }, onaySimge: { width: 54, height: 54, alignItems: "center", justifyContent: "center", borderRadius: 18, backgroundColor: "#E5F1DF" }, guvenlikMetinleri: { flex: 1 }, guvenlikBaslik: { color: "#253129", fontSize: 18, lineHeight: 23, fontWeight: "700" }, guvenlikAciklama: { color: "#5B675E", fontSize: 10, lineHeight: 14, fontWeight: "600", marginTop: 3 }, inceleSatiri: { alignSelf: "flex-end", paddingHorizontal: 16, height: 40, borderRadius: 20, backgroundColor: "#1A6B12", alignItems: "center", flexDirection: "row", gap: 6, justifyContent: "center", marginTop: 14 }, inceleMetni: { color: "#FFFFFF", fontSize: 13, fontWeight: "800" }, basili: { opacity: 0.74, transform: [{ scale: 0.97 }] }, menuPerdesi: { flex: 1, backgroundColor: "rgba(0,0,0,0.34)", alignItems: "flex-end", paddingTop: 63, paddingRight: 13 }, menuPaneli: { width: 292, borderRadius: 25, overflow: "hidden", paddingVertical: 8, backgroundColor: "#F7F9EA", shadowColor: "#000000", shadowOpacity: 0.28, shadowRadius: 16, elevation: 11 }, menuSatiri: { minHeight: 52, paddingHorizontal: 15, flexDirection: "row", alignItems: "center", gap: 12 }, menuSimge: { width: 31, alignItems: "center" }, menuMetni: { flex: 1, color: "#32372D", fontSize: 16, fontWeight: "500" }, menuAyirac: { height: StyleSheet.hairlineWidth, backgroundColor: "#D8DDCA", marginHorizontal: 16, marginVertical: 5 }, menuBasili: { backgroundColor: "#E9EEDC" },
});
