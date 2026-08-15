import AsyncStorage from "@react-native-async-storage/async-storage";
import { createContext, PropsWithChildren, useCallback, useContext, useEffect, useMemo, useState } from "react";

import { benzersizKimlik, GecmisKaydi, IndirmeGorevi, Sekme, SekmeTuru, TarayiciAyarlari, TarayiciDurumu, urlBasligi, varsayilanAyarlar, YerImi, yeniIndirme, yeniSekme, YENI_SEKME_URL } from "./modeller";
import { dosyaIndirmesiniBaslat, dosyaIndirmesiniDuraklat, indirmeDuraklatildiMi, indirilenDosyayiPaylas, indirilenDosyayiSil } from "./indirme-yoneticisi";

const DEPOLAMA_ANAHTARI = "akrep-tarayici-v1";
const ilkSekme = yeniSekme();
const baslangicDurumu: TarayiciDurumu = { sekmeler: [ilkSekme], etkinSekmeId: ilkSekme.id, yerImleri: [], gecmis: [], ayarlar: varsayilanAyarlar, indirmeler: [], engellenenIstekSayisi: 0 };

interface TarayiciBaglamiDegeri {
  durum: TarayiciDurumu;
  yuklendi: boolean;
  etkinSekme: Sekme;
  sekmeAc: (girdi?: string, tur?: SekmeTuru) => void;
  sekmeKapat: (id: string) => void;
  etkinSekmeyiDegistir: (id: string) => void;
  sayfayaGit: (id: string, url: string, baslik?: string) => void;
  yukleniyorAyarla: (id: string, yukleniyor: boolean) => void;
  yerImiDegistir: () => void;
  yerImiSil: (id: string) => void;
  gecmisiTemizle: () => void;
  ayariDegistir: <K extends keyof TarayiciAyarlari>(anahtar: K, deger: TarayiciAyarlari[K]) => void;
  sayfaMetniniKaydet: (id: string, metin: string, baslik?: string) => void;
  engellenenIstekEkle: (adet?: number) => void;
  indirmeBaslat: (url: string, dosyaAdi?: string, mimeTuru?: string) => Promise<void>;
  indirmeDuraklat: (id: string) => Promise<void>;
  indirmeyeDevam: (id: string) => Promise<void>;
  indirmePaylas: (id: string) => Promise<void>;
  indirmeSil: (id: string) => Promise<void>;
}

const TarayiciBaglami = createContext<TarayiciBaglamiDegeri | null>(null);

