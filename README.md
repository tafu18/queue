# NestJS PostgreSQL & Redis (BullMQ) Dockerized Hazır Proje Şablonu

Bu proje; **NestJS (TypeScript)**, **PostgreSQL** ve **Redis (BullMQ)** teknolojilerini içeren, tamamen dockerize edilmiş ve temiz bir mimariyle (Clean Architecture) tasarlanmış üretime hazır (production-ready) bir proje şablonudur.

---

## 🚀 Proje Mimarisi ve Docker İçi Haberleşme

Docker Compose içindeki servislerin birbirleriyle haberleşmesi için **servis isimleri** (`postgres` ve `redis`) kullanılır:

*   **Veritabanı Bağlantısı:** NestJS (`app.module.ts` içindeki `TypeOrmModule`), PostgreSQL ile `.env` dosyasındaki `DB_HOST=postgres` çevre değişkeni üzerinden haberleşir.
*   **Redis (BullMQ) Bağlantısı:** NestJS (`app.module.ts` içindeki `BullModule`), Redis sunucusuna `.env` dosyasındaki `REDIS_HOST=redis` çevre değişkeni üzerinden bağlanır.
*   **Bağımlılık ve Sağlık Kontrolleri (Healthcheck):** `api` servisi, `postgres` ve `redis` servislerinin sadece ayakta olmasını değil, aynı zamanda tamamen **sağlıklı (healthy)** duruma gelmesini bekler (`condition: service_healthy`). Bu sayede bağlantı hatalarının (connection refused) önüne geçilmiş olur.

---

## 📁 Katmanlı Temiz Mimari (Clean Architecture) Yapısı

Görevler (`Tasks`) modülü, sürdürülebilirlik, test edilebilirlik ve yüksek genişletilebilirlik sağlamak üzere 4 belirgin katmana ayrılmıştır:

```text
src/tasks/
├── domain/                     # 1. DOMAIN KATMANI (İş Kuralları & Sözleşmeler)
│   ├── entities/
│   │   └── task.entity.ts      # Veri Modeli (Database Entity)
│   └── interfaces/
│       ├── tasks-repository.interface.ts # Veritabanı arayüzü sözleşmesi (ITasksRepository)
│       └── tasks-queue.interface.ts      # Kuyruk arayüzü sözleşmesi (ITasksQueue)
│
├── application/                # 2. APPLICATION KATMANI (Uygulama Kullanım Senaryoları)
│   └── use-cases/
│       ├── create-task.use-case.ts # Görev oluşturup veritabanına kaydeden ve kuyruğa yollayan senaryo
│       └── get-tasks.use-case.ts   # Görevleri listeleyen senaryo
│
├── infrastructure/             # 3. INFRASTRUCTURE KATMANI (Teknolojik Detaylar & Adaptörler)
│   ├── repositories/
│   │   └── typeorm-tasks.repository.ts # TypeORM ve PostgreSQL kullanarak ITasksRepository uyarlaması
│   └── queue/
│       ├── bullmq-tasks.queue.ts       # BullMQ ile ITasksQueue arayüzünün Redis uyarlaması
│       └── tasks.processor.ts          # Kuyruktaki işleri işleyen BullMQ Worker (Tüketici)
│
├── presentation/               # 4. PRESENTATION KATMANI (Dış Dünya Bağlantıları)
│   ├── controllers/
│   │   └── tasks.controller.ts # Dışarıya açılan HTTP REST API uç noktaları
│   └── dto/
│       └── create-task.dto.ts  # class-validator tabanlı giriş veri doğrulama şeması
│
└── tasks.module.ts             # Katmanları birbirine bağlayan NestJS Özellik Modülü
```

---

## 🛠️ Makefile Kısayolları ile Çalıştırma Adımları

Projede işlerinizi kolaylaştırmak için bir `Makefile` bulunmaktadır. Terminal üzerinden tüm işlemleri tek satırlık komutlarla yürütebilirsiniz:

### 1. Projeyi Kurma ve Hazırlama (İlk Seferde)
`.env` dosyasını otomatik kopyalamak, yerel paketleri kurmak ve docker imajlarını inşa etmek için:
```bash
make setup
```

### 2. Sistemi Arka Planda Başlatma (Detached)
```bash
make up
```

### 3. Logları İzleme (Anlık)
NestJS API konteynerından gelen logları takip etmek için:
```bash
make logs
```

### 4. Konteynerların Sağlık ve Çalışma Durumlarını Kontrol Etme
```bash
make status
```

### 5. Sistemi Güvenli Şekilde Durdurma
```bash
make down
```

### 6. Sistemi Zorla Öldürme ve Verileri Sıfırlama (Zorlu Durumlar / Sıfır Başlangıç)
Tüm konteynerleri kapatır ve veritabanı ile redis verilerini (volumelerini) tamamen silerek sıfırlar:
```bash
make kill
```

---

## 🧪 Sistem Entegrasyon Testi (PostgreSQL & BullMQ)

Katmanlı yapının çalıştığını doğrulamak amacıyla hazırlanan uç noktaları aşağıdaki gibi test edebilirsiniz:

### 1. Yeni Bir Görev Oluşturma (Giriş Verisi Doğrulamalı)
Aşağıdaki `curl` isteğini göndererek yeni bir arka plan görevi tetikleyebilirsiniz. `class-validator` sayesinde başlık parametresi en az 3 karakter olmalıdır:

```bash
curl -X POST http://localhost:3000/tasks \
  -H "Content-Type: application/json" \
  -d '{"title": "Büyük Rapor Analizi"}'
```

**Dönen Yanıt Örneği:**
```json
{
  "id": 1,
  "title": "Büyük Rapor Analizi",
  "status": "PENDING",
  "createdAt": "2026-05-19T00:00:00.000Z"
}
```

### 2. BullMQ Arka Plan Worker İzlenmesi
Kuyruk loglarında (`make logs`) BullMQ Worker'ın görevi aldığını görebilirsiniz:
```text
[Nest] 1  - 05/19/2026, 12:00:00 AM     LOG [TasksProcessor] [BullMQ Worker] Processing job 1 for Task ID 1...
```
*Worker simülasyon amacıyla 5 saniye bekleyecek, ardından veritabanındaki durumunu otomatik olarak `COMPLETED` şeklinde güncelleyecektir.*

### 3. Görev Listesini ve Durumunu Kontrol Etme
Birkaç saniye bekledikten sonra tüm görevleri listelemek için şu isteği yapın:

```bash
curl http://localhost:3000/tasks
```

**Dönen Yanıt Örneği:**
```json
[
  {
    "id": 1,
    "title": "Büyük Rapor Analizi",
    "status": "COMPLETED",
    "createdAt": "2026-05-19T00:00:00.000Z"
  }
]
```

---

## 🔧 Yerel Geliştirme (Docker Dışında Çalıştırma)

Uygulamayı kendi bilgisayarınızda yerel olarak koşturmak isterseniz:
1. `.env` dosyasındaki `DB_HOST` ve `REDIS_HOST` değerlerini `localhost` olarak değiştirin.
2. Yerel postgresql ve redis servislerinizin çalıştığından emin olun.
3. Bağımlılıkları yükleyin ve uygulamayı dev modunda başlatın:
```bash
npm install
npm run start:dev
```
