export interface Supporter {
  name: string;
  logo: string;
  link: string;
  categories: ('implementers' | 'adopters' | 'funders' | 'past')[];
}

export const SUPPORTERS: Supporter[] = [
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

export type TabType = 'all' | 'implementers' | 'adopters' | 'funders' | 'past';
