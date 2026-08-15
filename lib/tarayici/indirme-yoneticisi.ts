import * as FileSystem from "expo-file-system/legacy";
import * as Sharing from "expo-sharing";

import type { IndirmeGorevi } from "./modeller";

type IndirmeGuncellemesi = (indirilenBayt: number, toplamBayt: number | null) => void;
const etkinIndirmeler = new Map<string, FileSystem.DownloadResumable>();
const duraklatmaIstenenler = new Set<string>();

async function indirmeKlasoru() {
  const kok = FileSystem.documentDirectory;
  if (!kok) throw new Error("Cihaz dosya alanına erişilemedi.");
  const klasor = `${kok}AkrepIndirmeler/`;
  await FileSystem.makeDirectoryAsync(klasor, { intermediates: true });
  return klasor;
}

function hedefYolu(gorev: IndirmeGorevi, klasor: string) {
  return gorev.hedefUri || `${klasor}${gorev.id}-${gorev.dosyaAdi}`;
}

export async function dosyaIndirmesiniBaslat(gorev: IndirmeGorevi, guncelle: IndirmeGuncellemesi, resumeVerisi?: string) {
  if (!gorev.url.startsWith("https://")) throw new Error("Güvenlik için yalnızca HTTPS indirmelerine izin verilir.");
  const klasor = await indirmeKlasoru();
  const hedef = hedefYolu(gorev, klasor);
  const indirme = FileSystem.createDownloadResumable(
    gorev.url,
    hedef,
    {},
    ({ totalBytesWritten, totalBytesExpectedToWrite }) => guncelle(totalBytesWritten, totalBytesExpectedToWrite > 0 ? totalBytesExpectedToWrite : null),
    resumeVerisi,
  );
  duraklatmaIstenenler.delete(gorev.id);
  etkinIndirmeler.set(gorev.id, indirme);
  const sonuc = await indirme.downloadAsync();
  etkinIndirmeler.delete(gorev.id);
  if (!sonuc?.uri) throw new Error("İndirme tamamlandı ancak dosya konumu alınamadı.");
  const bilgi = await FileSystem.getInfoAsync(sonuc.uri, { md5: true });
  return { hedefUri: sonuc.uri, indirilenBayt: bilgi.exists ? bilgi.size : gorev.indirilenBayt, toplamBayt: bilgi.exists ? bilgi.size : gorev.toplamBayt, ozeti: bilgi.exists && bilgi.md5 ? `MD5: ${bilgi.md5}` : undefined };
}

export async function dosyaIndirmesiniDuraklat(id: string) {
  const indirme = etkinIndirmeler.get(id);
  if (!indirme) throw new Error("Etkin indirme bulunamadı; uygulama yeniden başlatılmış olabilir.");
  duraklatmaIstenenler.add(id);
  const duraklatilmis = await indirme.pauseAsync();
  etkinIndirmeler.delete(id);
  return duraklatilmis.resumeData;
}

export function indirmeDuraklatildiMi(id: string) {
  return duraklatmaIstenenler.has(id);
}

export async function indirilenDosyayiPaylas(uri: string, mimeTuru?: string) {
  if (!(await Sharing.isAvailableAsync())) throw new Error("Bu cihazda dosya paylaşımı kullanılamıyor.");
  await Sharing.shareAsync(uri, { dialogTitle: "Akrep Tarayıcı indirmesi", mimeType: mimeTuru });
}

export async function indirilenDosyayiSil(uri?: string) {
  if (!uri) return;
  await FileSystem.deleteAsync(uri, { idempotent: true });
}
