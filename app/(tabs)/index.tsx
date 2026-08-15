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
  const geriDon = () => { onKapat(); if (expoRouter.canGoBack()) expoRouter.back(); };
  const anaSayfayiYenile = () => { onKapat(); expoRouter.replace("/(tabs)" as never); };
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
  return <Modal animationType="fade" transparent visible={acik} onRequestClose={onKapat}><Pressable accessibilityLabel="Menüyü kapat" onPress={onKapat} style={styles.menuPerdesi}><Pressable onPress={(olay) => olay.stopPropagation()} style={styles.menuPaneli}><View style={styles.menuHizliEylemler}><MenuYuvarlakButon icon="arrow-left" etiket="Geri" onPress={geriDon} /><MenuYuvarlakButon icon="star-outline" etiket="Yer imleri" onPress={() => onGit("/(tabs)/yer-imleri")} /><MenuYuvarlakButon icon="download-outline" etiket="İndirilenler" onPress={() => onGit("/indirmeler")} /><MenuYuvarlakButon icon="refresh" etiket="Yenile" onPress={anaSayfayiYenile} /></View>{eylemler.map((eylem, indeks) => <View key={eylem.id}>{indeks === 3 || indeks === 5 ? <View style={styles.menuAyirac} /> : null}<Pressable accessibilityLabel={eylem.ad} onPress={eylem.onPress} style={({ pressed }) => [styles.menuSatiri, pressed && styles.menuBasili]}><View style={styles.menuSimge}><MaterialCommunityIcons name={eylem.icon} color="#32372D" size={21} /></View><Text style={styles.menuMetni}>{eylem.ad}</Text><MaterialCommunityIcons name="chevron-right" color="#8D9386" size={18} /></Pressable></View>)}</Pressable></Pressable></Modal>;
}

function MenuYuvarlakButon({ icon, etiket, onPress }: { icon: React.ComponentProps<typeof MaterialCommunityIcons>["name"]; etiket: string; onPress: () => void }) {
  return <Pressable accessibilityLabel={etiket} onPress={onPress} style={({ pressed }) => [styles.menuYuvarlakButon, pressed && styles.menuBasili]}><MaterialCommunityIcons name={icon} color="#32372D" size={23} /></Pressable>;
}

