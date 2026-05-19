'use client'
import Link from 'next/link'
import React, { useState, useEffect } from 'react';
import { useParams } from 'next/navigation';
import { useTranslation } from 'react-i18next';
import { useBlogContent } from '../contexts/BlogContentContext';
import { Calendar, User, Clock, ChevronRight, Tag, MessageCircle, ArrowLeft } from 'lucide-react';

const API_BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL || 'http://localhost:4000';

// Normalise API post so getTranslatedPost can read content.en.content
const normalisePost = (raw) => {
  if (!raw) return null;
  const patched = { ...raw };
  if (patched.content?.en) {
    patched.content = {
      ...patched.content,
      en: {
        ...patched.content.en,
        content: patched.content.en.content ?? patched.content.en.body ?? '',
      },
    };
  }
  patched.id = raw._id || raw.id;
  patched.publishDate = raw.publishedAt || raw.publishDate;
  return patched;
};

// Category slug → i18n key mapping
const CATEGORY_KEYS = {
  'healthcare-technology': 'blog.categories.healthcareTech',
  'ai-ml': 'blog.categories.aiMl',
  'digital-health': 'blog.categories.digitalHealth',
  'telemedicine': 'blog.categories.telemedicine',
  'compliance': 'blog.categories.compliance',
  'asset-management': 'blog.categories.assetManagement',
  'data-analytics': 'blog.categories.dataAnalytics',
  'mobile-health': 'blog.categories.mobileHealth',
  'patient-safety': 'blog.categories.patientSafety',
  'healthcare-economics': 'blog.categories.healthcareEconomics',
  'case-study': 'blog.categories.caseStudy',
  'technology': 'blog.categories.technology',
};

const BlogPostCard = ({ rawPost, getTranslatedPost, currentLanguage, formatDate, t }) => {
  const [post, setPost] = useState(() => {
    const en = rawPost.content?.en || {};
    return {
      ...rawPost,
      title: en.title || '',
      excerpt: en.excerpt || '',
      tags: en.tags || [],
    };
  });

  useEffect(() => {
    let cancelled = false;
    getTranslatedPost(rawPost, currentLanguage).then((translated) => {
      if (!cancelled && translated) setPost(translated);
    });
    return () => { cancelled = true; };
  }, [currentLanguage]); // eslint-disable-line react-hooks/exhaustive-deps

  return (
    <article className="bg-white rounded-xl shadow-lg hover:shadow-xl transition-all duration-300 overflow-hidden group">
      <div className="relative overflow-hidden">
        {(post.featuredImage?.url || post.featuredImage) && (
          <img
            src={post.featuredImage?.url || post.featuredImage}
            alt={post.featuredImage?.altText || post.title}
            className="w-full h-56 object-cover group-hover:scale-105 transition-transform duration-300"
          />
        )}
        <div className="absolute top-4 left-4 flex flex-wrap gap-1">
          {(post.categories || []).map((cat, i) => (
            <span key={i} className="bg-insite-blue text-white px-3 py-1 text-xs font-semibold rounded-full">
              {cat}
            </span>
          ))}
        </div>
      </div>
      <div className="p-6">
        <div className="flex items-center text-sm text-gray-500 mb-3 space-x-4">
          <div className="flex items-center">
            <User className="h-4 w-4 mr-1" />
            <span>{post.author?.name}</span>
          </div>
          <div className="flex items-center">
            <Calendar className="h-4 w-4 mr-1" />
            <span>{formatDate(post.publishDate)}</span>
          </div>
          {post.readTime && (
            <div className="flex items-center">
              <Clock className="h-4 w-4 mr-1" />
              <span>{post.readTime}</span>
            </div>
          )}
        </div>
        <h3 className="text-xl font-bold text-gray-900 mb-3 group-hover:text-insite-blue transition-colors leading-tight">
          <Link href={`/blog/${post.slug}`}>{post.title}</Link>
        </h3>
        <p className="text-gray-600 mb-4 leading-relaxed">{post.excerpt}</p>
        <div className="flex items-center justify-between">
          <Link
            to={`/blog/${post.slug}`}
            className="inline-flex items-center text-insite-blue font-semibold hover:text-insite-blue/80 transition-colors group"
          >
            {t('blog.readMore', 'Read More')}
            <ChevronRight className="ml-1 h-4 w-4 group-hover:translate-x-1 transition-transform" />
          </Link>
          <div className="flex items-center text-gray-500 text-sm">
            <MessageCircle className="h-4 w-4 mr-1" />
            <span>{post.commentCount || 0} {t('blog.comments', 'comments')}</span>
          </div>
        </div>
      </div>
    </article>
  );
};

