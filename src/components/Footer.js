import React from 'react';
import Link from 'next/link';
import { FiMail, FiPhone, FiMapPin, FiHeart } from 'react-icons/fi';

export default function Footer() {
  const handleNewsletterSubmit = (e) => {
    e.preventDefault();
    alert('Thank you for subscribing to our newsletter!');
  };

  return (
    <footer className="w-full bg-slate-900 text-slate-400 border-t border-slate-800">
      <div className="mx-auto max-w-7xl px-4 py-12 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          {/* Brand Info */}
          <div className="space-y-4">
            <div className="flex items-center gap-2">
              <span className="flex h-10 w-10 items-center justify-center rounded-xl bg-gradient-to-tr from-teal-400 to-indigo-600 text-xl font-bold text-white shadow-lg">
                H
              </span>
              <span className="text-xl font-extrabold tracking-tight text-white">
                HealStore
              </span>
            </div>
            <p className="text-sm">
              Your trusted partner for health and wellness. We deliver original medicines, healthcare products, and consulting services right to your doorstep.
            </p>
          </div>

          {/* Quick Links */}
          <div>
            <h3 className="text-white font-semibold mb-4 text-sm uppercase tracking-wider">Quick Links</h3>
            <ul className="space-y-2 text-sm">
              <li>
                <Link href="/medicines" className="hover:text-white transition">Medicines Listing</Link>
              </li>
              <li>
                <Link href="/blogs" className="hover:text-white transition">Health Blogs</Link>
              </li>
              <li>
                <Link href="/prescriptions" className="hover:text-white transition">Upload Prescription</Link>
              </li>
              <li>
                <Link href="/faqs" className="hover:text-white transition">FAQs & Help</Link>
              </li>
            </ul>
          </div>

          {/* Contact Details */}
          <div>
            <h3 className="text-white font-semibold mb-4 text-sm uppercase tracking-wider">Contact Us</h3>
            <ul className="space-y-3 text-sm">
              <li className="flex items-center gap-2">
                <FiMail className="text-teal-400" /> support@healstore.com
              </li>
              <li className="flex items-center gap-2">
                <FiPhone className="text-teal-400" /> +91 1800 200 4567
              </li>
              <li className="flex items-center gap-2">
                <FiMapPin className="text-teal-400" /> 12 Sector, HSR Layout, Bangalore, India
              </li>
            </ul>
          </div>

          {/* Newsletter subscription */}
          <div>
            <h3 className="text-white font-semibold mb-4 text-sm uppercase tracking-wider">Newsletter</h3>
            <p className="text-sm mb-3">Subscribe to get medicine reminder alerts and fitness nutrition tips!</p>
            <form onSubmit={handleNewsletterSubmit} className="flex gap-2">
              <input
                type="email"
                required
                placeholder="Your email address"
                className="w-full bg-slate-800 border border-slate-705 text-white placeholder-slate-500 rounded-xl px-3 py-2 text-sm focus:outline-none focus:ring-1 focus:ring-teal-500"
              />
              <button
                type="submit"
                className="bg-teal-500 hover:bg-teal-600 text-white font-medium px-4 py-2 rounded-xl text-sm transition"
              >
                Join
              </button>
            </form>
          </div>
        </div>

        <hr className="my-8 border-slate-800" />

        <div className="flex flex-col sm:flex-row items-center justify-between text-xs text-slate-500 gap-4">
          <p>© {new Date().getFullYear()} HealStore Pharmacy. All rights reserved.</p>
          <p className="flex items-center gap-1">
            Made with <FiHeart className="text-red-500 fill-current" /> for healthy communities
          </p>
        </div>
      </div>
    </footer>
  );
}
