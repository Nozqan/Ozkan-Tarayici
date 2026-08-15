# AKREP TARAYICI

## Ürün, UX, Teknik Mimari ve Geliştirme Spesifikasyonu

**Marka:** Akrep

**Önerilen uygulama adı:** Akrep Tarayıcı

**Kurucu:** Nebi Özkan

**Platform:** Android mobil uygulaması

**Belgenin amacı:** Bu belge; Chrome ve Opera'nın ne olduğunu açıklayan, Akrep Tarayıcı'nın ürün vizyonunu tanımlayan, bütün özellikleri gerçek davranışlarıyla tarif eden, Android tarayıcı ve VPN motorunun teknik gereksinimlerini belirleyen ve uygulamayı geliştirecek yapay zekâya uygulanabilir bir çalışma sözleşmesi sağlayan ana spesifikasyondur.

> **Belgeyi okuma teyidi:** 85 05 77

<!-- 85 05 77: Bu ifade yalnızca bu belgenin eksiksiz okunduğunu teyit etmek için kullanılır; erişim anahtarı, parola veya güvenlik sırrı değildir. -->

---

## 1. Uygulamayı Geliştirecek Sisteme İlk Talimat

Bu belgeyi uygulamaya başlamadan önce tamamını oku. Yalnızca ilk birkaç bölüme bakarak kod yazma. Belgenin sonunda bulunan güvenlik, gerçek işlev, test, sunucu ve teslim şartlarını da uygula.

İlk yanıtında, belgeyi eksiksiz okuduğunu göstermek için **85 05 77** ifadesini kullan. Bu ifade dışında herhangi bir erişim anahtarı, token, parola veya özel kimlik bilgisini isteme, üretme, kaynak koda yazma ya da sohbete dökme.

Akrep Tarayıcı'da sahte çalışan düğme, rastgele üretilmiş bağlantı durumu, rastgele hız değeri, sahte VPN, uydurma sunucu, uydurma IP adresi, sahte indirme ilerlemesi veya yalnızca görünüşte çalışan ayar oluşturma. Bir özellik henüz uygulanmadıysa düğmeyi **Planlandı**, **Yakında**, **Devre dışı** veya açıklayıcı bir hata durumu ile göster; özelliği çalışıyormuş gibi sunma.

Mevcut bir proje deposu verildiğinde ilk işlem kodu değiştirmek değil, deposunu incelemek olmalıdır. Mevcut arayüz, gezinme akışı, sekme sistemi, tarayıcı motoru, VPN ekranı, geçmiş ve ayarlar davranışı korunmalıdır. Kullanıcı açıkça istemediği sürece mevcut UI bileşenlerini silme veya yeniden tasarlama.

---

## 2. Güvenlik Uyarısı: Paylaşılan Erişim Bilgisi

Kaynak talimat dosyasında GitHub erişim tokenı biçiminde görünen hassas bir değer yer almıştır. Bu değer yeni belgeye **bilinçli olarak alınmamıştır**.

Eğer bu değer gerçek bir token ise derhal iptal edilmeli, yeni token oluşturulmalı, depo geçmişinde ve commit kayıtlarında aranmalı, varsa temizlenmeli ve GitHub Actions secrets ya da güvenli ortam değişkeni olarak yeniden tanımlanmalıdır. Token'ı Markdown dosyasına, Kotlin dosyasına, Gradle dosyasına, log'a, ekran görüntüsüne veya issue açıklamasına yazma.

| Hassas bilgi | Doğru saklama yeri | Kesinlikle yapılmayacak işlem |
|---|---|---|
| GitHub tokenı | GitHub Secret, güvenli CI ortamı | Kaynak koda veya Markdown'a yazmak |
| WireGuard istemci private key'i | Android Keystore veya şifreli yerel depolama | Loglamak, UI'da göstermek, Git'e göndermek |
| Kullanıcı oturum tokenı | Güvenli token yöneticisi | URL'ye veya analytics olayına eklemek |
| VPN API cevabı | TLS üzerinden, doğrulama yapılarak | İmzasız ve doğrulanmamış veriyi kullanmak |
| Yapay zekâ API anahtarı | Yalnızca sunucu tarafı gizli ortam | APK içine gömmek |

---

## 3. Ürün Vizyonu

Akrep Tarayıcı; Opera'nın güçlü görsel kimliğini, Chrome'un anlaşılır sekme ve gezinme modelini, Android'in gerçek tarayıcı altyapısını, mahremiyet özelliklerini ve izinli yapay zekâ araçlarını tek bir Android uygulamasında birleştiren özgün bir mobil tarayıcıdır.

Bu uygulama Chrome'un veya Opera'nın kodunu, markasını, ikonlarını ya da özel tasarımlarını kopyalamaz. Kullanıcıların bu ürünlerde alışık olduğu kavramları ve etkileşim kalıplarını açıkça tanır; bunları Akrep markasına, koyu cam arayüze, turuncu-akrep vurgu rengine ve yapay zekâ destekli iş akışlarına uyarlar.

Akrep Tarayıcı'nın ayırt edici konumu şu üç katmanın birlikte ve dürüst biçimde çalışmasıdır:

1. **Gerçek tarayıcı:** Web sayfalarını gerçek bir Android web motoru ile açar, sekmeleri gerçek olarak yönetir ve web izinlerini gerçek işletim sistemi izinleriyle bağlar.
2. **Gerçek mahremiyet:** Reklam, takip, çerez, güvenli DNS, HTTPS, izin ve VPN durumlarını gerçek verilere dayanarak yönetir.
3. **Gerçek yapay zekâ:** Kullanıcının açık isteğiyle sayfa içeriğini analiz eder, özetler, çevirir veya soruları cevaplar; yapamadığı durumda bunu açıkça bildirir.

---

## 4. Chrome Nedir ve Akrep Tarayıcı Neyi Öğrenmelidir?

### 4.1 Chrome'un temel tanımı

Google Chrome, Chromium tabanlı, web sayfalarını sekmeler ve adres/arama çubuğu üzerinden açan, yer imleri, geçmiş, indirmeler, gizli gezinme, site izinleri, güvenlik uyarıları ve cihazlar arası ayar/oturum özellikleri bulunan genel amaçlı bir web tarayıcısıdır.

Chrome Android'de kullanıcı yeni sekme açabilir, açık sekmeler arasında geçiş yapabilir, sekmeleri gruplandırabilir, sekmeleri arayabilir, sekmeleri kapatabilir, gizli sekme açabilir, sayfayı paylaşabilir, indirebilir, çevirebilir ve site izinlerini yönetebilir. Resmî Chrome yardım sayfası; sekme açma, sekme grupları, sekme arama, toplu sekme işlemleri ve tablet bölünmüş görünümünü temel kullanım akışları arasında tanımlar [1].

### 4.2 Chrome arayüz anatomisi

Akrep Tarayıcı Chrome'un arayüzünü kopyalamayacak; ancak kullanıcının beklentisini anlamak için aşağıdaki kavramları karşılayacaktır.

| Chrome'da beklenen alan | İşlev | Akrep Tarayıcı karşılığı |
|---|---|---|
| Adres ve arama çubuğu | URL yazma veya arama yapma | Akrep Adres Çubuğu |
| Sekme düğmesi | Açık sekmeleri görme ve değiştirme | Sekme Merkezi |
| Yeni sekme | Yeni sayfa açma | Yeni Sekme düğmesi |
| Üç nokta menüsü | Paylaşma, indirme, geçmiş, ayarlar ve diğer işlemler | Akrep Menü |
| Gizli gezinme | Geçici ve ayrı gezinme oturumu | Gizli Sekme |
| Yer imi | Sayfayı daha sonra bulmak üzere kaydetme | Yer İmleri |
| Geçmiş | Ziyaret kayıtlarını görme ve temizleme | Geçmiş |
| İndirmeler | İnen dosyaları yönetme | İndirme Merkezi |
| Site izinleri | Kamera, mikrofon, konum, bildirim ve çerez kararları | Site İzinleri Merkezi |
| Güvenlik uyarısı | Zararlı veya güvensiz sayfa hakkında uyarı | Akrep Güvenlik Kalkanı |

### 4.3 Chrome'dan alınacak davranış ilkeleri

Akrep Tarayıcı, kullanıcının adres çubuğuna URL yazdığında doğrudan URL'ye gitmeli; URL değilse seçili varsayılan arama motoruyla arama yapmalıdır. Sekme değiştirme akışı tek dokunuşla anlaşılmalı, yeni sekme açmak görünür bir düğme olmalı ve sekme kapatma işlemi yanlışlıkla dokunmaya karşı yeterli dokunma alanına sahip olmalıdır.

Gizli sekme ile normal sekmeler ayrı oturumlar olarak tutulmalıdır. Kullanıcı gizli oturumdan çıkınca gizli geçmiş, geçici çerezler ve geçici web depolaması temizlenmeli; kullanıcıya açık bir gizli mod göstergesi sunulmalıdır. Gizli mod kullanıcının internet servis sağlayıcısından, web sitesinden veya ağ yöneticisinden tamamen görünmez olacağı anlamına gelmez; arayüz bunu yanlış vaat etmemelidir.

Chrome benzeri düzenin en önemli dersi, işlevleri saklamadan düzenlemektir. Akrep Tarayıcı da ayarları kategorilere ayırmalı; önemli düğmeleri yalnızca gizli bir menüye koymamalı; gezinme, sekmeler, güvenlik ve indirme akışlarını birer gerçek durum makinesi ile yönetmelidir.

