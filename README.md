# WagoSmart IIoT Kontrol Paneli

Bu proje, **Wago PLC** cihazları ile mobil cihazlar arasında çift yönlü veri akışı sağlayan, Endüstri 4.0 (IIoT) tabanlı bir staj projesidir. **React Native (v0.86+)** mimarisi kullanılarak geliştirilen mobil uygulama, saha verilerini canlı olarak izleme ve PLC'ye uzaktan komut gönderme yeteneğine sahiptir.

## 🚀 Proje Mimarisi & Özellikleri

- **Güvenli Canlı Bağlantı:** HiveMQ Cloud MQTT Broker altyapısı üzerinden `TLS/SSL (Port 8884)` protokolü kullanılarak şifreli WebSocket haberleşmesi kurulmuştur.
- **Çift Yönlü Veri Akışı:**
  - `wago/kontrol` topici üzerinden PLC cihazına anlık `START` / `STOP` komutları gönderilir.
  - `wago/durum` topici dinlenerek sahadaki sensör ve motor durum verileri canlı olarak mobil ekrana yansıtılır.
- **Modern Arayüz:** Endüstriyel ortamlara uygun, gözü yormayan koyu tema (Dark Mode) kontrol paneli tasarımı uygulanmıştır.

## 🛠️ Kullanılan Teknolojiler

- **Frontend:** React Native, TypeScript, Metro Bundler
- **Haberleşme:** MQTT JavaScript Client (v4)
- **Cloud/Broker:** HiveMQ Cloud MQTT Broker
- **Donanım Altyapısı:** Wago PLC (Codesys / e!COCKPIT)
