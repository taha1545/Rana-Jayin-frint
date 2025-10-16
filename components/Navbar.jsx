'use client';

import { useState } from 'react';
import Link from 'next/link';
import { useTranslation } from '@/hooks/useTranslation';
import { useAuth } from '@/contexts/AuthContext';
import ThemeToggle from '@/components/ui/ThemeToggle';
import LanguageToggle from '@/components/ui/LanguageToggle';
import { Menu, X, ChevronDown, User, LogOut } from 'lucide-react';
import { Button } from '@/components/ui/button';

export default function Navbar() {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isUserMenuOpen, setIsUserMenuOpen] = useState(false);
  const { t } = useTranslation();
  const { user, logout, isAuthenticated } = useAuth();

  const handleLogout = () => {
    logout();
    setIsUserMenuOpen(false);
    setIsMenuOpen(false);
  };

  const isClient = isAuthenticated && user?.role === 'client';
  const isMember = isAuthenticated && user?.role === 'member';

  return (
    <nav className="bg-background text-foreground fixed w-full z-50 top-0 left-0 border-b border-border transition-colors duration-300">
      <div className="max-w-screen-xl flex flex-wrap items-center justify-between mx-auto py-3">

        {/* Logo */}
        <Link href="/" className="flex items-center justify-center space-x-3 rtl:space-x-reverse h-full w-[20%]">
          <img src="/logo.svg" className="h-full w-full" alt="rana jayin Logo" />
        </Link>

        {/* Menu  */}
        {!isMember && (
          <div className="hidden md:flex items-center space-x-10 rtl:space-x-reverse mt-2 ">
            {[
              { href: '/', label: t('nav.home') },
              { href: '/contact', label: t('nav.contact') },
              { href: '/map', label: t('nav.map') },
              { href: '/services', label: t('nav.services') },
            ].map((link) => (
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

        {/* Theme + Language + Auth */}
        <div className="flex items-center space-x-3 md:space-x-4 rtl:space-x-reverse">
          <div className="hidden md:flex items-center space-x-3 px-4">
            <LanguageToggle  />
            <ThemeToggle />
          </div>

          {/* Auth Buttons */}
          <div className="hidden md:flex items-center space-x-3">
            {isAuthenticated ? (
              <div className="relative">
                <button
                  onClick={() => setIsUserMenuOpen(!isUserMenuOpen)}
                  className="flex items-center space-x-2 text-secondary-foreground hover:text-primary transition-colors duration-200"
                >
                  <User className="w-5 h-5" />
                  <span>{user?.name || 'User'}</span>
                  <ChevronDown className="w-4 h-4" />
                </button>

                {isUserMenuOpen && (
                  <div className="absolute right-0 top-full mt-2 w-48 bg-card text-card-foreground rounded-lg shadow-lg border border-border py-2 z-50">
                    {/* */}
                    {isMember && (
                      <Link
                        href="/member/dashboard"
                        className="block px-4 py-2 text-sm hover:bg-muted transition-colors duration-200"
                        onClick={() => setIsUserMenuOpen(false)}
                      >
                        Dashboard
                      </Link>
                    )}
                    {/* */}
                    <button
                      onClick={handleLogout}
                      className="w-full text-left px-4 py-2 text-sm flex items-center space-x-2 hover:bg-muted text-destructive transition-colors duration-200"
                    >
                      <LogOut className="w-4 h-4" />
                      <span>Logout</span>
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

          {/* Mobile  */}
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
            {/* Hide menu  */}
            {!isMember && (
              <>
                <div className="flex items-center justify-between mb-4 pb-4 border-b border-border">
                  <span className="text-sm text-muted-foreground">Settings:</span>
                  <div className="flex items-center space-x-2">
                    <LanguageToggle />
                    <ThemeToggle />
                  </div>
                </div>

                {[
                  { href: '/', label: t('nav.home') },
                  { href: '/contact', label: t('nav.contact') },
                  { href: '/map', label: t('nav.map') },
                  { href: '/services', label: t('nav.services') },
                ].map((link) => (
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

            {/* Mobile Auth Section */}
            <div className="flex flex-col space-y-2 mt-4 pt-4 border-t border-border">
              {isAuthenticated ? (
                <>
                  {isMember && (
                    <Link
                      href="/member/dashboard"
                      className="block py-2 px-3 text-center border border-border rounded-lg hover:bg-muted transition"
                      onClick={() => setIsMenuOpen(false)}
                    >
                      Dashboard
                    </Link>
                  )}
                  <button
                    onClick={handleLogout}
                    className="block py-2 px-3 text-center bg-destructive text-white rounded-lg hover:bg-red-700 transition"
                  >
                    Logout
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
