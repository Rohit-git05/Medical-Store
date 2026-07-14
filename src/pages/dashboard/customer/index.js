import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/router';
import DashboardLayout from '../../../components/DashboardLayout';
import { useAuth } from '../../../context/AuthContext';
import api from '../../../services/api';
import { FiEdit, FiTrash, FiCheck, FiUpload, FiUser } from 'react-icons/fi';

export default function CustomerDashboard() {
  const { user, updateProfile, uploadProfilePicture } = useAuth();
  const router = useRouter();
  const { tab = 'profile' } = router.query;

  // Profile Form States
  const [profileName, setProfileName] = useState(user?.name || '');
  const [profilePhone, setProfilePhone] = useState(user?.phone || '');
  const [profilePassword, setProfilePassword] = useState('');
  const [profileMsg, setProfileMsg] = useState('');
  const [profileErr, setProfileErr] = useState('');
  const [updatingProfile, setUpdatingProfile] = useState(false);

  // Address List States
  const [addresses, setAddresses] = useState([]);
  const [addressName, setAddressName] = useState('');
  const [addressStreet, setAddressStreet] = useState('');
  const [addressCity, setAddressCity] = useState('');
  const [addressState, setAddressState] = useState('');
  const [addressZip, setAddressZip] = useState('');
  const [addressPhone, setAddressPhone] = useState('');
  const [addingAddress, setAddingAddress] = useState(false);

  // Order List States
  const [orders, setOrders] = useState([]);
  const [loadingOrders, setLoadingOrders] = useState(false);

  // Prescription List States
  const [prescriptions, setPrescriptions] = useState([]);
  const [prescriptionFile, setPrescriptionFile] = useState(null);
  const [uploadingPres, setUploadingPres] = useState(false);

  // Wishlist States
  const [wishlist, setWishlist] = useState([]);

  useEffect(() => {
    if (user) {
      setProfileName(user.name);
      setProfilePhone(user.phone || '');
    }
  }, [user]);

  useEffect(() => {
    if (tab === 'addresses') fetchAddresses();
    if (tab === 'orders') fetchOrders();
    if (tab === 'prescriptions') fetchPrescriptions();
    if (tab === 'wishlist') fetchWishlist();
  }, [tab]);

  // --- API DISPATCHES ---
  const fetchAddresses = async () => {
    try {
      const { data } = await api.get('/addresses');
      if (data.success) setAddresses(data.addresses);
    } catch (err) {
      console.error(err);
    }
  };

  const fetchOrders = async () => {
    setLoadingOrders(true);
    try {
      const { data } = await api.get('/orders');
      if (data.success) setOrders(data.orders);
    } catch (err) {
      console.error(err);
    } finally {
      setLoadingOrders(false);
    }
  };

  const fetchPrescriptions = async () => {
    try {
      const { data } = await api.get('/prescriptions');
      if (data.success) setPrescriptions(data.prescriptions);
    } catch (err) {
      console.error(err);
    }
  };

  const fetchWishlist = async () => {
    try {
      const { data } = await api.get('/wishlist');
      if (data.success) setWishlist(data.wishlist.medicines || []);
    } catch (err) {
      console.error(err);
    }
  };

  // --- SUBMISSIONS ---
  const handleUpdateProfileSubmit = async (e) => {
    e.preventDefault();
    setUpdatingProfile(true);
    setProfileMsg('');
    setProfileErr('');

    const res = await updateProfile(profileName, profilePhone, profilePassword);
    if (res.success) {
      setProfileMsg('Profile updated successfully!');
      setProfilePassword('');
    } else {
      setProfileErr(res.message);
    }
    setUpdatingProfile(false);
  };

  const handleProfilePicUpload = async (e) => {
    const file = e.target.files[0];
    if (!file) return;

    const formData = new FormData();
    formData.append('profilePicture', file);

    const res = await uploadProfilePicture(formData);
    if (res.success) {
      alert('Profile picture updated successfully!');
    } else {
      alert(res.message);
    }
  };

  const handleAddAddressSubmit = async (e) => {
    e.preventDefault();
    setAddingAddress(true);
    try {
      const { data } = await api.post('/addresses', {
        name: addressName,
        street: addressStreet,
        city: addressCity,
        state: addressState,
        zipCode: addressZip,
        phone: addressPhone,
        isDefault: false
      });
      if (data.success) {
        setAddresses([data.address, ...addresses]);
        // Reset form
        setAddressName('');
        setAddressStreet('');
        setAddressCity('');
        setAddressState('');
        setAddressZip('');
        setAddressPhone('');
        alert('Address added successfully!');
      }
    } catch (err) {
      console.error(err);
    } finally {
      setAddingAddress(false);
    }
  };

  const handleSetDefaultAddress = async (id) => {
    try {
      const { data } = await api.patch(`/addresses/${id}/default`);
      if (data.success) {
        fetchAddresses();
      }
    } catch (err) {
      console.error(err);
    }
  };

  const handleDeleteAddress = async (id) => {
    if (!confirm('Are you sure you want to delete this address?')) return;
    try {
      const { data } = await api.delete(`/addresses/${id}`);
      if (data.success) {
        setAddresses(addresses.filter(a => a._id !== id));
      }
    } catch (err) {
      console.error(err);
    }
  };

  const handlePrescriptionUploadSubmit = async (e) => {
    e.preventDefault();
    if (!prescriptionFile) return;

    setUploadingPres(true);
    const formData = new FormData();
    formData.append('prescription', prescriptionFile);

    try {
      const { data } = await api.post('/prescriptions/upload', formData, {
        headers: {
          'Content-Type': 'multipart/form-data'
        }
      });
      if (data.success) {
        setPrescriptions([data.prescription, ...prescriptions]);
        setPrescriptionFile(null);
        alert('Prescription uploaded successfully. A pharmacist will review it soon.');
      }
    } catch (err) {
      alert(err.response?.data?.message || 'Error uploading prescription');
    } finally {
      setUploadingPres(false);
    }
  };

  return (
    <DashboardLayout title="Customer Dashboard" allowedRoles={['customer']}>
      <div className="glassmorphism-card p-6 border border-slate-200/50 min-h-[500px]">
        {/* Profile Tab */}
        {tab === 'profile' && (
          <div className="space-y-6">
            <h2 className="text-2xl font-extrabold tracking-tight">Edit Profile</h2>

            {/* Profile pic section */}
            <div className="flex items-center gap-4 p-4 bg-slate-50 dark:bg-slate-900 rounded-2xl">
              {user?.profilePicture ? (
                <img
                  src={user.profilePicture}
                  alt=""
                  className="w-16 h-16 rounded-2xl object-cover ring-2 ring-teal-500"
                />
              ) : (
                <span className="flex h-16 w-16 items-center justify-center rounded-2xl bg-slate-105 dark:bg-slate-850 text-slate-500 ring-2 ring-teal-500/20">
                  <FiUser size={32} />
                </span>
              )}
              <div>
                <label className="btn-secondary py-1.5 px-4 text-xs font-semibold flex items-center gap-2 cursor-pointer">
                  <FiUpload /> Upload New Picture
                  <input type="file" onChange={handleProfilePicUpload} accept="image/*" className="hidden" />
                </label>
                <p className="text-[10px] text-slate-400 mt-1.5">Max size 5MB (JPG, PNG, WEBP)</p>
              </div>
            </div>

            {profileMsg && <p className="p-3 bg-emerald-500/10 text-emerald-600 rounded-xl text-xs font-semibold">{profileMsg}</p>}
            {profileErr && <p className="p-3 bg-red-500/10 text-red-500 rounded-xl text-xs font-semibold">{profileErr}</p>}

            <form onSubmit={handleUpdateProfileSubmit} className="space-y-4 max-w-md">
              <div>
                <label className="block text-xs font-bold uppercase text-slate-400 mb-1">Full Name</label>
                <input
                  type="text"
                  required
                  value={profileName}
                  onChange={(e) => setProfileName(e.target.value)}
                  className="input-field text-sm"
                />
              </div>
              <div>
                <label className="block text-xs font-bold uppercase text-slate-400 mb-1">Phone Number</label>
                <input
                  type="tel"
                  value={profilePhone}
                  onChange={(e) => setProfilePhone(e.target.value)}
                  className="input-field text-sm"
                />
              </div>
              <div>
                <label className="block text-xs font-bold uppercase text-slate-400 mb-1">New Password (leave blank to keep current)</label>
                <input
                  type="password"
                  value={profilePassword}
                  onChange={(e) => setProfilePassword(e.target.value)}
                  placeholder="••••••••"
                  className="input-field text-sm"
                />
              </div>

              <button type="submit" disabled={updatingProfile} className="btn-primary py-2.5 px-6 text-sm">
                {updatingProfile ? 'Updating...' : 'Save Profile'}
              </button>
            </form>
          </div>
        )}

        {/* Addresses Tab */}
        {tab === 'addresses' && (
          <div className="space-y-8">
            <h2 className="text-2xl font-extrabold tracking-tight">Manage Addresses</h2>

            {/* List addresses */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {addresses.map((addr) => (
                <div key={addr._id} className="p-4 border rounded-2xl flex flex-col justify-between gap-4">
                  <div>
                    <div className="flex items-center justify-between">
                      <span className="font-bold text-sm">{addr.name}</span>
                      {addr.isDefault && <span className="bg-teal-500/10 text-teal-650 px-2 py-0.5 rounded text-[10px] font-bold">DEFAULT</span>}
                    </div>
                    <p className="text-xs text-slate-450 mt-2">{addr.street}</p>
                    <p className="text-xs text-slate-450">{addr.city}, {addr.state} - {addr.zipCode}</p>
                    <p className="text-xs text-slate-450 mt-1">Phone: {addr.phone}</p>
                  </div>

                  <div className="flex items-center gap-2 mt-auto border-t pt-3">
                    {!addr.isDefault && (
                      <button onClick={() => handleSetDefaultAddress(addr._id)} className="text-xs font-bold hover:underline text-teal-500">
                        Set Default
                      </button>
                    )}
                    <button onClick={() => handleDeleteAddress(addr._id)} className="text-xs font-bold hover:underline text-red-500 ml-auto flex items-center gap-1">
                      <FiTrash size={12} /> Delete
                    </button>
                  </div>
                </div>
              ))}
            </div>

            {/* Add new address Form */}
            <form onSubmit={handleAddAddressSubmit} className="border-t pt-6 space-y-4 max-w-md">
              <h3 className="font-bold text-lg">Add New Address</h3>
              <div className="grid grid-cols-2 gap-3">
                <div className="col-span-2">
                  <input
                    type="text"
                    required
                    placeholder="Recipient Name"
                    value={addressName}
                    onChange={(e) => setAddressName(e.target.value)}
                    className="input-field text-sm"
                  />
                </div>
                <div className="col-span-2">
                  <input
                    type="text"
                    required
                    placeholder="Street Address"
                    value={addressStreet}
                    onChange={(e) => setAddressStreet(e.target.value)}
                    className="input-field text-sm"
                  />
                </div>
                <div>
                  <input
                    type="text"
                    required
                    placeholder="City"
                    value={addressCity}
                    onChange={(e) => setAddressCity(e.target.value)}
                    className="input-field text-sm"
                  />
                </div>
                <div>
                  <input
                    type="text"
                    required
                    placeholder="State"
                    value={addressState}
                    onChange={(e) => setAddressState(e.target.value)}
                    className="input-field text-sm"
                  />
                </div>
                <div>
                  <input
                    type="text"
                    required
                    placeholder="Pincode"
                    value={addressZip}
                    onChange={(e) => setAddressZip(e.target.value)}
                    className="input-field text-sm"
                  />
                </div>
                <div>
                  <input
                    type="tel"
                    required
                    placeholder="Phone Number"
                    value={addressPhone}
                    onChange={(e) => setAddressPhone(e.target.value)}
                    className="input-field text-sm"
                  />
                </div>
              </div>
              <button type="submit" disabled={addingAddress} className="btn-primary py-2 px-6 text-xs">
                {addingAddress ? 'Adding...' : 'Add Address'}
              </button>
            </form>
          </div>
        )}

        {/* Orders Tab */}
        {tab === 'orders' && (
          <div className="space-y-6">
            <h2 className="text-2xl font-extrabold tracking-tight">Order History</h2>

            {loadingOrders ? (
              <div className="space-y-3 animate-pulse">
                <div className="h-10 bg-slate-200 dark:bg-slate-800 rounded-xl" />
                <div className="h-10 bg-slate-200 dark:bg-slate-800 rounded-xl" />
              </div>
            ) : orders.length === 0 ? (
              <p className="text-sm text-slate-400">No orders placed yet.</p>
            ) : (
              <div className="overflow-x-auto">
                <table className="w-full text-left border-collapse">
                  <thead>
                    <tr className="border-b text-xs font-bold uppercase tracking-wider text-slate-400">
                      <th className="py-3">Order ID</th>
                      <th>Date</th>
                      <th>Items</th>
                      <th>Status</th>
                      <th>Total</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-100 dark:divide-slate-850 text-sm">
                    {orders.map((o) => (
                      <tr key={o._id} className="hover:bg-slate-50 dark:hover:bg-slate-900/50">
                        <td className="py-4 font-mono text-xs">{o._id}</td>
                        <td>{new Date(o.createdAt).toLocaleDateString()}</td>
                        <td>{o.items.length} items</td>
                        <td>
                          <span className={`px-2 py-0.5 rounded-full text-[10px] font-bold uppercase ${
                            o.orderStatus === 'delivered' ? 'bg-emerald-500/10 text-emerald-600' : 'bg-amber-500/10 text-amber-600'
                          }`}>
                            {o.orderStatus}
                          </span>
                        </td>
                        <td className="font-bold">₹{o.totalAmount}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </div>
        )}

        {/* Prescriptions Tab */}
        {tab === 'prescriptions' && (
          <div className="space-y-8">
            <h2 className="text-2xl font-extrabold tracking-tight">My Prescriptions</h2>

            <form onSubmit={handlePrescriptionUploadSubmit} className="p-5 border rounded-2xl bg-slate-50 dark:bg-slate-900 flex flex-col md:flex-row items-center justify-between gap-4 max-w-2xl">
              <div>
                <h3 className="font-bold text-sm">Upload New Prescription</h3>
                <p className="text-xs text-slate-400">We accept image files (JPEG, PNG) and PDF copies.</p>
              </div>
              <div className="flex gap-2">
                <input
                  type="file"
                  required
                  accept="image/*,.pdf"
                  onChange={(e) => setPrescriptionFile(e.target.files[0])}
                  className="text-xs"
                />
                <button type="submit" disabled={uploadingPres} className="btn-primary py-1.5 px-4 text-xs">
                  {uploadingPres ? 'Uploading...' : 'Upload'}
                </button>
              </div>
            </form>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {prescriptions.map((p) => (
                <div key={p._id} className="p-4 border rounded-2xl space-y-3">
                  <div className="flex items-center justify-between">
                    <span className="text-xs text-slate-400">ID: {p._id.substring(0, 8)}...</span>
                    <span className={`px-2 py-0.5 rounded text-[10px] font-bold uppercase ${
                      p.status === 'approved' ? 'bg-emerald-500/10 text-emerald-600' : p.status === 'rejected' ? 'bg-red-500/10 text-red-600' : 'bg-amber-500/10 text-amber-600'
                    }`}>
                      {p.status}
                    </span>
                  </div>

                  <a href={p.fileUrl} target="_blank" rel="noopener noreferrer" className="block text-xs font-semibold text-teal-500 hover:underline">
                    View Uploaded File
                  </a>

                  {p.pharmacistFeedback && (
                    <div className="text-xs bg-slate-50 dark:bg-slate-900 p-2.5 rounded-lg border border-slate-100">
                      <span className="font-bold block text-[10px] text-slate-400 uppercase">Feedback:</span>
                      <p>{p.pharmacistFeedback}</p>
                    </div>
                  )}
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Wishlist Tab */}
        {tab === 'wishlist' && (
          <div className="space-y-6">
            <h2 className="text-2xl font-extrabold tracking-tight">My Wishlist</h2>
            {wishlist.length === 0 ? (
              <p className="text-sm text-slate-400">Your wishlist is empty.</p>
            ) : (
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                {wishlist.map((med) => (
                  <Link href={`/medicines/${med._id}`} key={med._id} className="p-3 border rounded-2xl bg-white dark:bg-slate-900 flex flex-col justify-between gap-3">
                    <img src={med.images?.[0]} alt="" className="h-28 w-full object-contain bg-slate-50 rounded-xl" />
                    <div>
                      <h4 className="font-bold text-xs truncate">{med.name}</h4>
                      <span className="font-extrabold text-teal-650 text-xs block mt-1">₹{med.sellingPrice}</span>
                    </div>
                  </Link>
                ))}
              </div>
            )}
          </div>
        )}
      </div>
    </DashboardLayout>
  );
}
// Default customer dashboard export
