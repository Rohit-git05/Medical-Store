import React from 'react';
import Head from 'next/head';
import Navbar from './Navbar';
import Footer from './Footer';
import { motion } from 'framer-motion';

export default function Layout({ children, title = 'HealStore - Medical Store' }) {
  return (
    <div className="flex min-h-screen flex-col bg-slate-50 dark:bg-slate-950 transition-colors duration-300">
      <Head>
        <title>{title}</title>
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <meta charSet="utf-8" />
      </Head>

      <Navbar />

      <motion.main
        initial={{ opacity: 0, y: 15 }}
        animate={{ opacity: 1, y: 0 }}
        exit={{ opacity: 0, y: 15 }}
        transition={{ duration: 0.35, ease: 'easeOut' }}
        className="flex-1 w-full mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8"
      >
        {children}
      </motion.main>

      <Footer />
    </div>
  );
}