export function TarayiciSaglayici({ children }: PropsWithChildren) {
  const [durum, durumAyarla] = useState<TarayiciDurumu>(baslangicDurumu);
  const [yuklendi, yuklendiAyarla] = useState(false);

  useEffect(() => {
    let etkin = true;
    AsyncStorage.getItem(DEPOLAMA_ANAHTARI).then((hamVeri) => {
      if (!etkin || !hamVeri) return;
      const kayitliDurum = JSON.parse(hamVeri) as TarayiciDurumu;
      if (kayitliDurum.sekmeler?.length) durumAyarla({ ...baslangicDurumu, ...kayitliDurum, ayarlar: { ...varsayilanAyarlar, ...kayitliDurum.ayarlar }, indirmeler: kayitliDurum.indirmeler ?? [], engellenenIstekSayisi: kayitliDurum.engellenenIstekSayisi ?? 0 });
    }).catch(() => {
      // Yerel depolama okunamazsa güvenli başlangıç durumu korunur.
    }).finally(() => { if (etkin) yuklendiAyarla(true); });
    return () => { etkin = false; };
  }, []);

  useEffect(() => {
    if (!yuklendi) return;
    AsyncStorage.setItem(DEPOLAMA_ANAHTARI, JSON.stringify(durum)).catch(() => {
      // Depolama hatası veri kalıcılığını etkileyebilir; temel gezinme akışı devam eder.
    });
  }, [durum, yuklendi]);

  const etkinSekme = useMemo(() => durum.sekmeler.find((sekme) => sekme.id === durum.etkinSekmeId) ?? durum.sekmeler[0], [durum.etkinSekmeId, durum.sekmeler]);

  const sekmeAc = useCallback((girdi?: string, tur: SekmeTuru = "normal") => {
    const eklenenSekme = yeniSekme(girdi, tur);
    durumAyarla((onceki) => ({ ...onceki, sekmeler: [eklenenSekme, ...onceki.sekmeler], etkinSekmeId: eklenenSekme.id }));
  }, []);

  const sekmeKapat = useCallback((id: string) => {
    durumAyarla((onceki) => {
      if (onceki.sekmeler.length === 1) {
        const sifirlananSekme = yeniSekme();
        return { ...onceki, sekmeler: [sifirlananSekme], etkinSekmeId: sifirlananSekme.id };
      }
      const yeniListe = onceki.sekmeler.filter((sekme) => sekme.id !== id);
      return { ...onceki, sekmeler: yeniListe, etkinSekmeId: onceki.etkinSekmeId === id ? yeniListe[0].id : onceki.etkinSekmeId };
    });
  }, []);

  const etkinSekmeyiDegistir = useCallback((id: string) => {
    durumAyarla((onceki) => ({ ...onceki, etkinSekmeId: id, sekmeler: onceki.sekmeler.map((sekme) => sekme.id === id ? { ...sekme, sonErisim: Date.now() } : sekme) }));
  }, []);

  const sayfayaGit = useCallback((id: string, url: string, baslik?: string) => {
    if (url === YENI_SEKME_URL) return;
    durumAyarla((onceki) => {
      const hedefSekme = onceki.sekmeler.find((sekme) => sekme.id === id);
      if (!hedefSekme) return onceki;
      const yeniBaslik = baslik?.trim() || urlBasligi(url);
      const ayniKayit = onceki.gecmis[0]?.url === url && onceki.gecmis[0]?.baslik === yeniBaslik;
      const yeniGecmis: GecmisKaydi[] = hedefSekme.tur === "gizli" || ayniKayit ? onceki.gecmis : [{ id: benzersizKimlik("gecmis"), url, baslik: yeniBaslik, ziyaretZamani: Date.now() }, ...onceki.gecmis].slice(0, 150);
      return { ...onceki, gecmis: yeniGecmis, sekmeler: onceki.sekmeler.map((sekme) => sekme.id === id ? { ...sekme, url, baslik: yeniBaslik, sonErisim: Date.now(), yukleniyor: false } : sekme) };
    });
  }, []);

  const yukleniyorAyarla = useCallback((id: string, yukleniyor: boolean) => {
    durumAyarla((onceki) => ({ ...onceki, sekmeler: onceki.sekmeler.map((sekme) => sekme.id === id ? { ...sekme, yukleniyor } : sekme) }));
  }, []);

  const yerImiDegistir = useCallback(() => {
    durumAyarla((onceki) => {
      const sekme = onceki.sekmeler.find((item) => item.id === onceki.etkinSekmeId);
      if (!sekme || sekme.url === YENI_SEKME_URL) return onceki;
      const mevcut = onceki.yerImleri.find((item) => item.url === sekme.url);
      const yerImleri: YerImi[] = mevcut ? onceki.yerImleri.filter((item) => item.id !== mevcut.id) : [{ id: benzersizKimlik("yer-imi"), url: sekme.url, baslik: sekme.baslik, olusturulma: Date.now() }, ...onceki.yerImleri];
      return { ...onceki, yerImleri };
    });
  }, []);

  const yerImiSil = useCallback((id: string) => durumAyarla((onceki) => ({ ...onceki, yerImleri: onceki.yerImleri.filter((item) => item.id !== id) })), []);
  const gecmisiTemizle = useCallback(() => durumAyarla((onceki) => ({ ...onceki, gecmis: [] })), []);
  const ayariDegistir = useCallback(<K extends keyof TarayiciAyarlari>(anahtar: K, deger: TarayiciAyarlari[K]) => durumAyarla((onceki) => ({ ...onceki, ayarlar: { ...onceki.ayarlar, [anahtar]: deger } })), []);

  const sayfaMetniniKaydet = useCallback((id: string, metin: string, baslik?: string) => {
    const temiz = metin.replace(/\s+/g, " ").trim().slice(0, 24000);
    durumAyarla((onceki) => ({ ...onceki, sekmeler: onceki.sekmeler.map((sekme) => sekme.id === id ? { ...sekme, sayfaMetni: temiz, baslik: baslik?.trim() || sekme.baslik } : sekme) }));
  }, []);

  const engellenenIstekEkle = useCallback((adet = 1) => durumAyarla((onceki) => ({ ...onceki, engellenenIstekSayisi: onceki.engellenenIstekSayisi + Math.max(1, adet) })), []);

  const indirmeGuncelle = useCallback((id: string, degisiklik: Partial<IndirmeGorevi>) => {
    durumAyarla((onceki) => ({ ...onceki, indirmeler: onceki.indirmeler.map((gorev) => gorev.id === id ? { ...gorev, ...degisiklik } : gorev) }));
  }, []);

  const indirmeBaslat = useCallback(async (url: string, dosyaAdi?: string, mimeTuru?: string) => {
    const gorev = { ...yeniIndirme(url, dosyaAdi), mimeTuru };
    durumAyarla((onceki) => ({ ...onceki, indirmeler: [gorev, ...onceki.indirmeler] }));
    try {
      const sonuc = await dosyaIndirmesiniBaslat(gorev, (indirilenBayt, toplamBayt) => indirmeGuncelle(gorev.id, { indirilenBayt, toplamBayt }));
      indirmeGuncelle(gorev.id, { ...sonuc, durum: "tamamlandi", hata: undefined, resumeVerisi: undefined });
    } catch (hata) {
      if (indirmeDuraklatildiMi(gorev.id)) return;
      indirmeGuncelle(gorev.id, { durum: "basarisiz", hata: hata instanceof Error ? hata.message : "İndirme tamamlanamadı." });
    }
  }, [indirmeGuncelle]);

  const indirmeDuraklat = useCallback(async (id: string) => {
    try {
      const resumeVerisi = await dosyaIndirmesiniDuraklat(id);
      indirmeGuncelle(id, { durum: "duraklatildi", resumeVerisi });
    } catch (hata) {
      indirmeGuncelle(id, { durum: "basarisiz", hata: hata instanceof Error ? hata.message : "İndirme duraklatılamadı." });
    }
  }, [indirmeGuncelle]);

  const indirmeyeDevam = useCallback(async (id: string) => {
    const gorev = durum.indirmeler.find((item) => item.id === id);
    if (!gorev) return;
    indirmeGuncelle(id, { durum: "indiriliyor", hata: undefined });
    try {
      const sonuc = await dosyaIndirmesiniBaslat(gorev, (indirilenBayt, toplamBayt) => indirmeGuncelle(id, { indirilenBayt, toplamBayt }), gorev.resumeVerisi);
      indirmeGuncelle(id, { ...sonuc, durum: "tamamlandi", resumeVerisi: undefined });
    } catch (hata) {
      indirmeGuncelle(id, { durum: "basarisiz", hata: hata instanceof Error ? hata.message : "İndirmeye devam edilemedi." });
    }
  }, [durum.indirmeler, indirmeGuncelle]);

  const indirmePaylas = useCallback(async (id: string) => {
    const gorev = durum.indirmeler.find((item) => item.id === id);
    if (!gorev?.hedefUri) return;
    try { await indirilenDosyayiPaylas(gorev.hedefUri, gorev.mimeTuru); }
    catch (hata) { indirmeGuncelle(id, { hata: hata instanceof Error ? hata.message : "Dosya paylaşılamadı." }); }
  }, [durum.indirmeler, indirmeGuncelle]);

  const indirmeSil = useCallback(async (id: string) => {
    const gorev = durum.indirmeler.find((item) => item.id === id);
    await indirilenDosyayiSil(gorev?.hedefUri);
    durumAyarla((onceki) => ({ ...onceki, indirmeler: onceki.indirmeler.filter((item) => item.id !== id) }));
  }, [durum.indirmeler]);

  const deger = useMemo<TarayiciBaglamiDegeri>(() => ({ durum, yuklendi, etkinSekme, sekmeAc, sekmeKapat, etkinSekmeyiDegistir, sayfayaGit, yukleniyorAyarla, yerImiDegistir, yerImiSil, gecmisiTemizle, ayariDegistir, sayfaMetniniKaydet, engellenenIstekEkle, indirmeBaslat, indirmeDuraklat, indirmeyeDevam, indirmePaylas, indirmeSil }), [ayariDegistir, durum, etkinSekme, etkinSekmeyiDegistir, engellenenIstekEkle, gecmisiTemizle, indirmeBaslat, indirmeDuraklat, indirmePaylas, indirmeSil, indirmeyeDevam, sayfaMetniniKaydet, sekmeAc, sekmeKapat, sayfayaGit, yerImiDegistir, yerImiSil, yuklendi, yukleniyorAyarla]);
  return <TarayiciBaglami.Provider value={deger}>{children}</TarayiciBaglami.Provider>;
}

export function useTarayici() {
  const baglam = useContext(TarayiciBaglami);
  if (!baglam) throw new Error("useTarayici yalnızca TarayiciSaglayici içinde kullanılabilir.");
  return baglam;
}
