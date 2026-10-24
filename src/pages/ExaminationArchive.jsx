import { useState } from 'react';
import { Plus, Pencil, Trash2, Upload } from 'lucide-react';
import Topbar from '../components/Topbar';
import StatusBadge from '../components/StatusBadge';
import Modal from '../components/Modal';

const EXAM_TYPES = ['ميدتيرم', 'نهائي'];
const YEARS      = ['First', 'Second', 'Third', 'Fourth'];
const SEMESTERS  = ['الفصل الأول', 'الفصل الثاني'];
const SPECS      = [
  'الذكاء الاصطناعي', 'تطوير الويب', 'تطبيقات الموبايل',
  'الأمن السيبراني', 'قواعد البيانات', 'هندسة البرمجيات',
];
const TYPE_TONE = { 'ميدتيرم': 'orange', 'نهائي': 'red' };

// ── Mock Data (بيانات وهمية بديلة للباك إند) ──────────────────────
const MOCK_EXAMS = [
  {
    _id: 'e1',
    courseName: 'هياكل البيانات',
    courseCode: 'CS201',
    examType: 'ميدتيرم',
    academicYear: 'Second',
    semester: 'الفصل الأول',
    specialization: 'علوم الحاسب',
    instructor: 'د. أحمد محمود',
    examDate: '2023-11-15T00:00:00Z',
    viewsCount: 45,
    examPdfUrl: '#',
    solutionPdfUrl: '#'
  },
  {
    _id: 'e2',
    courseName: 'هندسة البرمجيات',
    courseCode: 'SE305',
    examType: 'نهائي',
    academicYear: 'Third',
    semester: 'الفصل الثاني',
    specialization: 'هندسة البرمجيات',
    instructor: 'م. فاطمة علي',
    examDate: '2024-05-20T00:00:00Z',
    viewsCount: 120,
    examPdfUrl: '#',
    solutionPdfUrl: null
  }
];

const EMPTY_DRAFT = {
  courseName: '', courseCode: '', examType: 'نهائي',
  academicYear: 'First', semester: 'الفصل الأول',
  specialization: 'الذكاء الاصطناعي', instructor: '', examDate: '',
};

const EMPTY_FILES = { examPdf: null, solutionPdf: null };

