# Maktabti Admin & Supervisor Portal — Frontend

واجهة الإدارة (Admin/Supervisor Portal) بتاعة منصة Maktabti، متبنية على **React + Vite + Tailwind CSS v4**، ومطابقة لتصميم Figma. المشروع ده شغال دلوقتي بالكامل على **mock data** (`src/data/mockData.js`) لحد ما الباك إند يخلص، وبعدين هتستبدلي كل جزء بنداء API حقيقي بمجرد ما يكون جاهز.

## تشغيل المشروع

```bash
npm install
npm run dev
```

هيفتح على `http://localhost:5173`. الصفحة الافتراضية هي `/login` (أي إيميل وباسورد بيخليكي تدخلي، لأن الـ Auth لسه mock).

## هيكلة المشروع

```
src/
  api/client.js          // axios instance جاهز، مربوط بمتغير VITE_API_BASE_URL
  components/             // عناصر مشتركة: Sidebar, Topbar, StatCard, StatusBadge, Modal
  context/AuthContext.jsx // حالة تسجيل الدخول والدور (Super Admin / Supervisor) - mock دلوقتي
  data/mockData.js        // كل البيانات التجريبية لكل الموديولز
  layouts/AdminLayout.jsx // الـ Sidebar + منطقة المحتوى، وبيحمي الصفحات لو مفيش session
  pages/                  // كل صفحة من صفحات الـ SRS
```

## خريطة الصفحات

| الصفحة | الراوت | المصدر في الـ SRS |
|---|---|---|
| Login | `/login` | تسجيل دخول الأدمن/المشرف |
| Register | `/register` | تسجيل أدمن جديد (3 خطوات) |
| Dashboard | `/` | القسم 4 - Analytical Dashboard |
| Material Management | `/materials` | القسم 3.2 |
| Examination Archive | `/exams` | القسم 3.3 |
| Graduation Project Review | `/graduation-projects` | القسم 3.4 (Path A + Path B) |
| Circulation Desk | `/circulation` | القسم 3.5 |
| Audit Logs | `/audit-logs` | القسم 2.2 — متاحة للـ Super Admin بس |

## إزاي تربطي الباك إند الحقيقي لما يخلص

كل عملية إنشاء/تعديل/حذف في الصفحات فيها تعليق `// TODO: replace with ...` فوق الكود اللي بيغير الـ state المحلي، وده بالضبط الـ endpoint والـ method المفروض تستخدميه. مثال من `MaterialManagement.jsx`:

```js
// TODO: replace with POST /api/admin/materials once the backend is ready
setItems((prev) => [...]);
```

خطوات الاستبدال:

1. اعملي ملف `.env` من `.env.example` وحطي فيه رابط الباك إند الحقيقي.
2. استبدلي الاستيراد من `data/mockData.js` بنداء `apiClient` من `api/client.js` (موجود الـ instance والـ interceptors جاهزين أصلاً).
3. حولي كل handler (`handleAdd`, `handleCheckout`, `approve`, ...) لـ `async function` يستخدم `await apiClient.post(...)` / `.patch(...)` / `.delete(...)` بدل تعديل الـ state مباشرة، وبعد الرد الناجح حدّثي الـ state بنفس الشكل.
4. لو حابة caching وتقليل التكرار، ممكن نضيف React Query بعد كده بسهولة لأن شكل الكود مُجهز لده.

## الخطوة التالية

أهم حاجة لسه ناقصة عشان المشروع يبقى متكامل هي الباك إند نفسه (Auth, RBAC middleware, Audit Log, و باقي الـ endpoints المذكورة في خطة التنفيذ).
