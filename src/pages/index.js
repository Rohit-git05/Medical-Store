import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/router';
import Layout from '../components/Layout';
import api from '../services/api';
import { motion } from 'framer-motion';
import { getImageUrl } from '../utils/imageHelper';
import {
  FiUploadCloud,
  FiShield,
  FiTruck,
  FiClock,
  FiCheckCircle,
  FiChevronRight
} from 'react-icons/fi';

export default function Home() {
  const [medicines, setMedicines] = useState([]);
  const [blogs, setBlogs] = useState([]);
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);
  const router = useRouter();

  useEffect(() => {
    async function fetchData() {
      try {
        const medsRes = await api.get('/medicines?limit=4');
        if (medsRes.data.success) setMedicines(medsRes.data.medicines);

        const blogsRes = await api.get('/blogs?limit=3');
        if (blogsRes.data.success) setBlogs(blogsRes.data.blogs);

        const catsRes = await api.get('/admin/categories');
        if (catsRes.data.success) setCategories(catsRes.data.categories);
      } catch (err) {
        console.error('Error fetching landing data:', err);
      } finally {
        setLoading(false);
      }
    }
    fetchData();
  }, []);

  const premiumCategories = [
    { name: 'Appetizers', icon: '🍢', color: 'from-orange-500/10 to-orange-600/10' },
    { name: 'Mains', icon: '🍔', color: 'from-red-500/10 to-red-600/10' },
    { name: 'Desserts', icon: '🍰', color: 'from-pink-500/10 to-pink-600/10' },
    { name: 'Beverages', icon: '🥤', color: 'from-blue-500/10 to-blue-600/10' },
    { name: 'Snacks', icon: '🍿', color: 'from-amber-500/10 to-amber-600/10' }
  ];

  return (
    <Layout>
      {/* Hero Section */}
      <section className="relative rounded-3xl overflow-hidden mb-12 bg-gradient-to-r from-teal-500/90 to-indigo-650/90 py-20 px-8 text-white shadow-2xl">
        <div className="max-w-2xl space-y-6">
          <motion.h1
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="text-4xl sm:text-5xl font-extrabold tracking-tight leading-tight"
          >
            Delicious Food, <br />
            Delivered Instantly.
          </motion.h1>
          <p className="text-lg text-teal-50/80">
            Order warm pizzas, gourmet burgers, local appetizers, and sweet desserts online. Superfast delivery straight to your doorstep.
          </p>
          <div className="flex flex-wrap gap-4 pt-2">
            <Link
              href="/medicines"
              className="bg-white hover:bg-slate-100 text-indigo-750 font-bold px-8 py-3 rounded-xl transition shadow-lg"
            >
              Order Food Now
            </Link>
            <Link
              href="/medicines?sort=bestSelling"
              className="bg-teal-400/20 hover:bg-teal-400/35 border border-teal-355 text-white font-bold px-8 py-3 rounded-xl transition"
            >
              Trending Menu
            </Link>
          </div>
        </div>
      </section>

      {/* Why Choose Us */}
      <section className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-16">
        <div className="glassmorphism-card p-6 flex flex-col items-center text-center">
          <span className="flex h-12 w-12 items-center justify-center rounded-xl bg-teal-500/10 text-teal-605 mb-4">
            <FiShield size={24} />
          </span>
          <h3 className="font-bold text-lg mb-2">Hygienic Kitchens</h3>
          <p className="text-sm text-slate-400">All meals are cooked following highest hygiene standards.</p>
        </div>
        <div className="glassmorphism-card p-6 flex flex-col items-center text-center">
          <span className="flex h-12 w-12 items-center justify-center rounded-xl bg-indigo-500/10 text-indigo-605 mb-4">
            <FiTruck size={24} />
          </span>
          <h3 className="font-bold text-lg mb-2">Superfast Delivery</h3>
          <p className="text-sm text-slate-400">Fresh and piping hot food delivered at your door in 30 minutes.</p>
        </div>
        <div className="glassmorphism-card p-6 flex flex-col items-center text-center">
          <span className="flex h-12 w-12 items-center justify-center rounded-xl bg-amber-500/10 text-amber-605 mb-4">
            <FiClock size={24} />
          </span>
          <h3 className="font-bold text-lg mb-2">Realtime Tracking</h3>
          <p className="text-sm text-slate-400">Track your order status and rider location in real-time.</p>
        </div>
        <div className="glassmorphism-card p-6 flex flex-col items-center text-center">
          <span className="flex h-12 w-12 items-center justify-center rounded-xl bg-purple-500/10 text-purple-655 mb-4">
            <FiCheckCircle size={24} />
          </span>
          <h3 className="font-bold text-lg mb-2">Easy Refunds</h3>
          <p className="text-sm text-slate-400">Hassle-free refunds if your culinary experience isn't perfect.</p>
        </div>
      </section>

      {/* Category Section */}
      <section className="mb-16">
        <h2 className="text-2xl font-extrabold mb-6 tracking-tight">Shop by Category</h2>
        <div className="grid grid-cols-2 sm:grid-cols-4 md:grid-cols-8 gap-4">
          {premiumCategories.map((cat) => (
            <Link
              key={cat.name}
              href={`/medicines?categoryName=${cat.name}`}
              className="flex flex-col items-center justify-center p-4 bg-white dark:bg-slate-900 border border-slate-100 dark:border-slate-800 rounded-2xl hover:shadow-xl hover:border-teal-500/20 transition duration-300 transform hover:-translate-y-1"
            >
              <span className="text-3xl mb-2">{cat.icon}</span>
              <span className="text-xs font-bold text-slate-450 dark:text-slate-300 text-center">{cat.name}</span>
            </Link>
          ))}
        </div>
      </section>

      {/* Upload Prescription Call-To-Action Banner */}
      <section className="glassmorphism-card bg-gradient-to-r from-indigo-50/50 to-teal-50/50 dark:from-slate-900/40 dark:to-slate-900/10 p-8 rounded-3xl flex flex-col md:flex-row items-center justify-between gap-6 mb-16 border border-slate-205/30">
        <div className="space-y-2 max-w-xl">
          <h2 className="text-2xl font-extrabold tracking-tight">Special Promo: Get 30% OFF</h2>
          <p className="text-sm text-slate-400">
            Feeling hungry? Enter coupon code <strong className="text-orange-500">BITE30</strong> at checkout to claim 30% discount on your order. Valid today!
          </p>
        </div>
        <Link
          href="/medicines"
          className="btn-primary py-3 px-8 text-sm flex items-center gap-2"
        >
          Browse Delicious Menu
        </Link>
      </section>

      {/* Featured Medicines List */}
      <section className="mb-16">
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-2xl font-extrabold tracking-tight">Trending Dishes</h2>
          <Link href="/medicines" className="text-teal-500 hover:text-teal-600 font-bold text-sm flex items-center gap-1">
            View Menu <FiChevronRight />
          </Link>
        </div>

        {loading ? (
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
            {Array.from({ length: 4 }).map((_, idx) => (
              <div key={idx} className="glassmorphism rounded-2xl p-4 animate-pulse">
                <div className="h-40 bg-slate-200 dark:bg-slate-800 rounded-xl mb-4" />
                <div className="h-4 bg-slate-200 dark:bg-slate-850 rounded w-2/3 mb-2" />
                <div className="h-4 bg-slate-200 dark:bg-slate-850 rounded w-1/2" />
              </div>
            ))}
          </div>
        ) : (
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
            {medicines.map((med) => (
              <div
                key={med._id}
                className="flex flex-col bg-white dark:bg-slate-900 border border-slate-105/50 dark:border-slate-800 rounded-2xl p-4 shadow-sm hover:shadow-xl hover:border-teal-500/10 transition duration-300"
              >
                <div className="relative h-40 w-full mb-4 rounded-xl overflow-hidden bg-slate-50 flex items-center justify-center">
                  <img
                    src={getImageUrl(med.images?.[0])}
                    alt={med.name}
                    className="max-h-full max-w-full object-contain"
                  />
                  {med.discount > 0 && (
                    <span className="absolute top-2 left-2 bg-rose-500 text-white text-[10px] font-bold px-2 py-0.5 rounded-full">
                      -{med.discount}% OFF
                    </span>
                  )}
                </div>

                <div className="flex-1 flex flex-col justify-between">
                  <div>
                    <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400">
                      {med.brand?.name || 'CUISINE'}
                    </span>
                    <h3 className="font-bold text-sm mt-1 truncate">{med.name}</h3>
                    <p className="text-xs text-slate-400 truncate mb-4">{med.genericName}</p>
                  </div>

                  <div className="flex justify-between items-center mt-auto">
                    <div>
                      <span className="font-extrabold text-teal-605 dark:text-teal-400">₹{med.sellingPrice}</span>
                      {med.discount > 0 && (
                        <span className="text-xs text-slate-400 line-through ml-2">₹{med.MRP}</span>
                      )}
                    </div>
                    <Link
                      href={`/medicines/${med._id}`}
                      className="border border-teal-500/20 hover:bg-teal-500 hover:text-white text-teal-500 font-bold px-3 py-1.5 rounded-xl text-xs transition"
                    >
                      Details
                    </Link>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </section>

      {/* Blogs list section */}
      <section className="mb-16">
        <h2 className="text-2xl font-extrabold mb-6 tracking-tight">Food & Culinary Insights</h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {blogs.length === 0 ? (
            // Mock blogs placeholders if DB is empty
            Array.from({ length: 3 }).map((_, idx) => (
              <div key={idx} className="glassmorphism rounded-2xl overflow-hidden border border-slate-100 dark:border-slate-800">
                <div className="h-48 bg-slate-100 dark:bg-slate-850" />
                <div className="p-4 space-y-2">
                  <div className="h-4 bg-slate-200 dark:bg-slate-800 rounded w-1/3" />
                  <div className="h-5 bg-slate-200 dark:bg-slate-800 rounded w-full" />
                  <div className="h-4 bg-slate-200 dark:bg-slate-800 rounded w-2/3" />
                </div>
              </div>
            ))
          ) : (
            blogs.map((blog) => (
              <div key={blog._id} className="bg-white dark:bg-slate-900 border border-slate-105/50 dark:border-slate-800 rounded-2xl overflow-hidden shadow-sm hover:shadow-xl transition">
                <img
                  src={blog.image || 'https://images.unsplash.com/photo-1506126613408-eca07ce68773?w=300&auto=format&fit=crop&q=60'}
                  alt={blog.title}
                  className="h-48 w-full object-cover"
                />
                <div className="p-5">
                  <span className="text-[10px] font-bold text-teal-500 bg-teal-500/10 px-2 py-1 rounded-full uppercase tracking-wider">
                    {blog.category}
                  </span>
                  <h3 className="font-bold text-lg mt-3 line-clamp-2">{blog.title}</h3>
                  <p className="text-slate-400 text-xs mt-2">Published: {new Date(blog.createdAt).toLocaleDateString()}</p>
                </div>
              </div>
            ))
          )}
        </div>
      </section>
    </Layout>
  );
}
