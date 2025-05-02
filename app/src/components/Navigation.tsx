import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Menu, X, Globe } from "lucide-react";
import { useTranslation } from "react-i18next";
import { motion, AnimatePresence } from "framer-motion";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu";
import { NavLink, useLocation } from "react-router";
import { NavigationMenu, NavigationMenuItem, NavigationMenuLink, NavigationMenuList } from "@/components/ui/navigation-menu";

const languages = [
  { code: "en", name: "English" },
  { code: "ru", name: "Русский" },
  { code: "zh", name: "中文" },
];

interface NavLink {
  to: string;
  label: string;
  icon?: React.ComponentType<{ className?: string }>;
  children?: NavChild[];
}

interface NavChild {
  to: string;
  label: string;
  icon?: React.ComponentType<{ className?: string }>;
}

export function Navigation() {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const { t, i18n } = useTranslation();
  const location = useLocation();

  const navLinks: NavLink[] = [
    { to: "/miners", label: "Miners" },
    { to: "/pools", label: "Pools" },
    { to: "/developers", label: "Developers" },
    { to: "/resources", label: "Resources" },
    { to: "/specifications", label: "Specifications" },
  ];

  const changeLanguage = (lng: string) => {
    i18n.changeLanguage(lng);
  };

  return (
    <header className='fixed top-0 left-0 right-0 z-50 py-4'>
      <nav className='container mx-auto px-4 flex justify-center' role='navigation' aria-label='Main navigation'>
        <div className='w-full flex items-center justify-between'>
          {/* Logo */}
          <NavLink className='text-foreground focus:outline-none focus:ring-2 focus:ring-cyan-500 p-1' aria-label='Go to homepage' to='/'>
            <img src='/assets/sv2-logo.png' alt='Stratum V2 Logo' className='h-10 w-auto brightness-200' width={32} height={32} />
          </NavLink>

          {/* Desktop Navigation - Centered */}
          <div className='hidden lg:block absolute left-1/2 -translate-x-1/2'>
            {/* <div className='hidden md:block absolute left-1/2 -translate-x-1/2'> */}
            <div className='bg-[#2F2F2F] backdrop-blur-sm'>
              <NavigationMenu className='h-10'>
                <NavigationMenuList className='space-x-0 p-1'>
                  {navLinks.map((link) => (
                    <NavigationMenuItem key={link.to} className='data-[state=open]:bg-[#000]'>
                      <NavigationMenuLink
                        asChild
                        className='text-gray-300 hover:text-white px-4 py-2 text-sm font-medium transition-colors focus:outline-none relative group/item'
                      >
                        <NavLink to={link.to} className='relative block'>
                          <span className='relative z-10'>{link.label}</span>
                          <span className='absolute inset-0 border border-[#42B4C8] bg-[#0A2831] opacity-0 group-hover/item:opacity-100'></span>
                        </NavLink>
                      </NavigationMenuLink>
                    </NavigationMenuItem>
                  ))}
                </NavigationMenuList>
              </NavigationMenu>
            </div>
          </div>

          {/* Right side buttons */}
          <div className='hidden lg:flex items-center gap-4'>
            {/* Language Selector */}
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant='ghost' size='sm' className='gap-2 focus:ring-2 focus:ring-cyan-500' aria-label={t("navigation.language")}>
                  <Globe className='w-4 h-4' />
                  <span className='sr-only'>{t("navigation.language")}</span>
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align='end' className='w-32 bg-[#222222] border-none'>
                {languages.map((lang) => (
                  <DropdownMenuItem
                    key={lang.code}
                    onClick={() => changeLanguage(lang.code)}
                    className='cursor-pointer text-gray-300 hover:text-white hover:bg-[#000] focus:text-white focus:bg-[#000]'
                    role='menuitem'
                  >
                    {lang.name}
                  </DropdownMenuItem>
                ))}
              </DropdownMenuContent>
            </DropdownMenu>

            <Button
              size='lg'
              className='bg-cyan-custom-100 hover:bg-cyan-custom-200 text-background focus:ring-2 focus:ring-cyan-500 focus:ring-offset-2 focus:ring-offset-background'
              aria-label={t("navigation.getStarted")}
            >
              {t("navigation.getStarted")}
            </Button>
          </div>

          {/* Mobile Menu Button */}
          <button
            className='lg:hidden p-2 text-muted-foreground hover:text-foreground focus:outline-none focus:ring-2 focus:ring-cyan-500 rounded-lg'
            onClick={() => setIsMenuOpen(!isMenuOpen)}
            aria-label={isMenuOpen ? "Close menu" : "Open menu"}
            aria-expanded={isMenuOpen}
            aria-controls='mobile-menu'
          >
            {isMenuOpen ? <X className='w-6 h-6' /> : <Menu className='w-6 h-6' />}
          </button>
        </div>

        {/* Mobile Navigation */}
        <AnimatePresence>
          {isMenuOpen && (
            <motion.div
              id='mobile-menu'
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: "auto" }}
              exit={{ opacity: 0, height: 0 }}
              transition={{ duration: 0.2 }}
              className='lg:hidden absolute top-full left-0 right-0 bg-[#222222]/95 backdrop-blur-sm border-t border-[#333333]'
            >
              <div className='flex flex-col gap-4 p-4'>
                {navLinks.map((link) => (
                  <div key={link.to}>
                    <NavLink
                      className={`text-sm transition-colors focus:outline-none px-2 py-1 block relative group ${
                        location ? "text-foreground font-medium" : "text-muted-foreground hover:text-foreground"
                      }`}
                      to={link.to}
                    >
                      <span className='flex items-center gap-2 relative z-10' onClick={() => setIsMenuOpen(false)}>
                        {link.label}
                      </span>
                      <span className='absolute inset-0 border border-[#42B4C8] bg-[#0A2831] opacity-0 group-hover:opacity-100'></span>
                    </NavLink>
                  </div>
                ))}

                {/* Mobile Language Selector */}
                <div className='border-t border-[#333333] pt-4'>
                  <p className='text-sm text-muted-foreground mb-2' id='mobile-language-label'>
                    {t("navigation.language")}
                  </p>
                  <div className='grid grid-cols-3 gap-2' role='radiogroup' aria-labelledby='mobile-language-label'>
                    {languages.map((lang) => (
                      <Button
                        key={lang.code}
                        variant='outline'
                        size='sm'
                        onClick={() => {
                          changeLanguage(lang.code);
                          setIsMenuOpen(false);
                        }}
                        className='focus:ring-2 focus:ring-cyan-500'
                        role='radio'
                        aria-checked={i18n.language === lang.code}
                      >
                        {lang.name}
                      </Button>
                    ))}
                  </div>
                </div>

                <Button
                  size='sm'
                  className='bg-cyan-500 hover:bg-cyan-600 text-background w-full focus:ring-2 focus:ring-cyan-500 focus:ring-offset-2 focus:ring-offset-background'
                  onClick={() => setIsMenuOpen(false)}
                  aria-label={t("navigation.getStarted")}
                >
                  {t("navigation.getStarted")}
                </Button>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </nav>
    </header>
  );
}
