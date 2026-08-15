import MaterialCommunityIcons from "@expo/vector-icons/MaterialCommunityIcons";
import { router } from "expo-router";
import { StyleSheet, Text, View } from "react-native";

import { BolumBasligi, CamKart, DurumRozeti, SimgeliSatir, YuvarlakButon } from "@/bilesenler/akrep-ui";

export default function IndirmelerEkrani() {
  return (
    <View style={styles.ekran}>
      <View style={styles.icerik}>
        <BolumBasligi baslik="İndirme merkezi" aciklama="Gerçek dosya görevleri için hazırlık alanı" />
        <CamKart style={styles.durumKart}>
          <View style={styles.durumSimge}><MaterialCommunityIcons name="download-box-outline" size={30} color="#5B9DFF" /></View>
          <View style={styles.durumMetinleri}>
            <Text style={styles.durumBaslik}>Henüz indirme yok</Text>
            <Text style={styles.durumAciklama}>Bu ilk sürümde bir indirme dosyası, hız veya ilerleme değeri uydurulmaz. Yerel indirme işi bağlandığında gerçek durum burada görünür.</Text>
          </View>
          <DurumRozeti metin="Hazırlık" ton="uyari" />
        </CamKart>
        <CamKart style={styles.detayKart}>
          <SimgeliSatir icon="pause-circle-outline" iconRengi="#5B9DFF" baslik="Duraklat ve devam ettir" aciklama="Sunucu byte aralığı desteklediğinde gerçek indirme işi üzerinden çalışır." />
          <View style={styles.ayrac} />
          <SimgeliSatir icon="archive-outline" iconRengi="#5B9DFF" baslik="Dosya güvenliği" aciklama="ZIP ve APK işlemleri, içerik doğrulaması olmadan tamamlandı gibi gösterilmez." />
          <View style={styles.ayrac} />
          <SimgeliSatir icon="folder-open-outline" iconRengi="#5B9DFF" baslik="Dosya kategorileri" aciklama="Gerçek MIME türü ve dosya uzantısından türetilir." />
        </CamKart>
        <YuvarlakButon icon="arrow-left" etiket="Ayarlar'a dön" onPress={() => router.back()} style={styles.altButon} />
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  ekran: { flex: 1, backgroundColor: "#080B10" }, icerik: { paddingHorizontal: 18, paddingBottom: 30 },
  durumKart: { padding: 17, flexDirection: "row", alignItems: "center", gap: 12, marginBottom: 10 }, durumSimge: { width: 55, height: 55, borderRadius: 19, justifyContent: "center", alignItems: "center", backgroundColor: "rgba(91, 157, 255, 0.12)" }, durumMetinleri: { flex: 1 }, durumBaslik: { color: "#F6F8FB", fontSize: 16, lineHeight: 21, fontWeight: "900" }, durumAciklama: { color: "#A8B3C2", fontSize: 11, lineHeight: 16, marginTop: 3 },
  detayKart: { paddingHorizontal: 14 }, ayrac: { height: StyleSheet.hairlineWidth, backgroundColor: "rgba(168, 179, 194, 0.16)", marginLeft: 54 }, altButon: { marginTop: 24 },
});
