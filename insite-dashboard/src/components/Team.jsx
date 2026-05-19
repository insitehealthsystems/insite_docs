import { useTranslation } from 'react-i18next';
import { Link } from 'react-router-dom';
import { ChevronRight } from 'lucide-react';

// ─── Shared initials avatar (same color logic as TeamPage) ────────────────────
const AVATAR_COLORS = [
  '#1E40AF',
  '#0E7490',
  '#1D4ED8',
  '#0369A1',
  '#4338CA',
  '#0F766E',
  '#1E3A5F',
  '#065F46',
];

const getInitialsColor = (name) => {
  let hash = 0;
  for (let i = 0; i < name.length; i++) {
    hash = name.charCodeAt(i) + ((hash << 5) - hash);
  }
  return AVATAR_COLORS[Math.abs(hash) % AVATAR_COLORS.length];
};

const getInitials = (name) =>
  name
    .split(' ')
    .filter(Boolean)
    .map((n) => n[0])
    .slice(0, 2)
    .join('')
    .toUpperCase();

// ─── Condensed member card ─────────────────────────────────────────────────────
const MemberCard = ({ member }) => {
  const bg = getInitialsColor(member.name);
  const initials = getInitials(member.name);

  return (
    <div className="group bg-white rounded-2xl shadow-soft hover:shadow-strong transition-all duration-300 overflow-hidden">
      {/* Color bar */}
      <div className="h-1.5 bg-gradient-to-r from-insite-blue to-insite-cyan" />

      <div className="p-6">
        {/* Avatar + header */}
        <div className="flex items-center gap-4 mb-4">
          <div
            className="w-14 h-14 rounded-full flex items-center justify-center font-bold text-white text-lg flex-shrink-0 group-hover:scale-105 transition-transform duration-300"
            style={{ backgroundColor: bg }}
          >
            {initials}
          </div>
          <div>
            <h3 className="font-bold text-gray-800 leading-tight">{member.name}</h3>
            <p className="text-insite-blue text-sm font-semibold mt-0.5">{member.title}</p>
          </div>
        </div>

        {/* Role blurb */}
        {member.role && (
          <p className="text-gray-500 text-sm leading-relaxed">{member.role}</p>
        )}
      </div>
    </div>
  );
};

// ─── Team (homepage section) ───────────────────────────────────────────────────
const Team = () => {
  const { t } = useTranslation();

  const principal = t('team.members.principal', { returnObjects: true }) || [];
  const executive = t('team.members.executive', { returnObjects: true }) || [];

  // Show principal + first 5 executive = up to 6 cards
  const featured = [
    ...principal,
    ...executive.slice(0, 5),
  ];

  return (
    <section className="section-padding bg-white">
      <div className="container-custom">

        {/* Heading */}
        <div className="text-center mb-12">
          <h2 className="text-3xl md:text-4xl font-bold text-gray-800 mb-4">
            {t('team.title', 'Meet Our Team')}
          </h2>
          <p className="text-lg text-gray-600 max-w-2xl mx-auto">
            {t('team.subtitle', 'Decades of real-world experience in healthcare, enterprise technology, and infrastructure — united by a mission to transform how hospitals operate.')}
          </p>
        </div>

        {/* Cards grid */}
        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6 mb-12">
          {featured.map((member, i) => (
            <MemberCard key={i} member={member} />
          ))}
        </div>

        {/* CTA */}
        <div className="bg-gray-50 rounded-2xl p-8 text-center">
          <h3 className="text-2xl font-bold text-gray-800 mb-3">
            {t('team.joinMission', 'Ready to Join Our Mission?')}
          </h3>
          <p className="text-gray-600 mb-6 max-w-lg mx-auto">
            {t('team.joinDesc', "We're always looking for talented individuals who share our passion for improving healthcare through technology.")}
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link
              to="/team"
              className="btn-primary inline-flex items-center justify-center gap-2"
            >
              {t('team.viewFullTeam', 'Meet the Full Team')}
              <ChevronRight className="h-4 w-4" />
            </Link>
            <Link
              to="/contact"
              className="btn-outline inline-flex items-center justify-center"
            >
              {t('team.contactTeam', 'Contact Our Team')}
            </Link>
          </div>
        </div>

      </div>
    </section>
  );
};

export default Team;
