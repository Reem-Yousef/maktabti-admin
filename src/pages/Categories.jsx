import { useState } from 'react';
import { Plus, Pencil, Trash2 } from 'lucide-react';
import Topbar from '../components/Topbar';
import Modal from '../components/Modal';

const EMPTY = { name: '', description: '', iconUrl: '' };

// ── Mock Data (بيانات وهمية بديلة للباك إند) ──────────────────────
const MOCK_CATEGORIES = [
  { _id: 'cat1', name: 'تطوير الويب', description: 'كتب ومراجع تغطي أساسيات وتقنيات برمجة وتصميم مواقع الإنترنت.', booksCount: 15, iconUrl: '' },
  { _id: 'cat2', name: 'الذكاء الاصطناعي', description: 'كل ما يخص تعلم الآلة، الشبكات العصبية، والذكاء الاصطناعي.', booksCount: 8, iconUrl: '' },
  { _id: 'cat3', name: 'قواعد البيانات', description: 'أساسيات وتصميم وإدارة قواعد البيانات العلائقية وغير العلائقية.', booksCount: 5, iconUrl: '' }
];

export default function Categories() {
  // استبدال الـ API ببيانات محلية
  const [cats, setCats] = useState(MOCK_CATEGORIES);

  const [modal, setModal]         = useState(null); // null | { mode, id? }
  const [draft, setDraft]         = useState(EMPTY);
  const [saving, setSaving]       = useState(false);
  const [saveError, setSaveError] = useState('');
  const [fieldErrors, setFieldErrors] = useState({ name: '', description: '' });

  const validateField = (key, value) => {
    if (key === 'name') {
      if (!value.trim()) return 'الاسم مطلوب';
      if (value.trim().length < 3) return 'الاسم يجب أن يكون 3 أحرف على الأقل';
      return '';
    }
    if (key === 'description') {
      return value.trim() ? '' : 'الوصف مطلوب';
    }
    return '';
  };

  const updateDraft = (key, value) => {
    setDraft((prev) => ({ ...prev, [key]: value }));
    setFieldErrors((prev) => ({ ...prev, [key]: validateField(key, value) }));
  };

  const openAdd = () => {
    setDraft(EMPTY);
    setSaveError('');
    setFieldErrors({ name: '', description: '' });
    setModal({ mode: 'add' });
  };

  const openEdit = (cat) => {
    setDraft({ name: cat.name ?? '', description: cat.description ?? '', iconUrl: cat.iconUrl ?? '' });
    setSaveError('');
    setFieldErrors({ name: '', description: '' });
    setModal({ mode: 'edit', id: cat._id });
  };

  const handleSave = () => {
    const nameError = validateField('name', draft.name);
    const descriptionError = validateField('description', draft.description);
    setFieldErrors({ name: nameError, description: descriptionError });

    if (nameError || descriptionError) return;

    setSaving(true);
    setSaveError('');
    
    // محاكاة سرعة السيرفر الوهمية
    setTimeout(() => {
      if (modal.mode === 'add') {
        const newCat = {
          _id: Math.random().toString(36).substr(2, 9),
          ...draft,
          booksCount: 0
        };
        setCats([newCat, ...cats]);
      } else {
        setCats(cats.map(c => c._id === modal.id ? { ...c, ...draft } : c));
      }
      setSaving(false);
      setModal(null);
    }, 400);
  };

  const handleDelete = (id) => {
    if (!window.confirm('حذف هذا القسم؟')) return;
    setCats(cats.filter(c => c._id !== id));
  };

  return (
    <div>
      <Topbar
        title="Categories"
        action={
          <button onClick={openAdd}
            className="gradient-primary flex items-center gap-1.5 rounded-lg px-4 py-2 text-sm font-semibold text-white shadow-md shadow-navy/20">
            <Plus size={16} /> Add Category
          </button>
        }
      />

      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {cats.map((cat) => (
          <div key={cat._id} className="rounded-2xl bg-card p-5 shadow-sm shadow-navy/5">
            <div className="flex items-start justify-between gap-2">
              <div className="flex items-center gap-3">
                {cat.iconUrl ? (
                  <img src={cat.iconUrl} alt={cat.name}
                    className="h-10 w-10 rounded-xl object-cover" />
                ) : (
                  <div className="flex h-10 w-10 items-center justify-center rounded-xl gradient-primary text-lg text-white">
                    {cat.name?.[0] ?? '📚'}
                  </div>
                )}
                <div>
                  <h3 className="text-sm font-bold text-navy">{cat.name}</h3>
                  <p className="text-xs text-navy/40">{cat.booksCount ?? 0} books</p>
                </div>
              </div>
              <div className="flex gap-1.5 shrink-0">
                <button onClick={() => openEdit(cat)}
                  className="rounded-lg bg-status-green-bg p-1.5 text-status-green">
                  <Pencil size={14} />
                </button>
                <button onClick={() => handleDelete(cat._id)}
                  className="rounded-lg bg-status-red-bg p-1.5 text-status-red">
                  <Trash2 size={14} />
                </button>
              </div>
            </div>
            <p className="mt-3 text-xs text-navy/60 line-clamp-2">{cat.description}</p>
          </div>
        ))}

        {cats.length === 0 && (
          <p className="col-span-full py-12 text-center text-sm text-navy/40">
            لا توجد أقسام بعد.
          </p>
        )}
      </div>

      {/* ── Add / Edit Modal ─────────────────────────────────────────────── */}
      <Modal
        open={!!modal}
        onClose={() => setModal(null)}
        title={modal?.mode === 'add' ? 'Add Category' : 'Edit Category'}
      >
        <div className="space-y-3">
          <Field label="Name *" value={draft.name}
            error={fieldErrors.name}
            onChange={(e) => updateDraft('name', e.target.value)} />
          <div>
            <label className="text-xs font-semibold text-navy/70">Description *</label>
            <textarea value={draft.description} rows={3}
              onChange={(e) => updateDraft('description', e.target.value)}
              className="mt-1.5 w-full rounded-lg border border-navy/10 bg-card px-3 py-2 text-sm text-navy outline-none focus:border-teal" />
            {fieldErrors.description && (
              <p className="mt-2 text-[11px] text-status-red">{fieldErrors.description}</p>
            )}
          </div>
          <Field label="Icon URL (optional)" value={draft.iconUrl}
            onChange={(e) => updateDraft('iconUrl', e.target.value)} />

          {saveError && (
            <p className="rounded-lg bg-status-red-bg px-3 py-2 text-xs text-status-red">{saveError}</p>
          )}

          <button onClick={handleSave} disabled={saving}
            className="gradient-primary w-full rounded-lg py-2.5 text-sm font-semibold text-white shadow-md shadow-navy/20 disabled:opacity-60">
            {saving ? 'Saving…' : modal?.mode === 'add' ? 'Save Category' : 'Update Category'}
          </button>
        </div>
      </Modal>
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