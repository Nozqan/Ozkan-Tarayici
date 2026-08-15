import { TRPCError } from "@trpc/server";
import { z } from "zod";

import { invokeLLM } from "../_core/llm.js";
import { publicProcedure, router } from "../_core/trpc.js";

const SAYFA_METNI_SINIRI = 24_000;
const GORSEL_VERI_SINIRI = 3_500_000;
const istekSayaclari = new Map<string, { sayi: number; sifirlanma: number }>();

function istemciAnahtari(ileri: string | string[] | undefined) {
  return Array.isArray(ileri) ? ileri[0] : ileri?.split(",")[0]?.trim() || "anonim";
}

function hizSiniriKontrolEt(anahtar: string) {
  const simdi = Date.now();
  const onceki = istekSayaclari.get(anahtar);
  if (!onceki || onceki.sifirlanma < simdi) {
    istekSayaclari.set(anahtar, { sayi: 1, sifirlanma: simdi + 60_000 });
    return;
  }
  if (onceki.sayi >= 6) throw new TRPCError({ code: "TOO_MANY_REQUESTS", message: "AI araçları için dakika başına altı istek sınırı var." });
  onceki.sayi += 1;
}

function metniTemizle(metin: string) {
  return metin.replace(/\s+/g, " ").trim().slice(0, SAYFA_METNI_SINIRI);
}

const sayfaGirdisi = z.object({
  url: z.string().url().max(2048),
  baslik: z.string().max(240).optional(),
  metin: z.string().min(40).max(SAYFA_METNI_SINIRI),
});

async function metinYaniti({ gorev, url, baslik, metin, soru }: { gorev: string; url: string; baslik?: string; metin: string; soru?: string }) {
  const sonuc = await invokeLLM({
    model: "gpt-5-mini",
    maxCompletionTokens: 900,
    messages: [
      { role: "system", content: "Sen Akrep Tarayıcı içindeki gizlilik odaklı yardımcı asistansın. Yalnızca kullanıcının gönderdiği sayfa metnine dayan. Sayfada olmayan bilgiyi gerçek gibi söyleme. Cevabını Türkçe, kısa paragraflar ve gerekirse maddelerle ver. Harici URL açma, web araması veya araç kullanma." },
      { role: "user", content: `Görev: ${gorev}\nSayfa başlığı: ${baslik || "Bilinmiyor"}\nKaynak URL: ${url}\n${soru ? `Kullanıcı sorusu: ${soru}\n` : ""}Sayfa metni:\n${metniTemizle(metin)}` },
    ],
  });
  const icerik = sonuc.choices[0]?.message.content;
  const yanit = typeof icerik === "string" ? icerik.trim() : "";
  if (!yanit) throw new TRPCError({ code: "INTERNAL_SERVER_ERROR", message: "AI geçerli bir yanıt döndürmedi." });
  return { yanit, model: sonuc.model, kaynakUrl: url };
}

export const akrepAiRouter = router({
  ozetle: publicProcedure.input(sayfaGirdisi).mutation(async ({ input, ctx }) => {
    hizSiniriKontrolEt(istemciAnahtari(ctx.req.headers["x-forwarded-for"]));
    return metinYaniti({ gorev: "Bu sayfayı ana fikir, önemli ayrıntılar ve belirsizlikler olacak şekilde özetle.", ...input });
  }),
  cevir: publicProcedure.input(sayfaGirdisi.extend({ hedefDil: z.literal("tr").default("tr") })).mutation(async ({ input, ctx }) => {
    hizSiniriKontrolEt(istemciAnahtari(ctx.req.headers["x-forwarded-for"]));
    return metinYaniti({ gorev: "Sayfa metnini Türkçeye çevir. Anlamı koru; kaynakta olmayan bilgi ekleme.", ...input });
  }),
  soruSor: publicProcedure.input(sayfaGirdisi.extend({ soru: z.string().min(2).max(600) })).mutation(async ({ input, ctx }) => {
    hizSiniriKontrolEt(istemciAnahtari(ctx.req.headers["x-forwarded-for"]));
    return metinYaniti({ gorev: "Kullanıcının sorusunu yalnızca bu sayfa metninden yanıtla. Yanıt metinde bulunmuyorsa bunu açıkça söyle.", ...input });
  }),
  gorseliAcikla: publicProcedure.input(z.object({
    veri: z.string().startsWith("data:image/").max(GORSEL_VERI_SINIRI),
  })).mutation(async ({ input, ctx }) => {
    hizSiniriKontrolEt(istemciAnahtari(ctx.req.headers["x-forwarded-for"]));
    const sonuc = await invokeLLM({
      model: "gpt-5-mini",
      maxCompletionTokens: 650,
      messages: [
        { role: "system", content: "Kullanıcının seçtiği görseli Türkçe olarak açıkla. Görünmeyen ayrıntıları kesin gerçek gibi iddia etme. İnsanların kimliğini, hassas özelliğini veya konumunu tahmin etme." },
        { role: "user", content: [{ type: "text", text: "Bu görseli kısa ve yardımcı biçimde açıkla." }, { type: "image_url", image_url: { url: input.veri, detail: "low" } }] },
      ],
    });
    const icerik = sonuc.choices[0]?.message.content;
    const yanit = typeof icerik === "string" ? icerik.trim() : "";
    if (!yanit) throw new TRPCError({ code: "INTERNAL_SERVER_ERROR", message: "AI görsel için geçerli bir açıklama döndürmedi." });
    return { yanit, model: sonuc.model };
  }),
});