---

## 5. Opera Nedir ve Akrep Tarayıcı Neyi Öğrenmelidir?

### 5.1 Opera'nın temel tanımı

Opera, web tarayıcılığını yalnızca adres çubuğu ve sekmelerden ibaret görmeyen; yerleşik reklam engelleyici, ücretsiz tarayıcı VPN'i, yapay zekâ özellikleri, temalar, medya oynatma, bölünmüş ekran, dikey sekmeler, dosya paylaşımı ve kişiselleştirme gibi araçları ürün kimliğinin parçası yapan bir tarayıcı ailesidir.

Opera'nın resmî özellikler sayfasında Opera AI, dikey sekmeler, reklam engelleyici, ücretsiz VPN, müzik oynatıcı, dosya kolaylığı, bölünmüş ekran, ekran görüntüsü, sekme adaları, çalışma alanları, sekme arama, çeviri, yer imleri, video açılır penceresi, temalar ve cihazlar arası Flow gibi özellikler listelenir [2].

### 5.2 Opera'nın tasarım ve ürün mantığı

Opera; yoğun özellikleri kenar çubuğu, hızlı erişim düğmeleri, tema sistemi, kart tabanlı başlangıç sayfası ve bağlama göre ortaya çıkan araçlarla düzenler. Kullanıcıyı her özellik için ayrı bir uygulamaya göndermek yerine tarayıcı içinde bir araç kutusu sunar.

Akrep Tarayıcı bu mantığı Akrep markasıyla yeniden yorumlamalıdır. Örneğin Opera'nın kırmızı ağırlıklı kimliği yerine kömür siyahı, grafit, sıcak turuncu ve neon kehribar tonlarından oluşan bir Akrep paleti kullanılmalıdır. Opera'nın hazır marka ikonları veya görselleri kopyalanmamalıdır.

### 5.3 Opera'dan alınacak davranış ilkeleri

Akrep Tarayıcı; yerleşik AI paneli, medya oynatıcı, ekran görüntüsü, temalar, bölünmüş ekran, dosya paylaşımı, hızlı araçlar ve VPN gibi özellikleri ana tarayıcı deneyiminin dışında ayrı ve kopuk uygulamalar gibi değil, bağlamsal araçlar olarak sunmalıdır.

Ancak Opera'da yerleşik görülen bir özelliğin Akrep'te de otomatik olarak gerçek olduğu varsayılmamalıdır. Örneğin tarayıcı içindeki VPN düğmesi yalnızca Android `VpnService`, gerçek WireGuard tüneli, gerçek sunucu ve gerçek el sıkışma başarıyla kurulursa bağlı görünmelidir.

---

## 6. Chrome ve Opera Karşılaştırması

| Konu | Chrome yaklaşımı | Opera yaklaşımı | Akrep Tarayıcı kararı |
|---|---|---|---|
| Temel gezinme | Sade, alışılmış, hızlı | Daha zengin ve özelleştirilebilir | Sade çekirdek + isteğe bağlı gelişmiş araçlar |
| Sekmeler | Sekme grupları ve arama | Dikey sekmeler, çalışma alanları, sekme adaları | Yatay sekmeler + dikey sekme görünümü + gruplar |
| Başlangıç sayfası | Kısayollar ve kişiselleştirme | Tema, haber ve hızlı araçlar | Akrep kartları, kısayollar, AI ve gizlilik özeti |
| VPN | Tarayıcı genelinde standart özellik olarak konumlandırılmaz | Yerleşik tarayıcı VPN'i bulunabilir | Ayrı gerçek Android VPN motoru; proxy ile karıştırılmaz |
| Reklam engelleme | Bazı koruma ve site davranışları | Yerleşik reklam engelleyici vurgusu | Filtre listeleri, istisnalar ve ölçülebilir engelleme |
| AI | Chrome ekosistemine bağlı AI özellikleri görülebilir | Opera AI ve tarayıcı içi AI araçları | Kullanıcı izinli sayfa bağlamı + Türkçe odaklı AI |
| Temalar | Sınırlı veya sistem odaklı seçenekler | Güçlü tema kimliği | Akrep Cam, AMOLED, neon ve özel renk sistemi |
| Medya | Web oynatımı ve PiP | Medya oynatıcı ve video pop-out | Dahili medya merkezi ve PiP |
| Ürün ilkesi | Sadelik ve ekosistem | Zenginlik ve farklılaşma | Hız + mahremiyet + yapay zekâ + dürüst durum yönetimi |

---

## 7. Marka ve Görsel Kimlik

### 7.1 İsim

Birincil isim **Akrep Tarayıcı** olmalıdır. Kısa kullanımda **Akrep** denebilir. Uygulama paketi ve teknik kimlikte `akrep-tarayici` veya `com.akrep.tarayici` kullanılabilir.

### 7.2 Marka fikri

Akrep; sessiz, hızlı, dikkatli, savunmalı ve hedefe odaklı bir tarayıcı kişiliği temsil eder. Marka dili tehditkâr değil; kontrollü, güven veren ve teknik olmalıdır.

### 7.3 Renk sistemi

| Renk adı | Hex | Kullanım |
|---|---:|---|
| Akrep Siyahı | `#080B10` | Ana arka plan |
| Grafit | `#121821` | Kartlar ve alt yüzeyler |
| Cam Gri | `#1B2633` | Yarı saydam cam yüzey |
| Akrep Turuncusu | `#FF6A2A` | Ana eylem, aktif durum, vurgu |
| Neon Kehribar | `#FFB000` | Uyarı, premium veya dikkat durumu |
| Koruma Yeşili | `#27D17F` | Başarılı VPN, güvenli işlem |
| Hata Kırmızısı | `#FF4D5A` | Hata, bağlantı kaybı, tehlike |
| Metin Beyazı | `#F6F8FB` | Birincil metin |
| Metin Gri | `#A8B3C2` | İkincil metin |

### 7.4 Cam ve yüzey dili

iOS tarzı glassmorphism etkisi kullanılabilir; ancak cam efekti okunabilirliği bozmamalıdır. Kartlarda düşük opaklıklı arka plan, hafif arka plan bulanıklığı, 1 piksel yarı saydam kenarlık, yumuşak gölge ve 18–28 dp köşe yuvarlaklığı kullanılmalıdır. Sistem düşük güç modundaysa veya cihaz performansı yetersizse blur azaltılmalıdır.

Cam görünümü gerçek içeriğin yerine geçmez. Her kartta metin hiyerarşisi, dokunma alanı, kontrast ve erişilebilirlik korunmalıdır.

### 7.5 Şekiller ve butonlar

Ana eylem butonları oval veya kapsül biçimli olabilir. Butonların yalnızca görsel olarak bulunması kabul edilmez. Her butonun tıklama olayı, yüklenme durumu, başarı durumu, hata durumu ve devre dışı durumu tanımlanmalıdır.

| Buton | Varsayılan görünüm | Tıklanınca gerçek davranış |
|---|---|---|
| Bağlan | Turuncu oval | VPN izni, sunucu ve WireGuard tüneli akışını başlatır |
| Durdur | Kırmızı veya koyu oval | Tüneli kapatır, bağlantı durumunu doğrular |
| Yeni Sekme | Turuncu artı | Gerçek yeni sekme oluşturur |
| Sekmeler | Cam kartlı sayaç | Gerçek açık sekmeleri gösterir |
| AI | Akrep simgeli cam düğme | Sayfa bağlamı ve kullanıcı isteğiyle AI paneli açar |
| İndir | Aşağı ok | Gerçek Android indirme işini başlatır |
| Yer İmi | Yıldız veya akrep iğnesi | Veritabanına gerçek yer imi kaydeder |
| Ayarlar | Dişli | Gerçek ayarlar ekranına gider |
| Temizle | Kırmızı metinli buton | Onaydan sonra seçilen veriyi siler |

---

## 8. Giriş Ekranı ve İlk Kullanım

### 8.1 Giriş animasyonu

Uygulama açılışında akrep kuyruğunun veya akrep siluetinin kısa, zarif bir hareketi kullanılabilir. Animasyon 700–1.500 ms aralığında olmalı, uygulama açılışını gereksiz yere geciktirmemeli ve düşük hareket tercihi etkin kullanıcılar için azaltılmalıdır.

Animasyon sırası şu şekilde tasarlanabilir:

1. Koyu arka plan görünür.
2. İnce turuncu bir ışık çizgisi akrep kuyruğu hissi verir.
3. Akrep simgesi cam bir yüzey üzerinde netleşir.
4. Logo kısa süreli kehribar parıltı alır.
5. Başlangıç sayfası yumuşak geçişle açılır.

### 8.2 İlk açılış akışı

İlk açılışta kullanıcıya uygulamanın temel amacı, varsayılan arama motoru, bildirim tercihi, indirme klasörü, AI veri kullanımı, reklam engelleme, güvenli DNS ve VPN izinleri açıklanmalıdır. Kullanıcı istemediği izni vermek zorunda bırakılmamalıdır.

VPN izni, kullanıcı VPN'i ilk kez bağlamak istediğinde istenmelidir. Uygulama açılır açılmaz VPN izni penceresi göstermek gereksiz ve rahatsız edici olabilir.

### 8.3 İlk giriş ve sekme mantığı

Kullanıcı uygulamayı ilk açtığında Chrome benzeri bir yeni sekme ekranı görmelidir. Bu ekranın içinde adres/arama çubuğu, hızlı site kısayolları, yer imleri, son ziyaretler, AI hızlı eylemleri, güvenlik özeti ve VPN durum kartı bulunabilir.

