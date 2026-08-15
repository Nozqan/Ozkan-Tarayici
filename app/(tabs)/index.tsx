import MaterialCommunityIcons from "@expo/vector-icons/MaterialCommunityIcons";
import { router as expoRouter } from "expo-router";
import { useMemo, useState } from "react";
import { FlatList, ImageBackground, Pressable, StyleSheet, Text, TextInput, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

import { dokunsalGeriBildirim } from "@/bilesenler/akrep-ui";
import { useTarayici } from "@/lib/tarayici/baglam";

const ARKA_PLAN = "/manus-storage/akrep-yeni-sekme-arka-plan_c72f368d.jpg";
const router = { push: (rota: string) => expoRouter.push(rota as never) };

const hizliEylemler = [
  { id: "yer-imleri", ad: "Yer imleri", icon: "star-outline" as const, rota: "/(tabs)/yer-imleri", renk: "#FFD166" },
  { id: "gecmis", ad: "Geçmiş", icon: "history" as const, rota: "/(tabs)/gecmis", renk: "#9DBBFF" },
  { id: "indirmeler", ad: "İndirmeler", icon: "download-outline" as const, rota: "/indirmeler", renk: "#6FE5B6" },
  { id: "gizlilik", ad: "Gizlilik", icon: "shield-check-outline" as const, rota: "/gizlilik", renk: "#FF9F70" },
  { id: "ayarlar", ad: "Ayarlar", icon: "cog-outline" as const, rota: "/(tabs)/ayarlar", renk: "#C5B4FF" },
];

export default function AnaSayfa() {
  const { durum, sekmeAc } = useTarayici();
  const [girdi, girdiAyarla] = useState("");
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

  return (
    <ImageBackground source={{ uri: ARKA_PLAN }} resizeMode="cover" style={styles.ekran}>
      <View style={styles.koyuKatman} />
      <SafeAreaView edges={["top", "left", "right"]} style={styles.guvenliAlan}>
        <View style={styles.ustCubuk}>
          <Pressable accessibilityLabel="Akrep ana sayfa" onPress={() => expoRouter.replace("/(tabs)" as never)} style={({ pressed }) => [styles.ustSimge, pressed && styles.basili]}>
            <MaterialCommunityIcons name="zodiac-scorpio" color="#FFFFFF" size={28} />
          </Pressable>
          <View style={styles.ustSag}>
            <Pressable accessibilityLabel="Sekme merkezi" onPress={() => router.push("/(tabs)/sekmeler")} style={({ pressed }) => [styles.sekmeRozeti, pressed && styles.basili]}>
              <Text style={styles.sekmeSayisi}>{durum.sekmeler.length}</Text>
            </Pressable>
            <Pressable accessibilityLabel="Ayarlar" onPress={() => router.push("/(tabs)/ayarlar")} style={({ pressed }) => [styles.ustSimge, pressed && styles.basili]}>
              <MaterialCommunityIcons name="dots-vertical" color="#FFFFFF" size={27} />
            </Pressable>
          </View>
        </View>

        <View style={styles.markaAlani}>
          <Text style={styles.marka}>Akrep</Text>
          <Text style={styles.markaAlt}>Hızlı, sakin ve kontrol sende.</Text>
        </View>

        <View style={styles.aramaKapsayici}>
          <MaterialCommunityIcons name="magnify" size={28} color="#FF6A2A" />
          <TextInput
            accessibilityLabel="Ara veya URL gir"
            autoCapitalize="none"
            autoCorrect={false}
            onChangeText={girdiAyarla}
            onSubmitEditing={aramayiBaslat}
            placeholder="Ara veya URL gir"
            placeholderTextColor="#6F737B"
            returnKeyType="go"
            style={styles.aramaGirdisi}
            value={girdi}
          />
          <Pressable accessibilityLabel="Aramayı başlat" onPress={aramayiBaslat} style={({ pressed }) => [styles.aramaEylemi, pressed && styles.basili]}>
            <MaterialCommunityIcons name="arrow-up-right" size={23} color="#202124" />
          </Pressable>
        </View>

        <View style={styles.modSatiri}>
          <Pressable accessibilityLabel="AI modu" onPress={() => router.push("/yapay-zeka")} style={({ pressed }) => [styles.modButonu, pressed && styles.basili]}>
            <MaterialCommunityIcons name="creation" color="#2E3137" size={24} />
            <Text style={styles.modButonMetni}>AI Modu</Text>
          </Pressable>
          <Pressable accessibilityLabel="Gizli modda yeni sekme aç" onPress={gizliSekmeAc} style={({ pressed }) => [styles.modButonu, pressed && styles.basili]}>
            <MaterialCommunityIcons name="incognito" color="#2E3137" size={25} />
            <Text style={styles.modButonMetni}>Gizli mod</Text>
          </Pressable>
        </View>

        <View style={styles.hizliAlan}>
          <Text style={styles.hizliBaslik}>Hızlı erişim</Text>
          <FlatList
            horizontal
            contentContainerStyle={styles.hizliListe}
            data={hizliEylemler}
            keyExtractor={(item) => item.id}
            showsHorizontalScrollIndicator={false}
            renderItem={({ item }) => (
              <Pressable accessibilityLabel={item.ad} onPress={() => router.push(item.rota)} style={({ pressed }) => [styles.hizliOge, pressed && styles.basili]}>
                <View style={[styles.hizliSimge, { backgroundColor: `${item.renk}20` }]}>
                  <MaterialCommunityIcons name={item.icon} color={item.renk} size={26} />
                </View>
                <Text numberOfLines={1} style={styles.hizliMetin}>{item.ad}</Text>
              </Pressable>
            )}
          />
        </View>

        <Pressable accessibilityLabel="Güvenlik ayrıntılarını incele" onPress={() => router.push("/gizlilik")} style={({ pressed }) => [styles.guvenlikKarti, pressed && styles.basili]}>
          <View style={styles.guvenlikUst}> 
            <Text style={styles.guvenlikEtiket}>Akrep Güvenlik</Text>
            <MaterialCommunityIcons name="shield-check" color="#16833E" size={22} />
          </View>
          <View style={styles.guvenlikGovde}>
            <View style={styles.onaySimge}><MaterialCommunityIcons name="check" size={28} color="#16833E" /></View>
            <View style={styles.guvenlikMetinleri}>
              <Text style={styles.guvenlikBaslik}>Gezinme koruman hazır</Text>
              <Text style={styles.guvenlikAciklama}>{korumaMetni}. Engellenen istek: {durum.engellenenIstekSayisi}.</Text>
            </View>
          </View>
          <View style={styles.inceleSatiri}>
            <Text style={styles.inceleMetni}>İncele</Text>
            <MaterialCommunityIcons name="arrow-right" color="#FFFFFF" size={20} />
          </View>
        </Pressable>
      </SafeAreaView>
    </ImageBackground>
  );
}

const styles = StyleSheet.create({
  ekran: { flex: 1, backgroundColor: "#092116" },
  koyuKatman: { ...StyleSheet.absoluteFillObject, backgroundColor: "rgba(4, 16, 10, 0.30)" },
  guvenliAlan: { flex: 1, paddingHorizontal: 22 },
  ustCubuk: { height: 52, flexDirection: "row", alignItems: "center", justifyContent: "space-between" },
  ustSag: { flexDirection: "row", alignItems: "center", gap: 10 },
  ustSimge: { width: 42, height: 42, justifyContent: "center", alignItems: "center", borderRadius: 21, backgroundColor: "rgba(0, 0, 0, 0.16)" },
  sekmeRozeti: { width: 38, height: 38, alignItems: "center", justifyContent: "center", borderRadius: 13, borderWidth: 2, borderColor: "#FFFFFF", backgroundColor: "rgba(0, 0, 0, 0.18)" },
  sekmeSayisi: { color: "#FFFFFF", fontWeight: "900", fontSize: 13 },
  markaAlani: { alignItems: "center", marginTop: 28, marginBottom: 42 },
  marka: { color: "#FFFFFF", fontSize: 66, lineHeight: 70, letterSpacing: -2.8, fontWeight: "500" },
  markaAlt: { color: "rgba(255,255,255,0.88)", fontSize: 13, lineHeight: 18, fontWeight: "700", marginTop: 5 },
  aramaKapsayici: { height: 78, paddingLeft: 23, paddingRight: 12, alignItems: "center", flexDirection: "row", gap: 13, borderRadius: 40, backgroundColor: "#FFFFFF", shadowColor: "#031307", shadowOpacity: 0.28, shadowRadius: 18, elevation: 8 },
  aramaGirdisi: { flex: 1, minHeight: 54, color: "#2E3137", fontSize: 19, lineHeight: 25, fontWeight: "500" },
  aramaEylemi: { width: 49, height: 49, borderRadius: 25, alignItems: "center", justifyContent: "center", backgroundColor: "#F0F3EE" },
  modSatiri: { flexDirection: "row", gap: 12, marginTop: 17 },
  modButonu: { flex: 1, height: 58, borderRadius: 30, backgroundColor: "rgba(255, 255, 255, 0.96)", alignItems: "center", justifyContent: "center", flexDirection: "row", gap: 11 },
  modButonMetni: { color: "#2E3137", fontSize: 17, fontWeight: "700" },
  hizliAlan: { minHeight: 166, paddingTop: 18, paddingBottom: 14, marginTop: 26, borderRadius: 27, backgroundColor: "rgba(248, 251, 238, 0.94)" },
  hizliBaslik: { color: "#3B473D", fontSize: 13, fontWeight: "800", letterSpacing: 0.4, marginLeft: 21, marginBottom: 10 },
  hizliListe: { paddingHorizontal: 16, gap: 16 },
  hizliOge: { width: 73, alignItems: "center", gap: 9 },
  hizliSimge: { width: 58, height: 58, borderRadius: 29, alignItems: "center", justifyContent: "center" },
  hizliMetin: { color: "#3B473D", fontSize: 11, lineHeight: 15, fontWeight: "700", textAlign: "center" },
  guvenlikKarti: { marginTop: 20, padding: 22, borderRadius: 31, backgroundColor: "rgba(250, 255, 241, 0.96)", shadowColor: "#031307", shadowOpacity: 0.20, shadowRadius: 18, elevation: 6 },
  guvenlikUst: { flexDirection: "row", alignItems: "center", justifyContent: "space-between" },
  guvenlikEtiket: { color: "#39433B", fontSize: 15, fontWeight: "800" },
  guvenlikGovde: { flexDirection: "row", alignItems: "center", gap: 16, marginTop: 18 },
  onaySimge: { width: 70, height: 70, alignItems: "center", justifyContent: "center", borderRadius: 23, backgroundColor: "#E5F1DF" },
  guvenlikMetinleri: { flex: 1 },
  guvenlikBaslik: { color: "#253129", fontSize: 23, lineHeight: 29, fontWeight: "700" },
  guvenlikAciklama: { color: "#5B675E", fontSize: 12, lineHeight: 17, fontWeight: "600", marginTop: 5 },
  inceleSatiri: { alignSelf: "flex-end", paddingHorizontal: 20, height: 48, borderRadius: 24, backgroundColor: "#1A6B12", alignItems: "center", flexDirection: "row", gap: 7, justifyContent: "center", marginTop: 20 },
  inceleMetni: { color: "#FFFFFF", fontSize: 16, fontWeight: "800" },
  basili: { opacity: 0.76, transform: [{ scale: 0.97 }] },
});
