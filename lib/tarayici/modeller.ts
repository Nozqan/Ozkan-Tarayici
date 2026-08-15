export type SekmeTuru = "normal" | "gizli";
export type AramaMotoru = "google" | "yandex";
export type IndirmeSinifi = "video" | "belge" | "gorsel" | "arsiv" | "diger";

export interface Sekme { id: string; url: string; baslik: string; tur: SekmeTuru; yukleniyor: boolean; sonErisim: number; sayfaMetni?: string; grupId?: string; sabitlenmis?: boolean; uyuyor?: boolean; }
export interface SekmeGrubu { id: string; ad: string; renk: string; olusturulma: number; }
export interface KapatilanSekme { id: string; sekme: Sekme; kapanmaZamani: number; }
export interface YerImi { id: string; url: string; baslik: string; olusturulma: number; }
export interface GecmisKaydi { id: string; url: string; baslik: string; ziyaretZamani: number; }
export interface SayfaNotu { id: string; url: string; metin: string; olusturulma: number; guncellenme: number; }
export interface SayfaVurgusu { id: string; url: string; seciliMetin: string; renk: string; olusturulma: number; }
export interface SiteIzni { alan: string; kamera: boolean; mikrofon: boolean; konum: boolean; bildirim: boolean; guncellenme: number; }
export interface HizliErisimOgesi { id: string; ad: string; url: string; icon: string; }
export interface IndirmeDogrulamasi { dogrulandi: boolean; boyut: number; md5?: string; dogrulamaZamani: number; }

export interface TarayiciAyarlari {
  reklamEngelleme: boolean; takipKoruma: boolean; httpsZorunlu: boolean; guvenliDns: boolean; koyuTema: boolean; masaustuGorunumu: boolean; aramaMotoru: AramaMotoru; yetiskinErisimOnayi: boolean; yetiskinUyumOnayi: boolean; sayfaOlcegi: number; geceGorunumu: boolean; popUpEngelleme: boolean; otomatikOkumaModu: boolean; linkOnizlemeleri: boolean;
  adresCubuguKonumu: "ust" | "alt"; gorselEngelleme: boolean; tekElleKullanim: boolean; aramaOneriGecmisi: string[]; hizliErisimler: HizliErisimOgesi[]; baslangicTemasi: "orman" | "grafit" | "kizil";
}

export type IndirmeDurumu = "indiriliyor" | "duraklatildi" | "tamamlandi" | "basarisiz" | "engellendi";
export interface IndirmeGorevi { id: string; url: string; dosyaAdi: string; durum: IndirmeDurumu; baslangicZamani: number; indirilenBayt: number; toplamBayt: number | null; hedefUri?: string; mimeTuru?: string; sinif: IndirmeSinifi; ozeti?: string; dogrulama?: IndirmeDogrulamasi; hata?: string; resumeVerisi?: string; }
export interface TarayiciDurumu { sekmeler: Sekme[]; etkinSekmeId: string; yerImleri: YerImi[]; gecmis: GecmisKaydi[]; ayarlar: TarayiciAyarlari; indirmeler: IndirmeGorevi[]; engellenenIstekSayisi: number; sekmeGruplari: SekmeGrubu[]; kapatilanSekmeler: KapatilanSekme[]; okumaListesi: YerImi[]; sayfaNotlari: SayfaNotu[]; sayfaVurgulari: SayfaVurgusu[]; siteIzinleri: SiteIzni[]; tasarrufEdilenBayt: number; }

export const YENI_SEKME_URL = "akrep://yeni-sekme";
export const varsayilanHizliErisimler: HizliErisimOgesi[] = [
  { id: "hizli-google", ad: "Google", url: "https://www.google.com", icon: "google" },
  { id: "hizli-yandex", ad: "Yandex", url: "https://yandex.com", icon: "compass-outline" },
  { id: "hizli-youtube", ad: "YouTube", url: "https://www.youtube.com", icon: "youtube" },
  { id: "hizli-indirme", ad: "İndirmeler", url: "akrep://indirmeler", icon: "download-outline" },
];
export const varsayilanAyarlar: TarayiciAyarlari = { reklamEngelleme: true, takipKoruma: true, httpsZorunlu: true, guvenliDns: false, koyuTema: true, masaustuGorunumu: false, aramaMotoru: "google", yetiskinErisimOnayi: false, yetiskinUyumOnayi: false, sayfaOlcegi: 100, geceGorunumu: false, popUpEngelleme: true, otomatikOkumaModu: false, linkOnizlemeleri: true, adresCubuguKonumu: "ust", gorselEngelleme: false, tekElleKullanim: false, aramaOneriGecmisi: [], hizliErisimler: varsayilanHizliErisimler, baslangicTemasi: "orman" };

