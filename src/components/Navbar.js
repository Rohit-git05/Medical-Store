import React, { useState, useEffect, useRef } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/router';
import { useAuth } from '../context/AuthContext';
import { useCart } from '../context/CartContext';
import { useTheme } from '../context/ThemeContext';
import {
  FiShoppingCart,
  FiUser,
  FiSearch,
  FiSun,
  FiMoon,
  FiLogOut,
  FiMenu,
  FiX,
  FiPlusCircle
} from 'react-icons/fi';
import api from '../services/api';

export default function Navbar() {
  const { user, logout } = useAuth();
  const { getTotals } = useCart();
  const { darkMode, toggleTheme } = useTheme();
  const { totalItems } = getTotals();
  const router = useRouter();

  const [searchQuery, setSearchQuery] = useState('');
  const [suggestions, setSuggestions] = useState([]);
  const [showSuggestions, setShowSuggestions] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [profileDropdownOpen, setProfileDropdownOpen] = useState(false);

  const suggestionRef = useRef(null);

  // Close search suggestions on click outside
  useEffect(() => {
    function handleClickOutside(event) {
      if (suggestionRef.current && !suggestionRef.current.contains(event.target)) {
        setShowSuggestions(false);
      }
    }
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  // Fetch search suggestions
  useEffect(() => {
    if (searchQuery.trim().length > 1) {
      const delayDebounce = setTimeout(async () => {
        try {
          const { data } = await api.get(`/medicines/search/suggestions?query=${searchQuery}`);
          if (data.success) {
            setSuggestions(data.suggestions);
            setShowSuggestions(true);
          }
        } catch (err) {
          console.error(err);
        }
      }, 300);
      return () => clearTimeout(delayDebounce);
    } else {
      setSuggestions([]);
      setShowSuggestions(false);
    }
  }, [searchQuery]);

  const handleSearchSubmit = (e) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      router.push(`/medicines?search=${searchQuery}`);
      setShowSuggestions(false);
    }
  };

  const handleSuggestionClick = (medId) => {
    router.push(`/medicines/${medId}`);
    setShowSuggestions(false);
    setSearchQuery('');
  };

  const getDashboardLink = () => {
    if (!user) return '/login';
    if (user.role === 'admin') return '/dashboard/admin';
    if (user.role === 'pharmacist') return '/dashboard/pharmacist';
    return '/dashboard/customer';
  };

  return (
    <nav className="sticky top-0 z-50 w-full glassmorphism shadow-sm">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="flex h-16 items-center justify-between gap-4">
          {/* Logo */}
          <div className="flex items-center">
            <Link href="/" className="flex items-center gap-2">
              <span className="flex h-10 w-10 items-center justify-center rounded-xl bg-gradient-to-tr from-teal-400 to-indigo-600 text-xl font-bold text-white shadow-lg">
                H
              </span>
              <span className="hidden text-xl font-extrabold tracking-tight bg-gradient-to-r from-teal-500 to-indigo-600 bg-clip-text text-transparent sm:block">
                HealStore
              </span>
            </Link>
          </div>

          {/* Search bar */}
          <div className="relative flex-1 max-w-md" ref={suggestionRef}>
            <form onSubmit={handleSearchSubmit} className="relative">
              <input
                type="text"
                placeholder="Search medicines, health products..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                onFocus={() => searchQuery.trim() && setShowSuggestions(true)}
                className="w-full rounded-2xl bg-slate-100 dark:bg-slate-900 border border-transparent focus:border-teal-500/30 px-4 py-2 pl-10 pr-4 text-sm focus:outline-none transition duration-200"
              />
              <FiSearch className="absolute left-3.5 top-3 text-slate-400" />
            </form>

            {/* Suggestions drop card */}
            {showSuggestions && suggestions.length > 0 && (
              <div className="absolute top-12 left-0 w-full glassmorphism-card max-h-72 overflow-y-auto z-50 p-2 border border-slate-200/50 shadow-2xl">
                {suggestions.map((med) => (
                  <button
                    key={med._id}
                    onClick={() => handleSuggestionClick(med._id)}
                    className="w-full text-left flex items-center gap-3 p-2 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-xl transition duration-150"
                  >
                    <img
                      src={med.images?.[0] || 'https://images.unsplash.com/photo-1584308666744-24d5c474f2ae?w=80&auto=format&fit=crop&q=60'}
                      alt={med.name}
                      className="w-10 h-10 rounded-lg object-cover bg-white"
                    />
                    <div>
                      <div className="font-semibold text-sm">{med.name}</div>
                      <div className="text-xs text-slate-400">{med.genericName}</div>
                    </div>
                    <div className="ml-auto font-bold text-teal-600 dark:text-teal-400 text-sm">
                      ₹{med.sellingPrice}
                    </div>
                  </button>
                ))}
              </div>
            )}
          </div>

          {/* Action buttons */}
          <div className="hidden md:flex items-center gap-4">
            <button
              onClick={toggleTheme}
              className="p-2 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-xl text-slate-500 hover:text-slate-800 dark:text-slate-400 dark:hover:text-slate-200 transition duration-150"
            >
              {darkMode ? <FiSun size={20} /> : <FiMoon size={20} />}
            </button>

            <Link
              href="/cart"
              className="relative p-2 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-xl text-slate-500 hover:text-slate-800 dark:text-slate-400 dark:hover:text-slate-200 transition duration-150"
            >
              <FiShoppingCart size={20} />
              {totalItems > 0 && (
                <span className="absolute -top-1 -right-1 flex h-5 w-5 items-center justify-center rounded-full bg-gradient-to-r from-red-500 to-pink-500 text-[10px] font-bold text-white shadow-lg ring-2 ring-white dark:ring-slate-900">
                  {totalItems}
                </span>
              )}
            </Link>

            {/* Profile Dropdown */}
            {user ? (
              <div className="relative">
                <button
                  onClick={() => setProfileDropdownOpen(!profileDropdownOpen)}
                  className="flex items-center gap-2 p-1.5 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-xl transition duration-150"
                >
                  <img
                    src={user.profilePicture || `https://api.dicebear.com/7.x/initials/svg?seed=${user.name}`}
                    alt={user.name}
                    className="w-8 h-8 rounded-lg object-cover ring-1 ring-teal-500"
                  />
                  <span className="text-sm font-semibold max-w-[80px] truncate">{user.name.split(' ')[0]}</span>
                </button>

                {profileDropdownOpen && (
                  <div className="absolute right-0 top-12 w-48 glassmorphism-card border border-slate-200/50 shadow-2xl p-2 z-50">
                    <Link
                      href={getDashboardLink()}
                      onClick={() => setProfileDropdownOpen(false)}
                      className="flex items-center gap-2 p-2 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-lg text-sm transition"
                    >
                      <FiUser /> Dashboard
                    </Link>
                    <button
                      onClick={() => {
                        setProfileDropdownOpen(false);
                        logout();
                      }}
                      className="w-full flex items-center gap-2 p-2 hover:bg-red-50 dark:hover:bg-red-950/20 text-red-650 rounded-lg text-sm transition text-left"
                    >
                      <FiLogOut /> Logout
                    </button>
                  </div>
                )}
              </div>
            ) : (
              <Link href="/login" className="btn-primary py-1.5 px-4 text-sm flex items-center gap-1.5">
                <FiUser size={16} /> Login
              </Link>
            )}
          </div>

          {/* Mobile hamburger menu */}
          <div className="flex md:hidden items-center gap-2">
            <button
              onClick={toggleTheme}
              className="p-2 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-xl"
            >
              {darkMode ? <FiSun size={18} /> : <FiMoon size={18} />}
            </button>
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="p-2 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-xl"
            >
              {mobileMenuOpen ? <FiX size={20} /> : <FiMenu size={20} />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Drawer */}
      {mobileMenuOpen && (
        <div className="md:hidden w-full border-t border-slate-200/50 dark:border-slate-800/50 p-4 space-y-3 glassmorphism transition-all duration-300">
          <Link
            href="/medicines"
            onClick={() => setMobileMenuOpen(false)}
            className="block px-4 py-2 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-xl text-sm"
          >
            Browse Medicines
          </Link>
          <Link
            href="/cart"
            onClick={() => setMobileMenuOpen(false)}
            className="block px-4 py-2 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-xl text-sm flex items-center justify-between"
          >
            Shopping Cart
            {totalItems > 0 && <span className="bg-teal-500 text-white text-xs px-2 py-0.5 rounded-full">{totalItems}</span>}
          </Link>

          {user ? (
            <>
              <Link
                href={getDashboardLink()}
                onClick={() => setMobileMenuOpen(false)}
                className="block px-4 py-2 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-xl text-sm"
              >
                Dashboard ({user.role})
              </Link>
              <button
                onClick={() => {
                  setMobileMenuOpen(false);
                  logout();
                }}
                className="w-full text-left px-4 py-2 hover:bg-red-50 dark:hover:bg-red-950/20 text-red-500 rounded-xl text-sm"
              >
                Logout
              </button>
            </>
          ) : (
            <Link
              href="/login"
              onClick={() => setMobileMenuOpen(false)}
              className="block text-center btn-primary"
            >
              Login
            </Link>
          )}
        </div>
      )}
    </nav>
  );
}
