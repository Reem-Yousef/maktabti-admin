import { useState } from 'react';
import { BarChart, Bar, XAxis, ResponsiveContainer, Tooltip } from 'recharts';
import Topbar from '../components/Topbar';
import StatCard from '../components/StatCard';
import StatusBadge from '../components/StatusBadge';

// ── Mock Data (بيانات وهمية بديلة للباك إند) ──────────────────────
const MOCK_CATEGORIES = [
  { _id: 'cat1', name: 'تطوير الويب' },
  { _id: 'cat2', name: 'الذكاء الاصطناعي' },
  { _id: 'cat3', name: 'قواعد البيانات' },
  { _id: 'cat4', name: 'هندسة البرمجيات' }
];

const MOCK_BOOKS = [
  { _id: 'b1', title: 'React for Beginners', author: 'John Doe', category: 'cat1', availabilityStatus: 'متوفر' },
  { _id: 'b2', title: 'Introduction to AI', author: 'Sarah Smith', category: { _id: 'cat2' }, availabilityStatus: 'غير متوفر' }
];  

const MOCK_EXAMS = [
  { _id: 'e1' }, { _id: 'e2' }, { _id: 'e3' }, { _id: 'e4' }
];

const MOCK_PROJECTS = [
  { _id: 'p1', status: 'قيد المراجعة' },
  { _id: 'p2', status: 'مقبول' },
  { _id: 'p3', status: 'قيد المراجعة' },
  { _id: 'p4', status: 'مرفوض' }
];

export default function Dashboard() {
  const [books] = useState(MOCK_BOOKS);
  const [categories] = useState(MOCK_CATEGORIES);
  const [exams] = useState(MOCK_EXAMS);
  const [projects] = useState(MOCK_PROJECTS);

  // ── حساب الـ stats ──────────────────────────────────────────────────────
  const totalBooks      = books.length;
  const totalCategories = categories.length;
  const totalExams      = exams.length;
  const pendingProjects = projects.filter((p) => p.status === 'قيد المراجعة').length;

  // ── Demand chart: عدد الكتب في كل قسم ──────────────────────────────────
  const demandData = categories.map((cat) => ({
    period: cat.name.slice(0, 8),  // زودت الاختصار لـ 8 عشان الكلمات العربية تكون واضحة
    requests: books.filter(
      (b) => b.category === cat._id || b.category?._id === cat._id
    ).length,
    fullName: cat.name,
  }));

  // ── Overdue: عرض الكتب غير المتاحة ─────────────────────────────────────
  const unavailableBooks = books
    .filter((b) => b.availabilityStatus !== 'متوفر')
    .slice(0, 5);

  return (
    <div className="w-full">
      <Topbar title="لوحة التحكم" />

      {/* ── Stat Cards ─────────────────────────────────────────────────── */}
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <StatCard
          label="إجمالي المواد"
          value={totalBooks.toLocaleString()}
          delta="الكتب المتاحة في المكتبة"
          tone="green"
        />
        <StatCard
          label="مراجعات معلقة"
          value={pendingProjects}
          delta="مشروع قيد المراجعة"
          tone={pendingProjects > 0 ? 'red' : 'green'}
        />
        <StatCard
          label="إجمالي الامتحانات"
          value={totalExams}
          delta="امتحان في الأرشيف"
          tone="green"
        />
        <StatCard
          label="الأقسام"
          value={totalCategories}
          delta="قسم متاح"
          tone="green"
        />
      </div>

      <div className="mt-5 grid grid-cols-1 gap-5 lg:grid-cols-2">
        {/* ── غير المتاح من الكتب ──────────────────────────────────────── */}
        {/* التعديل الأول: استخدام border-s-4 بدل border-l-4 عشان الخط يظهر على اليمين */}
        <div className="rounded-2xl border-s-4 border-status-red bg-card p-5 shadow-sm shadow-navy/5">
          <div className="flex items-center justify-between">
            <h2 className="text-sm font-bold text-navy">الكتب غير المتوفرة</h2>
          </div>

          {unavailableBooks.length === 0 ? (
            <p className="mt-4 text-xs text-navy/40">كل الكتب متاحة ✅</p>
          ) : (
            <div className="mt-4 overflow-x-auto">
              {/* التعديل الثاني: text-start بدل text-left و whitespace-nowrap لمنع تكسر السطور */}
              <table className="w-full text-start text-sm whitespace-nowrap">
                <thead>
                  <tr className="text-xs font-semibold text-navy/40 border-b border-navy/5">
                    {/* التعديل الثالث: pe-3 (Padding End) بدل pr-3 */}
                    <th className="py-2 pe-3 pb-3">عنوان الكتاب</th>
                    <th className="py-2 pe-3 pb-3">المؤلف</th>
                    <th className="py-2 pe-3 pb-3">الحالة</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-navy/5">
                  {unavailableBooks.map((b) => (
                    <tr key={b._id}>
                      <td className="py-3 pe-3 font-semibold text-navy">{b.title}</td>
                      <td className="py-3 pe-3 text-navy/60">{b.author}</td>
                      <td className="py-3 pe-3">
                        <StatusBadge tone="red">{b.availabilityStatus}</StatusBadge>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>

        {/* ── Demand Forecasting — كتب في كل قسم ─────────────────────── */}
        <div className="rounded-2xl bg-card p-5 shadow-sm shadow-navy/5">
          <h2 className="text-sm font-bold text-navy">الكتب حسب القسم</h2>
          <div className="mt-4 h-52">
            {demandData.length === 0 ? (
              <p className="text-xs text-navy/40">لا توجد بيانات</p>
            ) : (
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={demandData}>
                  <XAxis
                    dataKey="period"
                    tickLine={false}
                    axisLine={false}
                    tick={{ fontSize: 11, fill: '#242254' }}
                  />
                  <Tooltip
                    formatter={(val, _, props) => [`${val} كتاب`, props.payload.fullName]}
                    cursor={{ fill: 'rgba(103,161,169,0.08)' }}
                    contentStyle={{ textAlign: 'right', borderRadius: '8px', border: 'none', boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1)' }}
                  />
                  <Bar dataKey="requests" fill="#67a1a9" radius={[6, 6, 0, 0]} barSize={40} />
                </BarChart>
              </ResponsiveContainer>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}