import { describe, expect, it } from "vitest";

import { adresiCoz, yeniSekme, YENI_SEKME_URL } from "../lib/tarayici/modeller";

describe("tarayıcı adres çözümü", () => {
  it("eksiksiz HTTP adresini değiştirmeden kullanır", () => {
    expect(adresiCoz("https://akrep.example/rehber")).toBe("https://akrep.example/rehber");
  });

  it("alan adını HTTPS ile tamamlar", () => {
    expect(adresiCoz("ornek.com")).toBe("https://ornek.com");
  });

  it("normal metni güvenli arama URL'sine dönüştürür", () => {
    expect(adresiCoz("akrep tarayıcı")).toBe("https://www.google.com/search?q=akrep%20taray%C4%B1c%C4%B1");
  });

  it("Yandex seçildiğinde kullanıcı aramasını Yandex üzerinde başlatır", () => {
    expect(adresiCoz("akrep tarayıcı", "yandex")).toBe("https://yandex.com/search/?text=akrep%20taray%C4%B1c%C4%B1");
  });

  it("boş yeni sekmenin başlangıç URL'sini kullanır", () => {
    const sekme = yeniSekme();
    expect(sekme.url).toBe(YENI_SEKME_URL);
    expect(sekme.tur).toBe("normal");
  });

  it("gizli sekmeyi bağımsız türle oluşturur", () => {
    const sekme = yeniSekme(undefined, "gizli");
    expect(sekme.tur).toBe("gizli");
    expect(sekme.url).toBe(YENI_SEKME_URL);
  });
});
