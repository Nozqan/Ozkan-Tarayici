import { describe, expect, it } from "vitest";

import { gezinmeKarari, takipParametreleriniTemizle } from "../lib/tarayici/filtreler";
import { indirmeAdayiMi, varsayilanAyarlar } from "../lib/tarayici/modeller";

describe("WebView koruma kuralları", () => {
  it("takip parametrelerini temizler", () => {
    expect(takipParametreleriniTemizle("https://ornek.com/yazi?utm_source=x&fbclid=y&id=9", true)).toBe("https://ornek.com/yazi?id=9");
  });

  it("bilinen reklam alanını engeller", () => {
    const karar = gezinmeKarari("https://googleads.g.doubleclick.net/pagead", varsayilanAyarlar);
    expect(karar.izinli).toBe(false);
  });

  it("şifrelenmemiş üst seviye bağlantıyı HTTPS zorunluluğunda engeller", () => {
    const karar = gezinmeKarari("http://ornek.com", varsayilanAyarlar);
    expect(karar.izinli).toBe(false);
  });

  it("güvenli sayfaya izin verir ve takip parametresini temizler", () => {
    const karar = gezinmeKarari("https://ornek.com/rehber?utm_campaign=akrep", varsayilanAyarlar);
    expect(karar).toEqual({ izinli: true, url: "https://ornek.com/rehber" });
  });
});

describe("indirme URL tespiti", () => {
  it("bilinen dosya uzantılarını indirilebilir olarak tanır", () => {
    expect(indirmeAdayiMi("https://ornek.com/dosya.pdf")).toBe(true);
    expect(indirmeAdayiMi("https://ornek.com/video.mp4?surum=2")).toBe(true);
  });

  it("normal web sayfasını indirme olarak işaretlemez", () => {
    expect(indirmeAdayiMi("https://ornek.com/hakkimizda")).toBe(false);
  });
});