export default function ExaminationArchive() {
  // استبدال الـ API ببيانات محلية
  const [exams, setExams] = useState(MOCK_EXAMS);

  const [modal, setModal]         = useState(null);
  const [draft, setDraft]         = useState(EMPTY_DRAFT);
  const [files, setFiles]         = useState(EMPTY_FILES);
  const [saving, setSaving]       = useState(false);
  const [saveError, setSaveError] = useState('');
  const [viewExam, setViewExam]   = useState(null);

  const openAdd = () => {
    setDraft(EMPTY_DRAFT);
    setFiles(EMPTY_FILES);
    setSaveError('');
    setModal({ mode: 'add' });
  };

  const openEdit = (exam) => {
    setDraft({
      courseName:     exam.courseName     ?? '',
      courseCode:     exam.courseCode     ?? '',
      examType:       exam.examType       ?? 'نهائي',
      academicYear:   exam.academicYear   ?? 'First',
      semester:       exam.semester       ?? 'الفصل الأول',
      specialization: exam.specialization ?? SPECS[0],
      instructor:     exam.instructor     ?? '',
      examDate:       exam.examDate       ? exam.examDate.slice(0, 10) : '',
    });
    setFiles(EMPTY_FILES);
    setSaveError('');
    setModal({ mode: 'edit', id: exam._id });
  };

  const handleSave = () => {
    if (!draft.courseName || !draft.courseCode || !draft.examDate) {
      setSaveError('يرجى ملء اسم المادة والكود وتاريخ الامتحان');
      return;
    }
    if (modal.mode === 'add' && !files.examPdf) {
      setSaveError('يرجى رفع ملف PDF للامتحان');
      return;
    }
    
    setSaving(true);
    setSaveError('');

    // محاكاة سرعة السيرفر الوهمية
    setTimeout(() => {
      if (modal.mode === 'add') {
        const newExam = {
          _id: Math.random().toString(36).substr(2, 9),
          ...draft,
          viewsCount: 0,
          examPdfUrl: files.examPdf ? URL.createObjectURL(files.examPdf) : '#',
          solutionPdfUrl: files.solutionPdf ? URL.createObjectURL(files.solutionPdf) : null
        };
        setExams([newExam, ...exams]);
      } else {
        setExams(exams.map(e => e._id === modal.id ? {
          ...e,
          ...draft,
          examPdfUrl: files.examPdf ? URL.createObjectURL(files.examPdf) : e.examPdfUrl,
          solutionPdfUrl: files.solutionPdf ? URL.createObjectURL(files.solutionPdf) : e.solutionPdfUrl
        } : e));
      }
      
      setSaving(false);
      setModal(null);
    }, 400);
  };

  const handleDelete = (id) => {
    if (!window.confirm('حذف هذا الامتحان؟')) return;
    setExams(exams.filter(e => e._id !== id));
  };

  return (
    <div>
      <Topbar
        title="Examination Archive"
        action={
          <button onClick={openAdd}
            className="gradient-primary flex items-center gap-1.5 rounded-lg px-4 py-2 text-sm font-semibold text-white shadow-md shadow-navy/20">
            <Plus size={16} /> Upload Past Exam
          </button>
        }
      />

      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {exams.map((exam) => (
          <div key={exam._id} className="gradient-primary rounded-2xl p-[3px] shadow-sm shadow-navy/5">
            <div className="rounded-[14px] bg-card p-5">
              <div className="flex items-center justify-between">
                <span className="text-xs font-bold text-teal">{exam.courseCode}</span>
                <StatusBadge tone={TYPE_TONE[exam.examType] ?? 'blue'}>
                  {exam.examType?.toUpperCase()}
                </StatusBadge>
              </div>
              <h3 className="mt-1 text-sm font-bold text-navy">{exam.courseName}</h3>

              <dl className="mt-3 space-y-1.5 text-xs">
                <Row label="Specialization" value={exam.specialization} />
                <Row label="Academic Year"  value={exam.academicYear} />
                <Row label="Semester"       value={exam.semester} />
                <Row label="Instructor"     value={exam.instructor ?? '—'} />
                <Row label="Exam Date"      value={exam.examDate?.slice(0, 10) ?? '—'} />
              </dl>

              <div className="mt-4 flex gap-2">
                <button onClick={() => setViewExam(exam)}
                  className="flex-1 rounded-lg bg-status-blue-bg py-1.5 text-xs font-semibold text-status-blue">
                  View
                </button>
                <button onClick={() => openEdit(exam)}
                  className="rounded-lg bg-status-green-bg p-1.5 text-status-green">
                  <Pencil size={14} />
                </button>
                <button onClick={() => handleDelete(exam._id)}
                  className="rounded-lg bg-status-red-bg p-1.5 text-status-red">
                  <Trash2 size={14} />
                </button>
              </div>
            </div>
          </div>
        ))}

        {exams.length === 0 && (
          <p className="col-span-full py-12 text-center text-sm text-navy/40">
            لا توجد امتحانات في الأرشيف.
          </p>
        )}
      </div>

      {/* ── Add / Edit Modal ─────────────────────────────────────────────── */}
      <Modal
        open={!!modal}
        onClose={() => setModal(null)}
        title={modal?.mode === 'add' ? 'Upload Past Exam' : 'Edit Exam'}
        widthClass="max-w-lg"
      >
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
          <Field label="Course Name *" value={draft.courseName}
            onChange={(e) => setDraft({ ...draft, courseName: e.target.value })} />
          <Field label="Course Code *" value={draft.courseCode}
            onChange={(e) => setDraft({ ...draft, courseCode: e.target.value })} />

          <Select label="Exam Type"      value={draft.examType}       options={EXAM_TYPES}
            onChange={(e) => setDraft({ ...draft, examType: e.target.value })} />
          <Select label="Academic Year"  value={draft.academicYear}   options={YEARS}
            onChange={(e) => setDraft({ ...draft, academicYear: e.target.value })} />
          <Select label="Semester"       value={draft.semester}       options={SEMESTERS}
            onChange={(e) => setDraft({ ...draft, semester: e.target.value })} />
          <Select label="Specialization" value={draft.specialization} options={SPECS}
            onChange={(e) => setDraft({ ...draft, specialization: e.target.value })} />

          <Field label="Instructor" value={draft.instructor}
            onChange={(e) => setDraft({ ...draft, instructor: e.target.value })} />
          <Field label="Exam Date *" type="date" value={draft.examDate}
            onChange={(e) => setDraft({ ...draft, examDate: e.target.value })} />

          {/* File Uploads */}
          <div className="col-span-2">
            <FileInput
              label="Exam PDF *"
              file={files.examPdf}
              onChange={(f) => setFiles({ ...files, examPdf: f })}
              hint={modal?.mode === 'edit' ? 'اتركه فاضي للإبقاء على الملف الحالي' : ''}
            />
          </div>
          <div className="col-span-2">
            <FileInput
              label="Solution PDF (اختياري)"
              file={files.solutionPdf}
              onChange={(f) => setFiles({ ...files, solutionPdf: f })}
              hint={modal?.mode === 'edit' ? 'اتركه فاضي للإبقاء على الملف الحالي' : ''}
            />
          </div>
        </div>

        {saveError && (
          <p className="mt-2 rounded-lg bg-status-red-bg px-3 py-2 text-xs text-status-red">{saveError}</p>
        )}
        <button onClick={handleSave} disabled={saving}
          className="gradient-primary mt-5 w-full rounded-lg py-2.5 text-sm font-semibold text-white shadow-md shadow-navy/20 disabled:opacity-60">
          {saving ? 'Saving…' : modal?.mode === 'add' ? 'Save Exam' : 'Update Exam'}
        </button>
      </Modal>

      {/* ── View Modal ───────────────────────────────────────────────────── */}
      <Modal open={!!viewExam} onClose={() => setViewExam(null)} title="Exam Details">
        {viewExam && (
          <div className="space-y-3 text-sm">
            <div className="flex items-center gap-2">
              <span className="font-bold text-teal">{viewExam.courseCode}</span>
              <StatusBadge tone={TYPE_TONE[viewExam.examType] ?? 'blue'}>
                {viewExam.examType}
              </StatusBadge>
            </div>
            <p className="text-base font-bold text-navy">{viewExam.courseName}</p>
            <Row label="Specialization" value={viewExam.specialization} />
            <Row label="Academic Year"  value={viewExam.academicYear} />
            <Row label="Semester"       value={viewExam.semester} />
            <Row label="Instructor"     value={viewExam.instructor ?? '—'} />
            <Row label="Exam Date"      value={viewExam.examDate?.slice(0, 10) ?? '—'} />
            <Row label="Views"          value={viewExam.viewsCount ?? 0} />
            <div className="flex gap-2 pt-2">
              {viewExam.examPdfUrl && viewExam.examPdfUrl !== '#' && (
                <a href={viewExam.examPdfUrl} target="_blank" rel="noreferrer"
                  className="flex-1 rounded-lg bg-status-blue-bg py-2 text-center text-xs font-semibold text-status-blue">
                  Exam PDF
                </a>
              )}
              {viewExam.solutionPdfUrl && viewExam.solutionPdfUrl !== '#' && (
                <a href={viewExam.solutionPdfUrl} target="_blank" rel="noreferrer"
                  className="flex-1 rounded-lg bg-status-green-bg py-2 text-center text-xs font-semibold text-status-green">
                  Solution PDF
                </a>
              )}
            </div>
          </div>
        )}
      </Modal>
    </div>
  );
}

