import MaterialCommunityIcons from "@expo/vector-icons/MaterialCommunityIcons";
import { router } from "expo-router";
import { useEffect, useMemo, useRef, useState } from "react";
import { ActivityIndicator, Platform, Pressable, StyleSheet, Text, View } from "react-native";
import * as ReactNativeWebView from "react-native-webview";

import { AdresCubugu } from "@/bilesenler/adres-cubugu";
import { CamKart, YuvarlakButon } from "@/bilesenler/akrep-ui";
import { useTarayici } from "@/lib/tarayici/baglam";
import { adresiCoz, YENI_SEKME_URL } from "@/lib/tarayici/modeller";

const YerelWebGorunumu: any = (ReactNativeWebView as any).default;
type WebGorunumuRef = { goBack: () => void; goForward: () => void; reload: () => void };
type WebGorunumuNavigasyonu = { url: string; title?: string };

const TARAYICI_ROTASI = "/tarayici" as never;
const SEKME_ROTASI = "/(tabs)/sekmeler" as never;
const ANA_SAYFA_ROTASI = "/(tabs)" as never;

export default function TarayiciEkrani() {
  const webGorunumu = useRef<WebGorunumuRef | null>(null);
  const { durum, etkinSekme, sayfayaGit, sekmeAc, yerImiDegistir, yukleniyorAyarla } = useTarayici();
  const [hata, hataAyarla] = useState<string | null>(null);
  const yeniSekmeMi = etkinSekme.url === YENI_SEKME_URL;
  const yildizli = useMemo(
    () => durum.yerImleri.some((item) => item.url === etkinSekme.url),
    [durum.yerImleri, etkinSekme.url],
  );

  useEffect(() => {
    hataAyarla(null);
  }, [etkinSekme.id]);

  const girdiGonder = (girdi: string) => {
    const url = adresiCoz(girdi);
    if (url === YENI_SEKME_URL) return;
    hataAyarla(null);
    sayfayaGit(etkinSekme.id, url);
  };

  if (Platform.OS === "web") {
    return <WebTarayiciSiniri onGeri={() => router.back()} />;
  }

  if (yeniSekmeMi) {
    return (
      <View style={styles.ekran}>
        <AdresCubugu deger="" onGonder={girdiGonder} yukleniyor={false} />
        <View style={styles.yeniSekmeIcerik}>
          <View style={styles.amblem}>
            <MaterialCommunityIcons name="zodiac-scorpio" size={45} color="#FF6A2A" />
          </View>
          <Text style={styles.yeniBaslik}>Yeni sekme</Text>
          <Text style={styles.yeniAciklama}>Adres çubuğuna bir URL yaz veya arama başlat. Bu sekme gerçek bir tarayıcı görünümüne dönüşür.</Text>
          <YuvarlakButon icon="compass-outline" etiket="Ana sayfaya dön" onPress={() => router.replace(ANA_SAYFA_ROTASI)} />
        </View>
      </View>
    );
  }

  return (
    <View style={styles.ekran}>
      <AdresCubugu deger={etkinSekme.url} onGonder={girdiGonder} onYildiz={yerImiDegistir} yildizli={yildizli} yukleniyor={etkinSekme.yukleniyor} />
      {hata ? (
        <CamKart style={styles.hataKart}>
          <MaterialCommunityIcons name="alert-circle-outline" color="#FF9AA2" size={20} />
          <Text style={styles.hataMetni}>{hata}</Text>
        </CamKart>
      ) : null}
      <View style={styles.webKapsayici}>
        <YerelWebGorunumu
          ref={webGorunumu}
          source={{ uri: etkinSekme.url }}
          onError={(olay: { nativeEvent: { description?: string } }) => {
            yukleniyorAyarla(etkinSekme.id, false);
            hataAyarla(olay.nativeEvent.description || "Sayfa yüklenemedi.");
          }}
          onLoadEnd={() => yukleniyorAyarla(etkinSekme.id, false)}
          onLoadStart={() => yukleniyorAyarla(etkinSekme.id, true)}
          onNavigationStateChange={(navigasyon: WebGorunumuNavigasyonu) => navigasyonuKaydet(navigasyon, etkinSekme.id, sayfayaGit)}
          startInLoadingState
          renderLoading={() => (
            <View style={styles.yukleme}>
              <ActivityIndicator color="#FF6A2A" />
              <Text style={styles.yuklemeMetni}>Sayfa yükleniyor</Text>
            </View>
          )}
          style={styles.webGorunumu}
        />
      </View>
      <View style={styles.altCubuk}>
        <AltSimge etiket="Geri" icon="arrow-left" onPress={() => webGorunumu.current?.goBack()} />
        <AltSimge etiket="İleri" icon="arrow-right" onPress={() => webGorunumu.current?.goForward()} />
        <AltSimge etiket="Yenile" icon="reload" onPress={() => webGorunumu.current?.reload()} />
        <Pressable accessibilityLabel="Yeni sekme" onPress={() => { sekmeAc(); router.replace(TARAYICI_ROTASI); }} style={({ pressed }) => [styles.yeniButon, pressed && styles.basili]}>
          <MaterialCommunityIcons name="plus" color="#080B10" size={21} />
        </Pressable>
        <Pressable accessibilityLabel="Sekme merkezi" onPress={() => router.replace(SEKME_ROTASI)} style={({ pressed }) => [styles.sekmeSayaci, pressed && styles.basili]}>
          <Text style={styles.sekmeSayisi}>{durum.sekmeler.length}</Text>
        </Pressable>
      </View>
    </View>
  );
}