Yeni sekme ekranı gerçek sekme yöneticisine bağlı olmalıdır. Bir kartın görünmesi, o web sayfasının önceden açıldığı anlamına gelmez; kart açıldığında gerçek bir sekme oluşturulmalıdır.

---

## 9. Ana Gezinme ve Sekme Sistemi

### 9.1 Ana yerleşim

Varsayılan mobil yerleşim aşağıdaki alanlardan oluşmalıdır:

| Bölge | İçerik |
|---|---|
| Üst alan | Adres/arama çubuğu, güvenlik kilidi, sesli arama, AI düğmesi |
| İçerik alanı | Web sayfası veya yeni sekme ekranı |
| Alt araç çubuğu | Geri, ileri, yenile/durdur, sekmeler, menü |
| Sekme merkezi | Açık sekmeler, gruplar, gizli sekmeler, kapatma ve yeni sekme |
| Hızlı araç çekmecesi | AI, VPN, reklam engelleme, indirme, ekran görüntüsü, çeviri |

### 9.2 Chrome benzeri sekme davranışı

Sekmeler gerçek bir `Sekme` veri modeli olarak tutulmalıdır. Her sekmede benzersiz kimlik, URL, başlık, favicon durumu, normal/gizli tür, yükleme durumu, son erişim zamanı, uyku durumu ve grup kimliği bulunmalıdır.

Kullanıcı sekmeleri soldan sağa kaydırarak değiştirebilmelidir. Kaydırma hareketi, web sayfasının kendi yatay kaydırmasıyla çakışmayacak şekilde sekme çubuğunda veya kenar bölgesinde çalışmalıdır.

Sekme işlemleri şunları içermelidir:

- Yeni sekme açma.
- Sekmeyi kapatma.
- Tüm sekmeleri kapatma.
- Sekmeyi çoğaltma.
- Sekmeyi yer imlerine ekleme.
- Sekmeyi gruba taşıma.
- Sekmeyi sabitleme veya uyutma.
- Sekmeleri arama.
- Son kapatılan sekmeyi geri açma.
- Sekme oturumunu kaydetme.
- Normal ve gizli sekmeleri ayırma.

### 9.3 Sekme grupları ve dikey sekmeler

Sekme grupları; kullanıcıya konu, proje veya görev bazlı çalışma alanı sağlamalıdır. Dikey sekme görünümü özellikle çok sayıda sekmesi olan kullanıcılar için alternatif görünüm olarak sunulmalıdır.

Dikey sekmeler ilk sürümde mevcut UI'ın bozulmasına neden olmayacak şekilde ikinci görünüm olarak eklenebilir. Kullanıcı ayarlardan yatay kart görünümü ile dikey liste görünümü arasında geçiş yapmalıdır.

### 9.4 Uyuyan sekmeler

Uyuyan sekme, uzun süre kullanılmayan sekmenin web motoru kaynaklarını serbest bırakmasıdır. Sekme kapatılmamalı; URL, başlık ve gerekli geri yükleme verisi saklanmalıdır. Yeniden açıldığında sayfanın gerçek olarak yeniden yüklenebileceği kullanıcıya bildirilmelidir.

Android işletim sistemi toplam RAM'i sihirli biçimde temizlemeye izin vermeyebilir. Bu nedenle uygulama **RAM temizlendi** gibi yanıltıcı bir ifade kullanmamalı; bunun yerine "Kullanılmayan sekmeler uyutuldu" veya "Akrep sekme belleği azaltıldı" demelidir.

---

## 10. Adres ve Arama Çubuğu

Adres çubuğu şu davranışları gerçek olarak desteklemelidir:

| Kullanıcı girdisi | Davranış |
|---|---|
| `https://` veya geçerli URL | URL'yi aç |
| Alan adı | HTTPS ile dene, başarısızsa açık hata göster |
| Normal metin | Varsayılan arama motorunda ara |
| QR veya barkod sonucu | Güvenlik kontrolünden sonra aç |
| Yapıştırılan şüpheli URL | Alan adı ve HTTPS durumu göster |
| Sesli arama | İzin varsa sesi yazıya çevir; izin yoksa açıklama göster |
| AI komutuyla başlayan istek | AI araması veya sayfa içi işlem akışı |

Kullanıcı adres çubuğuna yazarken geçmiş önerileri, yer imleri, sık kullanılanlar ve arama önerileri gösterilebilir. Hassas gizli sekme verileri normal sekme önerilerine sızdırılmamalıdır.

---

## 11. Gizli Sekme

Gizli sekme ayrı bir sekme türüdür; normal sekmelerle aynı geçmiş, çerez veya form otomatik doldurma deposunu paylaşmamalıdır. Gizli sekmede ekran görüntüsü, kopyalama ve dosya indirme davranışları kullanıcı ayarlarına bağlı olabilir.

Gizli sekme şu vaatleri yapmamalıdır: internet servis sağlayıcısından tamamen gizlenme, web sitelerinden tamamen görünmez olma veya VPN yerine geçme. VPN açıksa gizli sekme VPN üzerinden çalışabilir; bu iki özellik birbirinin yerine geçmez.

Uygulama, gizli sekmeleri biyometrik kilitleme ile korumayı desteklemelidir. Gizli sekme geri planda kaldığında içerik bulanıklaştırılmalı veya kart önizlemesi gizlenmelidir.

---

## 12. Yer İmleri, Geçmiş ve Site Verisi

### 12.1 Yer imleri

Yer imi; URL, başlık, favicon, klasör, oluşturulma tarihi, son erişim ve etiketlerden oluşmalıdır. Yer imleri aranabilmeli, klasörlere taşınabilmeli, dışa aktarılabilmeli ve senkronizasyon açıksa diğer cihazlara gönderilebilmelidir.

### 12.2 Geçmiş

Geçmiş gerçek gezinti olaylarından oluşturulmalıdır. Aynı sayfanın tekrar tekrar açılması için gruplanmış görünüm kullanılabilir; ancak silme işlemi veri tabanındaki gerçek kayıtları kaldırmalıdır.

Kullanıcı son 15 dakika, bugün, tüm zamanlar, alan adı veya özel seçim ile temizleme yapabilmelidir. Gizli sekme geçmişe yazılmamalıdır.

### 12.3 Çerez ve önbellek temizleme

Ayarlar içinde çerezler, önbellek, site depolaması, indirme geçmişi, gezinme geçmişi ve otomatik doldurma verileri ayrı seçenekler olarak sunulmalıdır. Tüm veriyi silme düğmesi öncesinde hangi verilerin silineceği açıkça gösterilmelidir.

---

## 13. Reklam Engelleyici ve Takip Engelleme

Reklam engelleyici; bilinen reklam, izleme, kripto madenciliği, açılır pencere ve kötü amaçlı komut dosyası kaynaklarını filtre listeleri üzerinden engellemelidir. Filtre listeleri sürümlenmeli, güncellenmeli ve güncelleme başarısızsa eski listeyle çalışmaya devam etmelidir.

Kullanıcı site bazlı istisna ekleyebilmelidir. Bir sayfa bozulduğunda adres çubuğundaki kalkan düğmesinden o site için reklam engellemeyi geçici olarak kapatabilmelidir.

Reklam engelleyici şu istatistikleri gerçek olarak gösterebilir:

- Bu sayfada engellenen istek sayısı.
- Bu alan adında engellenen istek sayısı.
- Son filtre listesi güncelleme zamanı.
- İstisna durumları.

"Yüzde 100 reklam engellendi" gibi doğrulanamayan bir iddia gösterilmemelidir. Engelleme, sayfa uyumluluğu ve performans arasında dengelenmelidir.

Takip engelleme, üçüncü taraf izleyicileri, bilinen parmak izi komut dosyalarını ve izleme parametrelerini azaltmayı hedeflemelidir. Mutlak anonimlik vaat edilmemelidir.

---

## 14. Açılır Pencere, Çerez ve İzin Yönetimi

### 14.1 Açılır pencere engelleme

Açılır pencere engelleyici, tarayıcı motorunun yeni pencere ve yeni sekme olaylarını gözlemlemeli; şüpheli açılır pencereleri engellemeli; kullanıcının istediği alan adları için istisna sunmalıdır.

### 14.2 Çerez izin yöneticisi

Kullanıcı tüm çerezleri, yalnızca gerekli çerezleri veya site bazlı çerez davranışını seçebilmelidir. Bir çerez bildirimindeki seçimler otomatik olarak kabul edilmiş gibi davranmamalı; kullanıcı kararı görünür ve geri alınabilir olmalıdır.

### 14.3 Kamera, mikrofon ve konum

Web siteleri kamera, mikrofon, konum, bildirim, pano ve dosya erişimi istediğinde site alan adı, istenen izin ve tek seferlik/kalıcı karar seçenekleri gösterilmelidir. Android sistem izni ile web sitesi izni birbirinden ayrı katmanlardır; ikisi de verilmeden erişim sağlanmamalıdır.

---

## 15. Varsayılan Arama Motoru

Ayarlar üzerinden arama motoru seçimi desteklenmelidir. En azından birden fazla meşru arama sağlayıcısı, özel arama URL'si ve uygulama içi AI araması seçenekleri mimari olarak desteklenmelidir.

Arama motoru seçimi; kullanıcı onayı olmadan değiştirilemez. Özel arama motoru ekleme sırasında HTTPS, alan adı ve URL şablonu doğrulanmalıdır. Hassas arama geçmişi varsayılan olarak üçüncü tarafa gönderilmemelidir.

