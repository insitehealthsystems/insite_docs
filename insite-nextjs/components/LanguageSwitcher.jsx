'use client'
import React, { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { supportedLanguages } from '../i18n';
import { Globe, ChevronDown, Check } from 'lucide-react';

const LanguageSwitcher = ({ variant = 'dropdown' }) => {
  const { i18n, t } = useTranslation();
  const [isOpen, setIsOpen] = useState(false);

  const currentLanguage = supportedLanguages.find(
    lang => lang.code === i18n.language
  ) || supportedLanguages[0];

  const handleLanguageChange = async (langCode) => {
    await i18n.changeLanguage(langCode);
    setIsOpen(false);
    
    // Update document direction for Arabic
    document.documentElement.dir = langCode === 'ar' ? 'rtl' : 'ltr';
    document.documentElement.lang = langCode;
  };

  if (variant === 'inline') {
    return (
      <div className="flex items-center space-x-2">
        <Globe className="h-4 w-4 text-gray-500" />
        <div className="flex space-x-1">
          {supportedLanguages.map(language => (
            <button
              key={language.code}
              onClick={() => handleLanguageChange(language.code)}
              className={`px-2 py-1 rounded text-xs transition-colors ${
                i18n.language === language.code
                  ? 'bg-insite-blue text-white'
                  : 'text-gray-600 hover:bg-gray-100'
              }`}
              title={language.name}
            >
              {language.flag}
            </button>
          ))}
        </div>
      </div>
    );
  }

  return (
    <div className="relative">
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="flex items-center space-x-2 px-3 py-2 text-gray-700 hover:text-insite-blue transition-colors rounded-lg hover:bg-gray-50"
      >
        <Globe className="h-4 w-4" />
        <span className="hidden md:inline text-sm">
          {currentLanguage.flag} {currentLanguage.name}
        </span>
        <span className="md:hidden">
          {currentLanguage.flag}
        </span>
        <ChevronDown className={`h-4 w-4 transition-transform ${isOpen ? 'rotate-180' : ''}`} />
      </button>

      {isOpen && (
        <>
          {/* Backdrop */}
          <div
            className="fixed inset-0 z-10"
            onClick={() => setIsOpen(false)}
          />
          
          {/* Dropdown Menu */}
          <div className="absolute right-0 mt-2 w-48 bg-white rounded-lg shadow-lg border border-gray-200 py-2 z-20">
            <div className="px-4 py-2 text-xs font-semibold text-gray-500 uppercase border-b border-gray-100">
              {t('common.selectLanguage')}
            </div>
            
            {supportedLanguages.map(language => (
              <button
                key={language.code}
                onClick={() => handleLanguageChange(language.code)}
                className={`w-full flex items-center justify-between px-4 py-2 text-sm hover:bg-gray-50 transition-colors ${
                  i18n.language === language.code ? 'text-insite-blue bg-insite-blue/5' : 'text-gray-700'
                }`}
              >
                <div className="flex items-center space-x-3">
                  <span className="text-lg">{language.flag}</span>
                  <span className="font-medium">{language.name}</span>
                </div>
                
                {i18n.language === language.code && (
                  <Check className="h-4 w-4 text-insite-blue" />
                )}
              </button>
            ))}
            
            <div className="border-t border-gray-100 mt-2 pt-2 px-4">
              <p className="text-xs text-gray-500">
                {t('common.languageSaved')}
              </p>
            </div>
          </div>
        </>
      )}
    </div>
  );
};

export default LanguageSwitcher;