function AltSimge({ etiket, icon, onPress }: { etiket: string; icon: React.ComponentProps<typeof MaterialCommunityIcons>["name"]; onPress: () => void }) {
  return <Pressable accessibilityLabel={etiket} onPress={onPress} style={({ pressed }) => [styles.altSimge, pressed && styles.basili]}><MaterialCommunityIcons name={icon} color="#F6F8FB" size={21} /></Pressable>;
}

function navigasyonuKaydet(navigasyon: WebGorunumuNavigasyonu, sekmeId: string, sayfayaGit: (id: string, url: string, baslik?: string) => void) {
  if (navigasyon.url && /^https?:\/\//.test(navigasyon.url)) {
    sayfayaGit(sekmeId, navigasyon.url, navigasyon.title);
  }
}

function WebTarayiciSiniri({ onGeri }: { onGeri: () => void }) {
  return (
    <View style={styles.webSinirEkrani}>
      <CamKart style={styles.webSinirKart}>
        <MaterialCommunityIcons name="cellphone-link" size={32} color="#FFB000" />
        <Text style={styles.webSinirBaslik}>Cihaz önizlemesi gerekli</Text>
        <Text style={styles.webSinirAciklama}>Gerçek WebView gezinmesi Android veya iOS cihazda çalışır. Web önizlemesi bu yerel tarayıcı motorunu güvenli biçimde barındırmaz.</Text>
        <YuvarlakButon icon="arrow-left" etiket="Ana sayfaya dön" onPress={onGeri} style={styles.webSinirButon} />
      </CamKart>
    </View>
  );
}

const styles = StyleSheet.create({
  ekran: { flex: 1, backgroundColor: "#080B10" }, webKapsayici: { flex: 1, backgroundColor: "#F6F8FB" }, webGorunumu: { flex: 1 },
  yukleme: { flex: 1, justifyContent: "center", alignItems: "center", gap: 9, backgroundColor: "#080B10" }, yuklemeMetni: { color: "#A8B3C2", fontSize: 13 },
  hataKart: { marginHorizontal: 18, marginBottom: 8, padding: 12, flexDirection: "row", gap: 9, alignItems: "center", borderColor: "rgba(255, 77, 90, 0.4)" }, hataMetni: { flex: 1, color: "#FFB0B7", fontSize: 12, lineHeight: 17 },
  altCubuk: { minHeight: 62, paddingHorizontal: 18, flexDirection: "row", alignItems: "center", justifyContent: "space-between", backgroundColor: "#0C1118", borderTopColor: "rgba(168, 179, 194, 0.15)", borderTopWidth: 1 }, altSimge: { width: 42, height: 42, alignItems: "center", justifyContent: "center", borderRadius: 16 }, yeniButon: { width: 43, height: 43, borderRadius: 16, alignItems: "center", justifyContent: "center", backgroundColor: "#FF6A2A" }, sekmeSayaci: { width: 36, height: 36, borderRadius: 13, alignItems: "center", justifyContent: "center", borderColor: "rgba(246, 248, 251, 0.25)", borderWidth: 1 }, sekmeSayisi: { color: "#F6F8FB", fontSize: 13, fontWeight: "900" },
  yeniSekmeIcerik: { flex: 1, alignItems: "center", justifyContent: "center", paddingHorizontal: 38 }, amblem: { width: 80, height: 80, borderRadius: 29, alignItems: "center", justifyContent: "center", backgroundColor: "rgba(255, 106, 42, 0.13)", borderColor: "rgba(255, 106, 42, 0.3)", borderWidth: 1 }, yeniBaslik: { color: "#F6F8FB", fontSize: 24, lineHeight: 30, fontWeight: "900", marginTop: 18 }, yeniAciklama: { color: "#A8B3C2", fontSize: 14, lineHeight: 21, textAlign: "center", marginTop: 8, marginBottom: 20 },
  webSinirEkrani: { flex: 1, justifyContent: "center", padding: 20, backgroundColor: "#080B10" }, webSinirKart: { padding: 28, alignItems: "center" }, webSinirBaslik: { color: "#F6F8FB", fontSize: 20, lineHeight: 26, fontWeight: "900", marginTop: 14 }, webSinirAciklama: { color: "#A8B3C2", textAlign: "center", fontSize: 13, lineHeight: 20, marginTop: 8 }, webSinirButon: { marginTop: 20 }, basili: { opacity: 0.7, transform: [{ scale: 0.96 }] },
});
