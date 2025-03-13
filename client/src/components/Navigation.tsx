import { useState } from 'react';
import { Link, useLocation } from 'wouter';
import { Button } from '@/components/ui/button';
import { Menu, X, Globe } from 'lucide-react';
import { useTranslation } from 'react-i18next';
import { motion, AnimatePresence } from 'framer-motion';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';

const languages = [
  { code: 'en', name: 'English' },
  { code: 'ru', name: 'Русский' },
  { code: 'zh', name: '中文' },
];

export function Navigation() {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const { t, i18n } = useTranslation();
  const [location] = useLocation();

  const navLinks = [
    { href: '/miners', label: t('navigation.miners') },
    { href: '/pools', label: t('navigation.pools') },
    { href: '/developers', label: t('navigation.developers') },
    { href: '/blog', label: 'Blog' },
  ];

  const changeLanguage = (lng: string) => {
    i18n.changeLanguage(lng);
  };

  return (
    <header className="fixed top-0 left-0 right-0 z-50 py-4 backdrop-blur-sm bg-background/80 border-b border-border/40">
      <nav
        className="container mx-auto px-4"
        role="navigation"
        aria-label="Main navigation"
      >
        <div className="flex items-center justify-between">
          {/* Logo */}
          <Link href="/">
            <a
              className="text-foreground focus:outline-none focus:ring-2 focus:ring-cyan-500 rounded-lg p-1"
              aria-label="Go to homepage"
            >
              <img
                src="/assets/sv2-logo.png"
                alt="Stratum V2 Logo"
                className="h-10 w-auto brightness-200"
                width={32}
                height={32}
              />
            </a>
          </Link>

          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center gap-8">
            {navLinks.map(({ href, label }) => (
              <Link key={href} href={href}>
                <a
                  className={`text-sm transition-colors focus:outline-none focus:ring-2 focus:ring-cyan-500 rounded-lg px-2 py-1 ${
                    location === href
                      ? 'text-foreground font-medium'
                      : 'text-muted-foreground hover:text-foreground'
                  }`}
                  aria-current={location === href ? 'page' : undefined}
                >
                  {label}
                </a>
              </Link>
            ))}

            {/* Language Selector */}
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button
                  variant="ghost"
                  size="sm"
                  className="gap-2 focus:ring-2 focus:ring-cyan-500"
                  aria-label={t('navigation.language')}
                >
                  <Globe className="w-4 h-4" />
                  <span className="sr-only">{t('navigation.language')}</span>
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end" className="w-32">
                {languages.map((lang) => (
                  <DropdownMenuItem
                    key={lang.code}
                    onClick={() => changeLanguage(lang.code)}
                    className="cursor-pointer focus:text-cyan-500"
                    role="menuitem"
                  >
                    {lang.name}
                  </DropdownMenuItem>
                ))}
              </DropdownMenuContent>
            </DropdownMenu>

            <Button
              size="sm"
              className="bg-cyan-500 hover:bg-cyan-600 text-background focus:ring-2 focus:ring-cyan-500 focus:ring-offset-2 focus:ring-offset-background"
              aria-label={t('navigation.getStarted')}
            >
              {t('navigation.getStarted')}
            </Button>
          </div>

          {/* Mobile Menu Button */}
          <button
            className="md:hidden p-2 text-muted-foreground hover:text-foreground focus:outline-none focus:ring-2 focus:ring-cyan-500 rounded-lg"
            onClick={() => setIsMenuOpen(!isMenuOpen)}
            aria-label={isMenuOpen ? 'Close menu' : 'Open menu'}
            aria-expanded={isMenuOpen}
            aria-controls="mobile-menu"
          >
            {isMenuOpen ? (
              <X className="w-6 h-6" />
            ) : (
              <Menu className="w-6 h-6" />
            )}
          </button>
        </div>

        {/* Mobile Navigation */}
        <AnimatePresence>
          {isMenuOpen && (
            <motion.div
              id="mobile-menu"
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: 'auto' }}
              exit={{ opacity: 0, height: 0 }}
              transition={{ duration: 0.2 }}
              className="md:hidden absolute top-full left-0 right-0 bg-background/95 backdrop-blur-sm border-t border-border"
            >
              <div className="flex flex-col gap-4 p-4">
                {navLinks.map(({ href, label }) => (
                  <Link key={href} href={href}>
                    <a
                      className={`text-sm transition-colors focus:outline-none focus:ring-2 focus:ring-cyan-500 rounded-lg px-2 py-1 ${
                        location === href
                          ? 'text-foreground font-medium'
                          : 'text-muted-foreground hover:text-foreground'
                      }`}
                      onClick={() => setIsMenuOpen(false)}
                      aria-current={location === href ? 'page' : undefined}
                    >
                      {label}
                    </a>
                  </Link>
                ))}

                {/* Mobile Language Selector */}
                <div className="border-t border-border pt-4">
                  <p
                    className="text-sm text-muted-foreground mb-2"
                    id="mobile-language-label"
                  >
                    {t('navigation.language')}
                  </p>
                  <div
                    className="grid grid-cols-3 gap-2"
                    role="radiogroup"
                    aria-labelledby="mobile-language-label"
                  >
                    {languages.map((lang) => (
                      <Button
                        key={lang.code}
                        variant="outline"
                        size="sm"
                        onClick={() => {
                          changeLanguage(lang.code);
                          setIsMenuOpen(false);
                        }}
                        className="focus:ring-2 focus:ring-cyan-500"
                        role="radio"
                        aria-checked={i18n.language === lang.code}
                      >
                        {lang.name}
                      </Button>
                    ))}
                  </div>
                </div>

                <Button
                  size="sm"
                  className="bg-cyan-500 hover:bg-cyan-600 text-background w-full focus:ring-2 focus:ring-cyan-500 focus:ring-offset-2 focus:ring-offset-background"
                  onClick={() => setIsMenuOpen(false)}
                  aria-label={t('navigation.getStarted')}
                >
                  {t('navigation.getStarted')}
                </Button>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </nav>
    </header>
  );
}
