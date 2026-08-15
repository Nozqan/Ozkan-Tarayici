import MaterialCommunityIcons from "@expo/vector-icons/MaterialCommunityIcons";
import { router } from "expo-router";
import { useEffect, useMemo, useRef, useState } from "react";
import { ActivityIndicator, Platform, Pressable, StyleSheet, Text, View } from "react-native";
import * as ReactNativeWebView from "react-native-webview";

import { AdresCubugu } from "@/bilesenler/adres-cubugu";
import { CamKart, YuvarlakButon } from "@/bilesenler/akrep-ui";
import { gezinmeKarari, reklamEngellemeBetigi, sayfaMetniCikarimBetigi } from "@/lib/tarayici/filtreler";
import { useTarayici } from "@/lib/tarayici/baglam";
import { adresiCoz, indirmeAdayiMi, YENI_SEKME_URL } from "@/lib/tarayici/modeller";

const YerelWebGorunumu: any = (ReactNativeWebView as any).default;
type WebGorunumuRef = { goBack: () => void; goForward: () => void; reload: () => void };
type WebGorunumuNavigasyonu = { url: string; title?: string };
type WebGorunumuIstek = { url: string; isTopFrame?: boolean };
type WebMesaji = { tip?: string; adet?: number; metin?: string; baslik?: string };

const TARAYICI_ROTASI = "/tarayici" as never;
const SEKME_ROTASI = "/(tabs)/sekmeler" as never;
const ANA_SAYFA_ROTASI = "/(tabs)" as never;