---

## 16. Yapay Zekâ Özellikleri

AI özellikleri varsayılan olarak sayfanın içeriğini arka planda göndermemelidir. Kullanıcı bir AI eylemini başlattığında hangi içeriğin gönderileceği, hangi servisin kullanılacağı ve verinin saklanıp saklanmayacağı açıklanmalıdır.

### 16.1 Sayfayı özetle

Sayfanın ana metni çıkarılır, menü ve reklam gürültüsü azaltılır, özet uzunluğu seçilebilir ve kaynak bağlantısı korunur. Özet üretilemezse kullanıcıya sebep gösterilir. Özet, sayfanın tamamının doğruluğu yerine geçmez.

### 16.2 Sayfayı Türkçeye çevir

Sayfa veya seçilen metin çevrilebilir. Kullanıcı orijinal metne geri dönebilir. Özel, kişisel veya form içeriği çevrilmeden önce uyarı gösterilebilir. Çeviri sonucu sayfanın gerçek içeriğiyle karıştırılmamalıdır.

### 16.3 PDF özetleme

Kullanıcı seçtiği PDF'yi cihazda veya izinli bir sunucu iş akışında analiz ettirebilir. Büyük dosyalarda sayfa aralığı ve veri kullanımı gösterilmelidir. Şifreli PDF için kullanıcıdan parola istemek yerine işletim sistemi güvenli akışı kullanılmalıdır; parola loglanmamalıdır.

### 16.4 Görseli açıklama

Kullanıcı açıkça seçtiği görseli AI'ya gönderebilir veya erişilebilirlik amacıyla cihaz içi analiz seçebilir. Görselde kişisel veri, yüz, belge veya konum bilgisi bulunabileceğine dair uyarı gösterilmelidir.

### 16.5 Web sayfasındaki soruları cevaplama

AI yalnızca sayfada bulunan veya kullanıcı tarafından ayrıca verilen içerik bağlamında cevap vermelidir. Sayfada bilgi yoksa uydurma cevap vermek yerine "Bu sayfada doğrulanabilir bilgi bulamadım" demelidir.

### 16.6 Kod açıklama ve makale kısaltma

Kod blokları biçimi bozulmadan analiz edilmeli, kod çalıştırılmamalı ve kullanıcı açıkça istemedikçe harici depolara gönderilmemelidir. Makale kısaltma, başlıkları ve kaynak bağlantılarını mümkün olduğunca korumalıdır.

### 16.7 Sesli sohbet

Sesli sohbet için mikrofon izni, kayıt göstergesi ve durdurma düğmesi bulunmalıdır. Kullanıcı sesinin kaydedilip kaydedilmediği açıklanmalıdır. Sürekli arka plan dinlemesi varsayılan davranış olmamalıdır.

### 16.8 Web'de araştırma modu

Araştırma modu arama sonuçlarını kaynak, tarih ve güvenilirlik bilgisiyle düzenlemeli; kaynakları birbirine karıştırmamalı; sonuç ile yorum arasındaki farkı göstermelidir. Kullanıcıya kaynak bağlantıları verilmelidir.

### 16.9 Akıllı sekme önerileri

Sekme başlıkları, alan adları ve kullanıcının açıkça etkinleştirdiği geçmiş verisiyle gruplanan sekme önerileri oluşturulabilir. Gizli sekmeler öneri sistemine dahil edilmemelidir.

### 16.10 Yapay zekâ destekli arama

Arama çubuğundan normal arama, AI araması ve sayfa içi AI eylemi birbirinden ayrılmalıdır. Her sonuçta bunun web araması mı, AI üretimi mi veya sayfa özeti mi olduğu açıkça yazmalıdır.

---

## 17. Performans Özellikleri

### 17.1 RAM ve sekme belleği

İşletim sistemi RAM'ini temizlediğini iddia etmek yerine, Akrep Tarayıcı kullanılmayan sekmeleri uyutmalı, sayfa önizlemelerini azaltmalı ve web motoru kaynaklarını geri vermelidir.

### 17.2 Veri tasarrufu

Veri tasarrufu; görsel kalitesi, ön yükleme, video otomatik oynatma ve AI istekleri üzerinde kullanıcı kontrolü sağlamalıdır. Kullanıcıya hangi işlemin veri tasarrufu yaptığı gösterilebilir.

### 17.3 Turbo yükleme

Turbo yükleme, sayfayı hızlandırmak için DNS ön çözümleme, ön bağlantı ve güvenli ön yükleme kullanabilir. Kullanıcının istemediği kişiselleştirilmiş sayfalar önceden yüklenmemeli; HTTPS ve gizlilik kuralları ihlal edilmemelidir.

### 17.4 Arka planda indirme

Android DownloadManager veya uygulamanın kontrollü indirme servisi kullanılmalıdır. İndirme durumu gerçek dosya akışına göre hesaplanmalı; ağ veya depolama hatası kullanıcıya bildirilmelidir.

### 17.5 DNS over HTTPS

DoH seçeneği güvenilir bir resolver ile HTTPS üzerinden yapılandırılmalı, bağlantı başarısız olduğunda fallback davranışı kullanıcıya açıklanmalıdır. DoH, VPN'in yerini tutmaz ve tek başına tam anonimlik sağlamaz.

### 17.6 HTTPS zorunlu modu

HTTP sayfaları HTTPS'e yükseltilmeye çalışılabilir. Site yalnızca HTTP destekliyorsa kullanıcıya uyarı gösterilmeli, güvenlik politikasını geçici olarak aşma kararı açıkça kullanıcıya bırakılmalıdır.

---

## 18. Gizlilik ve Güvenlik Özellikleri

### 18.1 Parmak izi koruması

Parmak izi koruması; ekran boyutu, kullanıcı ajanı, canvas, yazı tipi, zaman dilimi veya donanım bilgisi gibi sinyallerin aşırı benzersiz olmasını azaltmayı hedeflemelidir. Her web sitesini bozan agresif değişiklik yerine uyumluluk ve mahremiyet dengesi kurulmalıdır.

### 18.2 Güvenli tarama uyarıları

Şüpheli alan adı, kötü amaçlı indirme, kimlik avı veya geçersiz sertifika durumlarında kullanıcıya geçiş öncesi uyarı gösterilmelidir. Uyarı ekranındaki "Yine de devam et" düğmesi gizlenmemeli ancak güçlü şekilde açıklanmalıdır.

### 18.3 Uygulama kilidi

Uygulama kilidi PIN, parola veya biyometrik doğrulama ile çalışabilir. Kilit bilgisi kaynak koda yazılmamalı, deneme sayısı ve gecikmeli yeniden deneme uygulanmalıdır.

### 18.4 Şifre yöneticisi ve geçiş anahtarları

Şifre yöneticisi ilk sürümde yalnızca Android güvenli depolama ve kullanıcı onayıyla çalışmalıdır. Şifrelerin düz metin loglanması, dışa aktarılması veya AI'ya gönderilmesi yasaktır. Passkey desteği ileri aşamaya ayrılabilir.

---

## 19. +18 İçerik İzni

+18 seçeneği, kullanıcının yaşa uygun içerik filtresini isteğe bağlı olarak yönetmesi anlamına gelmelidir; yaş doğrulama veya yasal sorumlulukların atlanması anlamına gelmez.

Özellik şu kurallara uymalıdır:

1. İlk etkinleştirmede açık bilgilendirme ve onay alınır.
2. Bölgesel hukuk, uygulama mağazası politikaları ve yaş doğrulama yükümlülükleri ayrıca incelenir.
3. Çocuk güvenliği ve aile denetimi ayarları bu özelliğin üzerinde önceliğe sahip olur.
4. Uygulama yetişkin içeriği üretmez, sunucuya yüklemez ve filtreyi atlatma aracı sunmaz.
5. Ayar kolayca kapatılabilir ve durum açıkça gösterilir.
6. Hassas geçmiş kayıtları varsayılan olarak AI önerilerine dahil edilmez.

---

## 20. İndirme Yöneticisi

İndirme yöneticisi gerçek ağ ve dosya durumuna bağlı olmalıdır. Her indirme için URL, dosya adı, içerik türü, boyut, indirilen byte miktarı, hız, kalan süre, durum, hata ve hedef klasör tutulmalıdır.

Desteklenecek özellikler:

| Özellik | Gerçek davranış |
|---|---|
| Duraklat/devam ettir | Sunucu ve dosya sistemi destekliyorsa byte aralığıyla sürdür; desteklemiyorsa kullanıcıya yeniden başlatma gerektiğini söyle |
| Çoklu indirme | Aynı anda çalışan indirme sayısını ayarlardan yönet |
| Hız bilgisi | Son ölçüm penceresinden hesapla; rastgele sayı üretme |
| Dosya kategorileri | MIME türü ve uzantıya göre sınıflandır; belirsizse kullanıcıya göster |
| ZIP açıcı | Arşiv içeriğini güvenli dizinde aç; path traversal saldırısını engelle |
| APK taraması | Dosya hash'i ve güvenlik taraması yap; tarama yoksa "tarama yapılmadı" de |
| İndirme geçmişi | Gerçek tamamlanan, iptal edilen ve hatalı kayıtları listele |
| Arka plan indirme | Android yaşam döngüsü ve bildirim kurallarıyla sürdür |

APK dosyası indirmek ile kurmak birbirinden farklıdır. Akrep Tarayıcı kullanıcı onayı olmadan APK kurmaya çalışmamalıdır.

