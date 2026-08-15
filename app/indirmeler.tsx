import MaterialCommunityIcons from "@expo/vector-icons/MaterialCommunityIcons";
import { router } from "expo-router";
import { useState } from "react";
import { FlatList, Pressable, StyleSheet, Text, TextInput, View } from "react-native";

import { BolumBasligi, CamKart, DurumRozeti, YuvarlakButon } from "@/bilesenler/akrep-ui";
import { useTarayici } from "@/lib/tarayici/baglam";
import type { IndirmeGorevi } from "@/lib/tarayici/modeller";

export default function IndirmelerEkrani() {
  const { durum, indirmeBaslat, indirmeDuraklat, indirmeyeDevam, indirmePaylas, indirmeSil } = useTarayici();
  const [url, urlAyarla] = useState("");
  const [girisHatasi, girisHatasiAyarla] = useState<string | null>(null);

  const baslat = () => {
    const temiz = url.trim();
    if (!/^https:\/\//i.test(temiz)) {
      girisHatasiAyarla("Güvenlik için yalnızca https:// ile başlayan doğrudan indirme bağlantıları kabul edilir.");
      return;
    }
    girisHatasiAyarla(null);
    urlAyarla("");
    void indirmeBaslat(temiz);
  };

  return <View style={styles.ekran}><FlatList contentContainerStyle={styles.icerik} data={durum.indirmeler} keyExtractor={(item) => item.id} ListHeaderComponent={<><BolumBasligi baslik="İndirme merkezi" aciklama="Cihazda gerçek dosya görevleri" /><CamKart style={styles.eklemeKart}><Text style={styles.eklemeBaslik}>Doğrudan HTTPS indirmesi ekle</Text><View style={styles.girdiSatiri}><TextInput autoCapitalize="none" autoCorrect={false} onChangeText={urlAyarla} onSubmitEditing={baslat} placeholder="https://ornek.com/dosya.pdf" placeholderTextColor="#7C899A" style={styles.girdi} value={url} /><Pressable accessibilityLabel="İndirmeyi başlat" onPress={baslat} style={({ pressed }) => [styles.ekleButon, pressed && styles.basili]}><MaterialCommunityIcons name="download" size={20} color="#080B10" /></Pressable></View>{girisHatasi ? <Text style={styles.hata}>{girisHatasi}</Text> : <Text style={styles.eklemeNotu}>WebView üzerinden algılanan uygun dosya bağlantıları da otomatik olarak buraya eklenir.</Text>}</CamKart></>} ListEmptyComponent={<CamKart style={styles.bosKart}><MaterialCommunityIcons name="download-box-outline" size={32} color="#5B9DFF" /><Text style={styles.bosBaslik}>Henüz indirme yok</Text><Text style={styles.bosAciklama}>Bir HTTPS dosya bağlantısı eklediğinde gerçek ilerleme, duraklatma ve paylaşım kontrolleri burada görünür.</Text></CamKart>} renderItem={({ item }) => <IndirmeKarti gorev={item} onDuraklat={() => void indirmeDuraklat(item.id)} onDevam={() => void indirmeyeDevam(item.id)} onPaylas={() => void indirmePaylas(item.id)} onSil={() => void indirmeSil(item.id)} />} ListFooterComponent={<YuvarlakButon icon="arrow-left" etiket="Tarayıcıya dön" onPress={() => router.back()} style={styles.altButon} />} /></View>;
}

function IndirmeKarti({ gorev, onDuraklat, onDevam, onPaylas, onSil }: { gorev: IndirmeGorevi; onDuraklat: () => void; onDevam: () => void; onPaylas: () => void; onSil: () => void }) {
  const yuzde = gorev.toplamBayt ? Math.min(100, Math.round((gorev.indirilenBayt / gorev.toplamBayt) * 100)) : null;
  const ton = gorev.durum === "tamamlandi" ? "basari" : gorev.durum === "basarisiz" ? "hata" : gorev.durum === "duraklatildi" ? "uyari" : "bilgi";
  return <CamKart style={styles.gorevKart}><View style={styles.gorevUst}><View style={styles.dosyaSimge}><MaterialCommunityIcons name={gorev.durum === "tamamlandi" ? "file-check-outline" : "file-download-outline"} size={25} color="#5B9DFF" /></View><View style={styles.gorevMetinleri}><Text numberOfLines={1} style={styles.dosyaAdi}>{gorev.dosyaAdi}</Text><Text numberOfLines={1} style={styles.dosyaAlt}>{gorev.durum === "tamamlandi" ? (gorev.ozeti || "Dosya cihazda hazır") : gorev.hata || `${boyutMetni(gorev.indirilenBayt)}${gorev.toplamBayt ? ` / ${boyutMetni(gorev.toplamBayt)}` : " indirildi"}`}</Text></View><DurumRozeti metin={durumMetni(gorev.durum)} ton={ton as never} /></View>{gorev.durum === "indiriliyor" ? <><View style={styles.ilerlemeArka}><View style={[styles.ilerleme, { width: `${yuzde ?? 8}%` }]} /></View><Text style={styles.yuzde}>{yuzde === null ? "Boyut bekleniyor" : `%${yuzde}`}</Text></> : null}<View style={styles.eylemSatiri}>{gorev.durum === "indiriliyor" ? <KucukButon icon="pause" etiket="Duraklat" onPress={onDuraklat} /> : null}{gorev.durum === "duraklatildi" ? <KucukButon icon="play" etiket="Devam" onPress={onDevam} /> : null}{gorev.durum === "tamamlandi" ? <KucukButon icon="share-variant-outline" etiket="Paylaş" onPress={onPaylas} /> : null}<KucukButon icon="trash-can-outline" etiket="Sil" onPress={onSil} ton="tehlike" /></View></CamKart>;
}

