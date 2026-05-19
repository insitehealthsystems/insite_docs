'use client'
import React, { useState, useEffect, useRef, useCallback } from 'react';
import { useTranslation } from 'react-i18next';
import { supportedLanguages } from '../i18n';
import { useAuth } from '../contexts/AuthContext';
import {
  Globe, X, Bold, Italic, Strikethrough, Code, List, ListOrdered,
  Quote, Minus, Undo, Redo, Heading1, Heading2, Heading3,
  Image as ImageIcon, Upload, Eye, EyeOff, ChevronDown, ChevronUp,
  Tag, Plus, Check, Clock, Calendar, User, Link2, Search,
  AlertCircle, CheckCircle2, Trash2, Loader2
} from 'lucide-react';
import { useEditor, EditorContent } from '@tiptap/react';
import StarterKit from '@tiptap/starter-kit';
import Placeholder from '@tiptap/extension-placeholder';
import CharacterCount from '@tiptap/extension-character-count';

// ─────────────────────────────────────────────
// Constants
// ─────────────────────────────────────────────
const PREDEFINED_CATEGORIES = [
  { slug: 'healthcare-technology',  label: 'Healthcare Technology' },
  { slug: 'digital-health',         label: 'Digital Health' },
  { slug: 'compliance',             label: 'Compliance' },
  { slug: 'asset-management',       label: 'Asset Management' },
  { slug: 'telemedicine',           label: 'Telemedicine' },
  { slug: 'mobile-health',          label: 'Mobile Health' },
  { slug: 'data-analytics',         label: 'Data Analytics' },
  { slug: 'patient-safety',         label: 'Patient Safety' },
  { slug: 'case-study',             label: 'Case Study' },
  { slug: 'technology',             label: 'Technology' },
  { slug: 'ai-ml',                  label: 'AI & ML' },
  { slug: 'healthcare-economics',   label: 'Healthcare Economics' },
];

export const CATEGORY_LABEL_MAP = Object.fromEntries(
  PREDEFINED_CATEGORIES.map(({ slug, label }) => [slug, label])
);

const toSlug = (str) =>
  str.toLowerCase().trim().replace(/[^a-z0-9\s-]/g, '').replace(/\s+/g, '-').replace(/-+/g, '-');

const estimateReadTime = (html) => {
  const text = html?.replace(/<[^>]+>/g, '') ?? '';
  const words = text.trim().split(/\s+/).filter(Boolean).length;
  return Math.max(1, Math.round(words / 200));
};

// ─────────────────────────────────────────────
// Small reusable UI pieces
// ─────────────────────────────────────────────
const SidebarPanel = ({ title, icon: Icon, children, defaultOpen = true }) => {
  const [open, setOpen] = useState(defaultOpen);
  return (
    <div className="bg-white border border-gray-200 rounded-lg overflow-hidden">
      <button
        type="button"
        onClick={() => setOpen(!open)}
        className="w-full flex items-center justify-between px-4 py-3 bg-gray-50 hover:bg-gray-100 transition-colors text-left"
      >
        <span className="flex items-center gap-2 text-sm font-semibold text-gray-800">
          {Icon && <Icon className="h-4 w-4 text-insite-blue" />}
          {title}
        </span>
        {open ? <ChevronUp className="h-4 w-4 text-gray-400" /> : <ChevronDown className="h-4 w-4 text-gray-400" />}
      </button>
      {open && <div className="p-4 space-y-3">{children}</div>}
    </div>
  );
};

const Field = ({ label, hint, children }) => (
  <div>
    <label className="block text-xs font-medium text-gray-700 mb-1">{label}</label>
    {children}
    {hint && <p className="text-xs text-gray-400 mt-1">{hint}</p>}
  </div>
);

const Input = (props) => (
  <input
    {...props}
    className={`w-full px-3 py-2 border border-gray-300 rounded-md text-sm text-gray-900 bg-white focus:ring-2 focus:ring-insite-blue focus:border-transparent ${props.className ?? ''}`}
  />
);

const Textarea = ({ rows = 3, ...props }) => (
  <textarea
    rows={rows}
    {...props}
    className={`w-full px-3 py-2 border border-gray-300 rounded-md text-sm text-gray-900 bg-white focus:ring-2 focus:ring-insite-blue focus:border-transparent resize-none ${props.className ?? ''}`}
  />
);

// ─────────────────────────────────────────────
// Tiptap toolbar
// ─────────────────────────────────────────────
const ToolbarBtn = ({ onClick, active, disabled, title, children }) => (
  <button
    type="button"
    onClick={onClick}
    disabled={disabled}
    title={title}
    className={`p-1.5 rounded transition-colors text-sm ${
      active ? 'bg-insite-blue text-white' : 'text-gray-600 hover:bg-gray-200 hover:text-gray-900'
    } ${disabled ? 'opacity-30 cursor-not-allowed' : ''}`}
  >
    {children}
  </button>
);

const Divider = () => <div className="w-px h-5 bg-gray-300 mx-0.5 self-center" />;

