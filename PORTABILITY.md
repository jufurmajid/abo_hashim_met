# دليل وقابلية نقل المشروع (Portability Guide) 🚀

يوضح هذا المستند المعمارية المحايدة لمشروع **"متجر أبو هاشم للحوم والألبان والأجبان"** وكيفية نقله بسلاسة بين مختلف مزودي خدمات الاستضافة، قواعد البيانات، وخدمات التخزين دون تعديل الواجهة البرمجية أو الـ Business Logic.

---

## 🏛 المعمارية المحايدة (Architecture)

يعتمد المتجر على معمارية مفصولة بالكامل (Decoupled / Hexagonal Architecture):

```
┌─────────────────────────────────────────────────────────────┐
│                 React UI Components / Next.js Pages         │
└──────────────────────────────┬──────────────────────────────┘
                               │ (Calls Factory & Domain Interfaces)
                               ▼
┌─────────────────────────────────────────────────────────────┐
│    Domain Interfaces (IProductRepository, IOrderRepository) │
└──────────────────────────────┬──────────────────────────────┘
                               │ (Dynamic Provider Resolution)
                               ▼
┌─────────────────────────────────────────────────────────────┐
│               Factory (`src/lib/data/factory.ts`)           │
└────────┬─────────────────────┼─────────────────────┬────────┘
         │                     │                     │
         ▼                     ▼                     ▼
┌──────────────────┐  ┌──────────────────┐  ┌──────────────────┐
│  Mock Repository │  │ Cloudflare D1/R2 │  │ Postgres/S3/... │
│  (In-Memory/Local│  │ Adapter          │  │ Adapters         │
└──────────────────┘  └──────────────────┘  └──────────────────┘
```

لا توجد أي استيرادات برمجية (Imports) خاصة بـ Cloudflare أو Vercel أو Supabase داخل مكونات الواجهة (`src/components/*` أو `src/app/*`).

---

## ⚙️ مزودات قواعد البيانات (Database Providers)

يتم اختيار المزود عبر المتغير البيئي `DB_PROVIDER`:

1. **`mock` (الوضع الافتراضي/المحلي):** يعمل بالذاكرة والتخزين المحلي بدون الاتصال بأي سيرفر خارجي.
2. **`d1` (Cloudflare D1):** يتصل بقاعدة بيانات D1 عبر `D1ProductRepository` و `D1OrderRepository`.
3. **`postgres` / `supabase`:** يتصل بقاعدة بيانات PostgreSQL مفردة أو على Supabase عبر استعلامات SQL قياسية.

---

## 📁 مزودات تخزين الصور (Storage Providers)

يتم اختيار المزود عبر المتغير البيئي `STORAGE_PROVIDER`:

1. **`mock`:** يسترجع الروابط التجريبية.
2. **`r2` (Cloudflare R2):** يتصل بخدمة `R2StorageService` مع التحقق من الصيغ (JPG, PNG, WebP) والحد الأقصى 5MB وإنشاء مفاتيح UUID آمنة.
3. **`s3`:** يستخدم Amazon S3 أو DigitalOcean Spaces أو Supabase Storage.

---

## 🌐 مزودات الاستضافة (Hosting Providers)

التطبيق عبارة عن تطبيق **Next.js 15 App Router** محايد تماماً يمكن رفعه على:
- **Vercel**
- **Cloudflare Pages / Workers**
- **AWS Amplify / EC2**
- **Docker Container / VPS الخاص**

---

## 🔐 المتغيرات البيئية (Environment Variables)

تحكم كامل بالبيئة عبر ملف `.env.local` دون تغيير سطر كود واحد:

```env
# Provider Selection
DB_PROVIDER=mock
STORAGE_PROVIDER=mock

# Cloudflare Configuration
DB_BINDING=DB
R2_BUCKET_NAME=abo-hashim-media
R2_PUBLIC_DOMAIN=https://media.abohashim.com

# PostgreSQL / Supabase Configuration
DATABASE_URL=postgresql://user:password@localhost:5432/abohashim_db

# Telegram Bots Configuration
TELEGRAM_ADMIN_BOT_TOKEN=your_token
TELEGRAM_ADMIN_CHAT_ID=your_chat_id
TELEGRAM_ORDERS_BOT_TOKEN=your_token
TELEGRAM_ORDERS_CHAT_ID=your_chat_id
```

---

## ☁️ إعداد Cloudflare D1 و Cloudflare R2 (يدوياً)

1. **إنشاء Cloudflare D1 Database:**
   ```bash
   npx wrangler d1 create abo_hashim_db
   npx wrangler d1 execute DB --file=./migrations/0001_initial_schema.sql
   npx wrangler d1 execute DB --file=./migrations/0002_seed_products.sql
   ```

2. **إنشاء Cloudflare R2 Bucket:**
   ```bash
   npx wrangler r2 bucket create abo-hashim-media
   ```

---

## 💾 تصدير واستيراد البيانات (Export & Import Data)

### 1. تصدير البيانات (Export)
قم بتشغيل السكريبت المدمج:
```bash
node scripts/export-data.mjs
```
سيتم توليد ملفين قياسيين داخل المجلد `backups/`:
- `backups/backup.json`: صيغة JSON قياسية للمنتجات والطلبات.
- `backups/backup.sql`: صيغة استعلامات SQL قياسية (`INSERT INTO products ...`).

---

## 🔄 دلائل نقل الاستضافة والتطبيقات (Migration Guides)

### 1. Migration من Cloudflare R2 إلى AWS S3 أو Supabase Storage
1. قم برفع كافة ملفات صور المنتجات من R2 إلى AWS S3 Bucket أو Supabase Storage.
2. غيّر المتغير البيئي في الاستضافة إلى:
   ```env
   STORAGE_PROVIDER=s3
   ```
3. ستتولى طبقة Adapters توجيه العمليات إلى S3 تلقائياً دون تعديل أي مكون واجهة.