function KucukButon({ icon, etiket, onPress, ton }: { icon: React.ComponentProps<typeof MaterialCommunityIcons>["name"]; etiket: string; onPress: () => void; ton?: "tehlike" }) {
  return <Pressable accessibilityLabel={etiket} onPress={onPress} style={({ pressed }) => [styles.kucukButon, ton === "tehlike" && styles.tehlikeButon, pressed && styles.basili]}><MaterialCommunityIcons name={icon} size={16} color={ton === "tehlike" ? "#FF9AA2" : "#CFE8FF"} /><Text style={[styles.kucukButonMetni, ton === "tehlike" && styles.tehlikeMetin]}>{etiket}</Text></Pressable>;
}

function boyutMetni(bayt: number) { if (bayt < 1024) return `${bayt} B`; if (bayt < 1024 ** 2) return `${(bayt / 1024).toFixed(1)} KB`; return `${(bayt / 1024 ** 2).toFixed(1)} MB`; }
function durumMetni(durum: IndirmeGorevi["durum"]) { return ({ indiriliyor: "İndiriliyor", duraklatildi: "Duraklatıldı", tamamlandi: "Hazır", basarisiz: "Başarısız", engellendi: "Engellendi" } as const)[durum]; }

const styles = StyleSheet.create({
  ekran: { flex: 1, backgroundColor: "#080B10" }, icerik: { paddingHorizontal: 18, paddingBottom: 30 }, eklemeKart: { padding: 16, marginBottom: 13 }, eklemeBaslik: { color: "#F6F8FB", fontSize: 15, fontWeight: "800", marginBottom: 11 }, girdiSatiri: { height: 49, borderRadius: 16, backgroundColor: "rgba(246,248,251,0.08)", borderColor: "rgba(246,248,251,0.14)", borderWidth: 1, flexDirection: "row", alignItems: "center", paddingLeft: 13, paddingRight: 5 }, girdi: { flex: 1, height: 47, color: "#F6F8FB", fontSize: 12 }, ekleButon: { width: 38, height: 38, borderRadius: 13, alignItems: "center", justifyContent: "center", backgroundColor: "#FF6A2A" }, eklemeNotu: { color: "#8D9AAC", fontSize: 10, lineHeight: 15, marginTop: 10 }, hata: { color: "#FF9AA2", fontSize: 11, lineHeight: 16, marginTop: 10 }, bosKart: { padding: 27, alignItems: "center", gap: 7 }, bosBaslik: { color: "#F6F8FB", fontSize: 16, fontWeight: "900", marginTop: 3 }, bosAciklama: { color: "#A8B3C2", fontSize: 12, textAlign: "center", lineHeight: 18 }, gorevKart: { padding: 15, marginBottom: 10 }, gorevUst: { flexDirection: "row", alignItems: "center", gap: 10 }, dosyaSimge: { width: 42, height: 42, borderRadius: 14, alignItems: "center", justifyContent: "center", backgroundColor: "rgba(91,157,255,0.13)" }, gorevMetinleri: { flex: 1 }, dosyaAdi: { color: "#F6F8FB", fontSize: 13, fontWeight: "800" }, dosyaAlt: { color: "#A8B3C2", fontSize: 10, marginTop: 4 }, ilerlemeArka: { height: 5, borderRadius: 3, overflow: "hidden", backgroundColor: "rgba(246,248,251,0.12)", marginTop: 14 }, ilerleme: { height: "100%", borderRadius: 3, backgroundColor: "#5B9DFF" }, yuzde: { color: "#9DBBFF", fontSize: 10, fontWeight: "800", marginTop: 6 }, eylemSatiri: { flexDirection: "row", flexWrap: "wrap", gap: 8, marginTop: 13 }, kucukButon: { height: 34, paddingHorizontal: 11, borderRadius: 12, alignItems: "center", flexDirection: "row", gap: 5, backgroundColor: "rgba(91,157,255,0.15)" }, kucukButonMetni: { color: "#CFE8FF", fontSize: 11, fontWeight: "800" }, tehlikeButon: { backgroundColor: "rgba(255,77,90,0.10)" }, tehlikeMetin: { color: "#FF9AA2" }, altButon: { marginTop: 20, alignSelf: "center" }, basili: { opacity: 0.72, transform: [{ scale: 0.97 }] },
});
