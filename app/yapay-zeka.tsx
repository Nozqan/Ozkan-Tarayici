import MaterialCommunityIcons from "@expo/vector-icons/MaterialCommunityIcons";
import { router } from "expo-router";
import * as ImagePicker from "expo-image-picker";
import { useState } from "react";
import { ActivityIndicator, Alert, Pressable, ScrollView, StyleSheet, Text, TextInput, View } from "react-native";

import { BolumBasligi, CamKart, DurumRozeti, YuvarlakButon } from "@/bilesenler/akrep-ui";
import { useTarayici } from "@/lib/tarayici/baglam";
import { trpc } from "@/lib/trpc";

type Arac = "ozet" | "ceviri" | "soru" | "gorsel";
type Sonuc = { baslik: string; metin: string; kaynak?: string; model: string };

export default function YapayZekaEkrani() {
  const { etkinSekme } = useTarayici();
  const [soru, soruAyarla] = useState("");
  const [sonuc, sonucAyarla] = useState<Sonuc | null>(null);
  const [hata, hataAyarla] = useState<string | null>(null);
  const ozetle = trpc.ai.ozetle.useMutation();
  const cevir = trpc.ai.cevir.useMutation();
  const soruSor = trpc.ai.soruSor.useMutation();
  const gorseliAcikla = trpc.ai.gorseliAcikla.useMutation();
  const calisiyor = ozetle.isPending || cevir.isPending || soruSor.isPending || gorseliAcikla.isPending;

  const sayfaGirdisi = () => {
    const metin = etkinSekme.sayfaMetni?.trim() || "";
    if (!etkinSekme.url.startsWith("http") || metin.length < 40) throw new Error("Önce cihazdaki tarayıcıda bir sayfa açıp yüklenmesini bekle. AI yalnızca aktif sayfanın görünür metnini işler.");
    return { url: etkinSekme.url, baslik: etkinSekme.baslik, metin };
  };

  const sayfaAraciniCalistir = (arac: Exclude<Arac, "gorsel">) => {
    let girdi: ReturnType<typeof sayfaGirdisi>;
    try { girdi = sayfaGirdisi(); } catch (neden) { hataAyarla(neden instanceof Error ? neden.message : "Sayfa verisi alınamadı."); return; }
    if (arac === "soru" && soru.trim().length < 2) { hataAyarla("Sayfaya sormak istediğin soruyu yaz."); return; }
    const baslik = arac === "ozet" ? "Sayfa metni AI özetine gönderilsin mi?" : arac === "ceviri" ? "Sayfa metni Türkçe çeviri için gönderilsin mi?" : "Sayfa metni sorunu yanıtlamak için gönderilsin mi?";
    Alert.alert(baslik, "Yalnızca aktif sayfanın görünür metni ve kaynak URL'si güvenli sunucuya gönderilir. İşlem proje AI kullanımından tüketim oluşturur.", [
      { text: "Vazgeç", style: "cancel" },
      { text: "Devam et", onPress: () => { void gercekSayfaAraci(arac, girdi); } },
    ]);
  };

  const gercekSayfaAraci = async (arac: Exclude<Arac, "gorsel">, girdi: ReturnType<typeof sayfaGirdisi>) => {
    hataAyarla(null);
    sonucAyarla(null);
    try {
      if (arac === "ozet") {
        const veri = await ozetle.mutateAsync(girdi);
        sonucAyarla({ baslik: "Sayfa özeti", metin: veri.yanit, kaynak: veri.kaynakUrl, model: veri.model });
      } else if (arac === "ceviri") {
        const veri = await cevir.mutateAsync({ ...girdi, hedefDil: "tr" });
        sonucAyarla({ baslik: "Türkçe çeviri", metin: veri.yanit, kaynak: veri.kaynakUrl, model: veri.model });
      } else {
        const veri = await soruSor.mutateAsync({ ...girdi, soru: soru.trim() });
        sonucAyarla({ baslik: "Sayfa yanıtı", metin: veri.yanit, kaynak: veri.kaynakUrl, model: veri.model });
      }
    } catch (neden) {
      hataAyarla(neden instanceof Error ? neden.message : "AI isteği tamamlanamadı.");
    }
  };

  const gorselSec = async () => {
    const secim = await ImagePicker.launchImageLibraryAsync({ mediaTypes: ImagePicker.MediaTypeOptions.Images, base64: true, quality: 0.7, selectionLimit: 1 });
    if (secim.canceled || !secim.assets[0]?.base64) return;
    const gorsel = secim.assets[0];
    const veri = `data:${gorsel.mimeType || "image/jpeg"};base64,${gorsel.base64}`;
    Alert.alert("Görsel AI açıklamasına gönderilsin mi?", "Seçtiğin görsel yalnızca açıklama üretmek için güvenli sunucuya gönderilir. İşlem proje AI kullanımından tüketim oluşturur.", [
      { text: "Vazgeç", style: "cancel" },
      { text: "Devam et", onPress: () => { void gorselAciklamaIste(veri); } },
    ]);
  };

  const gorselAciklamaIste = async (veri: string) => {
    hataAyarla(null);
    sonucAyarla(null);
    try {
      const yanit = await gorseliAcikla.mutateAsync({ veri });
      sonucAyarla({ baslik: "Görsel açıklaması", metin: yanit.yanit, model: yanit.model });
    } catch (neden) {
      hataAyarla(neden instanceof Error ? neden.message : "Görsel açıklaması tamamlanamadı.");
    }
  };

  return <View style={styles.ekran}><ScrollView contentContainerStyle={styles.icerik} showsVerticalScrollIndicator={false}><BolumBasligi baslik="Yapay zekâ merkezi" aciklama="Yalnızca açık onayınla sayfa verisi işler" /><CamKart style={styles.durumKart}><View style={styles.durumSimge}><MaterialCommunityIcons name="creation" color="#FF6A2A" size={29} /></View><View style={styles.durumMetinleri}><Text style={styles.durumBaslik}>Kullanıcı onaylı AI hazır</Text><Text style={styles.durumAciklama}>Özet, çeviri ve sayfa sorusu aktif sekmenin görünür metnini ancak onayından sonra gönderir.</Text></View><DurumRozeti metin="Etkin" ton="basari" /></CamKart><AracKarti icon="text-short" baslik="Sayfayı özetle" aciklama="Ana fikirler, önemli ayrıntılar ve belirsizlikleri üretir." onPress={() => sayfaAraciniCalistir("ozet")} devreDisi={calisiyor} /><AracKarti icon="translate" baslik="Türkçeye çevir" aciklama="Aktif sayfanın görünür metnini anlamı koruyarak çevirir." onPress={() => sayfaAraciniCalistir("ceviri")} devreDisi={calisiyor} /><CamKart style={styles.soruKart}><Text style={styles.soruBaslik}>Sayfaya soru sor</Text><Text style={styles.soruAciklama}>Cevap yalnızca aktif sayfanın metnine dayanır.</Text><View style={styles.soruSatiri}><TextInput accessibilityLabel="Sayfaya sorulacak soru" value={soru} onChangeText={soruAyarla} placeholder="Bu sayfanın ana iddiası ne?" placeholderTextColor="#7C899A" style={styles.soruGirdisi} multiline /><Pressable accessibilityLabel="Soruyu gönder" disabled={calisiyor} onPress={() => sayfaAraciniCalistir("soru")} style={({ pressed }) => [styles.soruButon, (pressed || calisiyor) && styles.basili]}><MaterialCommunityIcons name="send" color="#080B10" size={18} /></Pressable></View></CamKart><AracKarti icon="image-search-outline" baslik="Görseli açıkla" aciklama="Cihazından seçtiğin görseli açık onayınla işler." onPress={() => void gorselSec()} devreDisi={calisiyor} />{calisiyor ? <CamKart style={styles.bekleme}><ActivityIndicator color="#FF6A2A" /><Text style={styles.beklemeMetni}>AI yanıtı hazırlanıyor…</Text></CamKart> : null}{hata ? <CamKart style={styles.hataKart}><MaterialCommunityIcons name="alert-circle-outline" color="#FF9AA2" size={20} /><Text style={styles.hataMetni}>{hata}</Text></CamKart> : null}{sonuc ? <CamKart style={styles.sonucKart}><View style={styles.sonucUst}><Text style={styles.sonucBaslik}>{sonuc.baslik}</Text><DurumRozeti metin="Canlı" ton="basari" /></View><Text style={styles.sonucMetni}>{sonuc.metin}</Text>{sonuc.kaynak ? <Text numberOfLines={1} style={styles.kaynak}>Kaynak: {sonuc.kaynak}</Text> : null}<Text style={styles.model}>Model: {sonuc.model}</Text></CamKart> : null}<Text style={styles.altNot}>AI yanıtları kaynak sayfanın yerine geçmez. Kişisel, finansal veya hassas bilgileri içeren sayfalarda araçları kullanmadan önce içeriği gözden geçir.</Text><YuvarlakButon icon="arrow-left" etiket="Ana sayfaya dön" onPress={() => router.replace("/(tabs)" as never)} style={styles.altButon} /></ScrollView></View>;
}