export default function TarayiciEkrani() {
  const webGorunumu = useRef<WebGorunumuRef | null>(null);
  const { durum, etkinSekme, sayfayaGit, sekmeAc, yerImiDegistir, yukleniyorAyarla, sayfaMetniniKaydet, engellenenIstekEkle, indirmeBaslat } = useTarayici();
  const [hata, hataAyarla] = useState<string | null>(null);
  const yeniSekmeMi = etkinSekme.url === YENI_SEKME_URL;
  const yildizli = useMemo(() => durum.yerImleri.some((item) => item.url === etkinSekme.url), [durum.yerImleri, etkinSekme.url]);
  const kuralBetigi = useMemo(() => reklamEngellemeBetigi(durum.ayarlar.reklamEngelleme, durum.ayarlar.takipKoruma), [durum.ayarlar.reklamEngelleme, durum.ayarlar.takipKoruma]);

  useEffect(() => { hataAyarla(null); }, [etkinSekme.id]);

  const girdiGonder = (girdi: string) => {
    const hamUrl = adresiCoz(girdi);
    if (hamUrl === YENI_SEKME_URL) return;
    const karar = gezinmeKarari(hamUrl, durum.ayarlar);
    if (!karar.izinli) {
      hataAyarla(karar.neden);
      engellenenIstekEkle();
      return;
    }
    if (indirmeAdayiMi(karar.url)) {
      void indirmeBaslat(karar.url);
      router.push("/indirmeler" as never);
      return;
    }
    hataAyarla(null);
    sayfayaGit(etkinSekme.id, karar.url);
  };

  const gezinmeyiDenetle = (istek: WebGorunumuIstek) => {
    if (!/^https?:\/\//i.test(istek.url)) return true;
    const karar = gezinmeKarari(istek.url, durum.ayarlar);
    if (!karar.izinli) {
      engellenenIstekEkle();
      if (istek.isTopFrame !== false) hataAyarla(karar.neden);
      return false;
    }
    if (indirmeAdayiMi(karar.url) && istek.isTopFrame !== false) {
      void indirmeBaslat(karar.url);
      router.push("/indirmeler" as never);
      return false;
    }
    if (karar.url !== istek.url && istek.isTopFrame !== false) {
      sayfayaGit(etkinSekme.id, karar.url);
      return false;
    }
    return true;
  };

  const webMesajiniIsle = (ham: string) => {
    try {
      const mesaj = JSON.parse(ham) as WebMesaji;
      if (mesaj.tip === "filtre" && typeof mesaj.adet === "number") engellenenIstekEkle(mesaj.adet);
      if (mesaj.tip === "sayfa_metni" && typeof mesaj.metin === "string") sayfaMetniniKaydet(etkinSekme.id, mesaj.metin, mesaj.baslik);
    } catch {
      // Sayfa içeriğinden gelen bozuk mesajlar güvenle yok sayılır.
    }
  };

  if (Platform.OS === "web") return <WebTarayiciSiniri onGeri={() => router.back()} />;

  if (yeniSekmeMi) {
    return <View style={styles.ekran}><AdresCubugu deger="" onGonder={girdiGonder} yukleniyor={false} /><View style={styles.yeniSekmeIcerik}><View style={styles.amblem}><MaterialCommunityIcons name="zodiac-scorpio" size={45} color="#FF6A2A" /></View><Text style={styles.yeniBaslik}>Yeni sekme</Text><Text style={styles.yeniAciklama}>Adres çubuğuna bir URL yaz veya arama başlat. HTTPS dosya bağlantıları doğrudan İndirme Merkezi’ne aktarılır.</Text><YuvarlakButon icon="compass-outline" etiket="Ana sayfaya dön" onPress={() => router.replace(ANA_SAYFA_ROTASI)} /></View></View>;
  }

  return (
    <View style={styles.ekran}>
      <AdresCubugu deger={etkinSekme.url} onGonder={girdiGonder} onYildiz={yerImiDegistir} yildizli={yildizli} yukleniyor={etkinSekme.yukleniyor} />
      {(durum.ayarlar.reklamEngelleme || durum.ayarlar.takipKoruma) ? <View style={styles.korumaCubugu}><MaterialCommunityIcons name="shield-check-outline" color="#68DC9A" size={14} /><Text style={styles.korumaMetni}>WebView koruması etkin · {durum.engellenenIstekSayisi} istek engellendi</Text></View> : null}
      {hata ? <CamKart style={styles.hataKart}><MaterialCommunityIcons name="alert-circle-outline" color="#FF9AA2" size={20} /><Text style={styles.hataMetni}>{hata}</Text></CamKart> : null}
      <View style={styles.webKapsayici}>
        <YerelWebGorunumu
          ref={webGorunumu}
          source={{ uri: etkinSekme.url }}
          userAgent={durum.ayarlar.masaustuGorunumu ? "Mozilla/5.0 (X11; Linux x86_64) AppleWebKit/537.36 Chrome/124 Safari/537.36" : undefined}
          onError={(olay: { nativeEvent: { description?: string } }) => { yukleniyorAyarla(etkinSekme.id, false); hataAyarla(olay.nativeEvent.description || "Sayfa yüklenemedi."); }}
          onLoadEnd={() => yukleniyorAyarla(etkinSekme.id, false)}
          onLoadStart={() => yukleniyorAyarla(etkinSekme.id, true)}
          onNavigationStateChange={(navigasyon: WebGorunumuNavigasyonu) => navigasyonuKaydet(navigasyon, etkinSekme.id, sayfayaGit)}
          onShouldStartLoadWithRequest={gezinmeyiDenetle}
          onFileDownload={(olay: { nativeEvent: { downloadUrl: string } }) => { void indirmeBaslat(olay.nativeEvent.downloadUrl); router.push("/indirmeler" as never); }}
          injectedJavaScriptBeforeContentLoaded={kuralBetigi}
          injectedJavaScript={sayfaMetniCikarimBetigi()}
          onMessage={(olay: { nativeEvent: { data: string } }) => webMesajiniIsle(olay.nativeEvent.data)}
          startInLoadingState
          renderLoading={() => <View style={styles.yukleme}><ActivityIndicator color="#FF6A2A" /><Text style={styles.yuklemeMetni}>Sayfa yükleniyor</Text></View>}
          style={styles.webGorunumu}
        />
      </View>
      <View style={styles.altCubuk}>
        <AltSimge etiket="Geri" icon="arrow-left" onPress={() => webGorunumu.current?.goBack()} />
        <AltSimge etiket="İleri" icon="arrow-right" onPress={() => webGorunumu.current?.goForward()} />
        <AltSimge etiket="Yenile" icon="reload" onPress={() => webGorunumu.current?.reload()} />
        <AltSimge etiket="İndirmeler" icon="download-outline" onPress={() => router.push("/indirmeler" as never)} />
        <Pressable accessibilityLabel="Yeni sekme" onPress={() => { sekmeAc(); router.replace(TARAYICI_ROTASI); }} style={({ pressed }) => [styles.yeniButon, pressed && styles.basili]}><MaterialCommunityIcons name="plus" color="#080B10" size={21} /></Pressable>
        <Pressable accessibilityLabel="Sekme merkezi" onPress={() => router.replace(SEKME_ROTASI)} style={({ pressed }) => [styles.sekmeSayaci, pressed && styles.basili]}><Text style={styles.sekmeSayisi}>{durum.sekmeler.length}</Text></Pressable>
      </View>
    </View>
  );
}

function AltSimge({ etiket, icon, onPress }: { etiket: string; icon: React.ComponentProps<typeof MaterialCommunityIcons>["name"]; onPress: () => void }) {
  return <Pressable accessibilityLabel={etiket} onPress={onPress} style={({ pressed }) => [styles.altSimge, pressed && styles.basili]}><MaterialCommunityIcons name={icon} color="#F6F8FB" size={20} /></Pressable>;
}

function navigasyonuKaydet(navigasyon: WebGorunumuNavigasyonu, sekmeId: string, sayfayaGit: (id: string, url: string, baslik?: string) => void) {
  if (navigasyon.url && /^https?:\/\//.test(navigasyon.url)) sayfayaGit(sekmeId, navigasyon.url, navigasyon.title);
}

function WebTarayiciSiniri({ onGeri }: { onGeri: () => void }) {
  return <View style={styles.webSinirEkrani}><CamKart style={styles.webSinirKart}><MaterialCommunityIcons name="cellphone-link" size={32} color="#FFB000" /><Text style={styles.webSinirBaslik}>Cihaz önizlemesi gerekli</Text><Text style={styles.webSinirAciklama}>Gerçek WebView, filtreleme ve indirme davranışları Android veya iOS cihazda çalışır. Web önizlemesi bu yerel motorları barındırmaz.</Text><YuvarlakButon icon="arrow-left" etiket="Ana sayfaya dön" onPress={onGeri} style={styles.webSinirButon} /></CamKart></View>;
}

const styles = StyleSheet.create({
  ekran: { flex: 1, backgroundColor: "#080B10" }, webKapsayici: { flex: 1, backgroundColor: "#F6F8FB" }, webGorunumu: { flex: 1 },
  korumaCubugu: { minHeight: 28, flexDirection: "row", alignItems: "center", gap: 6, paddingHorizontal: 16, backgroundColor: "#10251A" }, korumaMetni: { color: "#9CDDB7", fontSize: 10, fontWeight: "700" },
  yukleme: { flex: 1, justifyContent: "center", alignItems: "center", gap: 9, backgroundColor: "#080B10" }, yuklemeMetni: { color: "#A8B3C2", fontSize: 13 },
  hataKart: { marginHorizontal: 18, marginVertical: 8, padding: 12, flexDirection: "row", gap: 9, alignItems: "center", borderColor: "rgba(255, 77, 90, 0.4)" }, hataMetni: { flex: 1, color: "#FFB0B7", fontSize: 12, lineHeight: 17 },
  altCubuk: { minHeight: 62, paddingHorizontal: 12, flexDirection: "row", alignItems: "center", justifyContent: "space-between", backgroundColor: "#0C1118", borderTopColor: "rgba(168, 179, 194, 0.15)", borderTopWidth: 1 }, altSimge: { width: 37, height: 42, alignItems: "center", justifyContent: "center", borderRadius: 14 }, yeniButon: { width: 42, height: 42, borderRadius: 15, alignItems: "center", justifyContent: "center", backgroundColor: "#FF6A2A" }, sekmeSayaci: { width: 35, height: 35, borderRadius: 12, alignItems: "center", justifyContent: "center", borderColor: "rgba(246, 248, 251, 0.25)", borderWidth: 1 }, sekmeSayisi: { color: "#F6F8FB", fontSize: 12, fontWeight: "900" },
  yeniSekmeIcerik: { flex: 1, alignItems: "center", justifyContent: "center", paddingHorizontal: 38 }, amblem: { width: 80, height: 80, borderRadius: 29, alignItems: "center", justifyContent: "center", backgroundColor: "rgba(255, 106, 42, 0.13)", borderColor: "rgba(255, 106, 42, 0.3)", borderWidth: 1 }, yeniBaslik: { color: "#F6F8FB", fontSize: 24, lineHeight: 30, fontWeight: "900", marginTop: 18 }, yeniAciklama: { color: "#A8B3C2", fontSize: 14, lineHeight: 21, textAlign: "center", marginTop: 8, marginBottom: 20 },
  webSinirEkrani: { flex: 1, justifyContent: "center", padding: 20, backgroundColor: "#080B10" }, webSinirKart: { padding: 28, alignItems: "center" }, webSinirBaslik: { color: "#F6F8FB", fontSize: 20, lineHeight: 26, fontWeight: "900", marginTop: 14 }, webSinirAciklama: { color: "#A8B3C2", textAlign: "center", fontSize: 13, lineHeight: 20, marginTop: 8 }, webSinirButon: { marginTop: 20 }, basili: { opacity: 0.7, transform: [{ scale: 0.96 }] },
});
