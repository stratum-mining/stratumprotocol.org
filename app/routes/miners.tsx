import { Navigation } from '@/components/Navigation';
import { PoolSelector } from '@/components/PoolSelector';
import { LatencyJobBlockComparison } from '@/components/sections/LatencyJobBlockComparison';
import { ShareAcceptance } from '@/components/sections/ShareAcceptance';
import { useTranslation } from 'react-i18next';

export default function MinersPage() {
  const { t } = useTranslation();

  return (
    <main className="min-h-screen bg-background text-foreground" role="main">
      <Navigation />

      {/* Hero Section */}
      <section 
        className="min-h-screen flex flex-col justify-center px-4 relative bg-cover bg-center bg-no-repeat" 
        style={{
          backgroundImage: 'url(/assets/minersBackgound.png)',
        }}
        aria-labelledby="hero-heading"
      >
        {/* Background overlay for better text readability */}
        <div className="absolute inset-0 bg-black/50"></div>
        
        <div className="container mx-auto text-center relative z-10">
          <h1 id="hero-heading" className="text-6xl md:text-7xl font-mono mb-8 text-white">
            {t('miners.hero.title')}
          </h1>
          <p className="text-xl text-gray-200 max-w-2xl mx-auto mb-12">
            {t('miners.hero.subtitle')}
          </p>
          <div className="flex justify-center w-full">
            <PoolSelector />
          </div>
        </div>
      </section>

      {/* Key Metrics Section */}
      <section className="py-8 bg-black/95 border-t border-cyan-500/20 border-b border-cyan-500/20 relative">
        {/* Top decorative lines */}
        <div className="absolute top-0 left-0 w-full h-0.5" style={{
          borderTop: '1px solid #6ADDDF4D'
        }}></div>
        
        {/* Bottom decorative lines */}
        <div className="absolute bottom-0 left-0 w-full h-0.5" style={{
          borderBottom: '1px solid #6ADDDF4D'
        }}></div>
        
        <div className="container mx-auto px-4 relative z-10">
          <div className="grid md:grid-cols-3 gap-8 relative">
            {/* Profit Increase */}
            <div className="text-center">
              <div className="text-4xl md:text-5xl font-bold text-white mb-2">+7.4%</div>
              <div className="text-gray-400 text-sm uppercase tracking-wider">Profit Increase</div>
            </div>
            
            {/* First vertical divider */}
            <div className="absolute left-1/3 -top-4 -bottom-4 w-px hidden md:block" style={{
              background: 'linear-gradient(180deg, rgba(65, 255, 230, 0) 0%, #62EAE7 50%, rgba(65, 255, 230, 0) 100%)'
            }}></div>
            
            {/* Faster Latency */}
            <div className="text-center">
              <div className="text-4xl md:text-5xl font-bold text-white mb-2">228x</div>
              <div className="text-gray-400 text-sm uppercase tracking-wider">Faster Latency</div>
            </div>
            
            {/* Second vertical divider */}
            <div className="absolute left-2/3 -top-4 -bottom-4 w-px hidden md:block" style={{
              background: 'linear-gradient(180deg, rgba(65, 255, 230, 0) 0%, #62EAE7 50%, rgba(65, 255, 230, 0) 100%)'
            }}></div>
            
            {/* Security Protection */}
            <div className="text-center">
              <div className="text-4xl md:text-5xl font-bold text-white mb-2">100%</div>
              <div className="text-gray-400 text-sm uppercase tracking-wider">Security Protection</div>
            </div>
          </div>
        </div>
      </section>

      {/* Stratum V2 Benefits Section */}
      <section className="py-20 bg-black/95">
        <div className="container mx-auto px-4">
          {/* Outer rounded container */}
          <div className="border flex flex-col justify-center items-center max-w-7xl lg:max-w-none lg:mx-8 xl:mx-16 mx-auto rounded-3xl p-6 md:p-8 lg:px-20 lg:py-16 xl:px-24 xl:py-20" style={{ backgroundColor: '#0D0D0D', borderColor: '#4C4848' }}>
            {/* Header */}
            <div className="text-center mb-8 lg:mb-12">
              <p className="text-gray-400 text-sm mb-4">Stratum V2 provides</p>
              <h2 className="text-2xl md:text-3xl lg:text-4xl font-bold text-white">
                For mining operations with 10% margins
              </h2>
            </div>
            
            {/* Benefits Grid */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 lg:gap-6 w-full max-w-6xl">
              {/* Up to 7.4% */}
              <div className="border p-4 md:p-6 text-left rounded-2xl" style={{ backgroundColor: '#09090B', borderColor: '#4C4848' }}>
                <div className="mb-4">
                  <img src="/assets/NetworkConfigurationsIcon.svg" alt="Network Configuration" className="w-8 h-8 md:w-10 md:h-10" />
                </div>
                <h3 className="text-white font-semibold text-base md:text-lg mb-2">Up to 7.4%</h3>
                <p className="text-gray-400 text-sm">Net profit increase</p>
              </div>

              {/* Immediate benefits */}
              <div className="border p-4 md:p-6 text-left rounded-2xl" style={{ backgroundColor: '#09090B', borderColor: '#4C4848' }}>
                <div className="mb-4">
                  <img src="/assets/NetworkConfigurationsIcon.svg" alt="Network Configuration" className="w-8 h-8 md:w-10 md:h-10" />
                </div>
                <h3 className="text-white font-semibold text-base md:text-lg mb-2">Immediate benefits</h3>
                <p className="text-gray-400 text-sm">without hardware upgrades</p>
              </div>

              {/* Protection against */}
              <div className="border p-4 md:p-6 text-left rounded-2xl" style={{ backgroundColor: '#09090B', borderColor: '#4C4848' }}>
                <div className="mb-4">
                  <img src="/assets/NetworkConfigurationsIcon.svg" alt="Network Configuration" className="w-8 h-8 md:w-10 md:h-10" />
                </div>
                <h3 className="text-white font-semibold text-base md:text-lg mb-2">Protection against</h3>
                <p className="text-gray-400 text-sm">1-2% hashrate theft</p>
              </div>

              {/* Enhanced efficiency */}
              <div className="border p-4 md:p-6 text-left rounded-2xl" style={{ backgroundColor: '#09090B', borderColor: '#4C4848' }}>
                <div className="mb-4">
                  <img src="/assets/NetworkConfigurationsIcon.svg" alt="Network Configuration" className="w-8 h-8 md:w-10 md:h-10" />
                </div>
                <h3 className="text-white font-semibold text-base md:text-lg mb-2">Enhanced efficiency</h3>
                <p className="text-gray-400 text-sm">Through latency reduction</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Maximizing Your Mining Profitability Section */}
      <section className="py-16 bg-black/95">
        <div className="container mx-auto px-4">
          {/* Header */}
          <div className="text-center mb-16">
            <p className="text-gray-400 text-sm mb-4">Stratum V2 delivers increase through proven technical improvements by</p>
            <h2 className="text-4xl md:text-5xl font-bold text-white">
              Maximizing Your Mining Profitability
            </h2>
      </div>
      <div className="container mx-auto">
        <div className="grid md:grid-cols-2 gap-8">
          <LatencyJobBlockComparison />
          <ShareAcceptance />
          </div>
          </div>
        </div>
      </section>
    </main>
  );
}