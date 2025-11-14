import {
  useMemo,
  useState,
  useEffect,
  useRef,
  forwardRef,
} from 'react';
import { useTranslation } from 'react-i18next';

import { SUPPORTERS, TabType, Supporter } from '@/lib/constants';

export function Sponsorship() {
  const { t } = useTranslation();
  const [activeTab, setActiveTab] = useState<TabType>('all');

  const supporterRows = useMemo(() => {
    if (activeTab === 'all') {
      // Always 3 rows
      const rowsCount = 3;
      const total = SUPPORTERS.length;

      const baseSize = Math.floor(total / rowsCount);
      const remainder = total % rowsCount;

      const rows: {
        items: Supporter[];
        direction: 'left' | 'right';
      }[] = [];

      let start = 0;

      for (let rowIndex = 0; rowIndex < rowsCount; rowIndex++) {
        const extra = rowIndex < remainder ? 1 : 0;
        const size = baseSize + extra;

        const end = start + size;
        const rowItems = SUPPORTERS.slice(start, end);

        rows.push({
          items: rowItems,
          direction: rowIndex % 2 === 0 ? 'left' : 'right',
        });

        start = end;
      }

      return rows;
    }

    const filteredSupporters = SUPPORTERS.filter((supporter) =>
      supporter.categories.includes(activeTab)
    );

    return [
      {
        items: filteredSupporters,
        direction: 'left' as const,
      },
    ];
  }, [activeTab]);

  return (
    <section className="bg-black text-white py-20">
      <div className="container flex-col lg:flex-row mx-auto px-4 min-h-[550px] flex">
        <div className="w-full lg:w-4/12 p-6 mx-auto border">
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
                      ? 'text-cyan-300 bg-emerald-900 border-2 border-solid flex items-center justify-center border-cyan-300 font-medium'
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


function useMarqueeFiller(
  itemCount: number,
  firstItemRef: React.RefObject<HTMLAnchorElement | null>,
  containerRef: React.RefObject<HTMLDivElement | null>
) {
  const [duplicatesNeeded, setDuplicatesNeeded] = useState(2);

  useEffect(() => {
    const measure = () => {
      const container = containerRef.current;
      const firstItem = firstItemRef.current;

      if (!container || !firstItem) return;

      const containerWidth = container.clientWidth;
      const itemWidth = firstItem.clientWidth;

      if (!itemWidth) return;

      const widthNeeded = containerWidth + itemWidth * 2;
      const baseWidth = itemWidth * itemCount;

      const factor = Math.ceil(widthNeeded / baseWidth);
      setDuplicatesNeeded(Math.max(2, factor));
    };

    measure();

    let ro1: ResizeObserver | null = null;
    let ro2: ResizeObserver | null = null;

    if (typeof ResizeObserver !== 'undefined') {
      ro1 = new ResizeObserver(measure);
      ro2 = new ResizeObserver(measure);

      if (containerRef.current) ro1.observe(containerRef.current);
      if (firstItemRef.current) ro2.observe(firstItemRef.current);
    } else {
      window.addEventListener('resize', measure);
    }

    return () => {
      if (ro1) ro1.disconnect();
      if (ro2) ro2.disconnect();
      else window.removeEventListener('resize', measure);
    };
  }, [itemCount]);

  return duplicatesNeeded;
}

const SupporterGrid = ({
  supporters,
  direction,
  filter,
}: {
  supporters: Supporter[];
  direction: 'left' | 'right';
  filter: TabType;
}) => {
  const firstItemRef = useRef<HTMLAnchorElement | null>(null);
  const containerRef = useRef<HTMLDivElement | null>(null);

  const duplicates = useMarqueeFiller(
    supporters.length,
    firstItemRef,
    containerRef
  );

  return (
    <div
      ref={containerRef}
      className="overflow-hidden border-l border-t border-border mx-auto"
    >
      <div
        className={`flex ${
          direction === 'left' ? 'marquee-left' : 'marquee-right'
        }`}
      >
        {/* First set */}
        {supporters.map((supporter, index) => (
          <LogoCard
            key={`${supporter.name}-p-${index}`}
            {...supporter}
            ref={index === 0 ? firstItemRef : undefined}
          />
        ))}

        {/* Auto-filled duplicates */}
        {Array.from({ length: duplicates }).map((_, dupIndex) =>
          supporters.map((supporter, sIndex) => (
            <LogoCard
              key={`${supporter.name}-d-${dupIndex}-${sIndex}`}
              {...supporter}
            />
          ))
        )}
      </div>
    </div>
  );
};

const LogoCard = forwardRef<HTMLAnchorElement, Supporter>(
  ({ name, link, logo }, ref) => (
    <a
      ref={ref}
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
  )
);

LogoCard.displayName = 'LogoCard';