const BlogCategory = () => {
  const { name } = useParams();
  const { t, i18n } = useTranslation();
  const { getTranslatedPost, currentLanguage } = useBlogContent();

  const [posts, setPosts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);

  const normalizedSlug = (name || '').toLowerCase().replace(/\s+/g, '-');
  const categoryKey = CATEGORY_KEYS[normalizedSlug];
  const displayName = categoryKey
    ? t(categoryKey)
    : name?.replace(/-/g, ' ').replace(/\w/g, (c) => c.toUpperCase()) || 'Category';

  const formatDate = (date) => {
    if (!date) return '';
    const d = date instanceof Date ? date : new Date(date);
    return d.toLocaleDateString(i18n.language, { year: 'numeric', month: 'long', day: 'numeric' });
  };

  useEffect(() => {
    let cancelled = false;
    setLoading(true);
    setError(false);

    fetch(`${API_BASE_URL}/api/blog/posts?category=${encodeURIComponent(name)}&status=published&limit=50`)
      .then((res) => res.ok ? res.json() : Promise.reject())
      .then(async (data) => {
        if (cancelled) return;
        const raw = (data.data || data.posts || []).map(normalisePost).filter(Boolean);
        const translated = await Promise.all(
          raw.map((p) => getTranslatedPost(p, currentLanguage))
        );
        if (!cancelled) {
          setPosts(translated.filter(Boolean));
          setLoading(false);
        }
      })
      .catch(() => {
        if (!cancelled) {
          setError(true);
          setLoading(false);
        }
      });

    return () => { cancelled = true; };
  }, [name, currentLanguage]); // eslint-disable-line react-hooks/exhaustive-deps

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-insite-blue py-16">
        <div className="container-custom">
          <div className="text-center">
            <h1 className="text-4xl md:text-5xl font-bold text-white mb-4">{displayName}</h1>
            <div className="flex items-center justify-center space-x-2 text-white/90">
              <Link href="/" className="hover:text-white transition-colors">{t('nav.home', 'Home')}</Link>
              <span>/</span>
              <Link href="/blog" className="hover:text-white transition-colors">{t('nav.blog', 'Blog')}</Link>
              <span>/</span>
              <span className="text-insite-cyan">{displayName}</span>
            </div>
            {!loading && !error && (
              <p className="text-white/80 mt-4">
                {t('blog.articleCount', { count: posts.length })}
              </p>
            )}
          </div>
        </div>
      </div>

      {/* Posts Grid */}
      <div className="container-custom py-12">
        <div className="mb-6">
          <Link
            to="/blog"
            className="inline-flex items-center text-insite-blue font-semibold hover:text-insite-blue/80 transition-colors"
          >
            <ArrowLeft className="h-4 w-4 mr-2" />
            {t('blog.backToAllPosts')}
          </Link>
        </div>

        {loading ? (
          <div className="flex items-center justify-center py-20">
            <div className="text-center">
              <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-insite-blue mx-auto mb-4"></div>
              <p className="text-gray-600">{t('common.loading')}</p>
            </div>
          </div>
        ) : error ? (
          <div className="text-center py-20">
            <p className="text-red-500 text-lg">{t('blog.failedToLoad')}</p>
          </div>
        ) : posts.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {posts.map((rawPost) => (
              <BlogPostCard
                key={rawPost.id || rawPost._id}
                rawPost={rawPost}
                getTranslatedPost={getTranslatedPost}
                currentLanguage={currentLanguage}
                formatDate={formatDate}
                t={t}
              />
            ))}
          </div>
        ) : (
          <div className="text-center py-20">
            <Tag className="h-16 w-16 text-gray-300 mx-auto mb-4" />
            <h2 className="text-2xl font-bold text-gray-700 mb-2">{t('blog.noPostsFound')}</h2>
            <p className="text-gray-500 mb-8">
              {t('blog.noPostsInCategoryDesc', { name: displayName })}
            </p>
            <Link
              to="/blog"
              className="bg-insite-blue text-white px-8 py-3 rounded-lg font-semibold hover:bg-insite-blue/90 transition-colors inline-flex items-center gap-2"
            >
              <ArrowLeft className="h-4 w-4" />
              {t('blog.browseAllPosts')}
            </Link>
          </div>
        )}
      </div>
    </div>
  );
};

export default BlogCategory;