---

## 21. Kişiselleştirme

Açık, koyu, AMOLED, Akrep Gece, Neon Kehribar ve kullanıcı renk seçimi temaları desteklenmelidir. AMOLED tema gerçek siyah ağırlıklı olmalı; cam efektlerinin OLED ekranlarda güç tüketimini artırabileceği belirtilmelidir.

Kullanıcı ana sayfada hızlı bağlantıların sırasını, arka plan görselini, alt araç çubuğu düğmelerini, yazı boyutunu ve haber/AI kartlarını düzenleyebilmelidir. Duvar kâğıdı seçimi dosya izni veya sistem fotoğraf seçici üzerinden yapılmalıdır.

Tema değişikliği uygulama yeniden başlatılmadan mümkün olduğunca uygulanmalı; karanlık temada metin kontrastı korunmalıdır.

---

## 22. Akıllı Özellikler

### 22.1 QR kod okuyucu ve oluşturucu

QR okuyucu kamera izniyle çalışmalı, bağlantıyı açmadan önce alan adı önizlemesi göstermeli ve sahte/şüpheli alan adlarını işaretlemelidir. QR oluşturucu URL, metin, Wi-Fi bilgisi ve iletişim kartı gibi türleri destekleyebilir.

### 22.2 Web sayfasını PDF kaydetme

Sayfa yazdırma veya PDF oluşturma API'si kullanılarak gerçek PDF üretilmelidir. PDF sayfa sayısı ve hedef klasör kullanıcıya gösterilmelidir.

### 22.3 Çevrimdışı kaydetme

Çevrimdışı kaydetme yalnızca HTML'yi değil, mümkün olduğunda kaynakları ve görüntüleri de kontrollü şekilde saklamalıdır. Telif, oturum ve erişim kısıtları ihlal edilmemelidir.

### 22.4 Masaüstü görünümü

Masaüstü görünümü kullanıcı ajanını ve görünür yerleşimi değiştirebilir. Her sitenin masaüstü sürümünü desteklemediği açıkça belirtilmelidir.

### 22.5 Okuma modu

Okuma modu ana metni, başlığı, görselleri ve temel kaynakları sade bir görünüme taşır. Sayfanın yapısı güvenilir şekilde çıkarılamazsa buton gizlenmeli veya açıklayıcı biçimde devre dışı kalmalıdır.

### 22.6 Tam ekran, PiP ve medya

Tam ekran ve PiP için Android ve web motoru izinleri kullanılmalıdır. Video veya müzik oynatma, kullanıcı sayfadan ayrıldığında açık bir medya bildirimi ve durdurma kontrolü sunmalıdır.

---

## 23. Gelişmiş Özellikler

Eklenti desteği, masaüstü uzantıları, çoklu kullanıcı profili, senkronizasyon, parola yöneticisi, biyometrik kilit, uygulama kilidi, sekme grupları, dikey sekmeler, bölünmüş ekran ve sesli asistan ileri aşamalara ayrılmalıdır.

Eklenti desteği için kullanılan web motorunun gerçek eklenti API'si desteklemesi gerekir. Desteklenmeyen bir API'nin varmış gibi gösterilmesi yasaktır. İlk sürümde eklenti yerine güvenilir filtre listeleri ve dahili araçlar tercih edilebilir.

Çoklu profil; geçmiş, yer imleri, çerezler, indirmeler, ayarlar ve AI tercihlerini ayrı tutmalıdır. Profil değişimi arka plandaki gizli sekmeleri görünür yapmamalıdır.

---

## 24. Önerilen 25 Ek Özellik

Aşağıdaki özellikler kullanıcı tarafından verilen kapsamı tamamlamak üzere önerilmiştir. Her özellik önce ürün tasarımı ve veri güvenliği açısından planlanmalı, sonra uygulanmalıdır.

| No | Ek özellik | Açıklama |
|---:|---|---|
| 1 | Akıllı adres çubuğu | URL, arama, geçmiş, yer imi ve AI komutunu tek alanda ayırır. |
| 2 | Son oturumu geri yükleme | Uygulama kapanınca normal sekmeleri kullanıcı onayıyla geri getirir. |
| 3 | Sekme oturumu kaydetme | Geçici bir proje veya araştırma sekmeleri paketi olarak kaydedilir. |
| 4 | Sekme arşivi | Kapatmadan arşivler; daha sonra gerçek URL ve başlıkla geri açar. |
| 5 | Sekme paylaşım paketi | Seçilen sekmeleri link listesi olarak paylaşır; gizli sekmeleri varsayılan dışarıda bırakır. |
| 6 | Alan adı güven puanı | Sertifika, HTTPS, bilinen tehdit ve kullanıcı izinleriyle açıklanabilir risk özeti verir. |
| 7 | İzin panosu | Kamera, mikrofon, konum, bildirim ve pano izinlerini alan adı bazında yönetir. |
| 8 | Akıllı pano temizleme | Hassas kopyalanmış metin için süreli pano temizleme seçeneği sunar. |
| 9 | URL takip parametresi temizleme | UTM gibi bilinen takip parametrelerini kullanıcı seçimiyle azaltır. |
| 10 | Güvenli dosya önizleme | PDF, görsel, video ve metin dosyasını açmadan önce tür ve boyut kontrolü yapar. |
| 11 | İndirme kuralları | Alan adına, dosya türüne veya boyuta göre klasör seçimi yapar. |
| 12 | İndirme zamanlayıcı | Büyük dosyaları Wi-Fi, şarj veya belirli saat koşuluna göre başlatır. |
| 13 | Tarayıcı içi dosya kasası | Kullanıcının seçtiği dosyaları biyometrik korumalı uygulama alanında tutar. |
| 14 | Web bildirim merkezi | Sitelerin bildirimlerini tek ekranda listeler, sessize alır veya iptal eder. |
| 15 | Okuma listesi | Sayfaları etiket, kaynak ve çevrimdışı durumuyla saklar. |
| 16 | Kaynaklı AI cevapları | AI cevabında hangi sayfa parçasının kullanıldığını gösterir. |
| 17 | Sayfa değişikliği izleme | Kullanıcı seçtiği sayfanın değiştiğini yerel veya izinli bildirimle bildirir. |
| 18 | Fiyat ve ürün takip listesi | Kullanıcı seçimiyle ürün sayfalarını takip eder; yanıltıcı fiyat iddiası yapmaz. |
| 19 | Web sayfası ekran görüntüsü | Görünür alan veya tam sayfa görüntüsünü gerçek olarak kaydeder. |
| 20 | Ekran görüntüsü üzerine açıklama | Çizim, metin, bulanıklaştırma ve kırpma araçları sunar. |
| 21 | Cihazlar arası Flow | Kullanıcı hesabı varsa link, metin ve dosyayı şifreli senkronizasyonla taşır. |
| 22 | Yerel yedek ve geri yükleme | Yer imleri, ayarlar ve sekmeleri kullanıcı seçimiyle dışa aktarır. |
| 23 | Kullanım ve mahremiyet raporu | Engellenen izleyiciler, VPN süresi ve izin değişikliklerini açıklar. |
| 24 | Ağ tanılama ekranı | DNS, bağlantı, VPN handshake ve endpoint sorunlarını teknik olmayan dille açıklar. |
| 25 | Özellik bayrakları ve uzaktan yapılandırma | Yeni özellikleri uygulama güncellemesi beklemeden kontrollü açar; güvenli imza ve geri alma gerektirir. |

Ek özellikler varsayılan olarak kullanıcıyı boğacak biçimde ana ekrana doldurulmamalıdır. Akrep Tarayıcı'nın temel gezinmesi hızlı kalmalı; gelişmiş araçlar hızlı araç çekmecesinde ve ayarlarda bulunmalıdır.

---

## 25. Gerçek VPN Mimarisi

### 25.1 Temel ayrım

`VpnService`, Android'in VPN uygulamaları için sunduğu altyapıdır. Android dokümantasyonuna göre bu servis sanal bir ağ arayüzü oluşturur, adres ve yönlendirme kurallarını yapılandırır, dosya tanımlayıcısı üzerinden paket alışverişine izin verir ve uygulamanın uzak sunucuyla tünel kurmasını sağlar [3].

WireGuard ise gerçek VPN tünel protokolü ve motorudur. WireGuard; IP paketlerini UDP üzerinden şifreli biçimde taşır, anahtar tabanlı eş doğrulaması kullanır ve WireGuard arayüzünü bir ağ arayüzü olarak sunar [4].

VPN sunucusu ise tünelin karşı tarafıdır. Sunucuda WireGuard, IP forwarding, NAT, firewall ve DNS yönlendirmesi birlikte çalışmadıkça Android'de VPN düğmesine basılması internet trafiğinin gerçekten sunucu üzerinden geçtiği anlamına gelmez.

### 25.2 Veri akışı

```text
Akrep Tarayıcı
    |
    v
Akrep VPN Yöneticisi
    |
    v
Akrep VPN Servisi
    |
    v
Android VpnService / TUN arayüzü
    |
    v
WireGuard istemci motoru
    |
    v
Şifreli WireGuard UDP tüneli
    |
    v
Gerçek WireGuard VPN Gateway
    |
    +--> IP forwarding
    +--> NAT
    +--> Firewall
    +--> DNS resolver
    |
    v
İnternet
```

### 25.3 Gerçek bağlantı durumu

Aşağıdaki durum makinesi kullanılmalıdır:

