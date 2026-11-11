import { useMemo, useState } from 'react';
import { Plus, Eye, Pencil, Trash2, Upload } from 'lucide-react';
import Topbar from '../components/Topbar';
import StatusBadge from '../components/StatusBadge';
import Modal from '../components/Modal';

// ── Mock Data (بيانات وهمية بديلة للباك إند) ──────────────────────
const MOCK_CATEGORIES = [
  { _id: 'cat1', name: 'تطوير الويب' },
  { _id: 'cat2', name: 'الذكاء الاصطناعي' },
  { _id: 'cat3', name: 'قواعد البيانات' },
  { _id: 'cat4', name: 'هندسة البرمجيات' }
];

const INITIAL_BOOKS = [
  {
    _id: 'b1',
    title: 'React for Beginners',
    author: 'John Doe',
    category: { _id: 'cat1', name: 'تطوير الويب' },
    description: 'دليل شامل لتعلم مكتبة ريأكت من الصفر.',
    availabilityStatus: 'متوفر',
    availableCopies: 5,
    totalCopies: 10,
    publicationYear: 2024,
    rating: 4.8,
    coverImageUrl: 'https://via.placeholder.com/150/003366/FFFFFF?text=React+Book',
    pdfUrl: '#'
  },
  {
    _id: 'b2',
    title: 'Introduction to AI',
    author: 'Sarah Smith',
    category: { _id: 'cat2', name: 'الذكاء الاصطناعي' },
    description: 'مقدمة مبسطة لمفاهيم الذكاء الاصطناعي.',
    availabilityStatus: 'غير متوفر',
    availableCopies: 0,
    totalCopies: 3,
    publicationYear: 2023,
    rating: 4.5,
    coverImageUrl: 'https://via.placeholder.com/150/008080/FFFFFF?text=AI+Book',
    pdfUrl: '#'
  }
];

const AVAILABILITY = ['متوفر', 'غير متوفر', 'محفوظ'];

const EMPTY_DRAFT = {
  title: '', author: '', categoryName: '', description: '',
  availabilityStatus: 'متوفر', totalCopies: 1, availableCopies: 1,
  publicationYear: new Date().getFullYear(), rating: 0,
};

const EMPTY_FILES = { coverImage: null, bookPdf: null };