const EditorToolbar = ({ editor }) => {
  if (!editor) return null;
  return (
    <div className="flex flex-wrap items-center gap-0.5 px-2 py-1.5 border-b border-gray-200 bg-gray-50">
      <ToolbarBtn onClick={() => editor.chain().focus().undo().run()} disabled={!editor.can().undo()} title="Undo"><Undo className="h-3.5 w-3.5" /></ToolbarBtn>
      <ToolbarBtn onClick={() => editor.chain().focus().redo().run()} disabled={!editor.can().redo()} title="Redo"><Redo className="h-3.5 w-3.5" /></ToolbarBtn>
      <Divider />
      <ToolbarBtn onClick={() => editor.chain().focus().toggleHeading({ level: 1 }).run()} active={editor.isActive('heading', { level: 1 })} title="Heading 1"><Heading1 className="h-3.5 w-3.5" /></ToolbarBtn>
      <ToolbarBtn onClick={() => editor.chain().focus().toggleHeading({ level: 2 }).run()} active={editor.isActive('heading', { level: 2 })} title="Heading 2"><Heading2 className="h-3.5 w-3.5" /></ToolbarBtn>
      <ToolbarBtn onClick={() => editor.chain().focus().toggleHeading({ level: 3 }).run()} active={editor.isActive('heading', { level: 3 })} title="Heading 3"><Heading3 className="h-3.5 w-3.5" /></ToolbarBtn>
      <Divider />
      <ToolbarBtn onClick={() => editor.chain().focus().toggleBold().run()} active={editor.isActive('bold')} title="Bold"><Bold className="h-3.5 w-3.5" /></ToolbarBtn>
      <ToolbarBtn onClick={() => editor.chain().focus().toggleItalic().run()} active={editor.isActive('italic')} title="Italic"><Italic className="h-3.5 w-3.5" /></ToolbarBtn>
      <ToolbarBtn onClick={() => editor.chain().focus().toggleStrike().run()} active={editor.isActive('strike')} title="Strikethrough"><Strikethrough className="h-3.5 w-3.5" /></ToolbarBtn>
      <ToolbarBtn onClick={() => editor.chain().focus().toggleCode().run()} active={editor.isActive('code')} title="Inline Code"><Code className="h-3.5 w-3.5" /></ToolbarBtn>
      <Divider />
      <ToolbarBtn onClick={() => editor.chain().focus().toggleBulletList().run()} active={editor.isActive('bulletList')} title="Bullet List"><List className="h-3.5 w-3.5" /></ToolbarBtn>
      <ToolbarBtn onClick={() => editor.chain().focus().toggleOrderedList().run()} active={editor.isActive('orderedList')} title="Ordered List"><ListOrdered className="h-3.5 w-3.5" /></ToolbarBtn>
      <Divider />
      <ToolbarBtn onClick={() => editor.chain().focus().toggleBlockquote().run()} active={editor.isActive('blockquote')} title="Blockquote"><Quote className="h-3.5 w-3.5" /></ToolbarBtn>
      <ToolbarBtn onClick={() => editor.chain().focus().setHorizontalRule().run()} title="Horizontal Rule"><Minus className="h-3.5 w-3.5" /></ToolbarBtn>
    </div>
  );
};

