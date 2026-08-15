# Akrep Tarayıcı

Akrep Tarayıcı; **A+B tasarım yönüyle** geliştirilen, koyu cam yüzeyli ve turuncu vurgulu bir Android mobil tarayıcı başlangıç sürümüdür. Uygulama, sade adres çubuğu ve sekme düzenini; gizlilik, VPN, yapay zekâ ve indirme araçlarının açık durum bilgileriyle bir araya getirir.

## Bu sürümde çalışanlar

| Alan | Durum | Açıklama |
|---|---|---|
| Sekmeler | Çalışır | Normal/gizli sekme açma, kapatma, aktif sekme değiştirme ve yerel saklama |
| Gezinme | Çalışır | URL ve arama metni çözümleme; Android/iOS cihazda yerel WebView ile sayfa açma |
| Yer imleri | Çalışır | Aktif sayfayı kaydetme, arama ve silme |
| Geçmiş | Çalışır | Normal sekme ziyaretlerini yerelde listeleme ve temizleme |
| Temalar | Çalışır | Akrep Siyahı, grafit yüzey, turuncu/kehribar vurgu sistemi |
| Ayarlar | Çalışır | Tercihleri yerelde saklama; HTTPS, takip, DNS, reklam ve masaüstü görünümü tercihleri |
| VPN merkezi | Dürüst hazırlık durumu | Gerçek WireGuard gateway ve yerel Android VPN modülü olmadan bağlı görünmez |
| AI merkezi | Dürüst hazırlık durumu | Sağlayıcı ve kullanıcı izni olmadan özet/çeviri/cevap üretmez |
| İndirme merkezi | Dürüst hazırlık durumu | Gerçek indirme işi bağlanmadan hız veya dosya ilerlemesi göstermez |

> **Not:** Web tarayıcısındaki geliştirici önizlemesi, Android/iOS içindeki yerel WebView deneyiminin yerine geçmez. WebView gezinmesi cihazda veya uygun yerel önizlemede test edilmelidir.

## Yerelde çalıştırma

```bash
pnpm install
pnpm dev
```

Android cihazda test için Expo bağlantısını tarayın. Android APK'yı yerelde zorla üretmek yerine, doğrulanmış sürümden sonra yayın akışındaki **Publish** seçeneğiyle oluşturun.

## Kalite komutları

```bash
pnpm test
pnpm lint
pnpm check
```

## Mimari

```text
app/                 Ekranlar ve yönlendirme
bilesenler/          Türkçe adlandırılmış ortak UI bileşenleri
lib/tarayici/        Sekme, geçmiş, yer imi ve ayar veri modelleri
assets/images/       Akrep marka varlıkları
tests/               Birim testleri
```

Ürün alanına ait klasör ve yorumlar Türkçe tutulur. Derleme araçlarının zorunlu adları ile üçüncü taraf kütüphanelerin isimleri teknik uyumluluk için korunur.

## Gerçek VPN için sonraki adımlar

Gerçek VPN; uygulama ekranının ötesinde Android `VpnService`, güvenilir WireGuard Android entegrasyonu, kullanıcı izin akışı, Android Keystore, WireGuard gateway, NAT, IP forwarding, DNS, IPv6 ve leak testleri gerektirir. Bu bileşenler kurulmadan VPN arayüzü **bağlı** durumu göstermeyecektir.

## Güvenlik ilkeleri

Private key, oturum tokenı veya GitHub erişim anahtarı kaynak kodda, Markdown'da, loglarda veya uygulama paketinde yer almaz. Yapay zekâ araçları, kullanıcı açıkça izin vermeden sayfa verisini göndermez.

## Kaynak ürün spesifikasyonu

Kapsamlı ürün, UX, VPN ve güvenlik sözleşmesi için proje kökündeki [`AKREP_TARAYICI_URUN_VE_TEKNIK_SPESIFIKASYON.md`](./AKREP_TARAYICI_URUN_VE_TEKNIK_SPESIFIKASYON.md) belgesine bakın.