export default function MaterialManagement() {
  const [books, setBooks] = useState(INITIAL_BOOKS);
  const categories = MOCK_CATEGORIES;

  const [search, setSearch] = useState('');
  const [catFilter, setCatFilter] = useState('الكل');

  const [modal, setModal] = useState(null);
  const [draft, setDraft] = useState(EMPTY_DRAFT);
  const [files, setFiles] = useState(EMPTY_FILES);
  const [saving, setSaving] = useState(false);
  const [saveError, setSaveError] = useState('');
  const [viewBook, setViewBook] = useState(null);

  const filtered = useMemo(() => {
    return books.filter((b) => {
      const matchSearch =
        b.title?.toLowerCase().includes(search.toLowerCase()) ||
        b.author?.toLowerCase().includes(search.toLowerCase());
      const matchCat =
        catFilter === 'الكل' ||
        b.category?._id === catFilter ||
        b.category?.name === catFilter;
      return matchSearch && matchCat;
    });
  }, [books, search, catFilter]);

  const openAdd = () => {
    setDraft(EMPTY_DRAFT);
    setFiles(EMPTY_FILES);
    setSaveError('');
    setModal({ mode: 'add' });
  };

  const openEdit = (book) => {
    setDraft({
      title: book.title ?? '',
      author: book.author ?? '',
      categoryName: book.category?.name ?? '',
      description: book.description ?? '',
      availabilityStatus: book.availabilityStatus ?? 'متوفر',
      totalCopies: book.totalCopies ?? 1,
      availableCopies: book.availableCopies ?? 1,
      publicationYear: book.publicationYear ?? new Date().getFullYear(),
      rating: book.rating ?? 0,
    });
    setFiles(EMPTY_FILES);
    setSaveError('');
    setModal({ mode: 'edit', id: book._id });
  };

  const handleSave = () => {
    if (!draft.title || !draft.author || !draft.categoryName || !draft.description) {
      setSaveError('يرجى ملء العنوان والمؤلف والقسم والوصف');
      return;
    }
    if (+draft.availableCopies > +draft.totalCopies) {
      setSaveError('عدد النسخ المتاحة لا يمكن أن يتجاوز إجمالي النسخ');
      return;
    }
    if (+draft.publicationYear > new Date().getFullYear()) {
      setSaveError('سنة النشر لا يمكن أن تكون في المستقبل');
      return;
    }
    if (modal.mode === 'add' && !files.bookPdf) {
      setSaveError('يرجى رفع ملف PDF للكتاب');
      return;
    }

    setSaving(true);
    setSaveError('');

    setTimeout(() => {
      const selectedCat = categories.find(c => c.name === draft.categoryName) || { _id: 'custom', name: draft.categoryName };
      
      if (modal.mode === 'add') {
        const newBook = {
          _id: Math.random().toString(36).substr(2, 9),
          ...draft,
          category: selectedCat,
          coverImageUrl: files.coverImage ? URL.createObjectURL(files.coverImage) : null,
          pdfUrl: files.bookPdf ? URL.createObjectURL(files.bookPdf) : null
        };
        setBooks([newBook, ...books]);
      } else {
        setBooks(books.map(b => b._id === modal.id ? {
          ...b,
          ...draft,
          category: selectedCat,
          coverImageUrl: files.coverImage ? URL.createObjectURL(files.coverImage) : b.coverImageUrl,
          pdfUrl: files.bookPdf ? URL.createObjectURL(files.bookPdf) : b.pdfUrl
        } : b));
      }
      
      setSaving(false);
      setModal(null);
    }, 400);
  };

  const handleDelete = (id) => {
    if (!window.confirm('هل أنت متأكد من حذف هذا الكتاب؟')) return;
    setBooks(books.filter(b => b._id !== id));
  };

  return (
    // التعديل: مسافات الصفحة
    <div className="p-4 sm:p-6 lg:p-8 w-full">
      <Topbar
        title="إدارة المواد العلمية"
        action={
          <button onClick={openAdd}
            className="gradient-primary flex items-center gap-1.5 rounded-lg px-4 py-2 text-sm font-semibold text-white shadow-md shadow-navy/20 transition-opacity hover:opacity-90">
            <Plus size={16} /> إضافة مادة جديدة
          </button>
        }
      />

      <div className="mt-6 rounded-2xl bg-card p-5 shadow-sm shadow-navy/5">
        {/* Filters */}
        <div className="flex flex-col gap-3 sm:flex-row sm:items-center">
          <input value={search} onChange={(e) => setSearch(e.target.value)}
            placeholder="البحث بالعنوان أو اسم المؤلف..."
            className="min-w-[240px] flex-1 rounded-lg border border-navy/10 bg-app-bg px-4 py-2.5 text-sm text-navy placeholder:text-text-hint outline-none transition-colors focus:border-teal" />
          <select value={catFilter} onChange={(e) => setCatFilter(e.target.value)}
            className="rounded-lg border border-navy/10 bg-app-bg px-4 py-2.5 text-sm text-navy/70 outline-none transition-colors focus:border-teal appearance-none cursor-pointer">
            <option value="الكل">كل الأقسام</option>
            {categories.map((c) => <option key={c._id} value={c.name}>{c.name}</option>)}
          </select>
        </div>

        {/* Table */}
        <div className="mt-5 overflow-x-auto">
          {/* التعديل: text-start و whitespace-nowrap */}
          <table className="w-full text-start text-sm whitespace-nowrap">
            <thead>
              <tr className="text-xs font-bold tracking-wide text-navy/40 border-b border-navy/5">
                {/* التعديل: pe-4 بدل pr-4 */}
                <th className="py-3 pe-4 pb-3">العنوان</th>
                <th className="py-3 pe-4 pb-3">المؤلف</th>
                <th className="py-3 pe-4 pb-3">القسم</th>
                <th className="py-3 pe-4 pb-3">النسخ</th>
                <th className="py-3 pe-4 pb-3">الحالة</th>
                <th className="py-3 pe-4 pb-3">التقييم</th>
                <th className="py-3 pe-4 pb-3">إجراءات</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-navy/5">
              {filtered.map((b) => (
                <tr key={b._id} className="transition-colors hover:bg-navy/5">
                  <td className="py-3.5 pe-4 font-semibold text-navy">{b.title}</td>
                  <td className="py-3.5 pe-4 text-navy/60">{b.author}</td>
                  <td className="py-3.5 pe-4">
                    <StatusBadge tone="blue">{b.category?.name ?? '—'}</StatusBadge>
                  </td>
                  <td className="py-3.5 pe-4 font-medium text-navy/70">{b.availableCopies} / {b.totalCopies}</td>
                  <td className="py-3.5 pe-4">
                    <StatusBadge tone={b.availabilityStatus === 'متوفر' ? 'green' : 'red'}>
                      {b.availabilityStatus}
                    </StatusBadge>
                  </td>
                  <td className="py-3.5 pe-4 font-medium text-navy/60">⭐ {b.rating ?? 0}</td>
                  <td className="py-3.5 pe-4">
                    <div className="flex items-center gap-2">
                      <IconBtn tone="blue"  icon={Eye}    title="عرض التفاصيل"  onClick={() => setViewBook(b)} />
                      <IconBtn tone="green" icon={Pencil} title="تعديل"  onClick={() => openEdit(b)} />
                      <IconBtn tone="red"   icon={Trash2} title="حذف" onClick={() => handleDelete(b._id)} />
                    </div>
                  </td>
                </tr>
              ))}
              {filtered.length === 0 && (
                <tr><td colSpan={7} className="py-12 text-center text-sm text-navy/40">لا توجد مواد مطابقة للبحث.</td></tr>
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* ── Add / Edit Modal ─────────────────────────────────────────────── */}
      <Modal
        open={!!modal}
        onClose={() => setModal(null)}
        title={modal?.mode === 'add' ? 'إضافة مادة جديدة' : 'تعديل بيانات المادة'}
        widthClass="max-w-xl"
      >
        <div className="space-y-4">
          <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
            <Field label="عنوان الكتاب *"  value={draft.title}
              onChange={(e) => setDraft({ ...draft, title: e.target.value })} />
            <Field label="المؤلف *" value={draft.author}
              onChange={(e) => setDraft({ ...draft, author: e.target.value })} />
          </div>

          <div>
            <label className="text-xs font-semibold text-navy/70">القسم *</label>
            <select
              value={draft.categoryName}
              onChange={(e) => setDraft({ ...draft, categoryName: e.target.value })}
              className="mt-1.5 w-full rounded-lg border border-navy/10 bg-card px-3 py-2.5 text-sm text-navy outline-none transition-colors focus:border-teal appearance-none cursor-pointer">
              <option value="">— اختر القسم —</option>
              {categories.map((c) => (
                <option key={c._id} value={c.name}>{c.name}</option>
              ))}
            </select>
          </div>

          <div>
             <label className="text-xs font-semibold text-navy/70">الوصف *</label>
             <textarea value={draft.description} rows={2}
               onChange={(e) => setDraft({ ...draft, description: e.target.value })}
               className="mt-1.5 w-full rounded-lg border border-navy/10 bg-card px-3 py-2 text-sm text-navy outline-none transition-colors focus:border-teal" 
             />
          </div>

          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
            <div>
              <label className="text-xs font-semibold text-navy/70">حالة التوفر</label>
              <select value={draft.availabilityStatus}
                onChange={(e) => setDraft({ ...draft, availabilityStatus: e.target.value })}
                className="mt-1.5 w-full rounded-lg border border-navy/10 bg-card px-3 py-2.5 text-sm text-navy outline-none transition-colors focus:border-teal appearance-none cursor-pointer">
                {AVAILABILITY.map((a) => <option key={a} value={a}>{a}</option>)}
              </select>
            </div>
            <Field label="سنة النشر" type="number"
              value={draft.publicationYear}
              onChange={(e) => setDraft({ ...draft, publicationYear: +e.target.value })} />
          </div>

          <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
            <Field label="إجمالي النسخ" type="number" min="1"
              value={draft.totalCopies}
              onChange={(e) => setDraft({ ...draft, totalCopies: +e.target.value })} />
            <Field label="النسخ المتاحة" type="number" min="0"
              value={draft.availableCopies}
              onChange={(e) => setDraft({ ...draft, availableCopies: +e.target.value })} />
            <Field label="التقييم (0–5)" type="number" min="0" max="5" step="0.1"
              value={draft.rating}
              onChange={(e) => setDraft({ ...draft, rating: +e.target.value })} />
          </div>

          {/* File Uploads */}
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
            <FileInput
              label="ملف الكتاب (PDF) *"
              accept=".pdf"
              file={files.bookPdf}
              onChange={(f) => setFiles({ ...files, bookPdf: f })}
              hint={modal?.mode === 'edit' ? 'اتركه فارغاً للإبقاء على الملف الحالي' : ''}
            />
            <FileInput
              label="صورة الغلاف (اختياري)"
              accept="image/png,image/jpeg,image/webp"
              file={files.coverImage}
              onChange={(f) => setFiles({ ...files, coverImage: f })}
              hint={modal?.mode === 'edit' ? 'اتركه فارغاً للإبقاء على الصورة الحالية' : ''}
            />
          </div>

          {saveError && (
            <p className="mt-2 rounded-lg bg-status-red-bg px-3 py-2 text-xs font-medium text-status-red">{saveError}</p>
          )}

          <button onClick={handleSave} disabled={saving}
            className="gradient-primary mt-6 w-full rounded-lg py-3 text-sm font-semibold text-white shadow-md shadow-navy/20 transition-opacity hover:opacity-90 disabled:opacity-60">
            {saving ? 'جاري الحفظ...' : modal?.mode === 'add' ? 'حفظ المادة العلمية' : 'تحديث بيانات المادة'}
          </button>
        </div>
      </Modal>

      {/* ── View Modal ───────────────────────────────────────────────────── */}
      <Modal open={!!viewBook} onClose={() => setViewBook(null)} title="تفاصيل الكتاب">
        {viewBook && (
          <div className="space-y-4 text-sm">
            {viewBook.coverImageUrl && (
              <img src={viewBook.coverImageUrl} alt={viewBook.title}
                className="h-48 w-full rounded-xl object-cover shadow-sm" />
            )}
            
            <div className="space-y-2 pt-2">
              <Row label="العنوان"       value={viewBook.title} />
              <Row label="المؤلف"      value={viewBook.author} />
              <Row label="القسم"    value={viewBook.category?.name ?? '—'} />
              <div className="py-2 border-b border-navy/5 text-xs">
                <span className="block text-navy/50 mb-1">الوصف</span>
                <p className="text-navy font-medium leading-relaxed">{viewBook.description ?? '—'}</p>
              </div>
              <Row label="حالة التوفر"      value={viewBook.availabilityStatus} />
              <Row label="عدد النسخ"      value={`${viewBook.availableCopies} متوفرة / من أصل ${viewBook.totalCopies}`} />
              <Row label="سنة النشر"        value={viewBook.publicationYear} />
              <Row label="التقييم"      value={`⭐ ${viewBook.rating ?? 0}`} />
            </div>

            {viewBook.pdfUrl && viewBook.pdfUrl !== '#' && (
              <div className="pt-4">
                <a href={viewBook.pdfUrl} target="_blank" rel="noreferrer"
                  className="gradient-primary block rounded-lg py-2.5 text-center text-sm font-semibold text-white transition-opacity hover:opacity-90 shadow-md shadow-navy/20">
                  عرض الكتاب (PDF)
                </a>
              </div>
            )}
          </div>
        )}
      </Modal>
    </div>
  );
}

// ── Helper Components ──────────────────────────────────────────────────────

function FileInput({ label, accept, file, onChange, hint }) {
  return (
    <div>
      <label className="text-xs font-semibold text-navy/70">{label}</label>
      <label className="mt-1.5 flex cursor-pointer items-center gap-2 rounded-lg border border-dashed border-navy/20 bg-app-bg px-3 py-3 text-sm text-navy/50 hover:border-teal hover:text-teal transition-colors">
        <Upload size={16} className="shrink-0" />
        <span className="flex-1 truncate text-start">
          {file ? file.name : 'اضغط لاختيار ملف'}
        </span>
        <input
          type="file"
          accept={accept}
          className="hidden"
          onChange={(e) => onChange(e.target.files?.[0] ?? null)}
        />
      </label>
      {hint && <p className="mt-1.5 text-[11px] text-text-hint">{hint}</p>}
    </div>
  );
}

function Field({ label, ...props }) {
  return (
    <div>
      <label className="text-xs font-semibold text-navy/70">{label}</label>
      <input {...props} className="mt-1.5 w-full rounded-lg border border-navy/10 bg-card px-3 py-2.5 text-sm text-navy outline-none transition-colors focus:border-teal" />
    </div>
  );
}

// التعديل: ضبط الـ Flexbox عشان يعرض الكلمة وقيمتها صح بالعربي
function Row({ label, value }) {
  return (
    <div className="flex items-center justify-between gap-2 border-b border-navy/5 pb-2">
      <span className="shrink-0 text-navy/50">{label}</span>
      <span className="font-semibold text-navy text-end">{value}</span>
    </div>
  );
}

function IconBtn({ icon: Icon, tone, onClick, title }) {
  const tones = {
    blue:  'bg-status-blue-bg text-status-blue hover:bg-status-blue hover:text-white',
    green: 'bg-status-green-bg text-status-green hover:bg-status-green hover:text-white',
    red:   'bg-status-red-bg text-status-red hover:bg-status-red hover:text-white',
  };
  return (
    <button onClick={onClick} title={title} className={`rounded-lg p-1.5 transition-colors ${tones[tone]}`}>
      <Icon size={15} />
    </button>
  );
}