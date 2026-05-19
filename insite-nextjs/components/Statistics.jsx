'use client'
import { useEffect, useRef } from 'react';
import { useTranslation } from 'react-i18next';
import { useInView } from 'react-intersection-observer';
import { useCounter } from '../hooks/useCounter';
import { 
  Building2, 
  Activity, 
  Users, 
  Award,
  TrendingUp,
  Shield
} from 'lucide-react';

const Statistics = () => {
  const { t } = useTranslation();
  const { ref, inView } = useInView({
    threshold: 0.3,
    triggerOnce: true
  });

  const stats = t('statistics.stats', { returnObjects: true });
  const achievements = t('statistics.achievements', { returnObjects: true });

  // Icons for stats (in order)
  const statIcons = [Building2, Activity, Users, Award, TrendingUp, Shield];
  const achievementIcons = [Award, Shield, TrendingUp];
  const statColors = [
    'text-insite-blue',
    'text-insite-cyan', 
    'text-insite-orange',
    'text-green-600',
    'text-purple-600',
    'text-red-500'
  ];

  // Counter animations
  const counters = stats.map((stat) => 
    useCounter(stat.number, 2000, inView ? 0 : stat.number)
  );

  return (
    <section className="section-padding bg-insite-blue text-white relative overflow-hidden">
      {/* Background Pattern */}
      <div className="absolute inset-0 opacity-10">
        <div className="absolute top-0 left-0 w-64 h-64 border border-white rounded-full -translate-x-32 -translate-y-32"></div>
        <div className="absolute top-1/4 right-0 w-48 h-48 border border-white rounded-full translate-x-24"></div>
        <div className="absolute bottom-0 left-1/3 w-80 h-80 border border-white rounded-full translate-y-40"></div>
        <div className="absolute bottom-1/4 right-1/4 w-32 h-32 border border-white rounded-full"></div>
      </div>

      <div className="container-custom relative z-10" ref={ref}>
        {/* Header */}
        <div className="text-center mb-16">
          <h2 className="text-3xl md:text-4xl font-bold mb-4">
            {t('statistics.title')}
          </h2>
          <p className="text-xl text-blue-100 max-w-3xl mx-auto">
            {t('statistics.subtitle')}
          </p>
        </div>

        {/* Statistics Grid */}
        <div className="grid lg:grid-cols-3 md:grid-cols-2 gap-8">
          {stats.map((stat, index) => {
            const IconComponent = statIcons[index];
            const { count } = counters[index];
            
            return (
              <div
                key={index}
                className="text-center group"
              >
                {/* Icon */}
                <div className="w-20 h-20 mx-auto mb-6 bg-white/10 rounded-2xl flex items-center justify-center group-hover:bg-white/20 transition-all duration-300">
                  <IconComponent className="text-white" size={32} />
                </div>

                {/* Number */}
                <div className="mb-4">
                  <span className="text-4xl md:text-5xl font-bold">
                    {stat.number === 99.9 
                      ? count.toFixed(1) 
                      : Math.floor(count).toLocaleString()
                    }
                  </span>
                  <span className="text-3xl md:text-4xl font-bold text-insite-cyan">
                    {stat.suffix}
                  </span>
                </div>

                {/* Label & Description */}
                <h3 className="text-xl font-semibold mb-2">
                  {stat.label}
                </h3>
                <p className="text-blue-100 leading-relaxed">
                  {stat.description}
                </p>
              </div>
            );
          })}
        </div>

        {/* Achievement Highlights */}
        <div className="mt-20 grid md:grid-cols-3 gap-8">
          {achievements.map((achievement, index) => {
            const IconComponent = achievementIcons[index];
            const bgColors = ['bg-insite-cyan/20', 'bg-insite-orange/20', 'bg-green-400/20'];
            const iconColors = ['text-insite-cyan', 'text-insite-orange', 'text-green-400'];
            
            return (
              <div key={index} className="text-center">
                <div className={`w-16 h-16 mx-auto mb-4 ${bgColors[index]} rounded-2xl flex items-center justify-center`}>
                  <IconComponent className={iconColors[index]} size={28} />
                </div>
                <h3 className="text-lg font-semibold mb-2">{achievement.title}</h3>
                <p className="text-blue-100 text-sm">
                  {achievement.description}
                </p>
              </div>
            );
          })}
        </div>

        {/* Call to Action */}
        <div className="text-center mt-16">
          <div className="bg-white/10 backdrop-blur-sm rounded-2xl p-8">
            <h3 className="text-2xl font-bold mb-4">
              {t('statistics.ctaTitle')}
            </h3>
            <p className="text-blue-100 mb-6 max-w-2xl mx-auto">
              {t('statistics.ctaDesc')}
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <a
                href="#contact"
                className="inline-flex items-center justify-center px-8 py-4 text-lg font-semibold text-insite-blue bg-white hover:bg-gray-100 rounded-lg transition-all duration-300 transform hover:scale-105"
              >
                {t('statistics.getStarted')}
              </a>
              <a
                href="#demo"
                className="inline-flex items-center justify-center px-8 py-4 text-lg font-semibold text-white border-2 border-white hover:bg-white hover:text-insite-blue rounded-lg transition-all duration-300"
              >
                {t('statistics.scheduleDemo')}
              </a>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Statistics;
