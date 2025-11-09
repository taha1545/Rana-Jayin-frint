'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { useTranslation } from '@/hooks/useTranslation';
import ThemeToggle from '@/components/ui/ThemeToggle';
import LanguageToggle from '@/components/ui/LanguageToggle';
import { Menu, X, ChevronDown, User, LogOut } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useRouter } from 'next/navigation';

export default function Navbar() {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isUserMenuOpen, setIsUserMenuOpen] = useState(false);
  const [user, setUser] = useState(null);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const { t } = useTranslation();
  const router = useRouter();

  useEffect(() => {
    // 
    const storedUser = localStorage.getItem('user');
    const token = localStorage.getItem('token');
    if (storedUser && token) {
      setUser(JSON.parse(storedUser));
      setIsAuthenticated(true);
    } else {
      setUser(null);
      setIsAuthenticated(false);
    }
  }, []);

  const handleLogout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    setUser(null);
    setIsAuthenticated(false);
    setIsUserMenuOpen(false);
    setIsMenuOpen(false);
    router.push('/');
  };

  const isClient = isAuthenticated && user?.role === 'client';
  const isMember = isAuthenticated && user?.role === 'member';

  const menuLinks = [
    { href: '/', label: t('nav.home') },
    { href: '/contact', label: t('nav.contact') },
    { href: '/map', label: t('nav.map') },
    { href: '/services', label: t('nav.services') },
  ];

  return (
    <nav className="bg-background text-foreground fixed w-full z-50 top-0 left-0 border-b border-border transition-colors duration-300 rtl:text-center">
      <div className="max-w-screen-xl flex flex-wrap items-center justify-between mx-auto py-3">

        {/* Logo */}
        <Link href="/" className="flex items-center justify-center space-x-3 rtl:space-x-reverse h-full lg:w-[20%] w-32">
          <img src="/logo.svg" className="h-full w-full" alt="Logo" />
        </Link>

        {/* Desktop Menu */}
        {!isMember && (
          <div className="hidden md:flex items-center space-x-10 rtl:space-x-8 mt-2">
            {menuLinks.map(link => (
              <Link
                key={link.href}
                href={link.href}
                className="text-secondary-foreground hover:text-primary transition-colors duration-200 text-lg"
              >
                {link.label}
              </Link>
            ))}
          </div>
        )}

        {/* Right Section */}
        <div className="flex items-center space-x-3 md:space-x-4 rtl:space-x-5">
          {/* Desktop Theme & Language */}
          <div className="hidden md:flex items-center space-x-3 px-4">
            <LanguageToggle />
            <ThemeToggle />
          </div>

          {/* Auth Buttons */}
          <div className="hidden md:flex items-center space-x-3">
            {isAuthenticated ? (
              <div className="relative">
                <button
                  onClick={() => setIsUserMenuOpen(!isUserMenuOpen)}
                  className="flex items-center space-x-2 rtl:space-x-reverse text-secondary-foreground hover:text-primary transition-colors duration-200"
                >
                  <User className="w-5 h-5" />
                  <span>{user?.name || t('common.user')}</span>
                  <ChevronDown className="w-4 h-4" />
                </button>

                {isUserMenuOpen && (
                  <div className="absolute right-0 rtl:right-auto rtl:left-0 top-full mt-2 w-48 bg-card text-card-foreground rounded-lg shadow-lg border border-border py-2 z-50">
                    {isMember && (
                      <Link
                        href="/membre/dashbord"
                        className="block px-4 py-2 text-sm hover:bg-muted transition-colors duration-200"
                        onClick={() => setIsUserMenuOpen(false)}
                      >
                        {t('dashboard.dashboard')}
                      </Link>
                    )}
                    <button
                      onClick={handleLogout}
                      className="w-full text-left px-4 py-2 text-sm flex items-center space-x-2 rtl:space-x-2 hover:bg-muted text-destructive transition-colors duration-200"
                    >
                      <LogOut className="w-4 h-4" />
                      <span>{t('auth.logout')}</span>
                    </button>
                  </div>
                )}
              </div>
            ) : (
              <div className="flex items-center gap-3">
                <Link href="/auth/login" passHref>
                  <Button variant="ghost" className="text-base font-medium">
                    {t('nav.login')}
                  </Button>
                </Link>
                <Link href="/auth/signup" passHref>
                  <Button className="text-base font-semibold">
                    {t('nav.freeTrial')}
                  </Button>
                </Link>
              </div>
            )}
          </div>

          {/* Mobile Menu Button */}
          <button
            onClick={() => setIsMenuOpen(!isMenuOpen)}
            className="inline-flex items-center p-2 w-10 h-10 justify-center text-sm text-muted-foreground rounded-lg md:hidden hover:bg-muted transition-colors duration-200"
          >
            {isMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
          </button>
        </div>

        {/* Mobile Menu */}
        {isMenuOpen && (
          <div className="md:hidden w-full mt-4 bg-card border border-border rounded-lg p-4 transition-colors duration-300">
            {!isMember && (
              <>
                <div className="flex items-center justify-between mb-4 pb-4 border-b border-border">
                  <span className="text-sm text-muted-foreground">{t('common.settings')}:</span>
                  <div className="flex items-center space-x-2 rtl:space-x-reverse">
                    <LanguageToggle />
                    <ThemeToggle />
                  </div>
                </div>
                {menuLinks.map(link => (
                  <Link
                    key={link.href}
                    href={link.href}
                    onClick={() => setIsMenuOpen(false)}
                    className="block py-2 px-3 hover:bg-muted rounded transition"
                  >
                    {link.label}
                  </Link>
                ))}
              </>
            )}

            {/* Mobile Auth */}
            <div className="flex flex-col space-y-2 mt-4 pt-4 border-t border-border">
              {isAuthenticated ? (
                <>
                  {isMember && (
                    <Link
                      href="/membre/dashbord"
                      className="block py-2 px-3 text-center border border-border rounded-lg hover:bg-muted transition"
                      onClick={() => setIsMenuOpen(false)}
                    >
                      {t('dashboard.dashboard')}
                    </Link>
                  )}
                  <button
                    onClick={handleLogout}
                    className="block py-2 px-3 text-center bg-destructive text-white rounded-lg hover:bg-red-700 transition"
                  >
                    {t('auth.logout')}
                  </button>
                </>
              ) : (
                <>
                  <Link
                    href="/auth/login"
                    className="block py-2 px-3 text-center border border-border rounded-lg hover:bg-muted transition"
                    onClick={() => setIsMenuOpen(false)}
                  >
                    {t('nav.login')}
                  </Link>
                  <Link
                    href="/auth/signup"
                    className="block py-2 px-3 text-center bg-primary text-primary-foreground rounded-lg hover:bg-primary/90 transition"
                    onClick={() => setIsMenuOpen(false)}
                  >
                    {t('nav.freeTrial')}
                  </Link>
                </>
              )}
            </div>
          </div>
        )}
      </div>
    </nav>
  );
}
