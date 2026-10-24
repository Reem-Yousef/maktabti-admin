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
  // استخدام البيانات المحلية بدل الـ API
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
    period: cat.name.slice(0, 6),  // اختصار الاسم لو طويل
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
    <div>
      <Topbar title="Dashboard" />

      {/* ── Stat Cards ─────────────────────────────────────────────────── */}
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <StatCard
          label="Total Materials"
          value={totalBooks.toLocaleString()}
          delta="الكتب المتاحة في المكتبة"
          tone="green"
        />
        <StatCard
          label="Pending Reviews"
          value={pendingProjects}
          delta="مشروع قيد المراجعة"
          tone={pendingProjects > 0 ? 'red' : 'green'}
        />
        <StatCard
          label="Total Exams"
          value={totalExams}
          delta="امتحان في الأرشيف"
          tone="green"
        />
        <StatCard
          label="Categories"
          value={totalCategories}
          delta="قسم متاح"
          tone="green"
        />
      </div>

      <div className="mt-5 grid grid-cols-1 gap-5 lg:grid-cols-2">
        {/* ── غير المتاح من الكتب ──────────────────────────────────────── */}
        <div className="rounded-2xl border-l-4 border-status-red bg-card p-5 shadow-sm shadow-navy/5">
          <div className="flex items-center justify-between">
            <h2 className="text-sm font-bold text-navy">Unavailable Books</h2>
          </div>

          {unavailableBooks.length === 0 ? (
            <p className="mt-4 text-xs text-navy/40">كل الكتب متاحة ✅</p>
          ) : (
            <div className="mt-4 overflow-x-auto">
              <table className="w-full text-left text-sm">
                <thead>
                  <tr className="text-xs font-semibold text-navy/40">
                    <th className="py-2 pr-3">Book Title</th>
                    <th className="py-2 pr-3">Author</th>
                    <th className="py-2 pr-3">Status</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-navy/5">
                  {unavailableBooks.map((b) => (
                    <tr key={b._id}>
                      <td className="py-2.5 pr-3 font-semibold text-navy">{b.title}</td>
                      <td className="py-2.5 pr-3 text-navy/60">{b.author}</td>
                      <td className="py-2.5 pr-3">
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
          <h2 className="text-sm font-bold text-navy">Books per Category</h2>
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
                    formatter={(val, _, props) => [val, props.payload.fullName]}
                    cursor={{ fill: 'rgba(103,161,169,0.08)' }}
                  />
                  <Bar dataKey="requests" fill="#67a1a9" radius={[6, 6, 0, 0]} />
                </BarChart>
              </ResponsiveContainer>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}