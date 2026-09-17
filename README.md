# متجر أبو هاشم للحوم والألبان والأجبان 🥩🥛🧀

النسخة الأولى من متجر إلكتروني عربي احترافي، خفيف وسريع، ومصمم من البداية لدعم الاستضافة على Cloudflare والربط المستقبلي مع Telegram Bots وتحويله إلى تطبيق Android APK.

---

## 🌟 مميزات المشروع

- **تصميم وتجربة خفيفة وسريعة (Mobile-First):** واجهة مستخدم متجاوبة بالكامل باللغة العربية مع دعم شاشات الهواتف وأجهزة Android الضعيفة.
- **دعم اتجاه الكتابة RTL بالكامل:** استخدام خط `Tajawal` العربي وتنسيق سلس ومريح للعين.
- **نظام الطلب كضيف (Guest Checkout):** إمكانية تصفح المنتجات، إضافتها للسلة، وإرسال الطلب مباشرة مع إضافة التفاصيل (الاسم، الهاتف، المحافظة، المنطقة، أقرب نقطة دالة) دون الحاجة لإنشاء حساب.
- **طبقة بيانات منفصلة (Clean Architecture):** فصل المنطق البرمجي لقواعد البيانات والمنتجات عن مكونات الواجهة لتسهيل الربط مع Cloudflare D1 و Cloudflare R2 مستقبلاً.
- **واجهات خدمات جاهزة للربط مع Telegram Bots:** تصميم Interfaces لبوت الإدارة وبوت الطلبات دون وضع أسرار أو مفاتيح داخل الكود.

---

## 🛠 التكنولوجيا المستخدمة

- **الإطار البرمجي:** Next.js (App Router & TypeScript)
- **التنسيق:** Tailwind CSS v4
- **الأيقونات:** Lucide React
- **إدارة الحالة:** React Context API مع التخزين المحلي LocalStorage

---

## 📁 بنية المشروع (Project Structure)

```
├── public/                  # الملفات والأصول الثابتة
├── src/
│   ├── app/                 # مسارات Next.js App Router والصفحات
│   │   ├── api/orders/      # API Route لمعالجة وحفظ الطلبات وإعادة حساب الإجمالي
│   │   ├── globals.css      # التنسيقات العامة وأنماط Tailwind CSS
│   │   ├── layout.tsx       # الهيكل الرئيسي مع ضبط RTL وخط Tajawal
│   │   └── page.tsx         # الصفحة الرئيسية للمتجر
│   ├── components/          # مكونات الواجهة (Header, Hero, CategoryFilter, ProductCard, CartDrawer, CheckoutModal, Footer)
│   ├── context/             # إدارة حالة سلة المشتريات (CartContext)
│   ├── lib/
│   │   ├── data/            # المستودعات ونماذج البيانات (ProductRepository, OrderRepository, SampleProducts)
│   │   ├── services/        # Interfaces للخدمات المستقبلية (TelegramAdmin, TelegramOrder, Storage)
│   │   └── validation.ts    # أدوات التحقق من مدخلات الزبون وتطهير البيانات
│   └── types/               # تعريفات TypeScript لموديلات البيانات (Product, Order, Customer, Category)
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

### 2. تشغيل خادم التطوير
```bash
npm run dev
```
افتح المتصفح على العنوان [http://localhost:3000](http://localhost:3000)

### 3. بناء النسخة الإنتاجية (Production Build)
```bash
npm run build
```

---

## 🔐 المتغيرات البيئية المطلوبة مستقبلاً (Environment Variables)

عند الانتقال إلى المرحلة الثانية، يتم إنشاء ملف `.env.local` وإضافة المفاتيح التالية (دون رفعها على GitHub):

```env
# Cloudflare D1 Database Binding
DB_BINDING=DB

# Cloudflare R2 Storage Binding / Credentials
R2_BUCKET_NAME=abo-hashim-media
R2_ACCESS_KEY_ID=your_r2_access_key
R2_SECRET_ACCESS_KEY=your_r2_secret_key

# Telegram Admin Bot
TELEGRAM_ADMIN_BOT_TOKEN=your_admin_bot_token
TELEGRAM_ADMIN_CHAT_ID=your_admin_chat_id

# Telegram Orders Bot
TELEGRAM_ORDERS_BOT_TOKEN=your_orders_bot_token
TELEGRAM_ORDERS_CHAT_ID=your_orders_chat_id
```

---

## ☁️ طريقة الربط والاستضافة على Cloudflare مستقبلاً

المشروع جاهز للاستضافة المجانية على Cloudflare Pages باستخدام OpenNext / Cloudflare Workers Framework:

1. **إعداد Cloudflare D1 (قاعدة البيانات Relational SQL):**
   - قم بإنشاء قاعدة بيانات D1 عبر شاشة Cloudflare أو CLI:
     ```bash
     npx wrangler d1 create abo_hashim_db
     ```
   - أنشئ الجداول التالية (`products`, `categories`, `orders`, `order_items`) بنفس الهيكلية المعرفة في `src/types/index.ts`.
   - قم باستبدال `MockProductRepository` و `MockOrderRepository` بـ `D1ProductRepository` و `D1OrderRepository`.

2. **إعداد Cloudflare R2 (تخزين الصور):**
   - أنشئ R2 Bucket باسم `abo-hashim-media`.
   - ربط R2 بـ `StorageService` برفع الصور وحفظ روابطها الدائمة في قاعدة البيانات.

3. **النشر إلى Cloudflare Pages:**
   - ربط مستودع GitHub بـ Cloudflare Pages وتحديد إعدادات البناء:
     - **Build Command:** `npx @cloudflare/next-on-pages` (أو OpenNext)
     - **Build Output Directory:** `.vercel/output/static`

---

## 🤖 طريقة ربط Telegram Bots مستقبلاً

1. **Telegram Admin Bot (بوت الإدارة):**
   - يمكن للمشرفين التحكم بالمنتجات، تغيير الأسعار، تعديل المخزون، أو إخفاء المنتج من المتجر من خلال أوامر تلغرام مباشرة مثل `/addproduct` أو `/updateprice`.
   - يرتبط البوت عبر Cloudflare Worker Endpoint ويقوم بتنفيذ الأوامر عن طريق `IProductRepository`.

2. **Telegram Orders Bot (بوت استلام الطلبات):**
   - عند إتمام الطلب كضيف من الواجهة، يقوم الـ API Route بدعوة `TelegramOrderService.sendNewOrderNotification(order)` لإرسال الرسالة المفصلة مع زر تأكيد/إلغاء الطلب لمجموعة/قناة المبيعات.

---

## 📱 تحويل المتجر إلى تطبيق Android APK مستقبلاً

الموقع مصمم بمنهجية Mobile-First استجابة خفيفة وسريعة جدًا. لتحويله إلى APK:

1. **باستخدام Capacitor (موصى به):**
   - إضافة `@capacitor/core` و `@capacitor/android` للمشروع.
   - تشغيل `npx cap init` وبناء النسخة الثابتة.
   - فتح مشروع Android في Android Studio وتصدير ملف Release APK.

2. **باستخدام PWA (Progressive Web App):**
   - إضافة ملف `manifest.json` و Service Worker لإتاحة التثبيت المباشر من المتصفح على أجهزة أندرويد.

---

## ✒️ الهوية والتطوير

تم التطوير بواسطة **جعفر ماجد** 💡
