'use client'
import { useState, useEffect } from 'react';
import Link from 'next/link';
import { Calendar, Clock, ArrowRight, User } from 'lucide-react';
import { useTranslation } from 'react-i18next';
import { submitNewsletter } from '../utils/api';

const API_BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL || 'http://localhost:4000';

const Blog = () => {
  const { t, i18n } = useTranslation();
  const [activeCategory, setActiveCategory] = useState('all');
  const [newsletterEmail, setNewsletterEmail] = useState('');
  const [newsletterStatus, setNewsletterStatus] = useState(null); // null | 'loading' | 'success' | 'error'
  const [blogPosts, setBlogPosts] = useState([]);
  const [postsLoading, setPostsLoading] = useState(true);

  useEffect(() => {
    setPostsLoading(true);
    fetch(`${API_BASE_URL}/api/blog/posts?status=published&limit=4`)
      .then((res) => res.ok ? res.json() : null)
      .then((data) => {
        if (!data) return;
        const posts = (data.data || data.posts || []).map((p, i) => ({
          id: p._id || p.id,
          slug: p.slug,
          title: p.content?.en?.title || p.title || '',
          excerpt: p.content?.en?.excerpt || p.excerpt || '',
          image: p.featuredImage?.url || p.featuredImage || `/assets/images/themex-blog-${(i % 4) + 1}.jpg`,
          category: (p.categories || [])[0] || 'general',
          categoryLabel: (p.categories || [])[0] || 'General',
          author: p.author?.name || 'InSite Team',
          date: p.publishedAt
            ? new Date(p.publishedAt).toLocaleDateString(i18n.language, { year: 'numeric', month: 'long', day: 'numeric' })
            : '',
          readTime: p.readTime || '',
          featured: i === 0,
        }));
        setBlogPosts(posts);
      })
      .catch(() => {})
      .finally(() => setPostsLoading(false));
  }, []);

  const categories = [
    { slug: 'all', label: t('blog.allPosts', 'All Posts') },
    { slug: 'patient-safety', label: t('blog.categories.patientSafety', 'Patient Safety') },
    { slug: 'healthcare-economics', label: t('blog.categories.healthcareEconomics', 'Healthcare Economics') },
    { slug: 'compliance', label: t('blog.categories.compliance', 'Compliance') },
    { slug: 'case-study', label: t('blog.categories.caseStudy', 'Case Study') },
    { slug: 'technology', label: t('blog.categories.technology', 'Technology') },
  ];

  const displayedPosts = activeCategory === 'all'
    ? blogPosts
    : blogPosts.filter((p) => p.category === activeCategory);

  const featuredPost = displayedPosts.find((p) => p.featured);
  const gridPosts = displayedPosts.filter((p) => !p.featured);

  const handleNewsletterSubmit = async (e) => {
    e.preventDefault();
    if (!newsletterEmail) return;
    setNewsletterStatus('loading');
    try {
      await submitNewsletter({ email: newsletterEmail });
      setNewsletterStatus('success');
      setNewsletterEmail('');
      setTimeout(() => setNewsletterStatus(null), 5000);
    } catch {
      setNewsletterStatus('error');
      setTimeout(() => setNewsletterStatus(null), 5000);
    }
  };

  return (
    <section className="section-padding bg-white">
      <div className="container-custom">
        <div className="text-center mb-16">
          <h2 className="text-3xl md:text-4xl font-bold text-gray-800 mb-4">
            {t('blog.title', 'Healthcare Technology Insights')}
          </h2>
          <p className="text-lg text-gray-600 max-w-3xl mx-auto">
            {t('blog.subtitle', 'Stay informed with the latest trends, best practices, and innovations in healthcare technology and equipment management.')}
          </p>
        </div>

        {/* Category Filter */}
        <div className="flex flex-wrap justify-center gap-3 mb-12">
          {categories.map((category) => (
            <button
              key={category.slug}
              onClick={() => setActiveCategory(category.slug)}
              className={`px-6 py-3 rounded-full font-medium transition-all duration-200 ${
                activeCategory === category.slug
                  ? 'bg-insite-blue text-white shadow-md'
                  : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
              }`}
            >
              {category.label}
            </button>
          ))}
        </div>

        {/* Featured Post */}
        {postsLoading ? (
          <div className="mb-16 animate-pulse">
            <div className="bg-gray-200 rounded-2xl h-64 lg:h-80 w-full" />
          </div>
        ) : featuredPost && (
          <div className="mb-16">
            <div className="bg-gradient-to-r from-insite-blue to-insite-cyan rounded-2xl p-2">
              <div className="bg-white rounded-xl overflow-hidden">
                <div className="lg:flex">
                  <div className="lg:w-1/2">
                    <img
                      src={featuredPost.image}
                      alt={featuredPost.title}
                      className="w-full h-64 lg:h-full object-cover"
                      onError={(e) => {
                        e.target.style.display = 'none';
                        e.target.nextElementSibling.style.display = 'flex';
                      }}
                    />
                    <div className="w-full h-64 lg:h-full bg-gradient-to-br from-insite-blue to-insite-cyan hidden items-center justify-center text-white text-4xl font-bold">
                      {t('blog.featured')}
                    </div>
                  </div>
                  <div className="lg:w-1/2 p-8 lg:p-12 flex flex-col justify-center">
                    <div className="flex items-center gap-4 mb-4">
                      <span className="bg-insite-orange text-white px-3 py-1 rounded-full text-sm font-medium">
                        {t('blog.featured', 'Featured')}
                      </span>
                      <span className="bg-insite-blue/10 text-insite-blue px-3 py-1 rounded-full text-sm font-medium">
                        {featuredPost.categoryLabel}
                      </span>
                    </div>
                    <h3 className="text-2xl lg:text-3xl font-bold text-gray-800 mb-4 leading-tight">
                      {featuredPost.title}
                    </h3>
                    <p className="text-gray-600 leading-relaxed mb-6">
                      {featuredPost.excerpt}
                    </p>
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-4 text-sm text-gray-500">
                        <div className="flex items-center gap-2">
                          <User size={16} />
                          <span>{featuredPost.author}</span>
                        </div>
                        <div className="flex items-center gap-2">
                          <Calendar size={16} />
                          <span>{featuredPost.date}</span>
                        </div>
                        <div className="flex items-center gap-2">
                          <Clock size={16} />
                          <span>{featuredPost.readTime}</span>
                        </div>
                      </div>
                      <Link
                        to={`/blog/${featuredPost.slug}`}
                        className="inline-flex items-center gap-2 text-insite-blue font-semibold hover:text-insite-cyan transition-colors duration-200"
                      >
                        {t('blog.readMore', 'Read More')}
                        <ArrowRight size={16} />
                      </Link>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Blog Grid */}
        {postsLoading ? (
          <div className="grid lg:grid-cols-3 md:grid-cols-2 gap-8 animate-pulse">
            {[1, 2, 3].map((i) => (
              <div key={i} className="bg-gray-200 rounded-2xl h-64" />
            ))}
          </div>
        ) : gridPosts.length > 0 ? (
          <div className="grid lg:grid-cols-3 md:grid-cols-2 gap-8">
            {gridPosts.map((post) => (
              <article key={post.id} className="group cursor-pointer">
                <div className="bg-white rounded-2xl shadow-soft hover:shadow-strong transition-all duration-300 overflow-hidden">
                  {/* Image */}
                  <div className="relative h-48 overflow-hidden">
                    <img
                      src={post.image}
                      alt={post.title}
                      className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-110"
                      onError={(e) => {
                        e.target.style.display = 'none';
                        e.target.nextElementSibling.style.display = 'flex';
                      }}
                    />
                    <div className="w-full h-full bg-gradient-to-br from-insite-blue to-insite-cyan hidden items-center justify-center text-white text-lg font-bold">
                      {post.categoryLabel}
                    </div>
                    {/* Category Badge */}
                    <div className="absolute top-4 left-4 bg-white/90 backdrop-blur-sm text-insite-blue px-3 py-1 rounded-full text-sm font-medium">
                      {post.categoryLabel}
                    </div>
                  </div>

                  {/* Content */}
                  <div className="p-6">
                    <h3 className="text-xl font-bold text-gray-800 mb-3 group-hover:text-insite-blue transition-colors duration-200 leading-tight">
                      {post.title}
                    </h3>
                    <p className="text-gray-600 text-sm leading-relaxed mb-4">
                      {post.excerpt}
                    </p>

                    {/* Meta Info */}
                    <div className="flex items-center justify-between text-xs text-gray-500 mb-4">
                      <div className="flex items-center gap-2">
                        <User size={14} />
                        <span>{post.author}</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <Clock size={14} />
                        <span>{post.readTime}</span>
                      </div>
                    </div>

                    {/* Date and Read More */}
                    <div className="flex items-center justify-between pt-4 border-t border-gray-100">
                      <div className="flex items-center gap-2 text-sm text-gray-500">
                        <Calendar size={16} />
                        <span>{post.date}</span>
                      </div>
                      <Link
                        to={`/blog/${post.slug}`}
                        className="inline-flex items-center gap-2 text-insite-blue font-semibold hover:text-insite-cyan transition-colors duration-200"
                      >
                        {t('blog.readMore', 'Read More')}
                        <ArrowRight size={14} />
                      </Link>
                    </div>
                  </div>
                </div>
              </article>
            ))}
          </div>
        ) : (
          <div className="text-center py-12 text-gray-500">
            {t('blog.noPostsInCategory')}
          </div>
        )}

        {/* Newsletter Signup */}
        <div className="mt-16">
          <div className="bg-background-section rounded-2xl p-8 lg:p-12 text-center">
            <h3 className="text-2xl md:text-3xl font-bold text-gray-800 mb-4">
              {t('blog.newsletter.title', 'Stay Updated with Healthcare Technology Insights')}
            </h3>
            <p className="text-gray-600 mb-8 max-w-2xl mx-auto">
              {t('blog.newsletter.description', 'Subscribe to our newsletter and get the latest articles, case studies, and industry insights delivered directly to your inbox.')}
            </p>
            <div className="max-w-md mx-auto">
              <form onSubmit={handleNewsletterSubmit} className="flex flex-col sm:flex-row gap-3">
                <input
                  type="email"
                  value={newsletterEmail}
                  onChange={(e) => setNewsletterEmail(e.target.value)}
                  placeholder={t('blog.newsletter.placeholder', 'Enter your email address')}
                  className="flex-1 px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-insite-blue focus:border-transparent transition-all duration-200"
                  required
                />
                <button
                  type="submit"
                  disabled={newsletterStatus === 'loading'}
                  className="btn-primary whitespace-nowrap disabled:opacity-60 disabled:cursor-not-allowed"
                >
                  {newsletterStatus === 'loading'
                    ? t('blog.subscribing')
                    : t('blog.newsletter.subscribe', 'Subscribe Now')}
                </button>
              </form>
              {newsletterStatus === 'success' && (
                <p className="text-green-600 text-sm mt-3">{t('blog.subscribeSuccess')}</p>
              )}
              {newsletterStatus === 'error' && (
                <p className="text-red-500 text-sm mt-3">{t('blog.subscribeError')}</p>
              )}
              <p className="text-sm text-gray-500 mt-3">
                {t('blog.newsletter.privacy', 'No spam, unsubscribe at any time. Privacy policy applies.')}
              </p>
            </div>
          </div>
        </div>

        {/* View All Posts Button */}
        <div className="text-center mt-12">
          <Link
            to="/blog"
            className="btn-outline inline-flex items-center justify-center gap-2"
          >
            {t('blog.viewAllPosts', 'View All Posts')}
            <ArrowRight size={20} />
          </Link>
        </div>
      </div>
    </section>
  );
};

export default Blog;
