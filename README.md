# متجر أبو هاشم للحوم والألبان والأجبان 🥩🥛🧀

متجر إلكتروني عربي احترافي، خفيف وسريع، ومصمم ببنية معمارية مرنة. يعتمد على ملفات JSON داخل الـ Repository لقراءة المنتجات والتصنيفات، وبوت تلغرام الإدارة المباشر (Telegram Admin Bot) لإضافة وتعديل وحذف المنتجات مع المزامنة التلقائية لـ GitHub.

---

## 🌟 مميزات المشروع

- **تصميم وتجربة خفيفة وسريعة (Mobile-First):** واجهة مستخدم متجاوبة بالكامل باللغة العربية مع دعم شاشات الهواتف.
- **دعم اتجاه الكتابة RTL بالكامل:** استخدام خط `Tajawal` العربي وتنسيق سلس ومريح للعين.
- **نظام الطلب كضيف (Guest Checkout):** إمكانية تصفح المنتجات، إضافتها للسلة، وإرسال الطلب مباشرة إلى Telegram Orders Bot دون الحاجة لإنشاء حساب.
- **اعتماد كامل على GitHub وJSON:** لا حاجة لقواعد بيانات خارجية مثل Cloudflare D1 أو R2 لصور ومنتجات المتجر. يتم تحميل المنتجات بسرعة عالية جداً مع دعم الكاش الخفيف.
- **إدارة كاملة عبر Telegram Admin Bot:** التحكم الكامل بالمنتجات (إضافة، تعديل حقول، حذف، تعديل سعر ومخزون) مع المزامنة الفورية لملف `src/data/products.json` في GitHub.

---

## 🛠 التكنولوجيا المستخدمة

- **الإطار البرمجي:** Next.js (App Router & TypeScript)
- **النشر:** Cloudflare Workers / OpenNext (`@opennextjs/cloudflare`)
- **التنسيق:** Tailwind CSS v4
- **الأيقونات:** Lucide React
- **إدارة البيانات:** Repository JSON (`src/data/products.json`, `src/data/categories.json`)
- **البوتات:** Telegram Admin Bot & Telegram Orders Bot

---

## 📁 بنية المشروع (Project Structure)

```
├── public/                  # الملفات والأصول الثابتة
├── scripts/                 # سكريبتات الاختبارات والتزامن
│   ├── test-concurrent-orders.mjs
│   ├── test-telegram-bots.mjs
│   └── test-storage.mjs
├── src/
│   ├── app/                 # مسارات Next.js App Router والصفحات
│   │   ├── api/orders/      # API Route لمعالجة الطلبات وإرسالها لبوت الطلبات
│   │   ├── api/telegram/    # Webhooks لبوت الإدارة وبوت الطلبات
│   │   ├── globals.css      # التنسيقات العامة وأنماط Tailwind CSS
│   │   ├── layout.tsx       # الهيكل الرئيسي مع ضبط RTL وخط Tajawal
│   │   └── page.tsx         # الصفحة الرئيسية للمتجر
│   ├── components/          # مكونات الواجهة
│   ├── context/             # إدارة حالة سلة المشتريات (CartContext)
│   ├── data/                # مصدر بيانات المنتجات والتصنيفات (products.json, categories.json)
│   ├── lib/
│   │   ├── data/            # Factory وقواعد بيانات JSON
│   │   ├── services/        # خدمات التلغرام (TelegramAdmin, TelegramOrder, Storage)
│   │   ├── github.ts        # مصلحة التزامن التلقائي مع GitHub API
│   │   └── validation.ts    # أدوات التحقق من مدخلات الزبون وتطهير البيانات
│   └── types/               # تعريفات TypeScript لموديلات البيانات
├── .env.example             # نموذج المتغيرات البيئية
├── wrangler.json            # إعدادات Cloudflare Workers Runtime
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

### 4. تشغيل الاختبارات
```bash
npx tsx scripts/test-concurrent-orders.mjs
npx tsx scripts/test-telegram-bots.mjs
```

---

## ✒️ الهوية والتطوير

تم التطوير بواسطة **جعفر ماجد** 💡
