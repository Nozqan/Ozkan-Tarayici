import MaterialCommunityIcons from "@expo/vector-icons/MaterialCommunityIcons";
import { router as expoRouter } from "expo-router";
import { useMemo, useState } from "react";
import { FlatList, Pressable, StyleSheet, Text, TextInput, View } from "react-native";

import { BolumBasligi, CamKart, dokunsalGeriBildirim, SimgeliSatir, YuvarlakButon } from "@/bilesenler/akrep-ui";
import { useTarayici } from "@/lib/tarayici/baglam";
import { zamanEtiketi } from "@/lib/tarayici/modeller";

const router = { push: (rota: string) => expoRouter.push(rota as never) };

const hizliBaglantilar = [
  { id: "google", ad: "Google", url: "https://www.google.com", icon: "google" as const, renk: "#5B9DFF" },
  { id: "youtube", ad: "YouTube", url: "https://www.youtube.com", icon: "youtube" as const, renk: "#FF4D5A" },
  { id: "wikipedia", ad: "Wikipedia", url: "https://tr.wikipedia.org", icon: "book-open-page-variant-outline" as const, renk: "#A8B3C2" },
  { id: "github", ad: "GitHub", url: "https://github.com", icon: "github" as const, renk: "#F6F8FB" },
];

export default function AnaSayfa() {
  const { durum, sekmeAc } = useTarayici();
  const [girdi, girdiAyarla] = useState("");
  const korumaMetni = useMemo(() => {
    const etkin = [durum.ayarlar.httpsZorunlu, durum.ayarlar.reklamEngelleme, durum.ayarlar.takipKoruma, durum.ayarlar.guvenliDns].filter(Boolean).length;
    return `${etkin}/4 tercih etkin`;
  }, [durum.ayarlar]);

  const aramayiBaslat = () => {
    if (!girdi.trim()) return;
    dokunsalGeriBildirim("hafif");
    sekmeAc(girdi);
    girdiAyarla("");
    router.push("/tarayici");
  };

  return (
    <View style={styles.ekran}>
      <FlatList
        contentContainerStyle={styles.icerik}
        data={durum.gecmis.slice(0, 4)}
        keyExtractor={(item) => item.id}
        ListHeaderComponent={
          <>
            <View style={styles.ustAlan}>
              <View><Text style={styles.marka}>AKREP</Text><Text style={styles.markaAlt}>Tarayıcı</Text></View>
              <Pressable accessibilityLabel="Yeni gizli sekme aç" onPress={() => { sekmeAc(undefined, "gizli"); router.push("/tarayici"); }} style={({ pressed }) => [styles.gizliButon, pressed && styles.basili]}>
                <MaterialCommunityIcons name="incognito" size={19} color="#FFB000" />
              </Pressable>
            </View>
            <View style={styles.karsilama}>
              <View style={styles.amblem}><MaterialCommunityIcons name="zodiac-scorpio" size={42} color="#FF6A2A" /></View>
              <View style={styles.karsilamaMetinleri}>
                <Text style={styles.karsilamaBaslik}>Güvenli gezin, sade kal.</Text>
                <Text style={styles.karsilamaAciklama}>Akrep{String.fromCharCode(39)}in cam yüzeyleri, hızlı sekmeler ve kontrolün sende olduğu bir tarayıcı deneyimi.</Text>
              </View>
            </View>
            <View style={styles.aramaKapsayici}>
              <MaterialCommunityIcons name="magnify" size={21} color="#A8B3C2" />
              <TextInput accessibilityLabel="Ara veya adres gir" autoCapitalize="none" autoCorrect={false} onChangeText={girdiAyarla} onSubmitEditing={aramayiBaslat} placeholder="Ara veya adres gir" placeholderTextColor="#7C899A" returnKeyType="go" style={styles.aramaGirdisi} value={girdi} />
              <Pressable accessibilityLabel="Aramayı başlat" onPress={aramayiBaslat} style={({ pressed }) => [styles.gitButonu, pressed && styles.basili]}><MaterialCommunityIcons name="arrow-up-right" size={18} color="#080B10" /></Pressable>
            </View>
            <BolumBasligi baslik="Hızlı erişim" aciklama="Yeni sekmede açılır" />
            <View style={styles.hizliSatir}>
              {hizliBaglantilar.map((baglanti) => (
                <Pressable key={baglanti.id} accessibilityLabel={`${baglanti.ad} aç`} onPress={() => { sekmeAc(baglanti.url); router.push("/tarayici"); }} style={({ pressed }) => [styles.hizliOge, pressed && styles.basili]}>
                  <View style={[styles.hizliSimge, { backgroundColor: `${baglanti.renk}1D` }]}><MaterialCommunityIcons name={baglanti.icon} size={22} color={baglanti.renk} /></View>
                  <Text style={styles.hizliMetin}>{baglanti.ad}</Text>
                </Pressable>
              ))}
            </View>
            <BolumBasligi baslik="Akrep merkezi" aciklama="Gerçek durumlar ve kurulum bilgileri" />
            <CamKart style={styles.merkezKart}>
              <SimgeliSatir icon="shield-lock-outline" iconRengi="#FFB000" baslik="Gizlilik tercihleri" aciklama={korumaMetni} onPress={() => router.push("/gizlilik")} />
              <View style={styles.ayrac} />
              <SimgeliSatir icon="vpn" iconRengi="#FFB000" baslik="VPN altyapısı" aciklama="Gerçek WireGuard sunucusu henüz yapılandırılmadı." onPress={() => router.push("/vpn")} sagMetin="Kurulum gerekli" />
              <View style={styles.ayrac} />
              <SimgeliSatir icon="creation" iconRengi="#FF6A2A" baslik="Yapay zekâ araçları" aciklama="Sayfa verisi gönderilmeden önce izin ister." onPress={() => router.push("/yapay-zeka")} sagMetin="Hazırlık" />
            </CamKart>
            <BolumBasligi baslik="Son ziyaretler" aciklama="Normal sekmelerden kaydedilir" />
          </>
        }
        ListEmptyComponent={<CamKart style={styles.bosGecmis}><MaterialCommunityIcons name="history" size={24} color="#A8B3C2" /><Text style={styles.bosBaslik}>Henüz ziyaret kaydı yok</Text><Text style={styles.bosAciklama}>İlk aramanı başlat; ziyaretlerin burada görünür.</Text></CamKart>}
        renderItem={({ item }) => <Pressable onPress={() => { sekmeAc(item.url); router.push("/tarayici"); }} style={({ pressed }) => [styles.gecmisSatiri, pressed && styles.basili]}><View style={styles.gecmisSimge}><MaterialCommunityIcons name="web" size={18} color="#FF6A2A" /></View><View style={styles.gecmisMetinleri}><Text numberOfLines={1} style={styles.gecmisBasligi}>{item.baslik}</Text><Text numberOfLines={1} style={styles.gecmisUrl}>{item.url}</Text></View><Text style={styles.zaman}>{zamanEtiketi(item.ziyaretZamani)}</Text></Pressable>}
        ListFooterComponent={<View style={styles.altEylem}><YuvarlakButon icon="plus" etiket="Yeni sekme" tur="birincil" onPress={() => { sekmeAc(); router.push("/tarayici"); }} style={styles.yeniSekmeButonu} /></View>}
        showsVerticalScrollIndicator={false}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  ekran: { flex: 1, backgroundColor: "#080B10" }, icerik: { paddingHorizontal: 18, paddingBottom: 32 }, ustAlan: { flexDirection: "row", justifyContent: "space-between", alignItems: "center", paddingTop: 10 }, marka: { color: "#F6F8FB", fontSize: 16, lineHeight: 18, fontWeight: "900", letterSpacing: 2.8 }, markaAlt: { color: "#A8B3C2", fontSize: 11, lineHeight: 15, fontWeight: "700", letterSpacing: 0.8, marginTop: 2 }, gizliButon: { width: 44, height: 44, borderRadius: 18, alignItems: "center", justifyContent: "center", backgroundColor: "rgba(255, 176, 0, 0.1)", borderWidth: 1, borderColor: "rgba(255, 176, 0, 0.24)" },
  karsilama: { flexDirection: "row", gap: 15, alignItems: "center", marginTop: 24, marginBottom: 19 }, amblem: { width: 68, height: 68, borderRadius: 25, alignItems: "center", justifyContent: "center", backgroundColor: "rgba(255, 106, 42, 0.13)", borderWidth: 1, borderColor: "rgba(255, 106, 42, 0.3)" }, karsilamaMetinleri: { flex: 1 }, karsilamaBaslik: { color: "#F6F8FB", fontSize: 22, lineHeight: 27, fontWeight: "900" }, karsilamaAciklama: { color: "#A8B3C2", fontSize: 13, lineHeight: 19, marginTop: 5 },
  aramaKapsayici: { minHeight: 58, flexDirection: "row", alignItems: "center", gap: 10, borderRadius: 29, paddingLeft: 17, paddingRight: 6, backgroundColor: "#121821", borderColor: "rgba(246, 248, 251, 0.15)", borderWidth: 1 }, aramaGirdisi: { flex: 1, minHeight: 48, color: "#F6F8FB", fontSize: 15, lineHeight: 20, fontWeight: "600" }, gitButonu: { width: 43, height: 43, borderRadius: 17, justifyContent: "center", alignItems: "center", backgroundColor: "#FF6A2A" },
  hizliSatir: { flexDirection: "row", justifyContent: "space-between", gap: 9 }, hizliOge: { flex: 1, alignItems: "center", gap: 8 }, hizliSimge: { width: 55, height: 55, borderRadius: 20, alignItems: "center", justifyContent: "center", borderColor: "rgba(246, 248, 251, 0.08)", borderWidth: 1 }, hizliMetin: { color: "#D8DFE8", fontSize: 11, lineHeight: 15, fontWeight: "700" },
  merkezKart: { paddingHorizontal: 15, paddingVertical: 2 }, ayrac: { height: StyleSheet.hairlineWidth, backgroundColor: "rgba(168, 179, 194, 0.16)", marginLeft: 53 }, bosGecmis: { padding: 20, alignItems: "center", gap: 6 }, bosBaslik: { color: "#F6F8FB", fontSize: 15, lineHeight: 20, fontWeight: "800", marginTop: 3 }, bosAciklama: { color: "#A8B3C2", fontSize: 12, lineHeight: 18, textAlign: "center" },
  gecmisSatiri: { flexDirection: "row", alignItems: "center", gap: 12, paddingVertical: 12, borderBottomColor: "rgba(168, 179, 194, 0.1)", borderBottomWidth: StyleSheet.hairlineWidth }, gecmisSimge: { width: 36, height: 36, borderRadius: 13, alignItems: "center", justifyContent: "center", backgroundColor: "rgba(255, 106, 42, 0.1)" }, gecmisMetinleri: { flex: 1 }, gecmisBasligi: { color: "#F6F8FB", fontSize: 14, lineHeight: 19, fontWeight: "700" }, gecmisUrl: { color: "#8D9AAC", fontSize: 11, lineHeight: 15, marginTop: 2 }, zaman: { color: "#8D9AAC", fontSize: 10, fontWeight: "700" }, altEylem: { marginTop: 22, alignItems: "center" }, yeniSekmeButonu: { minWidth: 156 }, basili: { opacity: 0.74, transform: [{ scale: 0.97 }] },
});
