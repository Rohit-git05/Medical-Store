import React, { useState, useEffect } from 'react';
import DashboardLayout from '../../../components/DashboardLayout';
import api from '../../../services/api';
import { TableSkeleton } from '../../../components/LoadingSkeleton';
import {
  FiUsers,
  FiBox,
  FiShoppingBag,
  FiDollarSign,
  FiTrash,
  FiPlus,
  FiX
} from 'react-icons/fi';

import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend,
  Filler
} from 'chart.js';
import { Line } from 'react-chartjs-2';

// Register ChartJS elements
ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend,
  Filler
);

export default function AdminDashboard() {
  const [tab, setTab] = useState('analytics');
  const [loading, setLoading] = useState(true);

  // Stats & Graphs State
  const [stats, setStats] = useState(null);
  const [charts, setCharts] = useState(null);

  // Users State
  const [users, setUsers] = useState([]);

  // Category & Brand States
  const [categories, setCategories] = useState([]);
  const [brands, setBrands] = useState([]);
  const [suppliers, setSuppliers] = useState([]);
  const [coupons, setCoupons] = useState([]);

  // Form inputs
  const [newCatName, setNewCatName] = useState('');
  const [newCatDesc, setNewCatDesc] = useState('');

  const [newBrandName, setNewBrandName] = useState('');
  const [newBrandDesc, setNewBrandDesc] = useState('');

  const [newSupName, setNewSupName] = useState('');
  const [newSupEmail, setNewSupEmail] = useState('');
  const [newSupPhone, setNewSupPhone] = useState('');
  const [newSupAddr, setNewSupAddr] = useState('');

  const [newCouponCode, setNewCouponCode] = useState('');
  const [newCouponType, setNewCouponType] = useState('percentage');
  const [newCouponAmt, setNewCouponAmt] = useState('');
  const [newCouponMin, setNewCouponMin] = useState('0');
  const [newCouponExpiry, setNewCouponExpiry] = useState('');

  useEffect(() => {
    fetchStats();
    if (tab === 'users') fetchUsers();
    if (tab === 'categories') fetchCategories();
    if (tab === 'brands') fetchBrands();
    if (tab === 'suppliers') fetchSuppliers();
    if (tab === 'coupons') fetchCoupons();
  }, [tab]);

  // --- API DISPATCHES ---
  const fetchStats = async () => {
    setLoading(true);
    try {
      const { data } = await api.get('/dashboard/stats');
      if (data.success) {
        setStats(data.stats);
        setCharts(data.charts);
      }
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const fetchUsers = async () => {
    try {
      const { data } = await api.get('/admin/users');
      if (data.success) setUsers(data.users);
    } catch (err) {
      console.error(err);
    }
  };

  const fetchCategories = async () => {
    try {
      const { data } = await api.get('/admin/categories');
      if (data.success) setCategories(data.categories);
    } catch (err) {
      console.error(err);
    }
  };

  const fetchBrands = async () => {
    try {
      const { data } = await api.get('/admin/brands');
      if (data.success) setBrands(data.brands);
    } catch (err) {
      console.error(err);
    }
  };

  const fetchSuppliers = async () => {
    try {
      const { data } = await api.get('/admin/suppliers');
      if (data.success) setSuppliers(data.suppliers);
    } catch (err) {
      console.error(err);
    }
  };

  const fetchCoupons = async () => {
    try {
      const { data } = await api.get('/coupons');
      if (data.success) setCoupons(data.coupons);
    } catch (err) {
      console.error(err);
    }
  };

  // --- SUBMISSIONS ---
  const handleUpdateUserRole = async (id, role, isActive) => {
    try {
      const { data } = await api.put(`/admin/users/${id}`, { role, isActive });
      if (data.success) {
        alert('User settings updated successfully');
        fetchUsers();
      }
    } catch (err) {
      console.error(err);
    }
  };

  const handleAddCategory = async (e) => {
    e.preventDefault();
    try {
      const { data } = await api.post('/admin/categories', { name: newCatName, description: newCatDesc });
      if (data.success) {
        setCategories([data.category, ...categories]);
        setNewCatName('');
        setNewCatDesc('');
        alert('Category created successfully');
      }
    } catch (err) {
      alert(err.response?.data?.message || 'Error creating category');
    }
  };

  const handleDeleteCategory = async (id) => {
    if (!confirm('Are you sure you want to delete this category?')) return;
    try {
      const { data } = await api.delete(`/admin/categories/${id}`);
      if (data.success) {
        setCategories(categories.filter(c => c._id !== id));
      }
    } catch (err) {
      console.error(err);
    }
  };

  const handleAddBrand = async (e) => {
    e.preventDefault();
    try {
      const { data } = await api.post('/admin/brands', { name: newBrandName, description: newBrandDesc });
      if (data.success) {
        setBrands([data.brand, ...brands]);
        setNewBrandName('');
        setNewBrandDesc('');
        alert('Brand created successfully');
      }
    } catch (err) {
      alert(err.response?.data?.message || 'Error creating brand');
    }
  };

  const handleDeleteBrand = async (id) => {
    if (!confirm('Are you sure you want to delete this brand?')) return;
    try {
      const { data } = await api.delete(`/admin/brands/${id}`);
      if (data.success) {
        setBrands(brands.filter(b => b._id !== id));
      }
    } catch (err) {
      console.error(err);
    }
  };

  const handleAddSupplier = async (e) => {
    e.preventDefault();
    try {
      const { data } = await api.post('/admin/suppliers', {
        name: newSupName,
        contactEmail: newSupEmail,
        contactPhone: newSupPhone,
        address: newSupAddr
      });
      if (data.success) {
        setSuppliers([data.supplier, ...suppliers]);
        setNewSupName('');
        setNewSupEmail('');
        setNewSupPhone('');
        setNewSupAddr('');
        alert('Supplier added successfully');
      }
    } catch (err) {
      alert(err.response?.data?.message || 'Error adding supplier');
    }
  };

  const handleDeleteSupplier = async (id) => {
    if (!confirm('Are you sure you want to delete this supplier?')) return;
    try {
      const { data } = await api.delete(`/admin/suppliers/${id}`);
      if (data.success) {
        setSuppliers(suppliers.filter(s => s._id !== id));
      }
    } catch (err) {
      console.error(err);
    }
  };

  const handleAddCoupon = async (e) => {
    e.preventDefault();
    try {
      const { data } = await api.post('/coupons', {
        code: newCouponCode,
        discountType: newCouponType,
        discountAmount: Number(newCouponAmt),
        minPurchase: Number(newCouponMin),
        expiryDate: newCouponExpiry
      });
      if (data.success) {
        setCoupons([data.coupon, ...coupons]);
        setNewCouponCode('');
        setNewCouponAmt('');
        setNewCouponMin('0');
        setNewCouponExpiry('');
        alert('Coupon created successfully');
      }
    } catch (err) {
      alert(err.response?.data?.message || 'Error creating coupon');
    }
  };

  const handleDeleteCoupon = async (id) => {
    if (!confirm('Are you sure you want to delete this coupon?')) return;
    try {
      const { data } = await api.delete(`/coupons/${id}`);
      if (data.success) {
        setCoupons(coupons.filter(c => c._id !== id));
      }
    } catch (err) {
      console.error(err);
    }
  };

  // Setup line chart datasets
  const getLineChartData = () => {
    if (!charts) return null;
    return {
      labels: charts.labels,
      datasets: [
        {
          fill: true,
          label: 'Sales Revenue (₹)',
          data: charts.sales,
          borderColor: 'rgb(20, 184, 166)',
          backgroundColor: 'rgba(20, 184, 166, 0.1)',
          tension: 0.4
        }
      ]
    };
  };

  return (
    <DashboardLayout title="Admin Analytics - HealStore" allowedRoles={['admin']}>
      {/* Sub tabs switches */}
      <div className="flex gap-4 mb-6 overflow-x-auto pb-1 border-b">
        <button onClick={() => setTab('analytics')} className={`pb-2 px-1 text-sm font-bold border-b-2 transition ${tab === 'analytics' ? 'border-teal-500 text-teal-605' : 'border-transparent text-slate-405'}`}>
          Analytics
        </button>
        <button onClick={() => setTab('users')} className={`pb-2 px-1 text-sm font-bold border-b-2 transition ${tab === 'users' ? 'border-teal-500 text-teal-605' : 'border-transparent text-slate-405'}`}>
          Users Manager
        </button>
        <button onClick={() => setTab('categories')} className={`pb-2 px-1 text-sm font-bold border-b-2 transition ${tab === 'categories' ? 'border-teal-500 text-teal-605' : 'border-transparent text-slate-450'}`}>
          Categories
        </button>
        <button onClick={() => setTab('brands')} className={`pb-2 px-1 text-sm font-bold border-b-2 transition ${tab === 'brands' ? 'border-teal-500 text-teal-650' : 'border-transparent text-slate-450'}`}>
          Brands
        </button>
        <button onClick={() => setTab('suppliers')} className={`pb-2 px-1 text-sm font-bold border-b-2 transition ${tab === 'suppliers' ? 'border-teal-500 text-teal-650' : 'border-transparent text-slate-450'}`}>
          Suppliers
        </button>
        <button onClick={() => setTab('coupons')} className={`pb-2 px-1 text-sm font-bold border-b-2 transition ${tab === 'coupons' ? 'border-teal-500 text-teal-650' : 'border-transparent text-slate-450'}`}>
          Coupons
        </button>
      </div>

      <div className="glassmorphism-card p-6 border border-slate-200/50">
        {/* Analytics dashboard stats */}
        {tab === 'analytics' && (
          <div className="space-y-8">
            <h2 className="text-xl font-extrabold">Analytics Overview</h2>

            {loading || !stats ? (
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4 animate-pulse">
                {Array.from({ length: 4 }).map((_, idx) => (
                  <div key={idx} className="h-24 bg-slate-205/50 rounded-2xl" />
                ))}
              </div>
            ) : (
              <>
                {/* Stats grid cards */}
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
                  <div className="p-4 bg-teal-500/10 text-teal-700 dark:text-teal-400 border border-teal-500/10 rounded-2xl">
                    <span className="text-xs font-bold uppercase tracking-wider block">Total Revenue</span>
                    <span className="text-3xl font-extrabold mt-1 block">₹{stats.totalRevenue}</span>
                  </div>
                  <div className="p-4 bg-indigo-500/10 text-indigo-700 dark:text-indigo-400 border border-indigo-500/10 rounded-2xl">
                    <span className="text-xs font-bold uppercase tracking-wider block">Monthly Sales</span>
                    <span className="text-3xl font-extrabold mt-1 block">₹{stats.monthlyRevenue}</span>
                  </div>
                  <div className="p-4 bg-amber-500/10 text-amber-705 border border-amber-500/10 rounded-2xl">
                    <span className="text-xs font-bold uppercase tracking-wider block">Daily Orders</span>
                    <span className="text-3xl font-extrabold mt-1 block">{stats.totalOrders}</span>
                  </div>
                  <div className="p-4 bg-purple-500/10 text-purple-700 dark:text-purple-400 border border-purple-500/10 rounded-2xl">
                    <span className="text-xs font-bold uppercase tracking-wider block">Customers</span>
                    <span className="text-3xl font-extrabold mt-1 block">{stats.totalCustomers}</span>
                  </div>
                </div>

                {/* Line graph of revenue */}
                <div className="border border-slate-105 p-6 rounded-2xl bg-white dark:bg-slate-900/50">
                  <h3 className="font-extrabold text-sm mb-4">Sales Performance (Last 7 Days)</h3>
                  <div className="h-64 w-full">
                    {getLineChartData() && <Line data={getLineChartData()} options={{ responsive: true, maintainAspectRatio: false }} />}
                  </div>
                </div>
              </>
            )}
          </div>
        )}

        {/* User manager tab */}
        {tab === 'users' && (
          <div className="space-y-6">
            <h2 className="text-xl font-extrabold">Register Roles & Status</h2>
            <div className="overflow-x-auto">
              <table className="w-full text-left border-collapse">
                <thead>
                  <tr className="border-b text-xs font-bold uppercase tracking-wider text-slate-400">
                    <th className="py-3">User</th>
                    <th>Email</th>
                    <th>Role</th>
                    <th>Status</th>
                    <th className="text-right">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100 dark:divide-slate-850 text-sm">
                  {users.map((u) => (
                    <tr key={u._id}>
                      <td className="py-3.5 font-bold">{u.name}</td>
                      <td>{u.email}</td>
                      <td>
                        <select
                          value={u.role}
                          onChange={(e) => handleUpdateUserRole(u._id, e.target.value, u.isActive)}
                          className="bg-transparent border border-slate-200 rounded-lg text-xs font-semibold py-1 focus:ring-0"
                        >
                          <option value="customer">Customer</option>
                          <option value="pharmacist">Pharmacist</option>
                          <option value="admin">Admin</option>
                        </select>
                      </td>
                      <td>
                        <span className={`px-2 py-0.5 rounded text-[10px] font-bold uppercase ${u.isActive ? 'bg-emerald-500/10 text-emerald-600' : 'bg-red-500/10 text-red-600'}`}>
                          {u.isActive ? 'Active' : 'Inactive'}
                        </span>
                      </td>
                      <td className="text-right">
                        <button
                          onClick={() => handleUpdateUserRole(u._id, u.role, !u.isActive)}
                          className="text-xs font-bold text-teal-650 hover:underline"
                        >
                          {u.isActive ? 'Deactivate' : 'Activate'}
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {/* Categories Manager tab */}
        {tab === 'categories' && (
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <form onSubmit={handleAddCategory} className="space-y-4">
              <h3 className="font-bold text-lg">Add Category</h3>
              <div>
                <input
                  type="text"
                  required
                  placeholder="Category Name"
                  value={newCatName}
                  onChange={(e) => setNewCatName(e.target.value)}
                  className="input-field py-2 text-sm"
                />
              </div>
              <div>
                <textarea
                  rows={3}
                  placeholder="Description"
                  value={newCatDesc}
                  onChange={(e) => setNewCatDesc(e.target.value)}
                  className="input-field py-2 text-sm"
                />
              </div>
              <button type="submit" className="w-full btn-primary py-2 text-sm flex justify-center items-center gap-2">
                <FiPlus /> Add
              </button>
            </form>

            <div className="md:col-span-2 space-y-3">
              <h3 className="font-bold text-lg">Categories List</h3>
              <div className="overflow-x-auto">
                <table className="w-full text-left border-collapse text-sm">
                  <thead>
                    <tr className="border-b text-xs font-bold text-slate-400 uppercase"><th className="py-2">Name</th><th>Description</th><th className="text-right">Action</th></tr>
                  </thead>
                  <tbody className="divide-y divide-slate-100 dark:divide-slate-850">
                    {categories.map((c) => (
                      <tr key={c._id}>
                        <td className="py-2.5 font-bold">{c.name}</td>
                        <td>{c.description}</td>
                        <td className="text-right">
                          <button onClick={() => handleDeleteCategory(c._id)} className="text-red-500 hover:text-red-650 p-1">
                            <FiTrash />
                          </button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        )}

        {/* Brands Manager tab */}
        {tab === 'brands' && (
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <form onSubmit={handleAddBrand} className="space-y-4">
              <h3 className="font-bold text-lg">Add Brand</h3>
              <div>
                <input
                  type="text"
                  required
                  placeholder="Brand Name"
                  value={newBrandName}
                  onChange={(e) => setNewBrandName(e.target.value)}
                  className="input-field py-2 text-sm"
                />
              </div>
              <div>
                <textarea
                  rows={3}
                  placeholder="Description"
                  value={newBrandDesc}
                  onChange={(e) => setNewBrandDesc(e.target.value)}
                  className="input-field py-2 text-sm"
                />
              </div>
              <button type="submit" className="w-full btn-primary py-2 text-sm flex justify-center items-center gap-2">
                <FiPlus /> Add
              </button>
            </form>

            <div className="md:col-span-2 space-y-3">
              <h3 className="font-bold text-lg">Brands List</h3>
              <div className="overflow-x-auto">
                <table className="w-full text-left border-collapse text-sm">
                  <thead>
                    <tr className="border-b text-xs font-bold text-slate-400 uppercase"><th className="py-2">Name</th><th>Description</th><th className="text-right">Action</th></tr>
                  </thead>
                  <tbody className="divide-y divide-slate-100 dark:divide-slate-850">
                    {brands.map((b) => (
                      <tr key={b._id}>
                        <td className="py-2.5 font-bold">{b.name}</td>
                        <td>{b.description}</td>
                        <td className="text-right">
                          <button onClick={() => handleDeleteBrand(b._id)} className="text-red-500 hover:text-red-650 p-1">
                            <FiTrash />
                          </button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        )}

        {/* Suppliers Manager tab */}
        {tab === 'suppliers' && (
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <form onSubmit={handleAddSupplier} className="space-y-4">
              <h3 className="font-bold text-lg">Add Supplier</h3>
              <div>
                <input type="text" required placeholder="Name" value={newSupName} onChange={(e) => setNewSupName(e.target.value)} className="input-field py-2 text-sm" />
              </div>
              <div>
                <input type="email" required placeholder="Email" value={newSupEmail} onChange={(e) => setNewSupEmail(e.target.value)} className="input-field py-2 text-sm" />
              </div>
              <div>
                <input type="tel" required placeholder="Phone" value={newSupPhone} onChange={(e) => setNewSupPhone(e.target.value)} className="input-field py-2 text-sm" />
              </div>
              <div>
                <input type="text" required placeholder="Address" value={newSupAddr} onChange={(e) => setNewSupAddr(e.target.value)} className="input-field py-2 text-sm" />
              </div>
              <button type="submit" className="w-full btn-primary py-2 text-sm flex justify-center items-center gap-2">
                <FiPlus /> Add Supplier
              </button>
            </form>

            <div className="md:col-span-2 space-y-3">
              <h3 className="font-bold text-lg">Suppliers List</h3>
              <div className="overflow-x-auto">
                <table className="w-full text-left border-collapse text-sm">
                  <thead>
                    <tr className="border-b text-xs font-bold text-slate-400 uppercase"><th className="py-2">Name</th><th>Contact</th><th>Phone</th><th className="text-right">Action</th></tr>
                  </thead>
                  <tbody className="divide-y divide-slate-100 dark:divide-slate-850">
                    {suppliers.map((s) => (
                      <tr key={s._id}>
                        <td className="py-2.5 font-bold">{s.name}</td>
                        <td>{s.contactEmail}</td>
                        <td>{s.contactPhone}</td>
                        <td className="text-right">
                          <button onClick={() => handleDeleteSupplier(s._id)} className="text-red-500 hover:text-red-650 p-1">
                            <FiTrash />
                          </button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        )}

        {/* Coupons Manager tab */}
        {tab === 'coupons' && (
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <form onSubmit={handleAddCoupon} className="space-y-4">
              <h3 className="font-bold text-lg">Create Coupon</h3>
              <div>
                <input type="text" required placeholder="Coupon Code (e.g. SAVE10)" value={newCouponCode} onChange={(e) => setNewCouponCode(e.target.value)} className="input-field py-2 text-sm uppercase" />
              </div>
              <div>
                <select value={newCouponType} onChange={(e) => setNewCouponType(e.target.value)} className="input-field py-2 text-sm">
                  <option value="percentage">Percentage Discount (%)</option>
                  <option value="fixed">Fixed Discount (Rupees)</option>
                </select>
              </div>
              <div>
                <input type="number" required placeholder="Discount Amount" value={newCouponAmt} onChange={(e) => setNewCouponAmt(e.target.value)} className="input-field py-2 text-sm" />
              </div>
              <div>
                <input type="number" placeholder="Min Purchase Req (₹)" value={newCouponMin} onChange={(e) => setNewCouponMin(e.target.value)} className="input-field py-2 text-sm" />
              </div>
              <div>
                <label className="block text-xs font-bold text-slate-400 uppercase mb-1">Expiry Date</label>
                <input type="date" required value={newCouponExpiry} onChange={(e) => setNewCouponExpiry(e.target.value)} className="input-field py-2 text-sm" />
              </div>
              <button type="submit" className="w-full btn-primary py-2 text-sm flex justify-center items-center gap-2">
                <FiPlus /> Create
              </button>
            </form>

            <div className="md:col-span-2 space-y-3">
              <h3 className="font-bold text-lg">Coupons List</h3>
              <div className="overflow-x-auto">
                <table className="w-full text-left border-collapse text-sm">
                  <thead>
                    <tr className="border-b text-xs font-bold text-slate-400 uppercase"><th className="py-2">Code</th><th>Discount</th><th>Min Purchase</th><th>Expiry</th><th className="text-right">Action</th></tr>
                  </thead>
                  <tbody className="divide-y divide-slate-100 dark:divide-slate-850">
                    {coupons.map((c) => (
                      <tr key={c._id}>
                        <td className="py-2.5 font-bold uppercase">{c.code}</td>
                        <td>{c.discountType === 'percentage' ? `${c.discountAmount}%` : `₹${c.discountAmount}`}</td>
                        <td>₹{c.minPurchase}</td>
                        <td>{new Date(c.expiryDate).toLocaleDateString()}</td>
                        <td className="text-right">
                          <button onClick={() => handleDeleteCoupon(c._id)} className="text-red-500 hover:text-red-650 p-1">
                            <FiTrash />
                          </button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        )}
      </div>
    </DashboardLayout>
  );
}
// Default admin dashboard export wrapper
