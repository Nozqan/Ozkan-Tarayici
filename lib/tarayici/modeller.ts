export type SekmeTuru = "normal" | "gizli";

export interface Sekme {
  id: string;
  url: string;
  baslik: string;
  tur: SekmeTuru;
  yukleniyor: boolean;
  sonErisim: number;
}

export interface YerImi {
  id: string;
  url: string;
  baslik: string;
  olusturulma: number;
}

export interface GecmisKaydi {
  id: string;
  url: string;
  baslik: string;
  ziyaretZamani: number;
}

export interface TarayiciAyarlari {
  reklamEngelleme: boolean;
  takipKoruma: boolean;
  httpsZorunlu: boolean;
  guvenliDns: boolean;
  koyuTema: boolean;
  masaustuGorunumu: boolean;
}

export interface TarayiciDurumu {
  sekmeler: Sekme[];
  etkinSekmeId: string;
  yerImleri: YerImi[];
  gecmis: GecmisKaydi[];
  ayarlar: TarayiciAyarlari;
}

export const YENI_SEKME_URL = "akrep://yeni-sekme";

export const varsayilanAyarlar: TarayiciAyarlari = {
  reklamEngelleme: false,
  takipKoruma: false,
  httpsZorunlu: true,
  guvenliDns: false,
  koyuTema: true,
  masaustuGorunumu: false,
};

export function benzersizKimlik(onEk: string) {
  return `${onEk}-${Date.now()}-${Math.random().toString(36).slice(2, 8)}`;
}

export function yeniSekme(girdi?: string, tur: SekmeTuru = "normal"): Sekme {
  const url = girdi ? adresiCoz(girdi) : YENI_SEKME_URL;
  return { id: benzersizKimlik("sekme"), url, baslik: url === YENI_SEKME_URL ? "Yeni Sekme" : urlBasligi(url), tur, yukleniyor: false, sonErisim: Date.now() };
}

export function adresiCoz(girdi: string) {
  const temiz = girdi.trim();
  if (!temiz) return YENI_SEKME_URL;
  if (/^https?:\/\//i.test(temiz)) return temiz;
  if (/^[a-z0-9-]+(\.[a-z0-9-]+)+(\/[^\s]*)?$/i.test(temiz)) return `https://${temiz}`;
  return `https://www.google.com/search?q=${encodeURIComponent(temiz)}`;
}

export function urlBasligi(url: string) {
  if (url === YENI_SEKME_URL) return "Yeni Sekme";
  try { return new URL(url).hostname.replace(/^www\./, ""); } catch { return "Akrep Tarayıcı"; }
}

export function zamanEtiketi(zaman: number) {
  const dakika = Math.floor((Date.now() - zaman) / 60000);
  if (dakika < 1) return "Şimdi";
  if (dakika < 60) return `${dakika} dk önce`;
  const saat = Math.floor(dakika / 60);
  if (saat < 24) return `${saat} sa önce`;
  return new Intl.DateTimeFormat("tr-TR", { day: "numeric", month: "short" }).format(zaman);
}