```text
DISCONNECTED
    -> PREPARING_PERMISSION
    -> CONNECTING
    -> AUTHENTICATING
    -> HANDSHAKING
    -> TUNNEL_ESTABLISHED
    -> CONNECTED

CONNECTED
    -> CONNECTION_LOST
    -> RECONNECTING
    -> HANDSHAKING
    -> CONNECTED

Her aşama
    -> ERROR
    -> DISCONNECTED
```

UI kendi başına `CONNECTED` yazamaz. `CONNECTED` ancak Android VPN izni, servis, WireGuard tüneli, handshake, rota ve beklenen ağ doğrulaması başarılı olduğunda yayınlanmalıdır.

### 25.4 VPN sınıfları

```text
vpn/
├── vpn_hizmeti/
│   └── AkrepVpnService.kt
├── vpn_yonetimi/
│   └── AkrepVpnManager.kt
├── vpn_durumu/
│   └── VpnState.kt
├── vpn_yapilandirmasi/
│   └── VpnConfig.kt
├── vpn_baglantisi/
│   └── VpnConnectionManager.kt
├── vpn_deposu/
│   └── VpnRepository.kt
├── vpn_sunuculari/
│   ├── VpnServer.kt
│   └── VpnServerRepository.kt
├── vpn_secimi/
│   └── VpnServerSelector.kt
├── vpn_saglik/
│   └── VpnHealthChecker.kt
├── vpn_istatistikleri/
│   └── VpnStats.kt
├── vpn_hatalari/
│   └── VpnError.kt
├── vpn_olaylari/
│   └── VpnEvent.kt
└── vpn_guvenligi/
    └── VpnSecurityManager.kt
```

Kullanıcı mevcut VPN UI'ının hazır olduğunu belirttiğinde bu sınıflar UI'ı yeniden çizmemeli; mevcut VPN ekranına durum akışı, gerçek hata, bağlantı süresi ve gerçek istatistik sağlayan arka plan katmanı olarak bağlanmalıdır.

### 25.5 VPN yapılandırması

```kotlin
data class VpnConfig(
    val clientAddress: String,
    val serverPublicKey: String,
    val serverEndpoint: String,
    val serverPort: Int,
    val dnsServers: List<String>,
    val allowedIps: List<String>,
    val persistentKeepaliveSeconds: Int?,
    val mtu: Int
)
```

Private key bu modelin kalıcı, loglanabilir veya UI'ya aktarılabilir alanı olmamalıdır. Private key Android Keystore veya uygun güvenli depolama katmanından çalışma anında alınmalıdır.

### 25.6 WireGuard yapılandırması

Aşağıdaki yalnızca yer tutucu şemadır; gerçek anahtar, IP veya endpoint uydurulamaz:

```ini
[Interface]
PrivateKey = CLIENT_PRIVATE_KEY_FROM_SECURE_STORAGE
Address = VPN_CLIENT_ADDRESS_FROM_CONTROL_PLANE
DNS = VPN_DNS_FROM_TRUSTED_CONFIGURATION

[Peer]
PublicKey = VERIFIED_SERVER_PUBLIC_KEY
Endpoint = VERIFIED_SERVER_ENDPOINT:VERIFIED_SERVER_PORT
AllowedIPs = 0.0.0.0/0, ::/0
PersistentKeepalive = 25
```

Gerçek WireGuard yapılandırması control plane veya güvenilir yönetim sistemi tarafından sağlanmalı, imza/şema/alan doğrulaması yapılmalı ve istemci tarafında private key gereksiz yere sunucuya gönderilmemelidir.

### 25.7 VpnService kuralları

Android VPN servisinde `prepare`, `Builder`, `establish`, `protect`, `onRevoke`, foreground service ve ağ değişikliği akışları uygulanmalıdır. Android, aynı anda yalnızca bir VPN bağlantısı çalıştırır ve VPN bağlantısı süresince sistem tarafından yönetilen bildirim gösterir [3].

WireGuard'ın upstream soketi VPN rotasına tekrar girerek döngü oluşturmamalıdır. Tünel soketi uygun yerde `VpnService.protect()` ile korunmalı, Wi-Fi'dan mobil veriye geçişte underlying network ve soket durumu yeniden değerlendirilmelidir.

### 25.8 Foreground service

Android 8.0 ve üstünde VPN uygulaması servis başlatıldıktan sonra foreground konumuna geçmelidir; aksi halde sistem servisi sonlandırabilir [3]. Bildirimde bağlantının gerçek durumu, seçilen sunucu, durdurma eylemi ve varsa hata açıklanmalıdır.

### 25.9 IPv4, IPv6, DNS ve kill switch

Full tunnel için IPv4 `0.0.0.0/0` ve IPv6 `::/0` uyumlu şekilde ele alınmalıdır. Sunucu IPv6 desteklemiyorsa IPv6'nın doğrudan internete kaçması engellenmeli veya kullanıcıya açıkça desteklenmediği bildirilmelidir.

DNS resolver VPN üzerinden yönlendirilmeli, DNS leak testi yapılmalı ve normal ISP DNS'inin beklenmedik biçimde kullanıldığı durum hata olarak raporlanmalıdır.

Kill switch yalnızca UI switch'i olmamalıdır. Android Always-on veya Lockdown davranışları destekleniyorsa bunlar değerlendirilmelidir. Uygulamanın teknik yetkisi sistemin izin verdiği sınırları aşmamalıdır.

### 25.10 Yeniden bağlanma

Bağlantı koptuğunda sınırsız hızlı döngü yapılmamalıdır. Önerilen bekleme dizisi 1, 2, 4, 8, 16 ve 30 saniyeye kadar çıkabilir; ağ yoksa yeniden bağlanma duraklatılmalı, kullanıcıya iptal seçeneği verilmelidir.

Wi-Fi ve mobil ağ değişimleri `ConnectivityManager` üzerinden izlenmeli, eski ağ bağlantısı kontrollü kapatılmalı, yeni ağda WireGuard endpoint'i tekrar değerlendirilmeli ve handshake sonucu beklenmelidir.

### 25.11 VPN istatistikleri

Aşağıdaki değerler gerçek tünel veya ağ ölçümünden hesaplanmalıdır:

- İndirilen byte ve yüklenen byte.
- Bağlantı süresi.
- Son handshake zamanı.
- Paket sayısı.
- Gerçek ölçülen gecikme.
- Yeniden bağlanma sayısı.
- DNS ve endpoint durumu.

Rastgele `Ping: 32 ms`, `Speed: 50 Mbps`, `Protected` veya sahte IP gösterme. Ölçüm yoksa `Ölçülüyor`, `Veri yok` veya `Belirlenemedi` yaz.

---

## 26. VPN Sunucusu ve Control Plane

### 26.1 Sunucu gerekliliği

Gerçek VPN hizmeti için en az bir gerçek Linux WireGuard gateway gerekir. Sunucuda WireGuard, IP forwarding, NAT, firewall, DNS ve izleme bulunmalıdır. Android uygulaması tek başına internete VPN üzerinden çıkış sağlayamaz.

### 26.2 Control plane ve data plane

Control plane; kullanıcı doğrulama, sunucu listesi, VPN profil üretimi, oturum yönetimi, sunucu sağlığı ve hesap bilgilerini yönetir. Data plane ise kullanıcının gerçek internet trafiğini WireGuard gateway üzerinden taşır. Kullanıcının internet trafiği gereksiz biçimde control API üzerinden geçirilmemelidir.

```text
Control Plane
    ├── Kimlik doğrulama
    ├── Sunucu listesi
    ├── VPN profil isteği
    ├── Health ve yük
    └── Oturum yönetimi

Data Plane
    Telefon -> WireGuard -> Gateway -> NAT -> İnternet
```

### 26.3 Önerilen API

```text
POST /api/v1/auth/session
GET  /api/v1/vpn/servers
POST /api/v1/vpn/sessions
GET  /api/v1/vpn/sessions/{id}
POST /api/v1/vpn/sessions/{id}/revoke
GET  /api/v1/vpn/health
```

API cevapları HTTPS, kimlik doğrulama, şema doğrulama, süre sonu ve hata kodlarıyla korunmalıdır. Sunucu public key, endpoint ve allowed IP değerleri doğrulanmadan kullanılmamalıdır.

### 26.4 Sunucu listesi

Örneğin aşağıdaki bölgeler yalnızca gerçekten kurulmuş ve erişilebilir sunucular varsa gösterilebilir:

- Almanya #01.
- Hollanda #01.
- Fransa #01.
- Amerika Birleşik Devletleri #01.
- Türkiye veya kullanıcının hukuk ve altyapı kararına uygun diğer bölgeler.

Sunucu adı, ülke, şehir, endpoint, public key, durum, yük, gecikme ve son sağlık kontrolü gerçek veriden gelmelidir. Rastgele sunucu adı üretmek yasaktır.

### 26.5 Server health

Health check; reachability, WireGuard handshake başarısı, gecikme, yük, kullanılabilirlik, DNS ve NAT çıkışı için ayrı kontrol sonuçları üretmelidir. Bir sunucu yönetim API'sinde sağlıklı görünse bile istemci handshake yapamıyorsa istemcide bağlı gösterilmemelidir.

---

## 27. Ücretsiz VPN Ürün Kararı

Ücretsiz VPN sunulabilir; ancak "hız sınırı olmadan" ve "sınırsız" gibi vaatler gerçek kapasite, sunucu maliyeti, bölgesel düzenlemeler ve kullanım politikasına dayanmalıdır. Teknik olarak yeterli kapasite yoksa yapay hız sınırı uygulamak yerine açık kota ve adil kullanım politikası açıklanmalıdır.

