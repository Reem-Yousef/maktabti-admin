import { useMemo, useState } from 'react';
import Topbar from '../components/Topbar';
import StatusBadge from '../components/StatusBadge';
import Modal from '../components/Modal';

const STATUS = {
  pending:  'قيد المراجعة',
  approved: 'مقبول',
  published:'منشور',
  rejected: 'مرفوض',
};

const statusTone = (s) => {
  if (s === STATUS.pending)   return 'orange';
  if ([STATUS.approved, STATUS.published].includes(s)) return 'green';
  if (s === STATUS.rejected)  return 'red';
  return 'navy';
};

// ── Mock Data (بيانات وهمية بديلة للباك إند) ──────────────────────
const MOCK_PROJECTS = [
  {
    _id: 'p1',
    title: 'منصة امتحانات أونلاين',
    description: 'نظام متكامل لإجراء الاختبارات وتقييم الطلاب تلقائياً مع ميزات مراقبة متقدمة.',
    status: STATUS.pending,
    createdAt: new Date().toISOString(),
    createdBy: { fullName: 'إسلام جمال', universityEmail: 'islam@university.edu' },
    specialization: 'علوم الحاسب',
    supervisors: ['د. محمد علي', 'م. سارة أحمد'],
    teamMembers: ['إسلام جمال', 'يوسف مصطفى'],
    graduationYear: 2026,
    githubLink: 'https://github.com/example/online-exams',
    documentationPdfUrl: '#'
  },
  {
    _id: 'p2',
    title: 'تطبيق إدارة محافظ إلكترونية',
    description: 'تطبيق لتسهيل عمليات الدفع وإصدار إشعارات وتنبيهات المعاملات المالية.',
    status: STATUS.approved,
    createdAt: '2026-09-15T12:30:00Z',
    createdBy: { fullName: 'جمال يوسف', universityEmail: 'gamal@university.edu' },
    specialization: 'نظم معلومات',
    supervisors: ['د. إبراهيم يحيى'],
    teamMembers: ['جمال يوسف'],
    graduationYear: 2026,
    githubLink: 'https://github.com/example/wallet-app',
    documentationPdfUrl: '#'
  },
  {
    _id: 'p3',
    title: 'نظام تحليل البيانات الطبية',
    description: 'استخدام تقنيات تعلم الآلة لتحليل السجلات الطبية وتوقع مسار العلاج.',
    status: STATUS.rejected,
    createdAt: '2025-12-10T08:15:00Z',
    createdBy: { fullName: 'أحمد طارق', universityEmail: 'ahmed@university.edu' },
    specialization: 'الذكاء الاصطناعي',
    supervisors: ['د. منى سعيد'],
    teamMembers: ['أحمد طارق', 'كريم حسن'],
    graduationYear: 2025,
    githubLink: '',
    documentationPdfUrl: ''
  }
];