export function benzersizKimlik(onEk: string) { return `${onEk}-${Date.now()}-${Math.random().toString(36).slice(2, 8)}`; }
export function yeniSekme(girdi?: string, tur: SekmeTuru = "normal", aramaMotoru: AramaMotoru = "google"): Sekme { const url = girdi ? adresiCoz(girdi, aramaMotoru) : YENI_SEKME_URL; return { id: benzersizKimlik("sekme"), url, baslik: url === YENI_SEKME_URL ? "Yeni Sekme" : urlBasligi(url), tur, yukleniyor: false, sonErisim: Date.now() }; }
export function yeniIndirme(url: string, onerilenAd?: string, mimeTuru?: string): IndirmeGorevi { return { id: benzersizKimlik("indirme"), url, dosyaAdi: guvenliDosyaAdi(onerilenAd || urlDosyaAdi(url)), durum: "indiriliyor", baslangicZamani: Date.now(), indirilenBayt: 0, toplamBayt: null, mimeTuru, sinif: indirmeSinifiniBelirle(url, mimeTuru) }; }
export function guvenliDosyaAdi(ad: string) { const temiz = ad.replace(/[\\/:*?"<>|\u0000-\u001F]/g, "_").trim().slice(0, 120); return temiz || `akrep-indirme-${Date.now()}`; }
export function urlDosyaAdi(url: string) { try { const yol = new URL(url).pathname.split("/").filter(Boolean).pop(); return yol ? decodeURIComponent(yol) : "indirilen-dosya"; } catch { return "indirilen-dosya"; } }
export function indirmeAdayiMi(url: string) { try { return /\.(apk|zip|rar|7z|pdf|epub|docx?|xlsx?|pptx?|mp3|mp4|mkv|avi|webm|png|jpe?g|gif|webp|csv|json|txt)$/i.test(new URL(url).pathname); } catch { return false; } }
export function indirmeSinifiniBelirle(url: string, mimeTuru?: string): IndirmeSinifi { const deger = `${url.toLowerCase()} ${mimeTuru?.toLowerCase() || ""}`; if (/\.(mp4|mkv|avi|webm|mov|mp3|wav|m4a)(?:[?#\s]|$)|\b(video|audio)\//.test(deger)) return "video"; if (/\.(pdf|epub|doc|docx|xls|xlsx|ppt|pptx|csv|txt|json)(?:[?#\s]|$)|application\/pdf|text\//.test(deger)) return "belge"; if (/\.(png|jpe?g|gif|webp|svg|heic)(?:[?#\s]|$)|image\//.test(deger)) return "gorsel"; if (/\.(zip|rar|7z|tar|gz|apk)(?:[?#\s]|$)|zip|compressed|archive/.test(deger)) return "arsiv"; return "diger"; }
export function indirmeSinifiEtiketi(sinif: IndirmeSinifi) { return ({ video: "Video ve ses", belge: "Belge", gorsel: "Görsel", arsiv: "Arşiv", diger: "Diğer" } as const)[sinif]; }
export function alanAdiCikar(url: string) { try { return new URL(url).hostname.replace(/^www\./, "").toLowerCase(); } catch { return ""; } }
export function adresiCoz(girdi: string, aramaMotoru: AramaMotoru = "google") { const temiz = girdi.trim(); if (!temiz) return YENI_SEKME_URL; if (/^https?:\/\//i.test(temiz)) return temiz; if (/^[a-z0-9-]+(\.[a-z0-9-]+)+(\/[^\s]*)?$/i.test(temiz)) return `https://${temiz}`; return aramaMotoru === "yandex" ? `https://yandex.com/search/?text=${encodeURIComponent(temiz)}` : `https://www.google.com/search?q=${encodeURIComponent(temiz)}`; }
export function urlBasligi(url: string) { if (url === YENI_SEKME_URL) return "Yeni Sekme"; try { return new URL(url).hostname.replace(/^www\./, ""); } catch { return "Akrep Tarayıcı"; } }
export function zamanEtiketi(zaman: number) { const dakika = Math.floor((Date.now() - zaman) / 60000); if (dakika < 1) return "Şimdi"; if (dakika < 60) return `${dakika} dk önce`; const saat = Math.floor(dakika / 60); if (saat < 24) return `${saat} sa önce`; return new Intl.DateTimeFormat("tr-TR", { day: "numeric", month: "short" }).format(zaman); }