İleride ücretli sunucu bölgeleri, daha fazla cihaz, daha yüksek kapasite, özel DNS, gelişmiş sunucu seçimi veya kurumsal hesaplar eklenebilir. Ücretli özellikler sonradan eklenecekse ücretsiz sürümün temel gizlilik ve güvenlik durumları sahte biçimde kısıtlanmamalıdır.

---

## 28. Türkçe Klasör ve Kod Kuralı

### 28.1 Klasör isimleri

Ürün alanına ait klasör ve dosya isimleri Türkçe olmalıdır. Örnek yapı:

```text
akrep-tarayici/
├── uygulama/
│   ├── kaynak/
│   │   └── ana/
│   │       ├── AndroidManifest.xml
│   │       ├── kotlin/
│   │       │   └── com/akrep/tarayici/
│   │       │       ├── ekranlar/
│   │       │       ├── sekmeler/
│   │       │       ├── gezinme/
│   │       │       ├── yer_imleri/
│   │       │       ├── gecmis/
│   │       │       ├── indirmeler/
│   │       │       ├── yapay_zeka/
│   │       │       ├── gizlilik/
│   │       │       ├── vpn/
│   │       │       ├── ayarlar/
│   │       │       ├── tema/
│   │       │       ├── medya/
│   │       │       └── ortak/
│   │       └── res/
│   └── test/
├── ortak_kod/
├── backend/
│   ├── kimlik/
│   ├── vpn_kontrolu/
│   ├── sunucu_yonetimi/
│   ├── saglik_kontrolleri/
│   └── yapay_zeka/
├── sunucu/
│   ├── wireguard/
│   ├── firewall/
│   ├── dns/
│   └── izleme/
├── belgeler/
├── testler/
└── betikler/
```

Android Gradle'ın zorunlu klasörleri veya üçüncü taraf kütüphanelerin zorunlu adları derleme sisteminin gereği ise olduğu gibi bırakılabilir. Türkçeleştirme, derlemeyi bozacak şekilde zorunlu teknik yolları değiştirmek anlamına gelmez. Ürün alanı klasörlerinde Türkçe adlandırma esastır.

### 28.2 Kod ve yorum dili

Kod yorumları Türkçe yazılmalıdır. UI metinleri Türkçe kaynak dosyalarında tutulmalı, ileride İngilizce ve diğer diller için yerelleştirme altyapısı hazır olmalıdır. Değişken, sınıf ve fonksiyon isimleri derleme standardı ve kütüphane API'leriyle uyumlu olacak şekilde seçilebilir; ancak ürün alanı dosya ve klasör isimleri Türkçe tutulmalıdır.

Kod yorumlarında şu tür ifadeler kullanılmamalıdır:

- "Bunu bir yapay zekâ yazdı."
- "AI burada uydurdu."
- "Sahte veri geçici olarak kullanıldı."
- "Sonra gerçek yapılacak" denilerek çalışan özellik gibi sunulan açıklamalar.

Bunun yerine teknik ve kalıcı açıklamalar kullanılmalıdır:

```kotlin
// VPN bağlantısı doğrulanmadan kullanıcı arayüzüne CONNECTED durumu gönderilmez.
// Private key güvenli depolamadan çalışma anında alınır ve loglanmaz.
// Sunucu yanıtı şema ve public key doğrulamasından sonra kullanılır.
```

### 28.3 Kod kalite kuralları

Her özellik için durum, hata, yüklenme ve boş veri durumu tanımlanmalıdır. Uzun fonksiyonlar bölünmeli, ağ ve depolama işlemleri ana UI iş parçacığında çalıştırılmamalı, hassas değerler loglanmamalı ve test edilebilir arayüzler kullanılmalıdır.

---

## 29. Önerilen Android Teknik Yığını

| Katman | Öneri |
|---|---|
| Dil | Kotlin |
| UI | Mevcut UI korunur; yeni ekranlar için Jetpack Compose veya mevcut mimariyle uyumlu View sistemi |
| Tarayıcı motoru | Android WebView veya daha ileri motor kontrolü gereken durumda GeckoView; seçim prototip testinden sonra kesinleştirilir |
| Durum yönetimi | Kotlin Coroutines, Flow ve açık state modelleri |
| Yerel veri | Room veya mevcut güvenilir veri katmanı |
| Güvenli depolama | Android Keystore ve şifreli tercihler |
| Ağ | HTTPS, sertifika politikaları, yapılandırılmış API istemcisi |
| VPN | Android `VpnService` ve güvenilir WireGuard Android entegrasyonu |
| İndirme | Android DownloadManager veya kontrollü foreground indirme servisi |
| Test | Birim, UI, instrumented, ağ ve uçtan uca testler |
| Gözlemlenebilirlik | Kişisel veri toplamayan hata ve performans ölçümü |

Tarayıcı motoru seçimi; uzantı ihtiyacı, medya desteği, güvenlik güncellemeleri, performans, DRM, WebView sürüm bağımlılığı ve lisans koşulları dikkate alınarak yapılmalıdır. Bu seçim yapılmadan eklenti veya masaüstü uzantı sözü verilmemelidir.

---

## 30. Veri Modelleri

Aşağıdaki modeller uygulama alanının başlangıç sözleşmesidir:

```kotlin
data class TarayiciSekmesi(
    val id: String,
    val url: String?,
    val baslik: String?,
    val faviconUrl: String?,
    val gizliMi: Boolean,
    val grupId: String?,
    val uyuyorMu: Boolean,
    val yukleniyorMu: Boolean,
    val sonErisimZamani: Long
)

data class YerImi(
    val id: String,
    val url: String,
    val baslik: String,
    val klasor: String?,
    val etiketler: List<String>,
    val olusturulmaZamani: Long
)

data class IndirmeKaydi(
    val id: String,
    val url: String,
    val dosyaAdi: String,
    val mimeTuru: String?,
    val toplamByte: Long?,
    val indirilenByte: Long,
    val durum: IndirmeDurumu,
    val hataMesaji: String?
)

enum class IndirmeDurumu {
    BEKLIYOR, INIYOR, DURAKLATILDI, TAMAMLANDI, IPTAL_EDILDI, HATA
}
```

VPN durum modeli UI ile engine arasındaki tek kaynak olmalıdır. UI tarafından doğrudan `CONNECTED` atanması engellenmelidir.

---

## 31. Gerçek Buton Sözleşmesi

Her buton için aşağıdaki sözleşme uygulanmalıdır:

| Alan | Zorunlu davranış |
|---|---|
| Görünür etiket | Kullanıcı ne olacağını anlamalı |
| Tıklama | Gerçek bir iş akışını tetiklemeli |
| Yükleniyor | İşlem sürerken tekrar tıklamayı yönetmeli |
| Başarı | İşlemin sonucu gösterilmeli |
| Hata | Kullanıcıya anlaşılır hata ve tekrar seçeneği verilmeli |
| Boş/uygunsuz durum | Buton gizlenmeli veya neden devre dışı olduğu açıklanmalı |
| Erişilebilirlik | TalkBack etiketi, kontrast ve yeterli dokunma alanı olmalı |
| Analitik | Hassas içerik göndermeden anonim olay kaydı yapılmalı veya kapatılabilmeli |

Örnek: VPN bağlan butonu, tıklanınca yalnızca bir ikon döndürüp bağlı yazmamalıdır. Önce izin, yapılandırma, servis, handshake ve bağlantı doğrulaması çalışmalı; başarısızsa hata durumuna dönmelidir.

---

## 32. Ayarlar Menüsü

Ayarlar aşağıdaki başlıklara ayrılmalıdır:

| Kategori | İçerik |
|---|---|
| Tarayıcı | Ana sayfa, yeni sekme, varsayılan arama motoru, masaüstü görünümü |
| Sekmeler | Sekme düzeni, kaydırma, gruplar, uyuyan sekmeler, oturum geri yükleme |
| Gizlilik | Geçmiş, çerez, önbellek, takip, parmak izi, pano, izinler |
| Güvenlik | HTTPS, güvenli DNS, güvenli tarama, APK taraması, uygulama kilidi |
| Reklamlar | Reklam engelleme, filtre listeleri, site istisnaları |
| VPN | Gerçek sunucu listesi, kill switch, DNS, otomatik bağlanma, istatistik |
| Yapay zekâ | Sağlayıcı, veri paylaşımı, geçmiş, ses, sayfa analizi izni |
| İndirmeler | Klasör, eşzamanlı indirme, Wi-Fi koşulu, bildirim |
| Görünüm | Tema, renk, yazı boyutu, araç çubuğu, duvar kâğıdı |
| Medya | PiP, otomatik oynatma, ses, arka plan oynatma |
| Hesap ve senkronizasyon | Profil, yedek, cihazlar, oturum kapatma |
| Hakkında | Sürüm, açık kaynak lisansları, gizlilik politikası, destek |

Ayarın değeri yalnızca ekranda değişmiş görünmemeli; kalıcı depolama, tarayıcı motoru, VPN yöneticisi veya ilgili servis üzerinde gerçek etkisi görülmelidir.

---

## 33. Test ve Kabul Kriterleri

### 33.1 Tarayıcı testleri