export default function GraduationProjectReview() {
  // استبدال الـ API ببيانات محلية
  const [projects, setProjects] = useState(MOCK_PROJECTS);
  const [tab, setTab] = useState('all');
  const [rejectTarget, setRejectTarget] = useState(null);
  const [actionLoading, setActionLoading] = useState(false);

  const pendingCount = useMemo(
    () => projects.filter((p) => p.status === STATUS.pending).length,
    [projects]
  );

  const TABS = [
    { key: 'all',      label: 'All Submissions' },
    { key: 'pending',  label: `Pending Review (${pendingCount})` },
    { key: 'approved', label: 'Approved Archive' },
    { key: 'rejected', label: 'Rejected' },
  ];

  const filtered = useMemo(() => {
    if (tab === 'all')      return projects;
    if (tab === 'pending')  return projects.filter((p) => p.status === STATUS.pending);
    if (tab === 'approved') return projects.filter((p) => [STATUS.approved, STATUS.published].includes(p.status));
    if (tab === 'rejected') return projects.filter((p) => p.status === STATUS.rejected);
    return projects;
  }, [projects, tab]);

  const changeStatus = (id, newStatus) => {
    setActionLoading(true);
    // محاكاة سرعة السيرفر الوهمية
    setTimeout(() => {
      setProjects((prev) => 
        prev.map((p) => p._id === id ? { ...p, status: newStatus } : p)
      );
      setActionLoading(false);
    }, 300);
  };

  const confirmReject = () => {
    if (!rejectTarget) return;
    changeStatus(rejectTarget, STATUS.rejected);
    setRejectTarget(null);
  };

  const handleDelete = (id) => {
    if (!window.confirm('حذف هذا المشروع نهائياً؟')) return;
    setProjects((prev) => prev.filter((p) => p._id !== id));
  };

  return (
    <div>
      <Topbar title="Graduation Project Review" />

      {/* Tabs */}
      <div className="mb-4 flex flex-wrap gap-1 border-b border-navy/10">
        {TABS.map((t) => (
          <button key={t.key} onClick={() => setTab(t.key)}
            className={`whitespace-nowrap border-b-2 px-3.5 py-2 text-sm font-semibold ${
              tab === t.key ? 'border-navy text-navy' : 'border-transparent text-navy/40 hover:text-navy/60'
            }`}>
            {t.label}
          </button>
        ))}
      </div>

      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {filtered.map((p) => (
          <div key={p._id} className="rounded-2xl bg-card p-5 shadow-sm shadow-navy/5">
            <div className="flex items-center justify-between">
              <StatusBadge tone={statusTone(p.status)}>{p.status}</StatusBadge>
              <span className="text-xs text-navy/40">{p.createdAt?.slice(0, 10) ?? ''}</span>
            </div>

            <h3 className="mt-2 text-sm font-bold text-navy">{p.title}</h3>
            {p.description && (
              <p className="mt-1 text-xs text-navy/50 line-clamp-2">{p.description}</p>
            )}

            <dl className="mt-3 space-y-1 text-xs">
              <Row label="Student"
                value={p.createdBy?.fullName ?? p.createdBy ?? '—'} />
              <Row label="Email"
                value={p.createdBy?.universityEmail ?? '—'} />
              <Row label="Specialization"
                value={p.specialization ?? '—'} />
              {p.supervisors?.length > 0 && (
                <Row label="Supervisors"
                  value={p.supervisors.join(', ')} />
              )}
              {p.teamMembers?.length > 0 && (
                <Row label="Team"
                  value={p.teamMembers.join(', ')} />
              )}
              <Row label="Graduation Year" value={p.graduationYear} />
            </dl>

            {/* Action buttons */}
            <div className="mt-4 flex flex-wrap gap-2">
              {p.status === STATUS.pending && (
                <>
                  <button disabled={actionLoading}
                    onClick={() => changeStatus(p._id, STATUS.approved)}
                    className="flex-1 rounded-lg bg-status-green py-1.5 text-xs font-semibold text-white disabled:opacity-50">
                    Approve
                  </button>
                  <button disabled={actionLoading}
                    onClick={() => setRejectTarget(p._id)}
                    className="flex-1 rounded-lg bg-status-red py-1.5 text-xs font-semibold text-white disabled:opacity-50">
                    Reject
                  </button>
                </>
              )}

              {[STATUS.approved, STATUS.published].includes(p.status) && (
                <>
                  {p.githubLink && (
                    <a href={p.githubLink} target="_blank" rel="noreferrer"
                      className="flex-1 rounded-lg bg-status-blue-bg py-1.5 text-center text-xs font-semibold text-status-blue">
                      GitHub
                    </a>
                  )}
                  {p.documentationPdfUrl && (
                    <a href={p.documentationPdfUrl} target="_blank" rel="noreferrer"
                      className="flex-1 rounded-lg bg-status-green-bg py-1.5 text-center text-xs font-semibold text-status-green">
                      Docs PDF
                    </a>
                  )}
                  <button disabled={actionLoading}
                    onClick={() => changeStatus(p._id, STATUS.pending)}
                    className="flex-1 rounded-lg bg-navy/8 py-1.5 text-xs font-semibold text-navy/50">
                    Revoke
                  </button>
                </>
              )}

              {p.status === STATUS.rejected && (
                <button disabled={actionLoading}
                  onClick={() => changeStatus(p._id, STATUS.pending)}
                  className="flex-1 rounded-lg bg-navy/8 py-1.5 text-xs font-semibold text-navy/60">
                  Restore to Review
                </button>
              )}

              <button onClick={() => handleDelete(p._id)}
                className="rounded-lg bg-status-red-bg px-3 py-1.5 text-xs font-semibold text-status-red">
                Delete
              </button>
            </div>
          </div>
        ))}

        {filtered.length === 0 && (
          <p className="col-span-full py-12 text-center text-sm text-navy/40">
            No projects in this category.
          </p>
        )}
      </div>

      {/* Reject confirmation modal */}
      <Modal open={!!rejectTarget} onClose={() => setRejectTarget(null)} title="Reject Project">
        <p className="text-sm text-navy/60">
          هل أنت متأكد من رفض هذا المشروع؟ سيتغير وضعه إلى <strong>مرفوض</strong>.
        </p>
        <div className="mt-4 flex gap-3">
          <button onClick={() => setRejectTarget(null)}
            className="flex-1 rounded-lg bg-navy/8 py-2.5 text-sm font-semibold text-navy/60">
            إلغاء
          </button>
          <button onClick={confirmReject} disabled={actionLoading}
            className="flex-1 rounded-lg bg-status-red py-2.5 text-sm font-semibold text-white disabled:opacity-50">
            تأكيد الرفض
          </button>
        </div>
      </Modal>
    </div>
  );
}

function Row({ label, value }) {
  return (
    <div className="flex items-baseline justify-between gap-2">
      <span className="shrink-0 text-navy/40">{label}</span>
      <span className="truncate font-semibold text-navy">{value ?? '—'}</span>
    </div>
  );
}