import type { TarayiciAyarlari } from "./modeller";

const REKLAM_ALANLARI = new Set([
  "doubleclick.net",
  "googlesyndication.com",
  "googleadservices.com",
  "adnxs.com",
  "adsrvr.org",
  "taboola.com",
  "outbrain.com",
  "criteo.com",
  "scorecardresearch.com",
  "amazon-adsystem.com",
]);

const TAKIP_PARAMETRELERI = ["fbclid", "gclid", "dclid", "msclkid", "mc_cid", "mc_eid", "igshid"];
const TAKIP_YOLLARI = ["/collect", "/analytics", "/track", "/pixel", "/beacon"];
const REKLAM_SECICILERI = [
  "iframe[src*='doubleclick']",
  "iframe[src*='googlesyndication']",
  "iframe[src*='adnxs']",
  "[id*='ad-container']",
  "[class*='ad-container']",
  "[id^='google_ads']",
  "[data-ad-client]",
  ".adsbygoogle",
];

export type GezinmeKarari = { izinli: true; url: string } | { izinli: false; neden: string };

export function takipParametreleriniTemizle(girdi: string, takipKoruma: boolean) {
  if (!takipKoruma) return girdi;
  try {
    const url = new URL(girdi);
    for (const ad of [...url.searchParams.keys()]) {
      if (ad.toLowerCase().startsWith("utm_") || TAKIP_PARAMETRELERI.includes(ad.toLowerCase())) url.searchParams.delete(ad);
    }
    return url.toString();
  } catch {
    return girdi;
  }
}

export function gezinmeKarari(girdi: string, ayarlar: TarayiciAyarlari): GezinmeKarari {
  let url: URL;
  try {
    url = new URL(girdi);
  } catch {
    return { izinli: false, neden: "Geçersiz bağlantı engellendi." };
  }

  if (ayarlar.httpsZorunlu && url.protocol !== "https:") {
    return { izinli: false, neden: "HTTPS zorunlu olduğu için şifrelenmemiş bağlantı açılmadı." };
  }

  const alan = url.hostname.toLowerCase();
  const alanEngelli = [...REKLAM_ALANLARI].some((kural) => alan === kural || alan.endsWith(`.${kural}`));
  const yolTakip = TAKIP_YOLLARI.some((parca) => url.pathname.toLowerCase().includes(parca));
  if ((ayarlar.reklamEngelleme && alanEngelli) || (ayarlar.takipKoruma && yolTakip)) {
    return { izinli: false, neden: "Reklam veya takip uç noktası WebView koruması tarafından engellendi." };
  }

  return { izinli: true, url: takipParametreleriniTemizle(url.toString(), ayarlar.takipKoruma) };
}

export function reklamEngellemeBetigi(aktif: boolean, takipKoruma: boolean) {
  if (!aktif && !takipKoruma) return "true;";
  const alanlar = JSON.stringify([...REKLAM_ALANLARI]);
  const seciciler = JSON.stringify(REKLAM_SECICILERI);
  return `
    (function () {
      if (window.__akrepKorumaEtkin) return true;
      window.__akrepKorumaEtkin = true;
      const alanlar = ${alanlar};
      const seciciler = ${seciciler};
      const say = (adet) => {
        if (adet > 0 && window.ReactNativeWebView) {
          window.ReactNativeWebView.postMessage(JSON.stringify({ tip: 'filtre', adet: adet }));
        }
      };
      const alanEngelli = (deger) => {
        try {
          const host = new URL(deger, location.href).hostname.toLowerCase();
          return alanlar.some((alan) => host === alan || host.endsWith('.' + alan));
        } catch { return false; }
      };
      const temizle = (kok) => {
        let adet = 0;
        seciciler.forEach((secici) => {
          kok.querySelectorAll(secici).forEach((dugum) => {
            if (dugum.dataset.akrepEngellendi) return;
            dugum.dataset.akrepEngellendi = '1';
            dugum.remove();
            adet += 1;
          });
        });
        kok.querySelectorAll('iframe, img, script, link[rel="preload"], video, source').forEach((dugum) => {
          const kaynak = dugum.src || dugum.href || '';
          if (kaynak && alanEngelli(kaynak)) {
            dugum.remove();
            adet += 1;
          }
        });
        say(adet);
      };
      temizle(document);
      new MutationObserver((kayitlar) => kayitlar.forEach((kayit) => kayit.addedNodes.forEach((dugum) => {
        if (dugum.nodeType === 1) temizle(dugum);
      }))).observe(document.documentElement, { childList: true, subtree: true });
      true;
    })();
  `;
}

export function sayfaMetniCikarimBetigi() {
  return `
    (function () {
      const metin = (document.body && document.body.innerText ? document.body.innerText : '')
        .replace(/\\s+/g, ' ').trim().slice(0, 24000);
      if (window.ReactNativeWebView) {
        window.ReactNativeWebView.postMessage(JSON.stringify({ tip: 'sayfa_metni', metin: metin, baslik: document.title || '' }));
      }
      true;
    })();
  `;
}
