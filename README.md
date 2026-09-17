# متجر أبو هاشم للحوم والألبان والأجبان 🥩🥛🧀

النسخة الأولى من متجر إلكتروني عربي احترافي، خفيف وسريع، ومصمم ببنية معمارية مرنة وقابلة للنقل (Portable Architecture) بحيث يمكن استضافته ونقله بين مختلف مزودي خدمات السحابية (Cloudflare, Vercel, Supabase, VPS, AWS) بدون الحاجة لإعادة بناء المشروع.

---

## 🌟 مميزات المشروع

- **تصميم وتجربة خفيفة وسريعة (Mobile-First):** واجهة مستخدم متجاوبة بالكامل باللغة العربية مع دعم شاشات الهواتف وأجهزة Android الضعيفة.
- **دعم اتجاه الكتابة RTL بالكامل:** استخدام خط `Tajawal` العربي وتنسيق سلس ومريح للعين.
- **نظام الطلب كضيف (Guest Checkout):** إمكانية تصفح المنتجات، إضافتها للسلة، وإرسال الطلب مباشرة مع إضافة التفاصيل دون الحاجة لإنشاء حساب.
- **طبقة بيانات محايدة ومفصولة (Clean Architecture):** الاعتماد على نمط الموردين (Repository & Provider Pattern) عبر `IProductRepository` و `IOrderRepository` و `IStorageService` وجعل خيار الاستضافة مجرد Provider قابل للتغيير بسهولة.
- **ربط قواعد البيانات Cloudflare D1 (Phase 2A):** تدعم الداتابيز التحديث الشرطي الذري للمخزون ومنع تجاوز الكمية عند الطلبات المتزامنة.
- **تخزين صور المنتجات Cloudflare R2 (Phase 2B):** خدمة تخزين صور آمنة ومتحقق منها تعتمد مفاتيح UUID وتدعم امتدادات WebP, PNG, JPG بحد أقصى 5MB.

---

## 🛠 التكنولوجيا المستخدمة

- **الإطار البرمجي:** Next.js (App Router & TypeScript)
- **التنسيق:** Tailwind CSS v4
- **الأيقونات:** Lucide React
- **إدارة الحالة:** React Context API مع التخزين المحلي LocalStorage

---

## 📁 بنية المشروع (Project Structure)

```
├── backups/                 # النسخ الاحتياطية المصدرة (JSON / SQL)
├── migrations/              # ملفات الهيكلة والتهيئة لقاعدة بيانات Cloudflare D1
│   ├── 0001_initial_schema.sql
│   └── 0002_seed_products.sql
├── public/                  # الملفات والأصول الثابتة
├── scripts/                 # سكريبتات التصدير والاستيراد والاختبارات
│   ├── export-data.mjs
│   ├── test-concurrent-orders.mjs
│   └── test-storage.mjs
├── src/
│   ├── app/                 # مسارات Next.js App Router والصفحات
│   │   ├── api/orders/      # API Route لمعالجة وحفظ الطلبات وإعادة حساب الإجمالي
│   │   ├── globals.css      # التنسيقات العامة وأنماط Tailwind CSS
│   │   ├── layout.tsx       # الهيكل الرئيسي مع ضبط RTL وخط Tajawal
│   │   └── page.tsx         # الصفحة الرئيسية للمتجر
│   ├── components/          # مكونات الواجهة
│   ├── context/             # إدارة حالة سلة المشتريات (CartContext)
│   ├── lib/
│   │   ├── data/            # المستودعات والمحولات (Factory, Interfaces, Cloudflare Adapters, Mock)
│   │   ├── services/        # Interfaces للخدمات المستقبلية (TelegramAdmin, TelegramOrder, Storage)
│   │   ├── tools/           # أدوات الهجرة والتصدير (Migration Utilities)
│   │   └── validation.ts    # أدوات التحقق من مدخلات الزبون وتطهير البيانات
│   └── types/               # تعريفات TypeScript لموديلات البيانات
├── .env.example             # نموذج المتغيرات البيئية
├── wrangler.json            # إعدادات Cloudflare D1 & R2 Bindings
├── next.config.ts           # إعدادات Next.js
└── package.json
```

---

## 🚀 طريقة التشغيل المحلية (Local Development)

### 1. تثبيت الحزم والمكتبات
```bash
npm install
```

### 2. إعداد ملف المتغيرات البيئية
قم بنسخ ملف `.env.example` إلى `.env.local`:
```bash
cp .env.example .env.local
```

### 3. تشغيل خادم التطوير
```bash
npm run dev
```
افتح المتصفح على العنوان [http://localhost:3000](http://localhost:3000)

### 4. تشغيل اختبارات التخزين والطلبات المتزامنة
```bash
npx tsx scripts/test-storage.mjs
npx tsx scripts/test-concurrent-orders.mjs
```

---

## ☁️ إعداد Cloudflare D1 و Cloudflare R2 (يدوياً)

1. **إنشاء قاعدة البيانات Cloudflare D1:**
   ```bash
   npx wrangler d1 create abo_hashim_db
   npx wrangler d1 execute DB --file=./migrations/0001_initial_schema.sql
   npx wrangler d1 execute DB --file=./migrations/0002_seed_products.sql
   ```

2. **إنشاء Cloudflare R2 Bucket للصور:**
   ```bash
   npx wrangler r2 bucket create abo-hashim-media
   ```

---

## ✒️ الهوية والتطوير

تم التطوير بواسطة **جعفر ماجد** 💡
