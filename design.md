# Akrep Tarayıcı — Mobil Arayüz Tasarım Planı

## Tasarım İlkesi

Akrep Tarayıcı, **9:16 dikey mobil kullanım** ve tek elle erişim için tasarlanır. Gezinmenin çekirdeği Chrome benzeri anlaşılır bir sekme modeli; görsel atmosferi ise Akrep markasına ait koyu cam yüzeyler, sıcak turuncu vurgular ve yumuşak iOS hissi taşıyan geçişlerden oluşur. Opera'nın araç zenginliği fikrinden yararlanılır; ancak marka, simge, ekran veya özel UI unsuru kopyalanmaz.

İlk sürümde arayüz, gerçek verisi olmayan hiçbir işlevi çalışıyormuş gibi göstermez. VPN için gerçek sunucu ve Android yerel VPN motoru olmadan bağlantı kurulmuş durumu görünmez. Yapay zekâ için sunucu entegrasyonu bulunmadan üretken yanıt, özet veya çeviri sonucu üretilmez.

## Görsel Sistem

| Öğe | Karar | Kullanım |
|---|---|---|
| Ana arka plan | `#080B10` Akrep Siyahı | Tarayıcı ve tüm ana ekranlar |
| Yüzey | `#121821` Grafit | Kartlar, çekmeceler, modal yüzeyler |
| Cam katmanı | `rgba(27, 38, 51, 0.72)` | Hızlı araçlar ve ikincil bileşenler |
| Ana vurgu | `#FF6A2A` Akrep Turuncusu | Birincil eylem, aktif sekme, ekleme düğmesi |
| Başarı | `#27D17F` Koruma Yeşili | Doğrulanmış güvenlik veya başarılı işlem |
| Uyarı | `#FFB000` Neon Kehribar | Kurulum gerekli veya dikkat gerektiren bilgi |
| Hata | `#FF4D5A` Hata Kırmızısı | Başarısız işlem ve risk uyarıları |
| Birincil metin | `#F6F8FB` | Başlıklar ve önemli bilgiler |
| İkincil metin | `#A8B3C2` | Açıklamalar ve durum metinleri |

Kartlar 20–24 dp köşe yarıçapına, ince yarı saydam sınıra ve yumuşak gölgeye sahip olmalıdır. Etkileşimlerde 80–180 ms arası hafif küçülme ve düşük şiddetli haptik geri bildirim kullanılacaktır. Sistemde düşük hareket tercihi etkinse dekoratif animasyonlar azaltılacaktır.

## Ekran Listesi

| Ekran | Ana içerik | Birincil işlevler |
|---|---|---|
| Açılış | Akrep logosu, kısa kuyruk ışık animasyonu | Uygulama kabuğunu açma |
| Yeni Sekme / Ana Sayfa | Adres çubuğu, hızlı bağlantılar, son ziyaretler, gizlilik özeti | URL veya arama başlatma, yeni sekme açma |
| Tarayıcı | Web içeriği, URL çubuğu, güvenlik durumu | Geri/ileri, yenile, sayfa eylemleri |
| Sekme Merkezi | Normal, gizli ve uyuyan sekmeler | Sekme açma, kapatma, aktif sekmeyi değiştirme |
| Yer İmleri | Klasörler, arama, kayıtlar | Kaydetme, arama, silme |
| Geçmiş | Tarihe göre gerçek ziyaret kayıtları | Arama, öğe açma, kapsamlı silme |
| İndirme Merkezi | Gerçek indirme durumları veya boş durum | Dosya açma, paylaşma, iptal etme |
| Gizlilik Merkezi | Reklam/takip koruması, HTTPS, DNS, izin özeti | Ayar değiştirme, site istisnası yönetimi |
| VPN Merkezi | Sunucu/yerel motor hazırlık durumu | Gerçek bağlantı için eksik gereksinimleri gösterme |
| Yapay Zekâ Merkezi | Kullanıcı izinleri, kullanılabilir eylemler | İzin ve sağlayıcı yapılandırması gösterme |
| Ayarlar | Tarayıcı, tema, sekmeler, güvenlik, indirmeler | Kalıcı tercihler |

## Ana Akışlar

### Gezinme akışı

Kullanıcı adres çubuğuna URL girer → giriş doğrulanır → geçerliyse mevcut veya yeni sekmede web görünümü açılır → ziyaret gerçek geçmiş kaydına işlenir → kullanıcı geri/ileri/yüklemeyi durdur işlemlerini kullanabilir.

### Sekme akışı

Kullanıcı alt çubuktaki sekme düğmesine dokunur → Sekme Merkezi açılır → kullanıcı aktif sekmeye döner, yeni normal veya gizli sekme açar ya da bir sekmeyi kapatır → sayaç ve aktif sekme durumu gerçek sekme deposundan güncellenir.

### Yer imi akışı

Kullanıcı açık sayfadaki yıldız düğmesine dokunur → sayfa başlığı ve URL'si gerçek aktif sekmeden alınır → yerel depoya kaydedilir → düğme kaydedildi durumuna geçer → Yer İmleri ekranında aranabilir.

### VPN akışı

Kullanıcı VPN kartına dokunur → gerçek VPN sunucusu ve yerel Android motoru mevcut değilse bağlantı denemesi başlatılmaz → eksik gereksinimler, güvenlik notu ve sonraki adım gösterilir. İleride gerçek Android `VpnService`/WireGuard modülü eklendiğinde bu ekran aynı durum modeliyle gerçek izin, handshake ve bağlantı sonuçlarını kullanacaktır.

### Yapay zekâ akışı

Kullanıcı AI aracına dokunur → sayfa verisini göndermeden önce izin/durum ekranı açılır → sunucu entegrasyonu hazır değilse üretken cevap gösterilmez → entegrasyon sonraki sürümde etkinleştirildiğinde, kullanıcı onayı ve kaynak bağlantılarıyla çalışır.

## Erişilebilirlik ve Tek El Kullanımı

Birincil gezinme kontrolleri alt araç çubuğundadır. Minimum dokunma alanı 44×44 dp hedeflenir. Renk tek başına durum belirtmez; metin etiketi ve simge birlikte kullanılır. TalkBack için bütün simgeler açıklayıcı etiket alır. Dinamik yazı tipi boyutu kritik metni kırpmadan büyütmelidir.

## İlk Sürüm Kapsamı

İlk sürüm; markalı uygulama kabuğu, yeni sekme ekranı, gerçek sekme modeli, yerel yer imleri/geçmiş, ayarlar, dürüst VPN/AI hazırlık ekranları ve test altyapısına odaklanacaktır. Tam WireGuard motoru, gerçek VPN gateway, AI sunucusu, reklam filtre motoru, tam indirme yöneticisi, eşzamanlama ve ücretli planlar sonraki aşamalar olarak kalacaktır.