// ── Helper Components ──────────────────────────────────────────────────────

function FileInput({ label, file, onChange, hint }) {
  return (
    <div>
      <label className="block text-xs font-semibold text-navy/70">{label}</label>
      <label className="mt-1.5 flex flex-col gap-2 rounded-lg border border-dashed border-navy/20 bg-app-bg px-3 py-3 text-sm text-navy/50 hover:border-teal hover:text-teal transition-colors sm:flex-row sm:items-center">
        <Upload size={14} />
        <span className="flex-1 min-w-0 truncate">
          {file ? file.name : 'اضغط لاختيار ملف PDF'}
        </span>
        <input
          type="file"
          accept=".pdf"
          className="hidden"
          onChange={(e) => onChange(e.target.files?.[0] ?? null)}
        />
      </label>
      {hint && <p className="mt-1 text-xs text-text-hint">{hint}</p>}
    </div>
  );
}

function Row({ label, value }) {
  return (
    <div className="flex justify-between border-b border-navy/5 pb-1.5">
      <span className="text-navy/40">{label}</span>
      <span className="font-semibold text-navy">{value}</span>
    </div>
  );
}

function Field({ label, ...props }) {
  return (
    <div>
      <label className="block text-xs font-semibold text-navy/70">{label}</label>
      <input {...props} className="mt-1.5 w-full rounded-lg border border-navy/10 bg-card px-3 py-2 text-sm text-navy outline-none focus:border-teal" />
    </div>
  );
}

function Select({ label, options, ...props }) {
  return (
    <div>
      <label className="block text-xs font-semibold text-navy/70">{label}</label>
      <select {...props} className="mt-1.5 w-full rounded-lg border border-navy/10 bg-card px-3 py-2 text-sm text-navy outline-none">
        {options.map((o) => <option key={o}>{o}</option>)}
      </select>
    </div>
  );
}