// ─────────────────────────────────────────────
// Rich text editor instance
// ─────────────────────────────────────────────
const RichTextEditor = ({ content, onChange, placeholder }) => {
  const editor = useEditor({
    extensions: [
      StarterKit,
      Placeholder.configure({ placeholder: placeholder || 'Start writing your post...' }),
      CharacterCount,
    ],
    content: content || '',
    onUpdate: ({ editor }) => onChange(editor.getHTML()),
  });

  useEffect(() => {
    if (editor && editor.getHTML() !== content) {
      editor.commands.setContent(content || '', false);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [content]);

  const chars = editor?.storage?.characterCount?.characters() ?? 0;
  const words = editor?.storage?.characterCount?.words() ?? 0;
  const readTime = estimateReadTime(editor?.getHTML() ?? '');

  return (
    <div className="border border-gray-300 rounded-lg overflow-hidden focus-within:ring-2 focus-within:ring-insite-blue focus-within:border-transparent flex flex-col">
      <EditorToolbar editor={editor} />
      <EditorContent
        editor={editor}
        className="prose prose-sm max-w-none flex-1 min-h-[420px] px-5 py-4 focus:outline-none overflow-y-auto"
      />
      <div className="flex items-center gap-4 px-4 py-2 border-t border-gray-100 bg-gray-50 text-xs text-gray-400">
        <span className="flex items-center gap-1"><Clock className="h-3 w-3" />{readTime} min read</span>
        <span>{words.toLocaleString()} words</span>
        <span>{chars.toLocaleString()} characters</span>
      </div>
    </div>
  );
};

// ─────────────────────────────────────────────
// Tag input (pill-style)
// ─────────────────────────────────────────────
const TagInput = ({ tags, onChange }) => {
  const [input, setInput] = useState('');

  const addTag = (raw) => {
    const cleaned = raw.trim().replace(/,+$/, '').trim();
    if (!cleaned) return;
    const toAdd = cleaned.split(',').map(t => t.trim()).filter(t => t && !tags.includes(t));
    if (toAdd.length) onChange([...tags, ...toAdd]);
    setInput('');
  };

  const removeTag = (tag) => onChange(tags.filter(t => t !== tag));

  return (
    <div className="min-h-[42px] flex flex-wrap gap-1.5 p-2 border border-gray-300 rounded-md focus-within:ring-2 focus-within:ring-insite-blue focus-within:border-transparent bg-white">
      {tags.map(tag => (
        <span key={tag} className="inline-flex items-center gap-1 bg-insite-blue/10 text-insite-blue text-xs px-2 py-1 rounded-full">
          <Tag className="h-2.5 w-2.5" />
          {tag}
          <button type="button" onClick={() => removeTag(tag)} className="hover:text-red-500 transition-colors">
            <X className="h-2.5 w-2.5" />
          </button>
        </span>
      ))}
      <input
        type="text"
        value={input}
        onChange={e => setInput(e.target.value)}
        onKeyDown={e => {
          if (e.key === 'Enter' || e.key === ',') { e.preventDefault(); addTag(input); }
          if (e.key === 'Backspace' && !input && tags.length) removeTag(tags[tags.length - 1]);
        }}
        onBlur={() => addTag(input)}
        placeholder={tags.length ? '' : 'Add tags — press Enter or comma to confirm'}
        className="flex-1 min-w-[140px] text-sm outline-none bg-transparent placeholder-gray-400"
      />
    </div>
  );
};

// ─────────────────────────────────────────────
// Featured Image panel
// ─────────────────────────────────────────────
const FeaturedImagePanel = ({ t, featuredImage, onChange, authFetch }) => {
  const fileRef = useRef();
  const [urlInput, setUrlInput] = useState(featuredImage?.url || '');
  const [dragOver, setDragOver] = useState(false);
  const [uploading, setUploading] = useState(false);
  const [uploadError, setUploadError] = useState('');

  const API_BASE = process.env.NEXT_PUBLIC_API_BASE_URL || 'http://localhost:4000';

  // Keep url input in sync if parent resets
  useEffect(() => { setUrlInput(featuredImage?.url || ''); }, [featuredImage?.url]);

  const applyUrl = () => onChange({ ...featuredImage, url: urlInput.trim() });

  const handleFile = async (file) => {
    if (!file || !file.type.startsWith('image/')) return;
    setUploadError('');
    setUploading(true);
    try {
      const formData = new FormData();
      formData.append('image', file);
      const res = await authFetch(`${API_BASE}/api/upload/image`, {
        method: 'POST',
        body: formData,
      });
      const data = await res.json();
      if (!res.ok || !data.success) throw new Error(data.error || 'Upload failed.');
      onChange({ ...featuredImage, url: data.url });
      setUrlInput(data.url);
    } catch (err) {
      setUploadError(err.message);
    } finally {
      setUploading(false);
    }
  };

  return (
    <SidebarPanel title={t('editor.featuredImagePanel')} icon={ImageIcon}>
      {/* Drop zone / preview */}
      {featuredImage?.url ? (
        <div className="relative group rounded-lg overflow-hidden">
          <img
            src={featuredImage.url}
            alt={featuredImage.altText || 'Featured'}
            className="w-full h-36 object-cover rounded-lg"
            onError={e => { e.target.style.display = 'none'; }}
          />
          <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center gap-2">
            <button
              type="button"
              onClick={() => fileRef.current?.click()}
              className="p-1.5 bg-white rounded-md text-gray-700 hover:bg-gray-100"
              title="Replace"
            >
              <Upload className="h-4 w-4" />
            </button>
            <button
              type="button"
              onClick={() => { onChange({ url: '', altText: '' }); setUrlInput(''); }}
              className="p-1.5 bg-white rounded-md text-red-500 hover:bg-red-50"
              title={t('editor.featuredImageRemove')}
            >
              <Trash2 className="h-4 w-4" />
            </button>
          </div>
        </div>
      ) : (
        <div
          className={`border-2 border-dashed rounded-lg p-5 text-center cursor-pointer transition-colors ${
            uploading ? 'border-insite-blue bg-insite-blue/5 cursor-wait' :
            dragOver ? 'border-insite-blue bg-insite-blue/5' : 'border-gray-300 hover:border-insite-blue/60 hover:bg-gray-50'
          }`}
          onClick={() => !uploading && fileRef.current?.click()}
          onDragOver={e => { e.preventDefault(); setDragOver(true); }}
          onDragLeave={() => setDragOver(false)}
          onDrop={e => { e.preventDefault(); setDragOver(false); handleFile(e.dataTransfer.files[0]); }}
        >
          {uploading ? (
            <>
              <Loader2 className="h-7 w-7 mx-auto mb-2 text-insite-blue animate-spin" />
              <p className="text-xs text-insite-blue font-medium">Uploading...</p>
            </>
          ) : (
            <>
              <Upload className="h-7 w-7 mx-auto mb-2 text-gray-400" />
              <p className="text-xs text-gray-500 font-medium">{t('editor.featuredImageDrop')}</p>
              <p className="text-xs text-gray-400 mt-0.5">{t('editor.featuredImageFormats')}</p>
            </>
          )}
        </div>
      )}
      <input ref={fileRef} type="file" accept="image/*" className="hidden" onChange={e => handleFile(e.target.files[0])} />

      {uploadError && (
        <p className="text-xs text-red-500 flex items-center gap-1"><AlertCircle className="h-3 w-3" />{uploadError}</p>
      )}

      {/* URL input */}
      <Field label={t('editor.featuredImageUrl')}>
        <div className="flex gap-1">
          <input
            type="text"
            value={urlInput}
            onChange={e => setUrlInput(e.target.value)}
            onKeyDown={e => e.key === 'Enter' && applyUrl()}
            placeholder={t('editor.featuredImageUrlPlaceholder')}
            className="flex-1 px-3 py-2 border border-gray-300 rounded-md text-xs text-gray-900 bg-white focus:ring-2 focus:ring-insite-blue focus:border-transparent"
          />
          <button type="button" onClick={applyUrl} className="px-2 py-2 bg-gray-100 hover:bg-gray-200 rounded-md text-gray-600 transition-colors">
            <Check className="h-3.5 w-3.5" />
          </button>
        </div>
      </Field>

      {/* Alt text */}
      <Field label={t('editor.featuredImageAlt')}>
        <Input
          type="text"
          value={featuredImage?.altText || ''}
          onChange={e => onChange({ ...featuredImage, altText: e.target.value })}
          placeholder={t('editor.featuredImageAltPlaceholder')}
        />
      </Field>
    </SidebarPanel>
  );
};

// ─────────────────────────────────────────────
// Categories panel
// ─────────────────────────────────────────────
const CategoriesPanel = ({ t, categories, allCategories, onChange, onAddCategory }) => {
  const [newCat, setNewCat] = useState('');

  const toggle = (slug) => {
    onChange(categories.includes(slug) ? categories.filter(c => c !== slug) : [...categories, slug]);
  };

  const handleAdd = () => {
    const label = newCat.trim();
    if (!label) return;
    const slug = toSlug(label);
    onAddCategory({ slug, label });
    onChange([...categories, slug]);
    setNewCat('');
  };

  return (
    <SidebarPanel title={t('editor.categoriesPanel')} icon={Tag}>
      <div className="max-h-44 overflow-y-auto space-y-1 pr-1">
        {allCategories.map(cat => (
          <label key={cat.slug} className="flex items-center gap-2 cursor-pointer group py-0.5">
            <input
              type="checkbox"
              checked={categories.includes(cat.slug)}
              onChange={() => toggle(cat.slug)}
              className="rounded border-gray-300 text-insite-blue focus:ring-insite-blue"
            />
            <span className="text-sm text-gray-700 group-hover:text-insite-blue transition-colors">{cat.label}</span>
          </label>
        ))}
      </div>

      {/* Add new */}
      <div className="pt-2 border-t border-gray-100">
        <p className="text-xs font-medium text-gray-600 mb-1.5">{t('editor.addNewCategory')}</p>
        <div className="flex gap-1">
          <input
            type="text"
            value={newCat}
            onChange={e => setNewCat(e.target.value)}
            onKeyDown={e => e.key === 'Enter' && handleAdd()}
            placeholder={t('editor.addCategoryPlaceholder')}
            className="flex-1 px-2.5 py-1.5 border border-gray-300 rounded-md text-xs text-gray-900 bg-white focus:ring-2 focus:ring-insite-blue focus:border-transparent"
          />
          <button
            type="button"
            onClick={handleAdd}
            className="px-2.5 py-1.5 bg-insite-blue text-white rounded-md text-xs hover:bg-insite-blue/90 transition-colors flex items-center gap-1"
          >
            <Plus className="h-3 w-3" />
            {t('editor.addCategoryBtn')}
          </button>
        </div>
      </div>
    </SidebarPanel>
  );
};

// ─────────────────────────────────────────────
// Author panel
// ─────────────────────────────────────────────
const AuthorPanel = ({ t, author, onChange, authors = [] }) => {
  const [showCustom, setShowCustom] = useState(false);

  const selectAuthor = (a) => {
    onChange({ ...a, bio: author?.bio || '' });
    setShowCustom(false);
  };

  return (
    <SidebarPanel title={t('editor.authorPanel')} icon={User}>
      {/* Quick-select */}
      <div className="space-y-1.5">
        {authors.length === 0 && (
          <p className="text-xs text-gray-400 italic">No users loaded — use custom author below.</p>
        )}
        {authors.map(a => (
          <button
            key={a._id || a.slug}
            type="button"
            onClick={() => selectAuthor({ name: a.name, slug: a.slug, avatar: a.avatar || '/assets/images/team-1.jpg' })}
            className={`w-full flex items-center gap-2.5 px-2.5 py-2 rounded-lg border transition-colors text-left ${
              author?.slug === a.slug
                ? 'border-insite-blue bg-insite-blue/5'
                : 'border-gray-200 hover:border-insite-blue/50 hover:bg-gray-50'
            }`}
          >
            <img src={a.avatar || '/assets/images/team-1.jpg'} alt={a.name} className="w-7 h-7 rounded-full object-cover flex-shrink-0" />
            <div className="flex-1 min-w-0">
              <span className="text-sm text-gray-800 truncate block">{a.name}</span>
              <span className="text-xs text-gray-400 capitalize">{a.role}</span>
            </div>
            {author?.slug === a.slug && <Check className="h-3.5 w-3.5 text-insite-blue ml-auto flex-shrink-0" />}
          </button>
        ))}
        <button
          type="button"
          onClick={() => setShowCustom(!showCustom)}
          className="w-full flex items-center gap-2 px-2.5 py-2 rounded-lg border border-dashed border-gray-300 text-gray-500 hover:border-insite-blue hover:text-insite-blue transition-colors text-sm"
        >
          <Plus className="h-3.5 w-3.5" />
          Custom author
        </button>
      </div>

      {/* Custom author fields */}
      {showCustom && (
        <div className="space-y-2 pt-2 border-t border-gray-100">
          <Field label={t('editor.authorName')}>
            <Input type="text" value={author?.name || ''} onChange={e => onChange({ ...author, name: e.target.value })} placeholder={t('editor.authorNamePlaceholder')} />
          </Field>
          <Field label={t('editor.authorSlug')}>
            <Input type="text" value={author?.slug || ''} onChange={e => onChange({ ...author, slug: e.target.value })} placeholder={t('editor.authorSlugPlaceholder')} />
          </Field>
          <Field label={t('editor.authorAvatar')}>
            <Input type="text" value={author?.avatar || ''} onChange={e => onChange({ ...author, avatar: e.target.value })} placeholder={t('editor.authorAvatarPlaceholder')} />
          </Field>
        </div>
      )}

      {/* Bio — always shown */}
      <Field label={t('editor.authorBio')}>
        <Textarea
          rows={3}
          value={author?.bio || ''}
          onChange={e => onChange({ ...author, bio: e.target.value })}
          placeholder={t('editor.authorBioPlaceholder')}
        />
      </Field>
    </SidebarPanel>
  );
};

// ─────────────────────────────────────────────
// Publish panel
// ─────────────────────────────────────────────
const PublishPanel = ({ t, status, scheduledAt, isEditing, onSaveDraft, onPublish, onSchedule, onSwitchToDraft, canPublish }) => {
  const statusColors = {
    draft:     'bg-yellow-100 text-yellow-800',
    published: 'bg-green-100  text-green-800',
    scheduled: 'bg-blue-100   text-blue-800',
    archived:  'bg-gray-100   text-gray-600',
  };

  return (
    <SidebarPanel title={t('editor.publishPanel')} icon={CheckCircle2} defaultOpen={true}>
      {/* Status badge */}
      <div className="flex items-center justify-between">
        <span className="text-xs text-gray-500">{t('editor.status')}:</span>
        <span className={`text-xs font-semibold px-2 py-0.5 rounded-full ${statusColors[status] || statusColors.draft}`}>
          {t(`editor.${status}`) || status}
        </span>
      </div>

      {/* Scheduled date display */}
      {status === 'scheduled' && scheduledAt && (
        <div className="flex items-center gap-2 text-xs text-gray-500">
          <Calendar className="h-3.5 w-3.5" />
          {t('editor.scheduledFor')}:
          <span className="text-gray-700 font-medium">
            {new Date(scheduledAt).toLocaleDateString('en-US', { year: 'numeric', month: 'short', day: 'numeric', hour: '2-digit', minute: '2-digit' })}
          </span>
        </div>
      )}

      {/* Published date display */}
      {status === 'published' && (
        <div className="flex items-center gap-2 text-xs text-gray-500">
          <Calendar className="h-3.5 w-3.5" />
          {t('editor.publishDate')}:
          <span className="text-gray-700 font-medium">{t('editor.publishedNow')}</span>
        </div>
      )}

      <hr className="border-gray-100" />

      {/* Actions */}
      <div className="flex flex-col gap-2">
        {status !== 'draft' && (
          <button type="button" onClick={onSwitchToDraft}
            className="w-full px-3 py-2 border border-gray-300 text-gray-700 rounded-lg text-sm font-medium hover:bg-gray-50 transition-colors">
            {t('editor.switchToDraft')}
          </button>
        )}
        <button type="button" onClick={onSaveDraft}
          className="w-full px-3 py-2 border border-insite-blue text-insite-blue rounded-lg text-sm font-medium hover:bg-insite-blue/5 transition-colors">
          {t('editor.saveDraft')}
        </button>
        {canPublish && (
          <>
            {status === 'scheduled' ? (
              <button type="button" onClick={onSchedule}
                className="w-full px-3 py-2 bg-blue-600 text-white rounded-lg text-sm font-medium hover:bg-blue-700 transition-colors">
                {t('editor.updateSchedule')}
              </button>
            ) : (
              <button type="button" onClick={onPublish}
                className="w-full px-3 py-2 bg-insite-blue text-white rounded-lg text-sm font-medium hover:bg-insite-blue/90 transition-colors">
                {isEditing ? t('editor.updatePost') : t('editor.publishNow')}
              </button>
            )}
          </>
        )}
      </div>
    </SidebarPanel>
  );
};

// ─────────────────────────────────────────────
// SEO panel (per-language, collapsible)
// ─────────────────────────────────────────────
const SeoPanel = ({ t, seo, onChange, title, lang }) => {
  const metaTitle = seo?.metaTitle || '';
  const metaDesc  = seo?.metaDescription || '';
  const focus     = seo?.focusKeyword || '';

  const displayTitle = metaTitle || title || 'Post title will appear here';
  const displayDesc  = metaDesc  || 'Meta description will appear here — keep it under 160 characters for best results.';
  const descLen      = metaDesc.length;
  const descColor    = descLen > 160 ? 'text-red-500' : descLen > 130 ? 'text-yellow-500' : 'text-green-600';

  return (
    <SidebarPanel title={`${t('editor.seoPanel')} (${lang})`} icon={Search} defaultOpen={false}>
      {/* Google preview */}
      <div className="bg-gray-50 border border-gray-200 rounded-lg p-3">
        <p className="text-xs text-gray-400 mb-2 font-medium uppercase tracking-wide">{t('editor.seoPreview')}</p>
        <p className="text-blue-700 text-sm font-medium leading-tight line-clamp-1">{displayTitle}</p>
        <p className="text-green-700 text-xs mt-0.5">https://yoursite.com/blog/...</p>
        <p className="text-gray-600 text-xs mt-1 line-clamp-2">{displayDesc}</p>
      </div>

      <Field label={t('editor.metaTitle')}>
        <Input
          type="text"
          value={metaTitle}
          onChange={e => onChange({ ...seo, metaTitle: e.target.value })}
          placeholder={t('editor.metaTitlePlaceholder')}
          maxLength={70}
        />
        <p className="text-xs text-gray-400 mt-1">{metaTitle.length}/70 characters</p>
      </Field>

      <Field label={t('editor.metaDescription')}>
        <Textarea
          rows={3}
          value={metaDesc}
          onChange={e => onChange({ ...seo, metaDescription: e.target.value })}
          placeholder={t('editor.metaDescriptionPlaceholder')}
          maxLength={200}
        />
        <p className={`text-xs mt-1 ${descColor}`}>{descLen}/160 recommended</p>
      </Field>

      <Field label={t('editor.focusKeyword')}>
        <Input
          type="text"
          value={focus}
          onChange={e => onChange({ ...seo, focusKeyword: e.target.value })}
          placeholder={t('editor.focusKeywordPlaceholder')}
        />
      </Field>
    </SidebarPanel>
  );
};

// ─────────────────────────────────────────────
// Permalink bar
// ─────────────────────────────────────────────
const PermalinkBar = ({ t, slug, onChange }) => {
  const [editing, setEditing] = useState(false);
  const [draft, setDraft] = useState(slug);

  useEffect(() => { setDraft(slug); }, [slug]);

  const commit = () => {
    onChange(toSlug(draft));
    setEditing(false);
  };

  return (
    <div className="flex items-center gap-2 text-xs text-gray-500 mt-1.5">
      <Link2 className="h-3.5 w-3.5 flex-shrink-0" />
      <span className="flex-shrink-0">Permalink:</span>
      <span className="text-gray-400 flex-shrink-0">/blog/</span>
      {editing ? (
        <>
          <input
            type="text"
            value={draft}
            onChange={e => setDraft(e.target.value)}
            onKeyDown={e => { if (e.key === 'Enter') commit(); if (e.key === 'Escape') setEditing(false); }}
            autoFocus
            className="flex-1 border-b border-insite-blue outline-none text-gray-800 bg-transparent min-w-0"
          />
          <button type="button" onClick={commit} className="text-insite-blue font-medium hover:underline flex-shrink-0">
            {t('editor.permalinkDone')}
          </button>
        </>
      ) : (
        <>
          <span className="text-gray-700 font-medium truncate">{slug || '(auto-generated)'}</span>
          <button type="button" onClick={() => setEditing(true)} className="text-insite-blue hover:underline flex-shrink-0">
            {t('editor.permalinkEdit')}
          </button>
        </>
      )}
    </div>
  );
};

// ─────────────────────────────────────────────
// Main component
// ─────────────────────────────────────────────
const MultiLanguageBlogEditor = ({ initialData, onSave, onCancel, isEditing, canPublish = false }) => {
  const { t } = useTranslation();
  const { authFetch } = useAuth();

  // ── Real authors from API ──
  const [authors, setAuthors] = useState([]);
  useEffect(() => {
    authFetch(`${process.env.NEXT_PUBLIC_API_BASE_URL || 'http://localhost:4000'}/api/auth/users`)
      .then(r => r.json())
      .then(d => { if (d.success) setAuthors(d.data); })
      .catch(() => {}); // fail silently — custom author entry still works
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // ── Language-specific content ──
  const [currentLangCode, setCurrentLangCode] = useState('en');
  const [langContent, setLangContent] = useState(
    initialData?.content || { en: { title: '', excerpt: '', body: '', tags: [], slug: '', seo: { metaTitle: '', metaDescription: '', focusKeyword: '' } } }
  );

  // ── Global post fields ──
  const [status,        setStatus]        = useState(initialData?.status        || 'draft');
  const [scheduledAt,   setScheduledAt]   = useState(initialData?.scheduledAt   || null);
  const [featuredImage, setFeaturedImage] = useState(initialData?.featuredImage || { url: '', altText: '' });
  const [categories,    setCategories]    = useState(initialData?.categories    || []);
  const [allCategories, setAllCategories] = useState(PREDEFINED_CATEGORIES);
  const [author,        setAuthor]        = useState(initialData?.author        || null);

  // Sync when parent loads data (e.g. after async fetch)
  useEffect(() => {
    if (initialData?.content) setLangContent(initialData.content);
    if (initialData?.status)  setStatus(initialData.status);
    if (initialData?.featuredImage) setFeaturedImage(initialData.featuredImage);
    if (initialData?.categories)    setCategories(initialData.categories);
    if (initialData?.author)        setAuthor(initialData.author);
    if (initialData?.scheduledAt)   setScheduledAt(initialData.scheduledAt);
  }, [initialData]);

  // Fetch categories from API and merge with predefined list
  useEffect(() => {
    const API_BASE = process.env.NEXT_PUBLIC_API_BASE_URL || 'http://localhost:4000';
    fetch(`${API_BASE}/api/blog/categories`)
      .then(r => r.json())
      .then(data => {
        if (data.success && Array.isArray(data.categories) && data.categories.length > 0) {
          const existing = new Set(PREDEFINED_CATEGORIES.map(c => c.slug));
          const extras = data.categories
            .filter(slug => !existing.has(slug))
            .map(slug => ({ slug, label: slug.replace(/-/g, ' ').replace(/\w/g, c => c.toUpperCase()) }));
          if (extras.length > 0) setAllCategories([...PREDEFINED_CATEGORIES, ...extras]);
        }
      })
      .catch(() => {}); // silently fall back to PREDEFINED_CATEGORIES
  }, []);

  // ── Helpers ──
  const addLang = (code) => setLangContent(prev => ({
    ...prev,
    [code]: { title: '', excerpt: '', body: '', tags: [], slug: '', seo: { metaTitle: '', metaDescription: '', focusKeyword: '' } }
  }));

  const removeLang = (code) => {
    if (code === 'en') return;
    const next = { ...langContent };
    delete next[code];
    setLangContent(next);
    if (currentLangCode === code) setCurrentLangCode('en');
  };

  const updateLangField = useCallback((field, value) => {
    setLangContent(prev => ({
      ...prev,
      [currentLangCode]: { ...prev[currentLangCode], [field]: value }
    }));
  }, [currentLangCode]);

  // Auto-generate slug from title (English only, only if slug is still empty)
  const handleTitleChange = (val) => {
    updateLangField('title', val);
    if (currentLangCode === 'en' && !langContent.en?.slug) {
      updateLangField('slug', toSlug(val));
    }
  };

  const buildPayload = (overrideStatus) => ({
    ...initialData,
    status:      overrideStatus ?? status,
    scheduledAt: (overrideStatus ?? status) === 'scheduled' ? scheduledAt : null,
    featuredImage,
    categories,
    author,
    content: langContent,
  });

  const handleSaveDraft   = () => { setStatus('draft');     onSave(buildPayload('draft')); };
  const handlePublish     = () => { setStatus('published'); onSave(buildPayload('published')); };
  const handleSchedule    = () => { setStatus('scheduled'); onSave(buildPayload('scheduled')); };
  const handleSwitchDraft = () => { setStatus('draft');     onSave(buildPayload('draft')); };

  const availLangs    = Object.keys(langContent);
  const unaddedLangs  = supportedLanguages.filter(l => !availLangs.includes(l.code));
  const current       = langContent[currentLangCode] || { title: '', excerpt: '', body: '', tags: [], slug: '', seo: {} };
  const currentLang   = supportedLanguages.find(l => l.code === currentLangCode);

  return (
    <div className="min-h-screen bg-gray-50">
      {/* ── Language tabs bar ── */}
      <div className="bg-white border-b border-gray-200 sticky top-0 z-20 shadow-sm">
        <div className="max-w-screen-xl mx-auto px-4 sm:px-6 py-3 flex flex-wrap items-center gap-2">
          <Globe className="h-4 w-4 text-insite-blue flex-shrink-0" />

          {availLangs.map(code => {
            const lang = supportedLanguages.find(l => l.code === code);
            const hasContent = !!(langContent[code]?.title);
            return (
              <button
                key={code}
                type="button"
                onClick={() => setCurrentLangCode(code)}
                className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full text-sm font-medium border transition-all ${
                  currentLangCode === code
                    ? 'bg-insite-blue text-white border-insite-blue shadow-sm'
                    : 'bg-white text-gray-700 border-gray-300 hover:border-insite-blue/60 hover:bg-gray-50'
                }`}
              >
                <span>{lang?.flag}</span>
                <span>{lang?.name}</span>
                {hasContent && currentLangCode !== code && (
                  <span className="w-1.5 h-1.5 bg-green-400 rounded-full" title="Has content" />
                )}
                {code !== 'en' && (
                  <span
                    role="button"
                    tabIndex={0}
                    onClick={e => { e.stopPropagation(); removeLang(code); }}
                    onKeyDown={e => e.key === 'Enter' && removeLang(code)}
                    className="opacity-60 hover:opacity-100 cursor-pointer ml-0.5"
                  >
                    <X className="h-3 w-3" />
                  </span>
                )}
              </button>
            );
          })}

          {unaddedLangs.length > 0 && (
            <select
              defaultValue=""
              onChange={e => {
                if (e.target.value) { addLang(e.target.value); setCurrentLangCode(e.target.value); e.target.value = ''; }
              }}
              className="px-3 py-1.5 border border-dashed border-gray-400 rounded-full text-sm text-gray-500 bg-white hover:border-insite-blue hover:text-insite-blue cursor-pointer focus:outline-none transition-colors"
            >
              <option value="" disabled>+ Add Language</option>
              {unaddedLangs.map(l => (
                <option key={l.code} value={l.code}>{l.flag} {l.name}</option>
              ))}
            </select>
          )}

          <div className="ml-auto flex items-center gap-2 text-xs text-gray-400 flex-shrink-0">
            <span>{availLangs.length}/{supportedLanguages.length} languages</span>
            <span className={`px-2 py-0.5 rounded-full font-medium ${
              status === 'published' ? 'bg-green-100 text-green-700' :
              status === 'scheduled' ? 'bg-blue-100  text-blue-700'  :
              'bg-yellow-100 text-yellow-700'
            }`}>{t(`editor.${status}`) || status}</span>
          </div>
        </div>
      </div>

      {/* ── Main layout ── */}
      <div className="max-w-screen-xl mx-auto px-4 sm:px-6 py-6 sm:py-8 flex flex-col lg:flex-row gap-6 lg:gap-7 items-start">

        {/* ════ LEFT — main content ════ */}
        <div className="flex-1 min-w-0 space-y-5">

          {/* Title + permalink */}
          <div className="bg-white rounded-xl border border-gray-200 p-6">
            <input
              type="text"
              value={current.title}
              onChange={e => handleTitleChange(e.target.value)}
              placeholder="Add title"
              className="w-full text-2xl font-bold text-gray-900 placeholder-gray-300 border-0 outline-none focus:ring-0 bg-transparent"
            />
            <PermalinkBar
              t={t}
              slug={current.slug}
              onChange={val => updateLangField('slug', val)}
            />
          </div>

          {/* Rich text body */}
          <div className="bg-white rounded-xl border border-gray-200 overflow-hidden">
            <div className="px-4 pt-3 pb-1 border-b border-gray-100">
              <span className="text-xs font-semibold uppercase tracking-wide text-gray-400">
                {currentLang?.flag} {currentLang?.name} — Content
              </span>
            </div>
            <div className="p-4">
              <RichTextEditor
                key={currentLangCode}
                content={current.body}
                onChange={val => updateLangField('body', val)}
                placeholder={t('editor.contentPlaceholder')}
              />
            </div>
          </div>

          {/* Excerpt */}
          <div className="bg-white rounded-xl border border-gray-200 p-5">
            <label className="block text-sm font-semibold text-gray-800 mb-2">
              {t('editor.excerpt')}
              <span className="ml-1 text-xs font-normal text-gray-400">— shown in listings &amp; search results</span>
            </label>
            <Textarea
              rows={3}
              value={current.excerpt}
              onChange={e => updateLangField('excerpt', e.target.value)}
              placeholder={t('editor.excerptPlaceholder')}
            />
          </div>

          {/* Tags */}
          <div className="bg-white rounded-xl border border-gray-200 p-5">
            <label className="block text-sm font-semibold text-gray-800 mb-2">
              {t('editor.tags')}
            </label>
            <TagInput
              tags={current.tags || []}
              onChange={val => updateLangField('tags', val)}
            />
          </div>

          {/* SEO panel (per-language, inside main column) */}
          <SeoPanel
            t={t}
            seo={current.seo}
            onChange={val => updateLangField('seo', val)}
            title={current.title}
            lang={currentLang?.name}
          />

          {/* Translation tips */}
          <div className="bg-blue-50 border border-blue-100 rounded-xl p-4">
            <p className="text-xs font-semibold text-blue-800 mb-1.5 flex items-center gap-1.5">
              <AlertCircle className="h-3.5 w-3.5" />
              {t('editor.translationTips')}
            </p>
            <ul className="text-xs text-blue-700 space-y-0.5">
              <li>• {t('editor.tip1')}</li>
              <li>• {t('editor.tip2')}</li>
              <li>• {t('editor.tip3')}</li>
            </ul>
          </div>
        </div>

        {/* ════ RIGHT — sticky sidebar ════ */}
        <div className="w-full lg:w-72 lg:flex-shrink-0 space-y-4 lg:sticky lg:top-[72px] order-first lg:order-last">

          {/* Publish */}
          <PublishPanel
            t={t}
            status={status}
            scheduledAt={scheduledAt}
            isEditing={isEditing}
            canPublish={canPublish}
            onSaveDraft={handleSaveDraft}
            onPublish={handlePublish}
            onSchedule={handleSchedule}
            onSwitchToDraft={handleSwitchDraft}
          />

          {/* Cancel */}
          {onCancel && (
            <button
              type="button"
              onClick={onCancel}
              className="w-full px-3 py-2 border border-gray-300 text-gray-600 rounded-lg text-sm font-medium hover:bg-gray-100 transition-colors"
            >
              {t('common.cancel')}
            </button>
          )}

          {/* Featured Image */}
          <FeaturedImagePanel
            t={t}
            featuredImage={featuredImage}
            onChange={setFeaturedImage}
            authFetch={authFetch}
          />

          {/* Categories */}
          <CategoriesPanel
            t={t}
            categories={categories}
            allCategories={allCategories}
            onChange={setCategories}
            onAddCategory={cat => setAllCategories(prev => [...prev, cat])}
          />

          {/* Author */}
          <AuthorPanel
            t={t}
            author={author}
            onChange={setAuthor}
            authors={authors}
          />

          {/* Publish date (shown when scheduling) */}
          <SidebarPanel title={t('editor.schedulePanel')} icon={Calendar} defaultOpen={false}>
            <Field label={t('editor.publishStatus')}>
              <select
                value={status}
                onChange={e => setStatus(e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-md text-sm focus:ring-2 focus:ring-insite-blue focus:border-transparent"
              >
                <option value="draft">{t('editor.draft')}</option>
                {canPublish && <option value="published">{t('editor.published')}</option>}
                {canPublish && <option value="scheduled">{t('editor.scheduled')}</option>}
                <option value="archived">{t('editor.archived')}</option>
              </select>
            </Field>

            {status === 'scheduled' && (
              <>
                <Field label={t('editor.scheduledFor')}>
                  <input
                    type="datetime-local"
                    min={new Date(Date.now() + 60000).toISOString().slice(0, 16)}
                    value={scheduledAt ? new Date(scheduledAt).toISOString().slice(0, 16) : ''}
                    onChange={e => setScheduledAt(e.target.value ? new Date(e.target.value) : null)}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md text-sm focus:ring-2 focus:ring-insite-blue focus:border-transparent"
                  />
                </Field>
                {canPublish && (
                  <button
                    type="button"
                    onClick={handleSchedule}
                    disabled={!scheduledAt}
                    className="w-full px-3 py-2 bg-blue-600 text-white rounded-lg text-sm font-medium hover:bg-blue-700 transition-colors disabled:opacity-40 disabled:cursor-not-allowed"
                  >
                    {t('editor.schedulePost')}
                  </button>
                )}
              </>
            )}
          </SidebarPanel>

        </div>
      </div>
    </div>
  );
};

export default MultiLanguageBlogEditor;
