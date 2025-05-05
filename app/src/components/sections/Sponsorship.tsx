import { useMemo, useState } from 'react';

interface Supporter {
  name: string;
  logo: string;
  link: string;
  categories: ('implementers' | 'adopters' | 'funders' | 'past')[];
}

const SUPPORTERS: Supporter[] = [
  {
    name: 'Demand',
    logo: '/assets/svgs/demand-logo.svg',
    link: 'https://demand.org',
    categories: ['adopters'],
  },
  {
    name: 'Human Rights Foundation',
    logo: '/assets/svgs/hrf-logo.svg',
    link: 'https://hrf.org',
    categories: ['funders'],
  },
  {
    name: 'OpenSats',
    logo: '/assets/svgs/opensats-logo.svg',
    link: 'https://opensats.org',
    categories: ['funders'],
  },
  {
    name: 'Spiral',
    logo: '/assets/svgs/spiral-logo.svg',
    link: 'https://spiral.com',
    categories: ['funders', 'past'],
  },
  {
    name: 'HUT8',
    logo: '/assets/svgs/hut-logo.svg',
    link: 'https://hut8.com',
    categories: ['adopters'],
  },
  {
    name: 'Stratum V2',
    logo: '/assets/svgs/sv2-icon.svg',
    link: 'https://stratum.org',
    categories: ['implementers'],
  },
  {
    name: 'Vinteum',
    logo: '/assets/vinteum-logo.png',
    link: 'https://vinteum.org',
    categories: ['funders'],
  },
  {
    name: 'Braiins',
    logo: '/assets/svgs/braiins-logo.svg',
    link: 'https://braiins.com',
    categories: ['adopters', 'implementers'],
  },
  {
    name: 'Bitmex',
    logo: '/assets/svgs/bitmex-logo.svg',
    link: 'https://bitmex.com/',
    categories: ['past'],
  },
  {
    name: 'Summer of Bitcoin',
    logo: '/assets/svgs/summer-of-bitcoin.svg',
    link: 'https://summerofbitcoin.org/',
    categories: ['past'],
  },
  {
    name: 'Galaxy',
    logo: '/assets/svgs/galaxy-logo.svg',
    link: 'https://www.galaxy.com/',
    categories: ['past'],
  },
  {
    name: 'Foundry',
    logo: '/assets/svgs/foundry-logo.svg',
    link: 'https://foundrydigital.com/',
    categories: ['past'],
  },
];

type TabType = 'all' | 'implementers' | 'adopters' | 'funders' | 'past';

export function Sponsorship() {
  const [activeTab, setActiveTab] = useState<TabType>('all');

  const supporterRows = useMemo(() => {
    if (activeTab === 'all') {
      const rows = [];
      const chunkSize = 4;

      // Create chunks of contributors, each with 4 items
      for (let i = 0; i < SUPPORTERS.length; i += chunkSize) {
        const rowItems = SUPPORTERS.slice(i, i + chunkSize);
        // Alternate direction based on row index
        const direction: 'left' | 'right' =
          (i / chunkSize) % 2 === 0 ? 'left' : 'right';
        rows.push({ items: rowItems, direction });
      }

      return rows;
    } else {
      const filteredSupporters = SUPPORTERS.filter((supporter) =>
        supporter.categories.includes(activeTab)
      );

      return [
        {
          items: filteredSupporters,
          direction: 'left' as 'left' | 'right',
        },
      ];
    }
  }, [activeTab]);

  return (
    <section className="bg-black text-white py-20 border border-red-400 border-solid">
      <div className="container mx-auto px-4 min-h-[550px] border border-blue-400 border-solid flex">
        <div className="w-[550px]  mx-auto border border-green-400 border-solid">
          <h2 className="text-4xl mb-4">Support for</h2>
          <h1 className="text-6xl mb-8 text-cyan-400">Stratum v2</h1>
          <p className="text-xl mb-12">
            Let's make stratum V2 the new standard.
            <br />
            Show material support or indicate your approval of the protocol
            direction
          </p>
        </div>

        <div className="w-[990px] border border-yellow-400 border-solid">
          {/* Tabs */}
          <div className="flex p-4 bg-[#0F2126] space-x-8 mb-12 border-b border-gray-800">
            {[
              'All Contributors',
              'Implementers',
              'Adopters',
              'Funders',
              'Past Supporters',
            ].map((tab, index) => {
              const tabValue = tab.toLowerCase().split(' ')[0] as TabType;
              return (
                <button
                  key={index}
                  onClick={() => setActiveTab(tabValue)}
                  className={`p-2 hover:cursor-pointer text-lg ${
                    activeTab === tabValue
                      ? 'text-cyan-300 bg-emerald-900 border-2 border-solid flex items-center justify-center border-cyan-300 font-medium '
                      : 'text-gray-400'
                  }`}
                >
                  {tab}
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
      : supporters.filter((supporter) => supporter.categories.includes(filter));

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
      <div
        className={`flex ${
          isAnimated
            ? direction === 'left'
              ? 'marquee-left'
              : 'marquee-right'
            : ''
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
        {/* Only include duplicate items when animation is active */}
        {isAnimated && (
          <>
            {/* Second set of items (duplicate) */}
            {filteredSupporters.map((supporter, index) => (
              <LogoCard
                key={`${supporter.name}-duplicate-1-${index}`}
                name={supporter.name}
                link={supporter.link}
                logo={supporter.logo}
              />
            ))}
            {/* Third set of items (duplicate) - ensures no gap even during animation */}
            {filteredSupporters.map((supporter, index) => (
              <LogoCard
                key={`${supporter.name}-duplicate-2-${index}`}
                name={supporter.name}
                link={supporter.link}
                logo={supporter.logo}
              />
            ))}
          </>
        )}
      </div>
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
        width: '256px',
        height: '160px',
      }}
    >
      <img src={logo} alt={name} className="w-36 h-12 object-contain" />
    </a>
  );
};
