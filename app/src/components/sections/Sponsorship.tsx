import { useMemo, useState } from 'react';
import { useTranslation } from 'react-i18next';

import { SUPPORTERS, TabType, Supporter } from '@/lib/constants';

export function Sponsorship() {
  const { t } = useTranslation();
  const [activeTab, setActiveTab] = useState<TabType>('all');

  const supporterRows = useMemo(() => {
    if (activeTab === 'all') {
      // Distribute supporters into up to 3 rows instead of fixed chunks of 4
      const rows: { items: Supporter[]; direction: 'left' | 'right' }[] = [];
      const rowCount = 3;
      const perRow = Math.ceil(SUPPORTERS.length / rowCount);

      for (let rowIndex = 0; rowIndex < rowCount; rowIndex++) {
        const start = rowIndex * perRow;
        const end = start + perRow;
        const items = SUPPORTERS.slice(start, end);

        if (!items.length) break;

        const direction: 'left' | 'right' =
          rowIndex % 2 === 0 ? 'left' : 'right';

        rows.push({ items, direction });
      }

      return rows;
    }

    const filteredSupporters = SUPPORTERS.filter((supporter) =>
      supporter.categories.includes(activeTab)
    );

    return [
      {
        items: filteredSupporters,
        direction: 'left' as 'left' | 'right',
      },
    ];
  }, [activeTab]);

  return (
    <section className="bg-black text-white py-20">
      <div className="container flex-col lg:flex-row mx-auto px-4 min-h-[550px] flex">
        <div className="w-full lg:w-4/12 p-6  mx-auto border">
          <h2 className="text-2xl mb-4">{t('sponsorship.supportFor')}</h2>
          <h1 className="text-5xl font-medium mb-8 text-cyan-300">
            Stratum V2
          </h1>
          <p className="text-lg lg:mb-12 lg:mt-12">
            {t('sponsorship.joinEffort')}
          </p>
        </div>

        <div className="w-full lg:w-8/12 border">
          {/* Tabs */}
          <div className="flex flex-col lg:flex-row p-4 bg-[#0F2126] space-x-8 lg:mb-12 border-b border-gray-800">
            {[
              {
                key: 'allContributors',
                label: t('sponsorship.tabs.allContributors'),
              },
              {
                key: 'implementations',
                label: t('sponsorship.tabs.implementations'),
              },
              {
                key: 'adopters',
                label: t('sponsorship.tabs.adopters'),
              },
              {
                key: 'funders',
                label: t('sponsorship.tabs.funders'),
              },
              {
                key: 'pastFunders',
                label: t('sponsorship.tabs.pastFunders'),
              },
            ].map((tab, index) => {
              const tabValue =
                tab.key === 'allContributors'
                  ? 'all'
                  : (tab.key
                      .toLowerCase()
                      .split(/(?=[A-Z])/)
                      .join('')
                      .replace('contributors', '')
                      .replace('funders', 'funders')
                      .replace('pastfunders', 'past') as TabType);

              return (
                <button
                  key={index}
                  onClick={() => setActiveTab(tabValue)}
                  className={`p-2 hover:cursor-pointer text-lg lg:text-sm m-0 ${
                    activeTab === tabValue
                      ? 'text-cyan-300 bg-emerald-900 border-2 border-solid flex items-center justify-center border-cyan-300 font-medium '
                      : 'text-gray-400'
                  }`}
                >
                  {tab.label}
                </button>
              );
            })}
          </div>

          {supporterRows.map((row, index) => (
            <SupporterGrid
              key={index}
              supporters={row.items}
              direction={row.direction}
              filter={activeTab}
            />
          ))}
        </div>
      </div>
    </section>
  );
}

interface SupporterGridProps {
  supporters: Supporter[];
  direction: 'left' | 'right';
  filter: TabType;
}

const SupporterGrid = ({
  supporters,
  direction,
  filter,
}: SupporterGridProps) => {
  const filteredSupporters =
    filter === 'all'
      ? supporters
      : supporters.filter((supporter) =>
          supporter.categories.includes(filter)
        );

  if (filteredSupporters.length === 0) {
    return null;
  }

  const isAnimated = filter === 'all';

  return (
    <div
      className={`overflow-hidden border-l border-t border-border mx-auto ${
        isAnimated ? '' : 'flex flex-wrap'
      }`}
    >
      {isAnimated ? (
        <div
          className={`flex ${
            direction === 'left' ? 'marquee-left' : 'marquee-right'
          }`}
          style={{ gap: 0 }}
        >
          {/* First set of items */}
          {filteredSupporters.map((supporter, index) => (
            <LogoCard
              key={`${supporter.name}-primary-${index}`}
              name={supporter.name}
              link={supporter.link}
              logo={supporter.logo}
            />
          ))}
          {/* Duplicate items for seamless animation */}
          {filteredSupporters.map((supporter, index) => (
            <LogoCard
              key={`${supporter.name}-duplicate-1-${index}`}
              name={supporter.name}
              link={supporter.link}
              logo={supporter.logo}
            />
          ))}
          {filteredSupporters.map((supporter, index) => (
            <LogoCard
              key={`${supporter.name}-duplicate-2-${index}`}
              name={supporter.name}
              link={supporter.link}
              logo={supporter.logo}
            />
          ))}
        </div>
      ) : (
        <div className="flex flex-wrap">
          {filteredSupporters.map((supporter, index) => (
            <LogoCard key={index} {...supporter} />
          ))}
        </div>
      )}
    </div>
  );
};

const LogoCard: React.FC<{
  name: string;
  link: string;
  logo: string;
}> = ({ name, link, logo }) => {
  return (
    <a
      href={link}
      target="_blank"
      rel="noopener noreferrer"
      className="logo-card flex items-center justify-center border-r border-b border-border bg-card"
      style={{
        margin: 0,
        padding: '24px',
        boxSizing: 'border-box',
      }}
    >
      <img src={logo} alt={name} className="w-36 h-12 object-contain" />
    </a>
  );
};