const styles = StyleSheet.create({
  ekran: { flex: 1, backgroundColor: "#092116" }, koyuKatman: { ...StyleSheet.absoluteFillObject, backgroundColor: "rgba(4,16,10,0.35)" }, guvenliAlan: { flex: 1, paddingHorizontal: 18 }, ustCubuk: { height: 42, flexDirection: "row", alignItems: "center", justifyContent: "space-between" }, ustSag: { flexDirection: "row", alignItems: "center", gap: 6 }, ustSimge: { width: 34, height: 34, justifyContent: "center", alignItems: "center", borderRadius: 17, backgroundColor: "rgba(0,0,0,0.14)" }, sekmeRozeti: { width: 30, height: 30, alignItems: "center", justifyContent: "center", borderRadius: 10, borderWidth: 1.4, borderColor: "#FFFFFF", backgroundColor: "rgba(0,0,0,0.16)" }, sekmeSayisi: { color: "#FFFFFF", fontWeight: "800", fontSize: 10 }, markaAlani: { alignItems: "center", marginTop: 11, marginBottom: 18 }, marka: { color: "#FFFFFF", fontSize: 42, lineHeight: 47, letterSpacing: -1.6, fontWeight: "500" }, markaAlt: { color: "rgba(255,255,255,0.86)", fontSize: 10, lineHeight: 14, fontWeight: "600", marginTop: 1 }, aramaKapsayici: { height: 56, paddingLeft: 17, paddingRight: 7, alignItems: "center", flexDirection: "row", gap: 9, borderRadius: 29, backgroundColor: "#FFFFFF", shadowColor: "#031307", shadowOpacity: 0.2, shadowRadius: 11, elevation: 6 }, aramaGirdisi: { flex: 1, minHeight: 44, color: "#2E3137", fontSize: 15, lineHeight: 20, fontWeight: "500" }, aramaEylemi: { width: 39, height: 39, borderRadius: 20, alignItems: "center", justifyContent: "center", backgroundColor: "#F0F3EE" }, modSatiri: { flexDirection: "row", gap: 9, marginTop: 11 }, modButonu: { flex: 1, height: 44, borderRadius: 23, backgroundColor: "rgba(255,255,255,0.96)", alignItems: "center", justifyContent: "center", flexDirection: "row", gap: 8 }, modButonMetni: { color: "#2E3137", fontSize: 13, fontWeight: "700" }, hizliAlan: { minHeight: 106, paddingTop: 12, paddingBottom: 10, marginTop: 14, borderRadius: 21, backgroundColor: "rgba(248,251,238,0.94)" }, hizliBaslik: { color: "#3B473D", fontSize: 10, fontWeight: "800", letterSpacing: 0.25, marginLeft: 15, marginBottom: 7 }, hizliListe: { paddingHorizontal: 14, gap: 15 }, hizliOge: { width: 56, alignItems: "center", gap: 5 }, hizliSimge: { width: 42, height: 42, borderRadius: 21, alignItems: "center", justifyContent: "center" }, hizliMetin: { color: "#3B473D", fontSize: 8, lineHeight: 11, fontWeight: "700", textAlign: "center" }, guvenlikKarti: { marginTop: 14, padding: 14, borderRadius: 22, backgroundColor: "rgba(250,255,241,0.96)", shadowColor: "#031307", shadowOpacity: 0.16, shadowRadius: 11, elevation: 4 }, guvenlikUst: { flexDirection: "row", alignItems: "center", justifyContent: "space-between" }, guvenlikEtiket: { color: "#39433B", fontSize: 11, fontWeight: "800" }, guvenlikGovde: { flexDirection: "row", alignItems: "center", gap: 11, marginTop: 10 }, onaySimge: { width: 46, height: 46, alignItems: "center", justifyContent: "center", borderRadius: 16, backgroundColor: "#E5F1DF" }, guvenlikMetinleri: { flex: 1 }, guvenlikBaslik: { color: "#253129", fontSize: 16, lineHeight: 20, fontWeight: "700" }, guvenlikAciklama: { color: "#5B675E", fontSize: 9, lineHeight: 13, fontWeight: "600", marginTop: 2 }, inceleSatiri: { alignSelf: "flex-end", paddingHorizontal: 14, height: 34, borderRadius: 17, backgroundColor: "#1A6B12", alignItems: "center", flexDirection: "row", gap: 5, justifyContent: "center", marginTop: 10 }, inceleMetni: { color: "#FFFFFF", fontSize: 12, fontWeight: "800" }, basili: { opacity: 0.74, transform: [{ scale: 0.97 }] }, menuPerdesi: { flex: 1, backgroundColor: "rgba(0,0,0,0.34)", alignItems: "flex-end", paddingTop: 54, paddingRight: 10 }, menuPaneli: { width: 310, maxHeight: "82%", borderRadius: 26, overflow: "hidden", paddingVertical: 9, backgroundColor: "#F7F9EA", shadowColor: "#000000", shadowOpacity: 0.28, shadowRadius: 16, elevation: 11 }, menuHizliEylemler: { flexDirection: "row", paddingHorizontal: 14, paddingBottom: 10, gap: 11 }, menuYuvarlakButon: { width: 47, height: 47, alignItems: "center", justifyContent: "center", borderRadius: 24, backgroundColor: "#EDF0E4" }, menuSatiri: { minHeight: 48, paddingHorizontal: 15, flexDirection: "row", alignItems: "center", gap: 11 }, menuSimge: { width: 30, alignItems: "center" }, menuMetni: { flex: 1, color: "#32372D", fontSize: 15, fontWeight: "500" }, menuAyirac: { height: StyleSheet.hairlineWidth, backgroundColor: "#D8DDCA", marginHorizontal: 16, marginVertical: 4 }, menuBasili: { backgroundColor: "#E9EEDC" },
});