1. Yeni sekme gerçek olarak açılır.
2. Sekme kapatma ve geri açma gerçek veriyle çalışır.
3. Gizli sekme normal geçmişe yazılmaz.
4. Yer imi kaydedilir, aranır ve silinir.
5. Geçmiş temizliği seçilen zaman aralığını gerçekten etkiler.
6. Çerez ve önbellek temizliği kullanıcıya doğru kapsamı gösterir.
7. Reklam engelleyici filtre güncellendiğinde veya başarısız olduğunda doğru durumu gösterir.
8. Site izinleri kapatıldığında web motoru erişimi gerçekten reddeder.
9. İndirme dosyası gerçek byte ilerlemesiyle kaydedilir.
10. PDF, QR, PiP ve ekran görüntüsü gerçek cihaz davranışıyla test edilir.

### 33.2 AI testleri

1. Kullanıcı istemeden sayfa içeriği AI'ya gönderilmez.
2. AI isteği başarısız olduğunda sahte cevap gösterilmez.
3. Sayfada olmayan bilgi için uydurma cevap verilmez.
4. Türkçe çeviri ve özet sonuçlarında kaynak sayfa bağlantısı korunur.
5. Sesli kullanımda mikrofon göstergesi ve durdurma çalışır.
6. Gizli sekme içeriği AI geçmişine sızmaz.

### 33.3 VPN testleri

1. VPN kapalıyken gerçek public IP ölçülür.
2. VPN açıkken public IP gerçekten değişir.
3. WireGuard handshake başarısı gerçek endpoint'ten alınır.
4. DNS leak testi yapılır.
5. IPv6 leak testi yapılır.
6. Sunucu kapatıldığında durum `CONNECTION_LOST` ve `RECONNECTING` olur.
7. Wi-Fi ile mobil veri geçişinde tünel yeniden değerlendirilir.
8. VPN izni iptal edilince uygulama bağlı göstermez.
9. Telefon yeniden başlatıldığında otomatik bağlanma seçeneği güvenli çalışır.
10. Kill switch veya Lockdown yalnızca desteklendiği koşullarda etkinleşir.
11. Tünel soketi VPN içine loop oluşturmaz.
12. İstatistikler gerçek ölçüm yoksa boş veya beklemede görünür.

### 33.4 Güvenlik testleri

- Private key log taraması.
- APK içindeki gizli anahtar ve token taraması.
- Sertifika doğrulama ve geçersiz sertifika testi.
- URL yönlendirme ve açık redirect testi.
- ZIP path traversal testi.
- Kötü amaçlı APK ve bilinmeyen MIME türü testi.
- Hassas ekran görüntüsü ve geri plan bulanıklığı testi.
- Uygulama kilidi brute force testi.
- WebView/GeckoView güvenlik ayarları testi.
- Gizli sekme veri izolasyonu testi.

---

## 34. Aşamalı Geliştirme Planı

### Aşama 0: Depo inceleme ve karar kaydı

Mevcut projenin klasörleri, modülleri, Android sürümü, tarayıcı motoru, UI ekranları, VPN düğmesi, geçmiş, ayarlar ve indirme akışları incelenir. Değiştirilmeyecek alanlar yazılı olarak listelenir.

### Aşama 1: Gerçek tarayıcı çekirdeği

Yeni sekme, adres çubuğu, gerçek web motoru, geri/ileri, yenile, sekme oluşturma, sekme kapatma ve temel geçmiş uygulanır.

### Aşama 2: Veri ve ayarlar

Yer imleri, geçmiş, çerez/önbellek temizliği, tema, arama motoru ve site izinleri uygulanır.

### Aşama 3: Mahremiyet ve indirmeler

Reklam engelleyici, takip koruması, açılır pencere, HTTPS, DoH, indirme yöneticisi, QR ve PDF özellikleri uygulanır.

### Aşama 4: Gerçek VPN

Gerçek WireGuard gateway kurulmadan bağlı UI oluşturulmaz. `VpnService`, foreground servis, yapılandırma, secure storage, handshake, reconnect, DNS, IPv6 ve istatistikler uygulanır.

### Aşama 5: AI çekirdeği

Sayfa metni çıkarma, kullanıcı izinli özet, Türkçe çeviri, kaynaklı soru cevap, PDF, görsel ve ses iş akışları uygulanır.

### Aşama 6: Gelişmiş özellikler

Sekme grupları, dikey sekmeler, bölünmüş ekran, Flow, profil, senkronizasyon, parola/passkey, eklenti araştırması ve ürün içi keşif uygulanır.

### Aşama 7: Sertleştirme ve yayın

Güvenlik testi, performans profili, erişilebilirlik, cihaz çeşitliliği, pil tüketimi, çökme analizi, mağaza politikaları, gizlilik metinleri ve yayın yapılandırması tamamlanır.

---

## 35. Sürümleme ve Gelecekte Değişiklik

Uygulama gelecekte güncellenebilir, ücretli katman eklenebilir, bazı özellikler kaldırılabilir veya yeniden tasarlanabilir. Bu nedenle özellikler doğrudan ekranlara gömülmek yerine modüler servisler ve özellik bayraklarıyla tasarlanmalıdır.

Özellik bayrakları uzaktan değiştirilecekse imzalı yapılandırma, sürüm kontrolü, geri alma ve minimum güvenli varsayılanlar kullanılmalıdır. Uzaktan yapılandırma ile VPN endpoint'i, sertifika veya güvenlik politikasını doğrulamasız değiştirmek yasaktır.

Ücretli özellikler için paywall, deneme, abonelik, iade ve mağaza kuralları ileride ayrıca tasarlanmalıdır. Kullanıcı temel tarayıcıyı açmak için zorunlu üyelik veya zorunlu AI paylaşımıyla karşılaşmamalıdır.

---

## 36. Teslim Tanımı

İlk teslim şu unsurları içermelidir:

1. Akrep Tarayıcı adı, logo ve görsel dil.
2. Gerçek yeni sekme ve web sayfası açma.
3. Gerçek sekme oluşturma, kapatma ve değiştirme.
4. Yer imi ve geçmişin temel sürümü.
5. Gerçek ayar ekranı ve tema sistemi.
6. Temel reklam/takip koruma altyapısı veya doğru biçimde işaretlenmiş planlı durum.
7. Gerçek indirme akışı veya henüz desteklenmiyorsa dürüst devre dışı durumu.
8. AI özellikleri için izin, hata ve veri paylaşımı akışı.
9. VPN için gerçek sunucu yoksa sahte bağlı durum yerine açık kurulum engeli ve teknik açıklama.
10. Gerçek sunucu hazırsa WireGuard handshake, IP, DNS ve reconnect testleri.
11. Türkçe ürün klasörleri ve Türkçe kod yorumları.
12. Birim, UI ve entegrasyon testleri.
13. README, mimari karar kaydı, kurulum ve gerçek sunucu yapılandırma belgeleri.
14. Hassas bilgi taraması yapılmış temiz depo.

---

## 37. Kesinlikle Yapılmayacaklar

- Mevcut UI'ı kullanıcı onayı olmadan silmek.
- Bağlan düğmesine basıldığı için bağlı göstermek.
- `VpnService.Builder` oluşturup WireGuard tüneli olmadan VPN göstermek.
- HTTP/SOCKS proxy'yi gerçek cihaz VPN'i gibi adlandırmak.
- Rastgele ping, hız, süre, IP veya sunucu üretmek.
- Private key'i kaynak koda, log'a veya analytics'e yazmak.
- Kullanıcının sayfa verisini AI'ya sessizce göndermek.
- Gizli sekme kayıtlarını normal geçmişe karıştırmak.
- APK'yı kullanıcı onayı olmadan kurmak.
- Çerez ve önbellek temizlendi diyerek gerçek verileri bırakmak.
- Desteklenmeyen eklenti veya masaüstü özelliğini varmış gibi göstermek.
- Android veya üçüncü taraf marka logolarını kopyalamak.
- Güvenlik uyarılarını yalnızca görsel bir kalkan olarak kullanmak.
- Paylaşılan token veya anahtarları yeni dosyaya taşımak.

---

## 38. Son Ürün Cümlesi

**Akrep Tarayıcı**, Chrome'un anlaşılır sekme ve gezinme düzenini, Opera'nın zengin araç ve kişiselleştirme yaklaşımını, Türkçe merkezli yapay zekâ özelliklerini, güçlü mahremiyet kontrollerini ve gerçek WireGuard tabanlı Android VPN altyapısını bir araya getiren; fakat hiçbir özelliği gerçek değilken gerçekmiş gibi göstermeyen, güvenilir ve modüler bir Android tarayıcı olarak geliştirilmelidir.

> **Öncelik sırası:** Gerçeklik ve güvenlik → temel gezinme → mahremiyet → performans → yapay zekâ → gelişmiş özellikler → ücretli ve ileri hizmetler.

---

## Kaynaklar

[1]: https://support.google.com/chrome/answer/2391819?hl=en&co=GENIE.Platform%3DAndroid "Google Chrome Help — Manage tabs in Chrome"

[2]: https://www.opera.com/features "Opera — Browser features"

[3]: https://developer.android.com/reference/android/net/VpnService "Android Developers — VpnService API reference"

[4]: https://www.wireguard.com/ "WireGuard — Fast, modern, secure VPN tunnel"

---

**Belge sürümü:** 1.0.0

**Belge dili:** Türkçe

**Kod dili:** Projenin teknik gereksinimine göre Kotlin ve ilgili teknolojiler

**Varsayılan yazar:** Akrep Tarayıcı Ürün Ekibi

**Teyit ifadesi:** 85 05 77
