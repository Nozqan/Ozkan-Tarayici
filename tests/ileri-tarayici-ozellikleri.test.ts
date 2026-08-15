import { describe, expect, it } from "vitest";

import { alanAdiCikar, indirmeSinifiniBelirle, varsayilanAyarlar } from "../lib/tarayici/modeller";

describe("ileri tarayıcı özellikleri", () => {
  it("indirmeleri uzantı ve MIME türüne göre sınıflandırır", () => {
    expect(indirmeSinifiniBelirle("https://ornek.com/film.webm")).toBe("video");
    expect(indirmeSinifiniBelirle("https://ornek.com/rehber.pdf")).toBe("belge");
    expect(indirmeSinifiniBelirle("https://ornek.com/foto.webp")).toBe("gorsel");
    expect(indirmeSinifiniBelirle("https://ornek.com/arsiv.zip")).toBe("arsiv");
  });

  it("site izni için alan adını www önekinden arındırır", () => {
    expect(alanAdiCikar("https://www.ornek.com/izinler")).toBe("ornek.com");
  });

  it("başlangıç sayfası ve tek elle kullanım tercihlerini varsayılan olarak tanımlar", () => {
    expect(varsayilanAyarlar.adresCubuguKonumu).toBe("ust");
    expect(varsayilanAyarlar.tekElleKullanim).toBe(false);
    expect(varsayilanAyarlar.hizliErisimler.length).toBeGreaterThan(0);
  });
});
