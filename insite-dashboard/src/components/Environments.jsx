import { ArrowRight, CheckCircle } from 'lucide-react';
import { useScrollAnimation } from '../hooks/useScrollAnimation';
import { useTranslation } from 'react-i18next';

const Environments = () => {
  const { t } = useTranslation();
  const [environmentsRef, isVisible] = useScrollAnimation({ threshold: 0.2 });

  const environments = [
    t('homepage.acuteCare'),
    t('homepage.emergency'), 
    t('homepage.specialty'),
    t('homepage.postAcute'),
    t('homepage.outpatient'),
    t('homepage.diagnostic'),
    t('homepage.government'),
    t('homepage.multiBuilding'),
    t('homepage.mobileField'),
    t('homepage.privateNetworks')
  ];

  return (
    <section className="section-padding bg-white">
      <div className="container-custom">
        <div 
          ref={environmentsRef}
          className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center"
        >
          {/* Left Column - Environments List */}
          <div className={`${isVisible ? 'animate-fadeInUp' : 'opacity-0'}`}>
            <div className="bg-gradient-to-br from-insite-blue/5 to-insite-cyan/5 rounded-2xl p-8 shadow-soft">
              <h2 className="text-2xl md:text-3xl font-bold text-gray-900 mb-6">
                {t('homepage.environmentsTitle')}
              </h2>
              
              <ul className="space-y-4 mb-8">
                {environments.map((environment, index) => (
                  <li 
                    key={index}
                    className={`flex items-center space-x-3 ${
                      isVisible ? 'animate-fadeInUp' : 'opacity-0'
                    }`}
                    style={{
                      animationDelay: isVisible ? `${index * 100}ms` : '0ms'
                    }}
                  >
                    <CheckCircle className="w-5 h-5 text-insite-blue flex-shrink-0" />
                    <span className="text-gray-700 hover:text-insite-blue transition-colors duration-200 cursor-pointer">
                      {environment}
                    </span>
                  </li>
                ))}
              </ul>
              
              <a
                href="#"
                className="inline-flex items-center space-x-2 text-insite-blue hover:text-insite-orange font-semibold transition-colors duration-200 group"
              >
                <span>{t('homepage.discoverMore')}</span>
                <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform duration-200" />
              </a>
            </div>
          </div>

          {/* Right Column - Content */}
          <div className={`${isVisible ? 'animate-fadeInUp' : 'opacity-0'}`} style={{ animationDelay: '300ms' }}>
            <div className="space-y-6">
              <div>
                <h3 className="text-insite-blue font-semibold text-lg mb-2">
                  {t('homepage.learnMoreAbout')}
                </h3>
                <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
                  {t('homepage.professionalTeamTitle')}
                </h2>
              </div>

              <div className="space-y-4">
                <p className="text-gray-600 leading-relaxed">
                  {t('homepage.professionalTeamDesc')}
                </p>
                
                <p className="text-gray-600 leading-relaxed">
                  {t('homepage.teamExperience')}
                </p>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 py-6">
                  <div className="flex items-center space-x-3">
                    <div className="w-12 h-12 bg-insite-blue rounded-full flex items-center justify-center">
                      <CheckCircle className="w-6 h-6 text-white" />
                    </div>
                    <div>
                      <h4 className="font-semibold text-gray-900">{t('homepage.hipaaCompliant')}</h4>
                      <p className="text-sm text-gray-600">{t('homepage.securePrivate')}</p>
                    </div>
                  </div>

                  <div className="flex items-center space-x-3">
                    <div className="w-12 h-12 bg-insite-orange rounded-full flex items-center justify-center">
                      <CheckCircle className="w-6 h-6 text-white" />
                    </div>
                    <div>
                      <h4 className="font-semibold text-gray-900">{t('homepage.support24_7')}</h4>
                      <p className="text-sm text-gray-600">{t('homepage.alwaysAvailable')}</p>
                    </div>
                  </div>
                </div>
              </div>

              <div className="pt-4">
                <a
                  href="#"
                  className="inline-flex items-center space-x-2 btn-primary group"
                >
                  <span>{t('homepage.discoverMore')}</span>
                  <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform duration-200" />
                </a>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Environments;