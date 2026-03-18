"use client";

import Link from "next/link";
import { useSession, signOut } from "next-auth/react";
import { useState } from "react";

export default function Header() {
  const { data: session } = useSession();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  return (
    <header className="bg-white shadow-sm sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-4">
        <div className="flex items-center justify-between h-20">
          <Link href="/" className="flex items-center gap-2">
            <span className="font-heading text-2xl md:text-3xl font-bold text-foreground">
              Cooking <span className="text-orange">With</span> Atiba
            </span>
          </Link>

          <nav className="hidden md:flex items-center gap-6">
            <Link
              href="/browse-recipes"
              className="text-foreground hover:text-orange transition font-body font-bold text-sm uppercase tracking-wide"
            >
              Browse Recipes
            </Link>
            <Link
              href="/contact"
              className="text-foreground hover:text-orange transition font-body font-bold text-sm uppercase tracking-wide"
            >
              Contact
            </Link>
            {session ? (
              <>
                <Link
                  href="/admin"
                  className="text-foreground hover:text-orange transition font-body font-bold text-sm uppercase tracking-wide"
                >
                  My Account
                </Link>
                <button
                  onClick={() => signOut()}
                  className="btn-orange text-sm"
                >
                  Sign Out
                </button>
              </>
            ) : (
              <Link href="/login" className="btn-orange text-sm">
                Login
              </Link>
            )}
          </nav>

          <button
            className="md:hidden p-2"
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
          >
            <svg
              className="w-6 h-6"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              {mobileMenuOpen ? (
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M6 18L18 6M6 6l12 12"
                />
              ) : (
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M4 6h16M4 12h16M4 18h16"
                />
              )}
            </svg>
          </button>
        </div>

        {mobileMenuOpen && (
          <nav className="md:hidden pb-4 flex flex-col gap-3">
            <Link
              href="/browse-recipes"
              className="text-foreground hover:text-orange transition font-body font-bold text-sm uppercase tracking-wide"
              onClick={() => setMobileMenuOpen(false)}
            >
              Browse Recipes
            </Link>
            <Link
              href="/contact"
              className="text-foreground hover:text-orange transition font-body font-bold text-sm uppercase tracking-wide"
              onClick={() => setMobileMenuOpen(false)}
            >
              Contact
            </Link>
            {session ? (
              <>
                <Link
                  href="/admin"
                  className="text-foreground hover:text-orange transition font-body font-bold text-sm uppercase tracking-wide"
                  onClick={() => setMobileMenuOpen(false)}
                >
                  My Account
                </Link>
                <button
                  onClick={() => signOut()}
                  className="btn-orange text-sm w-fit"
                >
                  Sign Out
                </button>
              </>
            ) : (
              <Link
                href="/login"
                className="btn-orange text-sm w-fit"
                onClick={() => setMobileMenuOpen(false)}
              >
                Login
              </Link>
            )}
          </nav>
        )}
      </div>
    </header>
  );
}