function AracKarti({ icon, baslik, aciklama, onPress, devreDisi }: { icon: React.ComponentProps<typeof MaterialCommunityIcons>["name"]; baslik: string; aciklama: string; onPress: () => void; devreDisi: boolean }) {
  return <Pressable accessibilityLabel={baslik} disabled={devreDisi} onPress={onPress} style={({ pressed }) => [styles.aracKart, (pressed || devreDisi) && styles.basili]}><View style={styles.aracSimge}><MaterialCommunityIcons name={icon} color="#FF6A2A" size={24} /></View><View style={styles.aracMetinleri}><Text style={styles.aracBaslik}>{baslik}</Text><Text style={styles.aracAciklama}>{aciklama}</Text></View><MaterialCommunityIcons name="chevron-right" color="#A8B3C2" size={22} /></Pressable>;
}

const styles = StyleSheet.create({
  ekran: { flex: 1, backgroundColor: "#080B10" }, icerik: { paddingHorizontal: 18, paddingBottom: 30 }, durumKart: { padding: 17, flexDirection: "row", alignItems: "center", gap: 12, marginBottom: 11 }, durumSimge: { width: 55, height: 55, borderRadius: 19, justifyContent: "center", alignItems: "center", backgroundColor: "rgba(255,106,42,0.13)" }, durumMetinleri: { flex: 1 }, durumBaslik: { color: "#F6F8FB", fontSize: 16, lineHeight: 21, fontWeight: "900" }, durumAciklama: { color: "#A8B3C2", fontSize: 11, lineHeight: 16, marginTop: 3 }, aracKart: { minHeight: 82, marginBottom: 10, padding: 14, flexDirection: "row", alignItems: "center", gap: 12 }, aracSimge: { width: 48, height: 48, borderRadius: 16, alignItems: "center", justifyContent: "center", backgroundColor: "rgba(255,106,42,0.11)" }, aracMetinleri: { flex: 1 }, aracBaslik: { color: "#F6F8FB", fontSize: 14, fontWeight: "800" }, aracAciklama: { color: "#A8B3C2", fontSize: 11, lineHeight: 16, marginTop: 4 }, soruKart: { padding: 15, marginBottom: 10 }, soruBaslik: { color: "#F6F8FB", fontSize: 14, fontWeight: "800" }, soruAciklama: { color: "#A8B3C2", fontSize: 11, lineHeight: 16, marginTop: 4 }, soruSatiri: { flexDirection: "row", alignItems: "center", gap: 8, borderWidth: 1, borderColor: "rgba(246,248,251,0.13)", borderRadius: 15, marginTop: 12, paddingLeft: 11, paddingRight: 5, backgroundColor: "rgba(246,248,251,0.06)" }, soruGirdisi: { flex: 1, minHeight: 46, maxHeight: 88, color: "#F6F8FB", fontSize: 12, paddingVertical: 10 }, soruButon: { width: 38, height: 38, borderRadius: 13, alignItems: "center", justifyContent: "center", backgroundColor: "#FF6A2A" }, bekleme: { padding: 16, marginTop: 2, flexDirection: "row", alignItems: "center", gap: 10 }, beklemeMetni: { color: "#F6F8FB", fontSize: 12, fontWeight: "700" }, hataKart: { padding: 14, marginTop: 11, flexDirection: "row", gap: 9, alignItems: "center", borderColor: "rgba(255,77,90,0.42)" }, hataMetni: { color: "#FFB0B7", fontSize: 11, lineHeight: 16, flex: 1 }, sonucKart: { padding: 17, marginTop: 12, borderColor: "rgba(104,220,154,0.30)" }, sonucUst: { flexDirection: "row", alignItems: "center", justifyContent: "space-between", gap: 10 }, sonucBaslik: { color: "#F6F8FB", fontSize: 16, fontWeight: "900" }, sonucMetni: { color: "#E1E8F0", fontSize: 13, lineHeight: 20, marginTop: 12 }, kaynak: { color: "#9DBBFF", fontSize: 10, marginTop: 14 }, model: { color: "#7C899A", fontSize: 10, marginTop: 5 }, altNot: { color: "#7C899A", fontSize: 11, lineHeight: 16, textAlign: "center", marginTop: 21, paddingHorizontal: 10 }, altButon: { marginTop: 15, alignSelf: "center" }, basili: { opacity: 0.72, transform: [{ scale: 0.98 }] },
});
