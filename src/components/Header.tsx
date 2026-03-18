"use client";

import Link from "next/link";
import { useSession, signOut } from "next-auth/react";
import { useState } from "react";

export default function Header() {
  const { data: session } = useSession();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  return (
    <header className="bg-white sticky top-0 z-50 border-b border-border">
      {/* Top bar */}
      <div className="max-w-6xl mx-auto px-4">
        {/* Logo */}
        <div className="flex items-center justify-center py-4">
          <Link href="/">
            <img
              src="/images/logo.jpg"
              alt="Cooking With Atiba"
              className="h-16 md:h-20 w-auto"
            />
          </Link>
        </div>

        {/* Navigation */}
        <nav className="hidden md:flex items-center justify-center gap-8 pb-4 text-sm">
          <Link
            href="/browse-recipes"
            className="text-text-muted hover:text-orange transition font-bold uppercase tracking-wider"
          >
            Browse Recipes
          </Link>
          <Link
            href="/contact"
            className="text-text-muted hover:text-orange transition font-bold uppercase tracking-wider"
          >
            Contact
          </Link>
          {session ? (
            <>
              <Link
                href="/admin"
                className="text-text-muted hover:text-orange transition font-bold uppercase tracking-wider"
              >
                My Account
              </Link>
              <button
                onClick={() => signOut()}
                className="text-text-muted hover:text-orange transition font-bold uppercase tracking-wider"
              >
                Sign Out
              </button>
            </>
          ) : (
            <Link
              href="/login"
              className="text-text-muted hover:text-orange transition font-bold uppercase tracking-wider"
            >
              Login / Signup
            </Link>
          )}
          <div className="flex items-center gap-3 ml-4">
            <a href="https://instagram.com/cookingwithatiba" target="_blank" rel="noopener noreferrer" className="text-text-muted hover:text-orange transition">
              <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zm0-2.163c-3.259 0-3.667.014-4.947.072-4.358.2-6.78 2.618-6.98 6.98-.059 1.281-.073 1.689-.073 4.948 0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98-1.281-.059-1.69-.073-4.949-.073zm0 5.838c-3.403 0-6.162 2.759-6.162 6.162s2.759 6.163 6.162 6.163 6.162-2.759 6.162-6.163c0-3.403-2.759-6.162-6.162-6.162zm0 10.162c-2.209 0-4-1.79-4-4 0-2.209 1.791-4 4-4s4 1.791 4 4c0 2.21-1.791 4-4 4zm6.406-11.845c-.796 0-1.441.645-1.441 1.44s.645 1.44 1.441 1.44c.795 0 1.439-.645 1.439-1.44s-.644-1.44-1.439-1.44z" />
              </svg>
            </a>
            <a href="https://youtube.com/@cookingwithatiba" target="_blank" rel="noopener noreferrer" className="text-text-muted hover:text-orange transition">
              <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                <path d="M23.498 6.186a3.016 3.016 0 0 0-2.122-2.136C19.505 3.545 12 3.545 12 3.545s-7.505 0-9.377.505A3.017 3.017 0 0 0 .502 6.186C0 8.07 0 12 0 12s0 3.93.502 5.814a3.016 3.016 0 0 0 2.122 2.136c1.871.505 9.376.505 9.376.505s7.505 0 9.377-.505a3.015 3.015 0 0 0 2.122-2.136C24 15.93 24 12 24 12s0-3.93-.502-5.814zM9.545 15.568V8.432L15.818 12l-6.273 3.568z" />
              </svg>
            </a>
          </div>
        </nav>

        {/* Mobile menu button */}
        <div className="md:hidden flex items-center justify-end pb-4">
          <button
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="p-2 text-foreground"
          >
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              {mobileMenuOpen ? (
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              ) : (
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
              )}
            </svg>
          </button>
        </div>

        {mobileMenuOpen && (
          <nav className="md:hidden pb-4 flex flex-col gap-3 border-t border-border pt-4">
            <Link href="/browse-recipes" className="text-text-muted hover:text-orange font-bold uppercase text-sm tracking-wider" onClick={() => setMobileMenuOpen(false)}>Browse Recipes</Link>
            <Link href="/contact" className="text-text-muted hover:text-orange font-bold uppercase text-sm tracking-wider" onClick={() => setMobileMenuOpen(false)}>Contact</Link>
            {session ? (
              <>
                <Link href="/admin" className="text-text-muted hover:text-orange font-bold uppercase text-sm tracking-wider" onClick={() => setMobileMenuOpen(false)}>My Account</Link>
                <button onClick={() => signOut()} className="text-left text-text-muted hover:text-orange font-bold uppercase text-sm tracking-wider">Sign Out</button>
              </>
            ) : (
              <Link href="/login" className="text-text-muted hover:text-orange font-bold uppercase text-sm tracking-wider" onClick={() => setMobileMenuOpen(false)}>Login / Signup</Link>
            )}
          </nav>
        )}
      </div>
    </header>
  );
}
