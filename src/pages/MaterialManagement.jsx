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
  // استبدال الـ API ببيانات محلية
  const [books, setBooks] = useState(INITIAL_BOOKS);
  const categories = MOCK_CATEGORIES;

  const [search, setSearch] = useState('');
  const [catFilter, setCatFilter] = useState('All');

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
        catFilter === 'All' ||
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

    // محاكاة سرعة السيرفر الوهمية
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
    if (!window.confirm('حذف هذا الكتاب؟')) return;
    setBooks(books.filter(b => b._id !== id));
  };

  return (
    <div>
      <Topbar
        title="Material Management"
        action={
          <button onClick={openAdd}
            className="gradient-primary flex items-center gap-1.5 rounded-lg px-4 py-2 text-sm font-semibold text-white shadow-md shadow-navy/20">
            <Plus size={16} /> Add New Material
          </button>
        }
      />

      <div className="rounded-2xl bg-card p-5 shadow-sm shadow-navy/5">
        {/* Filters */}
        <div className="flex flex-col gap-3 sm:flex-row sm:items-center">
          <input value={search} onChange={(e) => setSearch(e.target.value)}
            placeholder="Search by title or author…"
            className="min-w-[240px] flex-1 rounded-lg border border-navy/10 bg-auth-card px-3 py-2 text-sm text-navy placeholder:text-text-hint outline-none focus:border-teal" />
          <select value={catFilter} onChange={(e) => setCatFilter(e.target.value)}
            className="rounded-lg border border-navy/10 bg-auth-card px-3 py-2 text-sm text-navy/70 outline-none">
            <option value="All">All Categories</option>
            {categories.map((c) => <option key={c._id} value={c.name}>{c.name}</option>)}
          </select>
        </div>

        {/* Table */}
        <div className="mt-4 overflow-x-auto">
          <table className="w-full text-left text-sm">
            <thead>
              <tr className="text-xs font-bold tracking-wide text-navy/40">
                <th className="py-2 pr-4">Title</th>
                <th className="py-2 pr-4">Author</th>
                <th className="py-2 pr-4">Category</th>
                <th className="py-2 pr-4">Copies</th>
                <th className="py-2 pr-4">Status</th>
                <th className="py-2 pr-4">Rating</th>
                <th className="py-2 pr-4">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-navy/5">
              {filtered.map((b) => (
                <tr key={b._id}>
                  <td className="py-3 pr-4 font-semibold text-navy">{b.title}</td>
                  <td className="py-3 pr-4 text-navy/60">{b.author}</td>
                  <td className="py-3 pr-4">
                    <StatusBadge tone="green">{b.category?.name ?? '—'}</StatusBadge>
                  </td>
                  <td className="py-3 pr-4 text-navy/70">{b.availableCopies}/{b.totalCopies}</td>
                  <td className="py-3 pr-4">
                    <StatusBadge tone={b.availabilityStatus === 'متوفر' ? 'green' : 'red'}>
                      {b.availabilityStatus}
                    </StatusBadge>
                  </td>
                  <td className="py-3 pr-4 text-navy/60">⭐ {b.rating ?? 0}</td>
                  <td className="py-3 pr-4">
                    <div className="flex items-center gap-2">
                      <IconBtn tone="blue"  icon={Eye}    title="View"   onClick={() => setViewBook(b)} />
                      <IconBtn tone="green" icon={Pencil} title="Edit"   onClick={() => openEdit(b)} />
                      <IconBtn tone="red"   icon={Trash2} title="Delete" onClick={() => handleDelete(b._id)} />
                    </div>
                  </td>
                </tr>
              ))}
              {filtered.length === 0 && (
                <tr><td colSpan={7} className="py-8 text-center text-sm text-navy/40">No materials found.</td></tr>
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* ── Add / Edit Modal ─────────────────────────────────────────────── */}
      <Modal
        open={!!modal}
        onClose={() => setModal(null)}
        title={modal?.mode === 'add' ? 'Add New Material' : 'Edit Material'}
        widthClass="max-w-lg"
      >
        <div className="space-y-3">
          <div className="grid grid-cols-1 gap-3 md:grid-cols-2">
            <Field label="Title *"  value={draft.title}
              onChange={(e) => setDraft({ ...draft, title: e.target.value })} />
            <Field label="Author *" value={draft.author}
              onChange={(e) => setDraft({ ...draft, author: e.target.value })} />
          </div>

          <div>
            <label className="text-xs font-semibold text-navy/70">Category *</label>
            <select
              value={draft.categoryName}
              onChange={(e) => setDraft({ ...draft, categoryName: e.target.value })}
              className="mt-1.5 w-full rounded-lg border border-navy/10 bg-card px-3 py-2 text-sm text-navy outline-none">
              <option value="">— اختر قسم —</option>
              {categories.map((c) => (
                <option key={c._id} value={c.name}>{c.name}</option>
              ))}
            </select>
          </div>

          <Field label="Description" value={draft.description}
            onChange={(e) => setDraft({ ...draft, description: e.target.value })} />

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="text-xs font-semibold text-navy/70">Availability</label>
              <select value={draft.availabilityStatus}
                onChange={(e) => setDraft({ ...draft, availabilityStatus: e.target.value })}
                className="mt-1.5 w-full rounded-lg border border-navy/10 bg-card px-3 py-2 text-sm text-navy outline-none">
                {AVAILABILITY.map((a) => <option key={a}>{a}</option>)}
              </select>
            </div>
            <Field label="Pub. Year" type="number"
              value={draft.publicationYear}
              onChange={(e) => setDraft({ ...draft, publicationYear: +e.target.value })} />
          </div>

          <div className="grid grid-cols-1 gap-3 sm:grid-cols-2 xl:grid-cols-3">
            <Field label="Total Copies" type="number" min="1"
              value={draft.totalCopies}
              onChange={(e) => setDraft({ ...draft, totalCopies: +e.target.value })} />
            <Field label="Available" type="number" min="0"
              value={draft.availableCopies}
              onChange={(e) => setDraft({ ...draft, availableCopies: +e.target.value })} />
            <Field label="Rating (0–5)" type="number" min="0" max="5" step="0.1"
              value={draft.rating}
              onChange={(e) => setDraft({ ...draft, rating: +e.target.value })} />
          </div>

          {/* File Uploads */}
          <FileInput
            label="Book PDF *"
            accept=".pdf"
            file={files.bookPdf}
            onChange={(f) => setFiles({ ...files, bookPdf: f })}
            hint={modal?.mode === 'edit' ? 'اتركه فاضي للإبقاء على الملف الحالي' : ''}
          />
          <FileInput
            label="Cover Image"
            accept="image/png,image/jpeg,image/webp"
            file={files.coverImage}
            onChange={(f) => setFiles({ ...files, coverImage: f })}
            hint={modal?.mode === 'edit' ? 'اتركه فاضي للإبقاء على الصورة الحالية' : ''}
          />

          {saveError && (
            <p className="rounded-lg bg-status-red-bg px-3 py-2 text-xs text-status-red">{saveError}</p>
          )}

          <button onClick={handleSave} disabled={saving}
            className="gradient-primary w-full rounded-lg py-2.5 text-sm font-semibold text-white shadow-md shadow-navy/20 disabled:opacity-60">
            {saving ? 'Saving…' : modal?.mode === 'add' ? 'Save Material' : 'Update Material'}
          </button>
        </div>
      </Modal>

      {/* ── View Modal ───────────────────────────────────────────────────── */}
      <Modal open={!!viewBook} onClose={() => setViewBook(null)} title="Book Details">
        {viewBook && (
          <div className="space-y-3 text-sm">
            {viewBook.coverImageUrl && (
              <img src={viewBook.coverImageUrl} alt={viewBook.title}
                className="h-40 w-full rounded-xl object-cover" />
            )}
            <Row label="Title"       value={viewBook.title} />
            <Row label="Author"      value={viewBook.author} />
            <Row label="Category"    value={viewBook.category?.name ?? '—'} />
            <Row label="Description" value={viewBook.description ?? '—'} />
            <Row label="Status"      value={viewBook.availabilityStatus} />
            <Row label="Copies"      value={`${viewBook.availableCopies} / ${viewBook.totalCopies}`} />
            <Row label="Year"        value={viewBook.publicationYear} />
            <Row label="Rating"      value={`⭐ ${viewBook.rating ?? 0}`} />
            {viewBook.pdfUrl && viewBook.pdfUrl !== '#' && (
              <a href={viewBook.pdfUrl} target="_blank" rel="noreferrer"
                className="gradient-primary block rounded-lg py-2 text-center text-sm font-semibold text-white">
                View PDF
              </a>
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
      <label className="mt-1.5 flex cursor-pointer items-center gap-2 rounded-lg border border-dashed border-navy/20 bg-app-bg px-3 py-2.5 text-sm text-navy/50 hover:border-teal hover:text-teal transition-colors">
        <Upload size={14} />
        <span className="flex-1 truncate">
          {file ? file.name : 'اضغط لاختيار ملف'}
        </span>
        <input
          type="file"
          accept={accept}
          className="hidden"
          onChange={(e) => onChange(e.target.files?.[0] ?? null)}
        />
      </label>
      {hint && <p className="mt-1 text-xs text-text-hint">{hint}</p>}
    </div>
  );
}

function Field({ label, ...props }) {
  return (
    <div>
      <label className="text-xs font-semibold text-navy/70">{label}</label>
      <input {...props} className="mt-1.5 w-full rounded-lg border border-navy/10 bg-card px-3 py-2 text-sm text-navy outline-none focus:border-teal" />
    </div>
  );
}

function Row({ label, value }) {
  return (
    <div className="flex justify-between border-b border-navy/5 pb-2">
      <span className="text-navy/40">{label}</span>
      <span className="font-semibold text-navy">{value}</span>
    </div>
  );
}

function IconBtn({ icon: Icon, tone, onClick, title }) {
  const tones = {
    blue:  'bg-status-blue-bg text-status-blue hover:bg-status-blue/20',
    green: 'bg-status-green-bg text-status-green hover:bg-status-green/20',
    red:   'bg-status-red-bg text-status-red hover:bg-status-red/20',
  };
  return (
    <button onClick={onClick} title={title} className={`rounded-lg p-1.5 ${tones[tone]}`}>
      <Icon size={14} />
    </button>
  );
}