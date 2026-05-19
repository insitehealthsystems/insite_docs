import React, { createContext, useContext, useState, useEffect, useRef } from 'react';
import { useTranslation } from 'react-i18next';
import { translateBlogContent } from '../utils/translateService';

const BlogContentContext = createContext();

export const useBlogContent = () => {
  const context = useContext(BlogContentContext);
  if (!context) {
    throw new Error('useBlogContent must be used within a BlogContentProvider');
  }
  return context;
};

export const BlogContentProvider = ({ children }) => {
  const { i18n } = useTranslation();
  const [currentLanguage, setCurrentLanguage] = useState(i18n.language || 'en');
  // In-memory cache: key = `${slug}-${lang}`, value = translated post object
  // Prevents duplicate API calls within the same browser session
  const translationCache = useRef({});

  useEffect(() => {
    setCurrentLanguage(i18n.language);
  }, [i18n.language]);

  // Helper function to get content in current language with fallback
  const getLocalizedContent = (contentObject, fallbackLang = 'en') => {
    if (!contentObject) return null;
    
    // If content is a simple string, return as-is
    if (typeof contentObject === 'string') {
      return contentObject;
    }
    
    // If content is an object with language keys
    if (typeof contentObject === 'object') {
      // Try current language first
      if (contentObject[currentLanguage]) {
        return contentObject[currentLanguage];
      }
      
      // Fallback to English
      if (contentObject[fallbackLang]) {
        return contentObject[fallbackLang];
      }
      
      // If no localized version, return the first available
      const firstKey = Object.keys(contentObject)[0];
      return contentObject[firstKey] || null;
    }
    
    return null;
  };

  // Helper function to get localized blog post (synchronous, no API call)
  const getLocalizedBlogPost = (post) => {
    if (!post) return null;

    const localizedContent = getLocalizedContent(post.content);
    
    return {
      ...post,
      title: localizedContent?.title || post.title,
      excerpt: localizedContent?.excerpt || post.excerpt,
      content: localizedContent?.content || post.content || '',
      tags: localizedContent?.tags || post.tags || [],
      category: post.category, // Categories use translation keys
      author: post.author, // Author names typically don't change
      publishDate: post.publishDate,
      slug: post.slug, // URL slug stays the same
      featuredImage: post.featuredImage,
      // Keep original data for editing
      originalContent: post.content
    };
  };

  /**
   * Async function: returns a localised post, auto-translating via API if no
   * pre-authored translation exists for targetLang.
   * Results are cached in-memory by `${slug}-${lang}` to avoid redundant API calls.
   * Falls back to English on any translation error.
   *
   * @param {object} post       - Raw post from multiLanguageBlogPosts
   * @param {string} targetLang - Language code to translate into (defaults to currentLanguage)
   * @returns {Promise<object>} Hydrated post object in the target language
   */
  const getTranslatedPost = async (post, targetLang = currentLanguage) => {
    if (!post) return null;

    // Pre-authored translation exists — use fast sync path, no API call
    if (post.content && post.content[targetLang]) {
      return getLocalizedBlogPost({ ...post });
    }

    // English source is the base for auto-translation
    const enContent = post.content?.en;
    if (!enContent || targetLang === 'en') {
      return getLocalizedBlogPost({ ...post });
    }

    // Check in-memory cache (translateService also caches in localStorage,
    // but this avoids re-assembling the post object on every call)
    const cacheKey = `${post.slug}-${targetLang}`;
    if (translationCache.current[cacheKey]) {
      return translationCache.current[cacheKey];
    }

    try {
      const translated = await translateBlogContent(enContent, targetLang);
      const result = {
        ...post,
        title: translated.title || enContent.title,
        excerpt: translated.excerpt || enContent.excerpt,
        content: translated.content || enContent.content,
        tags: translated.tags || enContent.tags || [],
        category: post.category,
        author: post.author,
        publishDate: post.publishDate,
        slug: post.slug,
        featuredImage: post.featuredImage,
        originalContent: post.content
      };
      translationCache.current[cacheKey] = result;
      return result;
    } catch {
      // On any translation failure, fall back to English
      return getLocalizedBlogPost({ ...post });
    }
  };

  // Check if content has translations
  const hasTranslation = (contentObject, language) => {
    return contentObject && 
           typeof contentObject === 'object' && 
           contentObject[language];
  };

  // Get available languages for a piece of content
  const getAvailableLanguages = (contentObject) => {
    if (!contentObject || typeof contentObject !== 'object') {
      return [currentLanguage];
    }
    return Object.keys(contentObject);
  };

  const value = {
    currentLanguage,
    getLocalizedContent,
    getLocalizedBlogPost,
    getTranslatedPost,
    hasTranslation,
    getAvailableLanguages
  };

  return (
    <BlogContentContext.Provider value={value}>
      {children}
    </BlogContentContext.Provider>
  );
};