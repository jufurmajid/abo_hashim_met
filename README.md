# متجر أبو هاشم للحوم والألبان والأجبان 🥩🥛🧀

النسخة الأولى من متجر إلكتروني عربي احترافي، خفيف وسريع، ومصمم ببنية معمارية مرنة وقابلة للنقل (Portable Architecture) بحيث يمكن استضافته ونقله بين مختلف مزودي خدمات السحابية (Cloudflare, Vercel, Supabase, VPS, AWS) بدون الحاجة لإعادة بناء المشروع.

---

## 🌟 مميزات المشروع

- **تصميم وتجربة خفيفة وسريعة (Mobile-First):** واجهة مستخدم متجاوبة بالكامل باللغة العربية مع دعم شاشات الهواتف وأجهزة Android الضعيفة.
- **دعم اتجاه الكتابة RTL بالكامل:** استخدام خط `Tajawal` العربي وتنسيق سلس ومريح للعين.
- **نظام الطلب كضيف (Guest Checkout):** إمكانية تصفح المنتجات، إضافتها للسلة، وإرسال الطلب مباشرة مع إضافة التفاصيل دون الحاجة لإنشاء حساب.
- **طبقة بيانات محايدة ومفصولة (Clean Architecture):** الاعتماد على نمط الموردين (Repository & Provider Pattern) عبر `IProductRepository` و `IOrderRepository` و `IStorageService` وجعل خيار الاستضافة مجرد Provider قابل للتغيير بسهولة.
- **واجهات خدمات جاهزة للربط مع Telegram Bots:** تصميم Interfaces لبوت الإدارة وبوت الطلبات دون وضع أسرار أو مفاتيح داخل الكود ودون الربط المباشر بقاعدة بيانات محددة.

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
├── public/                  # الملفات والأصول الثابتة
├── scripts/                 # سكريبتات التصدير والاستيراد للبيانات
│   └── export-data.mjs
├── src/
│   ├── app/                 # مسارات Next.js App Router والصفحات
│   │   ├── api/orders/      # API Route لمعالجة وحفظ الطلبات وإعادة حساب الإجمالي
│   │   ├── globals.css      # التنسيقات العامة وأنماط Tailwind CSS
│   │   ├── layout.tsx       # الهيكل الرئيسي مع ضبط RTL وخط Tajawal
│   │   └── page.tsx         # الصفحة الرئيسية للمتجر
│   ├── components/          # مكونات الواجهة (Header, Hero, CategoryFilter, ProductCard, CartDrawer, CheckoutModal, Footer)
│   ├── context/             # إدارة حالة سلة المشتريات (CartContext)
│   ├── lib/
│   │   ├── data/            # المستودعات والمحولات (Factory, Interfaces, Cloudflare Adapters, Mock)
│   │   ├── services/        # Interfaces للخدمات المستقبلية (TelegramAdmin, TelegramOrder, Storage)
│   │   ├── tools/           # أدوات الهجرة والتصدير (Migration Utilities)
│   │   └── validation.ts    # أدوات التحقق من مدخلات الزبون وتطهير البيانات
│   └── types/               # تعريفات TypeScript لموديلات البيانات (Product, Order, Customer, Category)
├── .env.example             # نموذج المتغيرات البيئية
├── next.config.ts           # إعدادات Next.js
├── tsconfig.json            # إعدادات TypeScript
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

### 4. بناء النسخة الإنتاجية (Production Build)
```bash
npm run build
```

---

## 📦 دليل نقل المشروع وإدارة النسخ الاحتياطية (Migration & Backup Guide)

تم تصميم المتجر بحيث لا ترتبط Business Logic بأي شركة أو استضافة محددة.

### 1. تصدير قاعدة البيانات وأخذ النسخ الاحتياطية (Backup & Export)
يمكنك أخذ نسخة احتياطية كاملة من جميع المنتجات والطلبات بصيغة JSON أو SQL قياسية عبر تشغيل السكريبت التالي:
```bash
node scripts/export-data.mjs
```
سيتم حفظ الملفات الناتجة داخل المجلد `backups/`:
- `backups/backup.json`: ملف JSON يحتوي على كامل هيكل البيانات.
- `backups/backup.sql`: ملف استعلامات SQL جاهز للاستيراد في قواعد بيانات PostgreSQL أو MySQL أو SQLite أو D1.

---

### 2. تغيير مزود قاعدة البيانات (Database Provider Switching)
لتغيير قاعدة البيانات دون التعديل على واجهة الموقع، قم فقط بتعديل قيمة المتغير `DB_PROVIDER` في ملف البيئة:

- **الوضع الافتراضي / الذاكرة المحلية:**
  ```env
  DB_PROVIDER=mock
  ```
- **استخدام Cloudflare D1:**
  ```env
  DB_PROVIDER=d1
  DB_BINDING=DB
  ```
- **استخدام PostgreSQL / Supabase:**
  ```env
  DB_PROVIDER=postgres
  DATABASE_URL=postgresql://user:password@localhost:5432/abohashim_db
  ```

---

### 3. تغيير مزود تخزين الصور (Storage Provider Switching)
لتغيير خدمة تخزين صور المنتجات، عدّل المتغير `STORAGE_PROVIDER`:

- **التخزين المؤقت / العادي:**
  ```env
  STORAGE_PROVIDER=mock
  ```
- **استخدام Cloudflare R2:**
  ```env
  STORAGE_PROVIDER=r2
  R2_BUCKET_NAME=abo-hashim-media
  ```
- **استخدام Amazon S3 / DigitalOcean Spaces:**
  ```env
  STORAGE_PROVIDER=s3
  ```

---

### 4. نقل الاستضافة إلى خادم جديد (Vercel, AWS, VPS, Netlify)
عند نقل تطبيق Next.js من Cloudflare إلى أي استضافة أخرى:
1. قم بإنشاء مشروع جديد في الاستضافة المستهدفة وربط المستودع من GitHub.
2. ضف المتغيرات البيئية المعرفة في ملف `.env.example`.
3. قم بتشغيل سكريبت إنشاء الجدول أو استيراد ملف `backups/backup.sql` داخل قاعدة البيانات الجديدة.
4. أعد ضبط روابط الـ Webhook الخاصة ببوتات التلغرام لتشير إلى رابط النطاق الجديد `https://your-new-domain.com/api/telegram/orders/webhook`.

---

## 🤖 إعادة ربط Telegram Bots بعد النقل

خدمات التلغرام منفصلة تماماً عن قواعد البيانات والاستضافة. عند النقل لبيئة جديدة:
1. احتفظ بنفس الـ `TELEGRAM_ADMIN_BOT_TOKEN` و `TELEGRAM_ORDERS_BOT_TOKEN`.
2. حدّث عنوان الـ Webhook عبر طلب HTTP بسيط:
   ```bash
   curl -X POST "https://api.telegram.org/bot<YOUR_BOT_TOKEN>/setWebhook?url=https://YOUR_NEW_DOMAIN.com/api/telegram/orders/webhook"
   ```

---

## ✒️ الهوية والتطوير

تم التطوير بواسطة **جعفر ماجد** 💡
