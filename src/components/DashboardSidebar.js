import React from 'react';
import Link from 'next/link';
import { useRouter } from 'next/router';
import { useAuth } from '../context/AuthContext';
import {
  FiGrid,
  FiUser,
  FiBox,
  FiFileText,
  FiShoppingBag,
  FiAlertTriangle,
  FiTrendingUp,
  FiSettings,
  FiTag,
  FiBookOpen,
  FiUsers,
  FiHome,
  FiMapPin,
  FiHeart
} from 'react-icons/fi';

export default function DashboardSidebar() {
  const { user } = useAuth();
  const router = useRouter();

  if (!user) return null;

  const currentPath = router.pathname;

  const getAdminLinks = () => [
    { label: 'Analytics', href: '/dashboard/admin', icon: <FiTrendingUp /> },
    { label: 'Medicines', href: '/dashboard/admin/medicines', icon: <FiBox /> },
    { label: 'Orders', href: '/dashboard/admin/orders', icon: <FiShoppingBag /> },
    { label: 'Users Manager', href: '/dashboard/admin/users', icon: <FiUsers /> },
    { label: 'Coupons', href: '/dashboard/admin/coupons', icon: <FiTag /> },
    { label: 'Blogs & Articles', href: '/dashboard/admin/blogs', icon: <FiBookOpen /> },
    { label: 'Suppliers', href: '/dashboard/admin/suppliers', icon: <FiFileText /> },
    { label: 'Store Settings', href: '/dashboard/admin/settings', icon: <FiSettings /> }
  ];

  const getPharmacistLinks = () => [
    { label: 'Dashboard', href: '/dashboard/pharmacist', icon: <FiGrid /> },
    { label: 'Inventory', href: '/dashboard/pharmacist/inventory', icon: <FiBox /> },
    { label: 'Prescriptions', href: '/dashboard/pharmacist/prescriptions', icon: <FiFileText /> },
    { label: 'Orders Processing', href: '/dashboard/pharmacist/orders', icon: <FiShoppingBag /> }
  ];

  const getCustomerLinks = () => [
    { label: 'My Profile', href: '/dashboard/customer', icon: <FiUser /> },
    { label: 'Order History', href: '/dashboard/customer/orders', icon: <FiShoppingBag /> },
    { label: 'My Addresses', href: '/dashboard/customer/addresses', icon: <FiMapPin /> },
    { label: 'Wishlist', href: '/dashboard/customer/wishlist', icon: <FiHeart /> },
    { label: 'Prescriptions', href: '/dashboard/customer/prescriptions', icon: <FiFileText /> }
  ];

  const links =
    user.role === 'admin'
      ? getAdminLinks()
      : user.role === 'pharmacist'
      ? getPharmacistLinks()
      : getCustomerLinks();

  return (
    <aside className="w-full md:w-64 glassmorphism border border-slate-200/50 dark:border-slate-800/40 rounded-2xl p-4 shrink-0 flex flex-col gap-2">
      {/* Header Info */}
      <div className="flex items-center gap-3 p-2 mb-4 border-b border-slate-200/50 dark:border-slate-850/50 pb-4">
        <img
          src={user.profilePicture || `https://api.dicebear.com/7.x/initials/svg?seed=${user.name}`}
          alt={user.name}
          className="w-12 h-12 rounded-xl object-cover ring-2 ring-teal-500/50"
        />
        <div>
          <div className="font-bold text-sm tracking-tight truncate max-w-[120px]">{user.name}</div>
          <div className="text-xs font-semibold text-slate-400 capitalize">{user.role}</div>
        </div>
      </div>

      {/* Nav List */}
      <nav className="flex flex-row md:flex-col overflow-x-auto md:overflow-x-visible gap-1 scrollbar-none pb-2 md:pb-0">
        {links.map((link) => {
          const isActive = currentPath === link.href;
          return (
            <Link
              key={link.label}
              href={link.href}
              className={`flex items-center gap-3 px-4 py-2.5 rounded-xl text-sm font-semibold transition shrink-0 ${
                isActive
                  ? 'bg-gradient-to-r from-teal-500/10 to-indigo-500/10 text-teal-650 dark:text-teal-450 border-l-2 border-teal-500'
                  : 'text-slate-500 hover:bg-slate-100 dark:hover:bg-slate-850 hover:text-slate-800 dark:hover:text-slate-200'
              }`}
            >
              {link.icon}
              <span>{link.label}</span>
            </Link>
          );
        })}
      </nav>
    </aside>
  );
}
