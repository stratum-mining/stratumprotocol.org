import { useState } from 'react';
import {
  motion,
  useScroll,
  useSpring,
  useTransform,
  useMotionValue,
  useVelocity,
  useAnimationFrame,
} from 'framer-motion';

interface Supporter {
  name: string;
  logo: string;
  link: string;
  categories: ('implementers' | 'adopters' | 'funders' | 'past')[];
}

const supporters: Supporter[] = [
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
    categories: ['funders'],
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
];

type TabType = 'all' | 'implementers' | 'adopters' | 'funders' | 'past';

export function Sponsorship() {
  const [activeTab, setActiveTab] = useState<TabType>('all');

  const filteredSupporters = supporters.filter(
    (supporter) =>
      activeTab === 'all' || supporter.categories.includes(activeTab)
  );

  return (
    <section className="bg-black text-white py-20 border border-red-400 border-solid">
      <div className="container mx-auto px-4 border border-blue-400 border-solid flex">
        <div className="w-[550px] mx-auto border border-green-400 border-solid">
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
          <div className="flex p-4 bg-green-950 space-x-8 mb-12 border-b border-gray-800">
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
                  className={`p-2 hover:cursor-pointer ${
                    activeTab === tabValue
                      ? 'text-cyan-400 border-2 border-solid flex items-center justify-center border-cyan-400'
                      : 'text-gray-400'
                  }`}
                >
                  {tab}
                </button>
              );
            })}
          </div>

          {/* Grid of Supporters */}
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 border border-white">
            {filteredSupporters.map((supporter, index) => (
              <a
                key={index}
                href={supporter.link}
                target="_blank"
                rel="noopener noreferrer"
                className="group relative min-h-[200px] border border-white flex items-center justify-center hover:bg-gray-800 transition-colors"
              >
                <img
                  src={supporter.logo}
                  alt={supporter.name}
                  className="max-w-full h-12 object-contain"
                />
                {supporter.categories.length > 1 && (
                  <div className="absolute bottom-2 right-2 flex gap-1">
                    {supporter.categories.map((category, i) => (
                      <span
                        key={i}
                        className="w-2 h-2 rounded-full bg-cyan-400"
                        title={category}
                      />
                    ))}
                  </div>
                )}
              </a>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
