import React, { useState, useEffect } from 'react';
import DashboardLayout from '../../../components/DashboardLayout';
import api from '../../../services/api';
import { TableSkeleton } from '../../../components/LoadingSkeleton';
import { FiAlertCircle, FiCheck, FiX, FiRefreshCw, FiEdit } from 'react-icons/fi';

export default function PharmacistDashboard() {
  const [tab, setTab] = useState('inventory');
  const [loading, setLoading] = useState(true);

  // Inventory list states
  const [medicines, setMedicines] = useState([]);
  const [categories, setCategories] = useState([]);
  const [brands, setBrands] = useState([]);
  const [suppliers, setSuppliers] = useState([]);

  // Form states for Add/Edit Medicine
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [selectedMed, setSelectedMed] = useState(null);
  const [medName, setMedName] = useState('');
  const [medGeneric, setMedGeneric] = useState('');
  const [medCategory, setMedCategory] = useState('');
  const [medBrand, setMedBrand] = useState('');
  const [medSupplier, setMedSupplier] = useState('');
  const [medBatch, setMedBatch] = useState('');
  const [medPurchase, setMedPurchase] = useState('');
  const [medSelling, setMedSelling] = useState('');
  const [medMRP, setMedMRP] = useState('');
  const [medDiscount, setMedDiscount] = useState('0');
  const [medStock, setMedStock] = useState('');
  const [medMinStock, setMedMinStock] = useState('10');
  const [medExpiry, setMedExpiry] = useState('');
  const [medMfg, setMedMfg] = useState('');
  const [medDescription, setMedDescription] = useState('');

  // Alerts states
  const [lowStockMeds, setLowStockMeds] = useState([]);
  const [expiringMeds, setExpiringMeds] = useState([]);

  // Prescriptions list state
  const [prescriptions, setPrescriptions] = useState([]);

  // Orders list state
  const [orders, setOrders] = useState([]);

  useEffect(() => {
    loadMetaData();
    fetchInventory();
    fetchAlerts();
    fetchPrescriptions();
    fetchOrders();
  }, []);

  const loadMetaData = async () => {
    try {
      const catRes = await api.get('/admin/categories');
      if (catRes.data.success) setCategories(catRes.data.categories);

      const brandRes = await api.get('/admin/brands');
      if (brandRes.data.success) setBrands(brandRes.data.brands);

      const supRes = await api.get('/admin/suppliers');
      if (supRes.data.success) setSuppliers(supRes.data.suppliers);
    } catch (err) {
      console.error(err);
    }
  };

  const fetchInventory = async () => {
    setLoading(true);
    try {
      const { data } = await api.get('/medicines?limit=50');
      if (data.success) setMedicines(data.medicines);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const fetchAlerts = async () => {
    try {
      const lowRes = await api.get('/medicines/alerts/low-stock');
      if (lowRes.data.success) setLowStockMeds(lowRes.data.medicines);

      const expRes = await api.get('/medicines/alerts/expiry');
      if (expRes.data.success) setExpiringMeds(expRes.data.medicines);
    } catch (err) {
      console.error(err);
    }
  };

  const fetchPrescriptions = async () => {
    try {
      const { data } = await api.get('/prescriptions/all');
      if (data.success) setPrescriptions(data.prescriptions);
    } catch (err) {
      console.error(err);
    }
  };

  const fetchOrders = async () => {
    try {
      const { data } = await api.get('/orders/all');
      if (data.success) setOrders(data.orders);
    } catch (err) {
      console.error(err);
    }
  };

  // Add/Edit Submissions
  const handleSaveMedicineSubmit = async (e) => {
    e.preventDefault();
    const payload = {
      name: medName,
      genericName: medGeneric,
      category: medCategory,
      brand: medBrand,
      supplier: medSupplier,
      batchNumber: medBatch,
      purchasePrice: Number(medPurchase),
      sellingPrice: Number(medSelling),
      MRP: Number(medMRP),
      discount: Number(medDiscount),
      stock: Number(medStock),
      minStock: Number(medMinStock),
      expiryDate: medExpiry,
      manufacturingDate: medMfg,
      description: medDescription
    };

    try {
      if (selectedMed) {
        // Edit
        const { data } = await api.put(`/medicines/${selectedMed._id}`, payload);
        if (data.success) {
          alert('Medicine updated successfully!');
          fetchInventory();
          setIsFormOpen(false);
        }
      } else {
        // Add new
        const { data } = await api.post('/medicines', payload);
        if (data.success) {
          alert('Medicine added to inventory!');
          fetchInventory();
          setIsFormOpen(false);
        }
      }
    } catch (err) {
      alert(err.response?.data?.message || 'Error saving product');
    }
  };

  const handleEditClick = (med) => {
    setSelectedMed(med);
    setMedName(med.name);
    setMedGeneric(med.genericName);
    setMedCategory(med.category?._id || '');
    setMedBrand(med.brand?._id || '');
    setMedSupplier(med.supplier?._id || '');
    setMedBatch(med.batchNumber || '');
    setMedPurchase(med.purchasePrice);
    setMedSelling(med.sellingPrice);
    setMedMRP(med.MRP);
    setMedDiscount(med.discount);
    setMedStock(med.stock);
    setMedMinStock(med.minStock);
    setMedExpiry(med.expiryDate.split('T')[0]);
    setMedMfg(med.manufacturingDate.split('T')[0]);
    setMedDescription(med.description);
    setIsFormOpen(true);
  };

  const handleAddClick = () => {
    setSelectedMed(null);
    setMedName('');
    setMedGeneric('');
    setMedCategory(categories[0]?._id || '');
    setMedBrand(brands[0]?._id || '');
    setMedSupplier(suppliers[0]?._id || '');
    setMedBatch('');
    setMedPurchase('');
    setMedSelling('');
    setMedMRP('');
    setMedDiscount('0');
    setMedStock('');
    setMedMinStock('10');
    setMedExpiry('');
    setMedMfg('');
    setMedDescription('');
    setIsFormOpen(true);
  };

  const handleDeactivate = async (id) => {
    if (!confirm('Are you sure you want to deactivate this medicine?')) return;
    try {
      const { data } = await api.delete(`/medicines/${id}`);
      if (data.success) {
        alert('Medicine deactivated');
        fetchInventory();
      }
    } catch (err) {
      console.error(err);
    }
  };

  // Prescription Decisions
  const handleReviewPrescription = async (id, decision) => {
    const feedback = prompt(`Enter feedback comments for this ${decision}:`);
    if (feedback === null) return; // Cancelled

    try {
      const { data } = await api.put(`/prescriptions/${id}/status`, {
        status: decision === 'approve' ? 'approved' : 'rejected',
        pharmacistFeedback: feedback
      });
      if (data.success) {
        alert(`Prescription status updated to: ${decision}`);
        fetchPrescriptions();
      }
    } catch (err) {
      console.error(err);
    }
  };

  // Order Decisions
  const handleAdvanceOrderStatus = async (id, status) => {
    try {
      const { data } = await api.put(`/orders/${id}/status`, { orderStatus: status });
      if (data.success) {
        alert('Order status advanced successfully');
        fetchOrders();
      }
    } catch (err) {
      console.error(err);
    }
  };

  return (
    <DashboardLayout title="Pharmacist Dashboard" allowedRoles={['pharmacist', 'admin']}>
      {/* Sub Tabs Toggle */}
      <div className="flex gap-4 mb-6 overflow-x-auto pb-1 border-b">
        <button onClick={() => setTab('inventory')} className={`pb-2 px-1 text-sm font-bold border-b-2 transition ${tab === 'inventory' ? 'border-teal-500 text-teal-605' : 'border-transparent text-slate-400'}`}>
          Inventory
        </button>
        <button onClick={() => setTab('prescriptions')} className={`pb-2 px-1 text-sm font-bold border-b-2 transition ${tab === 'prescriptions' ? 'border-teal-500 text-teal-605' : 'border-transparent text-slate-400'}`}>
          Prescriptions Review ({prescriptions.filter(p => p.status === 'pending').length})
        </button>
        <button onClick={() => setTab('orders')} className={`pb-2 px-1 text-sm font-bold border-b-2 transition ${tab === 'orders' ? 'border-teal-500 text-teal-605' : 'border-transparent text-slate-400'}`}>
          Orders Processing
        </button>
        <button onClick={() => setTab('alerts')} className={`pb-2 px-1 text-sm font-bold border-b-2 transition ${tab === 'alerts' ? 'border-teal-500 text-teal-605' : 'border-transparent text-slate-400'}`}>
          Alerts & Expiries ({lowStockMeds.length + expiringMeds.length})
        </button>
      </div>

      <div className="glassmorphism-card p-6 border border-slate-200/50">
        {/* Inventory tab */}
        {tab === 'inventory' && (
          <div className="space-y-6">
            <div className="flex justify-between items-center">
              <h2 className="text-xl font-extrabold">Inventory List</h2>
              <button onClick={handleAddClick} className="btn-primary py-2 px-4 text-xs font-bold">
                + Add Medicine
              </button>
            </div>

            {loading ? (
              <TableSkeleton />
            ) : (
              <div className="overflow-x-auto">
                <table className="w-full text-left border-collapse">
                  <thead>
                    <tr className="border-b text-xs font-bold uppercase tracking-wider text-slate-400">
                      <th className="py-3">Medicine</th>
                      <th>Batch</th>
                      <th>Expiry</th>
                      <th>Price (Rupees)</th>
                      <th>Stock</th>
                      <th className="text-right">Actions</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-100 dark:divide-slate-850 text-sm">
                    {medicines.map((m) => (
                      <tr key={m._id} className="hover:bg-slate-50 dark:hover:bg-slate-900/50">
                        <td className="py-3.5">
                          <span className="font-bold block">{m.name}</span>
                          <span className="text-xs text-slate-400">{m.genericName}</span>
                        </td>
                        <td>{m.batchNumber}</td>
                        <td className={new Date(m.expiryDate) < new Date() ? 'text-red-500 font-bold' : ''}>
                          {new Date(m.expiryDate).toLocaleDateString()}
                        </td>
                        <td>₹{m.sellingPrice}</td>
                        <td className={m.stock <= m.minStock ? 'text-red-500 font-bold' : ''}>
                          {m.stock}
                        </td>
                        <td className="text-right">
                          <div className="flex justify-end gap-2">
                            <button onClick={() => handleEditClick(m)} className="p-1.5 hover:bg-slate-105 border rounded-lg text-slate-450 hover:text-teal-500">
                              <FiEdit size={14} />
                            </button>
                            <button onClick={() => handleDeactivate(m._id)} className="p-1.5 hover:bg-slate-105 border rounded-lg text-slate-450 hover:text-red-500">
                              <FiX size={14} />
                            </button>
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </div>
        )}

        {/* Prescription approvals tab */}
        {tab === 'prescriptions' && (
          <div className="space-y-6">
            <h2 className="text-xl font-extrabold">Prescriptions Review</h2>
            {prescriptions.length === 0 ? (
              <p className="text-sm text-slate-405">No customer prescriptions submitted.</p>
            ) : (
              <div className="space-y-4">
                {prescriptions.map((p) => (
                  <div key={p._id} className="p-4 border rounded-2xl flex flex-col md:flex-row items-center justify-between gap-4">
                    <div>
                      <p className="text-sm font-semibold">User: {p.user?.name || 'Customer'}</p>
                      <a href={p.fileUrl} target="_blank" rel="noopener noreferrer" className="text-xs text-teal-500 hover:underline block mt-1">
                        Download / View Document
                      </a>
                      <span className="text-[10px] text-slate-400">Date: {new Date(p.createdAt).toLocaleDateString()}</span>
                    </div>

                    {p.status === 'pending' ? (
                      <div className="flex gap-2">
                        <button onClick={() => handleReviewPrescription(p._id, 'approve')} className="bg-emerald-500 hover:bg-emerald-600 text-white font-bold py-1.5 px-4 rounded-xl text-xs transition">
                          Approve
                        </button>
                        <button onClick={() => handleReviewPrescription(p._id, 'reject')} className="bg-red-500 hover:bg-red-650 text-white font-bold py-1.5 px-4 rounded-xl text-xs transition">
                          Reject
                        </button>
                      </div>
                    ) : (
                      <span className="text-xs font-bold text-slate-400 capitalize">{p.status}</span>
                    )}
                  </div>
                ))}
              </div>
            )}
          </div>
        )}

        {/* Orders processing tab */}
        {tab === 'orders' && (
          <div className="space-y-6">
            <h2 className="text-xl font-extrabold">Process Shop Orders</h2>
            <div className="overflow-x-auto">
              <table className="w-full text-left border-collapse">
                <thead>
                  <tr className="border-b text-xs font-bold uppercase tracking-wider text-slate-400">
                    <th className="py-3">Order</th>
                    <th>Customer</th>
                    <th>Status</th>
                    <th>Grand Total</th>
                    <th className="text-right">Action</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100 dark:divide-slate-850 text-sm">
                  {orders.map((o) => (
                    <tr key={o._id}>
                      <td className="py-4 font-mono text-xs">{o._id.substring(0, 10)}...</td>
                      <td>{o.user?.name}</td>
                      <td>
                        <span className="bg-teal-50 text-teal-650 px-2 py-0.5 rounded text-[10px] font-bold uppercase">{o.orderStatus}</span>
                      </td>
                      <td className="font-bold">₹{o.totalAmount}</td>
                      <td className="text-right">
                        {o.orderStatus !== 'delivered' && o.orderStatus !== 'cancelled' && (
                          <select
                            onChange={(e) => handleAdvanceOrderStatus(o._id, e.target.value)}
                            value={o.orderStatus}
                            className="bg-transparent border border-slate-200 rounded-lg text-xs font-bold py-1 focus:ring-0 cursor-pointer"
                          >
                            <option value="pending">Pending</option>
                            <option value="confirmed">Confirm</option>
                            <option value="processing">Process</option>
                            <option value="shipped">Ship</option>
                            <option value="delivered">Deliver</option>
                          </select>
                        )}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {/* Alerts & warnings tab */}
        {tab === 'alerts' && (
          <div className="space-y-8">
            {/* Low stock list */}
            <div className="space-y-4">
              <h3 className="font-bold text-lg text-red-500 flex items-center gap-2">
                <FiAlertCircle /> Low Stock Warning ({lowStockMeds.length})
              </h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {lowStockMeds.map((m) => (
                  <div key={m._id} className="p-4 border border-red-500/20 bg-red-500/5 rounded-2xl flex justify-between">
                    <div>
                      <span className="font-bold block text-sm">{m.name}</span>
                      <span className="text-xs text-slate-450">Brand: {m.brand?.name}</span>
                    </div>
                    <div className="text-right">
                      <span className="text-xs text-slate-400 block">Current Stock:</span>
                      <span className="font-extrabold text-sm text-red-500">{m.stock} items</span>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Expiry warnings */}
            <div className="space-y-4">
              <h3 className="font-bold text-lg text-orange-505 flex items-center gap-2">
                <FiAlertCircle /> Expiring Products (Expiring in 30 Days: {expiringMeds.length})
              </h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {expiringMeds.map((m) => (
                  <div key={m._id} className="p-4 border border-orange-505/20 bg-orange-505/5 rounded-2xl flex justify-between">
                    <div>
                      <span className="font-bold block text-sm">{m.name}</span>
                      <span className="text-xs text-slate-455">Batch: {m.batchNumber}</span>
                    </div>
                    <div className="text-right">
                      <span className="text-xs text-slate-400 block">Expiry Date:</span>
                      <span className="font-bold text-xs text-red-500">{new Date(m.expiryDate).toLocaleDateString()}</span>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}
      </div>

      {/* MODAL FOR ADD/EDIT MEDICINE */}
      {isFormOpen && (
        <div className="fixed inset-0 z-50 bg-black/50 backdrop-blur-sm flex justify-center items-center p-4">
          <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-3xl p-6 w-full max-w-xl max-h-[90vh] overflow-y-auto shadow-2xl">
            <div className="flex justify-between items-center mb-6">
              <h3 className="text-xl font-extrabold">{selectedMed ? 'Edit Medicine' : 'Add New Medicine'}</h3>
              <button onClick={() => setIsFormOpen(false)} className="p-1 hover:bg-slate-100 rounded-full text-slate-400">
                <FiX size={20} />
              </button>
            </div>

            <form onSubmit={handleSaveMedicineSubmit} className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-bold text-slate-400 uppercase mb-1">Name</label>
                  <input type="text" required value={medName} onChange={(e) => setMedName(e.target.value)} className="input-field py-2 text-sm" />
                </div>
                <div>
                  <label className="block text-xs font-bold text-slate-400 uppercase mb-1">Generic Name</label>
                  <input type="text" required value={medGeneric} onChange={(e) => setMedGeneric(e.target.value)} className="input-field py-2 text-sm" />
                </div>
                <div>
                  <label className="block text-xs font-bold text-slate-400 uppercase mb-1">Category</label>
                  <select value={medCategory} onChange={(e) => setMedCategory(e.target.value)} className="input-field py-2 text-sm">
                    {categories.map((c) => (<option key={c._id} value={c._id}>{c.name}</option>))}
                  </select>
                </div>
                <div>
                  <label className="block text-xs font-bold text-slate-400 uppercase mb-1">Brand</label>
                  <select value={medBrand} onChange={(e) => setMedBrand(e.target.value)} className="input-field py-2 text-sm">
                    {brands.map((b) => (<option key={b._id} value={b._id}>{b.name}</option>))}
                  </select>
                </div>
                <div>
                  <label className="block text-xs font-bold text-slate-400 uppercase mb-1">Supplier</label>
                  <select value={medSupplier} onChange={(e) => setMedSupplier(e.target.value)} className="input-field py-2 text-sm">
                    {suppliers.map((s) => (<option key={s._id} value={s._id}>{s.name}</option>))}
                  </select>
                </div>
                <div>
                  <label className="block text-xs font-bold text-slate-400 uppercase mb-1">Batch Number</label>
                  <input type="text" required value={medBatch} onChange={(e) => setMedBatch(e.target.value)} className="input-field py-2 text-sm" />
                </div>
                <div>
                  <label className="block text-xs font-bold text-slate-400 uppercase mb-1">Purchase Price (₹)</label>
                  <input type="number" required value={medPurchase} onChange={(e) => setMedPurchase(e.target.value)} className="input-field py-2 text-sm" />
                </div>
                <div>
                  <label className="block text-xs font-bold text-slate-400 uppercase mb-1">Selling Price (₹)</label>
                  <input type="number" required value={medSelling} onChange={(e) => setMedSelling(e.target.value)} className="input-field py-2 text-sm" />
                </div>
                <div>
                  <label className="block text-xs font-bold text-slate-400 uppercase mb-1">MRP (₹)</label>
                  <input type="number" required value={medMRP} onChange={(e) => setMedMRP(e.target.value)} className="input-field py-2 text-sm" />
                </div>
                <div>
                  <label className="block text-xs font-bold text-slate-400 uppercase mb-1">Discount (%)</label>
                  <input type="number" value={medDiscount} onChange={(e) => setMedDiscount(e.target.value)} className="input-field py-2 text-sm" />
                </div>
                <div>
                  <label className="block text-xs font-bold text-slate-400 uppercase mb-1">Stock</label>
                  <input type="number" required value={medStock} onChange={(e) => setMedStock(e.target.value)} className="input-field py-2 text-sm" />
                </div>
                <div>
                  <label className="block text-xs font-bold text-slate-400 uppercase mb-1">Min Threshold</label>
                  <input type="number" value={medMinStock} onChange={(e) => setMedMinStock(e.target.value)} className="input-field py-2 text-sm" />
                </div>
                <div>
                  <label className="block text-xs font-bold text-slate-400 uppercase mb-1">Manufacturing Date</label>
                  <input type="date" required value={medMfg} onChange={(e) => setMedMfg(e.target.value)} className="input-field py-2 text-sm" />
                </div>
                <div>
                  <label className="block text-xs font-bold text-slate-400 uppercase mb-1">Expiry Date</label>
                  <input type="date" required value={medExpiry} onChange={(e) => setMedExpiry(e.target.value)} className="input-field py-2 text-sm" />
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-400 uppercase mb-1">Description</label>
                <textarea rows={3} required value={medDescription} onChange={(e) => setMedDescription(e.target.value)} className="input-field py-2 text-sm" />
              </div>

              <button type="submit" className="w-full btn-primary py-3 rounded-xl mt-4">
                Save Medicine
              </button>
            </form>
          </div>
        </div>
      )}
    </DashboardLayout>
  );
}
