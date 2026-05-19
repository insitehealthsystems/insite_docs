import React, { useState, useEffect } from 'react';
import { useNavigate, useParams, Link } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import { useTranslation } from 'react-i18next';
import { toast } from 'sonner';
import MultiLanguageBlogEditor from '../components/MultiLanguageBlogEditor';
import { ArrowLeft } from 'lucide-react';

const API_BASE = import.meta.env.VITE_API_BASE_URL || 'http://localhost:4000';

const EMPTY_LANG_CONTENT = {
  title: '',
  excerpt: '',
  body: '',
  tags: [],
  slug: '',
  seo: { metaTitle: '', metaDescription: '', focusKeyword: '' },
};

const BlogEditor = () => {
  const { t } = useTranslation();
  const { id } = useParams();
  const navigate = useNavigate();
  const { user, authFetch } = useAuth();
  const [initialData, setInitialData] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);

  useEffect(() => {
    const loadPost = async () => {
      setIsLoading(true);

      if (id) {
        try {
          const res = await authFetch(`${API_BASE}/api/blog/posts/id/${id}`);
          const data = await res.json();

          if (res.ok && data.success) {
            setInitialData(data.data);
            setIsLoading(false);
            return;
          }
        } catch (err) {
          console.error('Failed to load post:', err.message);
        }
      }

      // New post scaffold
      setInitialData({
        content: { en: { ...EMPTY_LANG_CONTENT } },
        status: 'draft',
        publishedAt: null,
        featuredImage: { url: '', altText: '' },
        categories: [],
        author: {
          name: user?.name || '',
          slug: user?.slug || '',
          avatar: user?.avatar || '/assets/images/team-1.jpg',
          bio: '',
        },
      });
      setIsLoading(false);
    };

    loadPost();
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [id, user]);

  const handleSave = async (updatedPost) => {
    setIsSaving(true);

    try {
      const endpoint = id
        ? `${API_BASE}/api/blog/posts/${id}`
        : `${API_BASE}/api/blog/posts`;
      const method = id ? 'PUT' : 'POST';

      // Derive slug from EN title if not set
      const slug =
        updatedPost.slug ||
        (updatedPost.content?.en?.title || '')
          .toLowerCase()
          .replace(/[^a-z0-9\s-]/g, '')
          .trim()
          .replace(/\s+/g, '-');

      const res = await authFetch(endpoint, {
        method,
        body: JSON.stringify({ ...updatedPost, slug }),
      });

      const data = await res.json();

      if (!res.ok || !data.success) {
        throw new Error(data.error || 'Save failed.');
      }

      const savedStatus = updatedPost.status;

      if (savedStatus === 'scheduled' && updatedPost.scheduledAt) {
        const fmt = new Date(updatedPost.scheduledAt).toLocaleString('en-US', {
          month: 'short', day: 'numeric', year: 'numeric',
          hour: '2-digit', minute: '2-digit',
        });
        toast.success(`Post scheduled — publishing ${fmt}`);
        // Stay on editor so the user can keep tweaking
      } else if (savedStatus === 'published') {
        toast.success(id ? 'Post updated and published.' : 'Post published successfully.');
        navigate('/blog/manage');
      } else if (savedStatus === 'draft') {
        toast.success('Draft saved.');
        // Stay on editor
      } else if (savedStatus === 'archived') {
        toast.success('Post archived.');
        navigate('/blog/manage');
      } else {
        navigate('/blog/manage');
      }
    } catch (err) {
      toast.error(err.message || 'Something went wrong. Please try again.');
    } finally {
      setIsSaving(false);
    }
  };

  const handleCancel = () => navigate('/blog/manage');

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-insite-blue mx-auto mb-4" />
          <p className="text-gray-600">{t('common.loading')}</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Top nav bar */}
      <div className="bg-white shadow-sm border-b">
        <div className="container-custom py-3">
          <div className="flex items-center justify-between gap-3">
            <div className="flex items-center gap-2 sm:gap-4 min-w-0">
              <Link
                to="/blog/manage"
                className="flex items-center text-gray-600 hover:text-insite-blue transition-colors text-sm flex-shrink-0"
              >
                <ArrowLeft className="h-4 w-4 mr-1" />
                <span className="hidden sm:inline">{t('common.back')}</span>
              </Link>
              <span className="h-4 w-px bg-gray-300 hidden sm:block" />
              <h1 className="text-base sm:text-lg font-bold text-gray-900 truncate">
                {id ? t('blog.editPost') : t('blog.newPost')}
              </h1>
              {isSaving && (
                <span className="text-sm text-gray-500 animate-pulse hidden sm:inline">Saving...</span>
              )}
            </div>
            <button
              type="button"
              onClick={handleCancel}
              className="text-sm text-gray-600 hover:text-gray-900 border border-gray-300 px-4 py-1.5 rounded-lg transition-colors"
            >
              {t('common.cancel')}
            </button>
          </div>
        </div>
      </div>

      {/* Editor */}
      <MultiLanguageBlogEditor
        key={initialData?._id || 'new'}
        initialData={initialData}
        onSave={handleSave}
        onCancel={handleCancel}
        isEditing={!!id}
        canPublish={user?.role === 'editor' || user?.role === 'admin'}
      />
    </div>
  );
};

export default BlogEditor;
