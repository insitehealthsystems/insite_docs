'use client'
import { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { CheckCircle, Target, Users, Heart } from 'lucide-react';

const AboutTabs = () => {
  const { t } = useTranslation();
  const [activeTab, setActiveTab] = useState('mission');

  const tabs = [
    {
      id: 'mission',
      label: t('aboutTabs.mission.label'),
      icon: Target,
      title: t('aboutTabs.mission.title'),
      content: t('aboutTabs.mission.content', { returnObjects: true }),
      features: t('aboutTabs.mission.features', { returnObjects: true })
    },
    {
      id: 'vision',
      label: t('aboutTabs.vision.label'),
      icon: CheckCircle,
      title: t('aboutTabs.vision.title'),
      content: t('aboutTabs.vision.content', { returnObjects: true }),
      features: t('aboutTabs.vision.features', { returnObjects: true })
    },
    {
      id: 'values',
      label: t('aboutTabs.values.label'),
      icon: Heart,
      title: t('aboutTabs.values.title'),
      content: t('aboutTabs.values.content', { returnObjects: true }),
      features: t('aboutTabs.values.features', { returnObjects: true })
    },
    {
      id: 'team',
      label: t('aboutTabs.team.label'),
      icon: Users,
      title: t('aboutTabs.team.title'),
      content: t('aboutTabs.team.content', { returnObjects: true }),
      features: t('aboutTabs.team.features', { returnObjects: true })
    }
  ];

  const currentTab = tabs.find(tab => tab.id === activeTab);

  return (
    <section className="section-padding bg-background-light">
      <div className="container-custom">
        <div className="text-center mb-16">
          <h2 className="text-3xl md:text-4xl font-bold text-gray-800 mb-4">
            {t('aboutTabs.title')}
          </h2>
          <p className="text-lg text-gray-600 max-w-3xl mx-auto">
            {t('aboutTabs.subtitle')}
          </p>
        </div>

        <div className="max-w-6xl mx-auto">
          {/* Tab Navigation */}
          <div className="flex flex-wrap justify-center mb-8 bg-white rounded-2xl p-2 shadow-soft">
            {tabs.map((tab) => {
              const IconComponent = tab.icon;
              return (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id)}
                  className={`flex items-center gap-3 px-6 py-4 rounded-xl font-semibold transition-all duration-300 ${
                    activeTab === tab.id
                      ? 'bg-insite-blue text-white shadow-md'
                      : 'text-gray-600 hover:bg-gray-50'
                  }`}
                >
                  <IconComponent size={20} />
                  <span className="hidden sm:inline">{tab.label}</span>
                </button>
              );
            })}
          </div>

          {/* Tab Content */}
          {currentTab && (
            <div className="bg-white rounded-2xl shadow-medium overflow-hidden">
              <div className="lg:flex">
                {/* Content Side */}
                <div className="lg:w-2/3 p-8 lg:p-12">
                  <div className="flex items-center gap-3 mb-6">
                    <div className="w-12 h-12 bg-insite-blue/10 rounded-xl flex items-center justify-center">
                      <currentTab.icon className="text-insite-blue" size={24} />
                    </div>
                    <h3 className="text-2xl lg:text-3xl font-bold text-gray-800">
                      {currentTab.title}
                    </h3>
                  </div>

                  <div className="space-y-4 mb-8">
                    {currentTab.content.map((paragraph, index) => (
                      <p key={index} className="text-gray-600 leading-relaxed">
                        {paragraph}
                      </p>
                    ))}
                  </div>

                  {/* Features List */}
                  <div>
                    <h4 className="text-xl font-semibold text-gray-800 mb-4">
                      {t('aboutTabs.keyHighlights')}
                    </h4>
                    <div className="grid sm:grid-cols-2 gap-3">
                      {currentTab.features.map((feature, index) => (
                        <div key={index} className="flex items-start gap-3">
                          <CheckCircle className="text-insite-cyan flex-shrink-0 mt-0.5" size={18} />
                          <span className="text-gray-600">{feature}</span>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>

                {/* Image Side */}
                <div className="lg:w-1/3 relative">
                  <div className="h-64 lg:h-full bg-gradient-to-br from-insite-blue to-insite-cyan relative">
                    {/* Decorative Pattern */}
                    <div className="absolute inset-0 opacity-20">
                      <div className="absolute top-4 right-4 w-24 h-24 border-2 border-white rounded-full"></div>
                      <div className="absolute top-8 right-8 w-16 h-16 border-2 border-white rounded-full"></div>
                      <div className="absolute bottom-8 left-4 w-32 h-32 border-2 border-white rounded-full"></div>
                      <div className="absolute bottom-4 left-8 w-20 h-20 border-2 border-white rounded-full"></div>
                    </div>
                    
                    {/* Icon Display */}
                    <div className="absolute inset-0 flex items-center justify-center">
                      <div className="w-20 h-20 bg-white/20 rounded-2xl flex items-center justify-center backdrop-blur-sm">
                        <currentTab.icon className="text-white" size={40} />
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Statistics Row */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-8 mt-16">
          {t('aboutTabs.stats', { returnObjects: true }).map((stat, index) => (
            <div key={index} className="text-center">
              <div className="text-3xl md:text-4xl font-bold text-insite-blue mb-2">
                {stat.number}
              </div>
              <div className="text-gray-600 font-medium">
                {stat.label}
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default AboutTabs;
