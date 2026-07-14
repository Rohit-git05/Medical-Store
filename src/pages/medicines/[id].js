import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/router';
import Layout from '../../components/Layout';
import api from '../../services/api';
import { useCart } from '../../context/CartContext';
import { useAuth } from '../../context/AuthContext';
import { FiShoppingCart, FiHeart, FiAlertCircle, FiStar, FiFileText, FiUser } from 'react-icons/fi';
import Link from 'next/link';
import { getImageUrl } from '../../utils/imageHelper';

export default function MedicineDetail() {
  const router = useRouter();
  const { id } = router.query;
  const { user } = useAuth();
  const { addToCart } = useCart();

  const [medicine, setMedicine] = useState(null);
  const [reviews, setReviews] = useState([]);
  const [similarMedicines, setSimilarMedicines] = useState([]);
  const [activeImage, setActiveImage] = useState('');
  const [quantity, setQuantity] = useState(1);
  const [loading, setLoading] = useState(true);

  // New review form states
  const [ratingInput, setRatingInput] = useState(5);
  const [reviewTextInput, setReviewTextInput] = useState('');
  const [reviewError, setReviewError] = useState('');
  const [submittingReview, setSubmittingReview] = useState(false);

  // Wishlist state
  const [inWishlist, setInWishlist] = useState(false);

  // Accordion state
  const [openSections, setOpenSections] = useState({
    uses: true,
    dosage: false,
    sideEffects: false,
    precautions: false
  });

  const toggleSection = (section) => {
    setOpenSections((prev) => ({ ...prev, [section]: !prev[section] }));
  };

  useEffect(() => {
    if (!id) return;

    async function loadData() {
      setLoading(true);
      try {
        const medRes = await api.get(`/medicines/${id}`);
        if (medRes.data.success) {
          const med = medRes.data.medicine;
          setMedicine(med);
          setActiveImage(getImageUrl(med.images?.[0]));

          // Fetch similar medicines
          const similarRes = await api.get(`/medicines?category=${med.category?._id}&limit=4`);
          if (similarRes.data.success) {
            setSimilarMedicines(similarRes.data.medicines.filter(m => m._id !== id));
          }
        }

        // Fetch reviews
        const reviewRes = await api.get(`/reviews/medicine/${id}`);
        if (reviewRes.data.success) {
          setReviews(reviewRes.data.reviews);
        }

        // Check wishlist if user logged in
        if (user) {
          const wlRes = await api.get('/wishlist');
          if (wlRes.data.success) {
            setInWishlist(wlRes.data.wishlist.medicines.some(m => m._id === id));
          }
        }
      } catch (err) {
        console.error('Error fetching detail data:', err);
      } finally {
        setLoading(false);
      }
    }
    loadData();
  }, [id, user]);

  const handleAddToCart = async () => {
    const res = await addToCart(medicine, quantity);
    if (res.success) {
      alert('Added to cart successfully!');
    } else {
      alert(res.message);
    }
  };

  const handleToggleWishlist = async () => {
    if (!user) {
      alert('Please log in to add items to your wishlist.');
      return;
    }

    try {
      const { data } = await api.post('/wishlist/toggle', { medicineId: id });
      if (data.success) {
        setInWishlist(!inWishlist);
      }
    } catch (err) {
      console.error(err);
    }
  };

  const handleReviewSubmit = async (e) => {
    e.preventDefault();
    if (!user) {
      alert('Please log in to leave reviews.');
      return;
    }
    if (!reviewTextInput.trim()) {
      setReviewError('Review content is required');
      return;
    }

    setSubmittingReview(true);
    setReviewError('');

    try {
      const { data } = await api.post('/reviews', {
        medicineId: id,
        rating: ratingInput,
        reviewText: reviewTextInput
      });

      if (data.success) {
        // Refresh reviews list
        const reviewRes = await api.get(`/reviews/medicine/${id}`);
        if (reviewRes.data.success) {
          setReviews(reviewRes.data.reviews);
        }
        setReviewTextInput('');
        alert('Review submitted successfully!');
      }
    } catch (err) {
      setReviewError(err.response?.data?.message || 'Error submitting review');
    } finally {
      setSubmittingReview(false);
    }
  };

  if (loading) {
    return (
      <div className="flex h-screen items-center justify-center">
        <div className="h-10 w-10 animate-spin rounded-full border-4 border-slate-200 border-t-teal-500" />
      </div>
    );
  }

  if (!medicine) {
    return (
      <Layout>
        <div className="text-center py-20">
          <h2 className="text-2xl font-extrabold">Product Not Found</h2>
        </div>
      </Layout>
    );
  }

  return (
    <Layout title={`${medicine.name} - BiteDash`}>
      <div className="space-y-12">
        {/* Main Details Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-10">
          {/* Gallery view */}
          <div className="space-y-4">
            <div className="h-96 w-full rounded-2xl bg-white dark:bg-slate-900 border border-slate-105 flex items-center justify-center p-6 overflow-hidden">
              <img src={getImageUrl(activeImage)} alt={medicine.name} className="max-h-full max-w-full object-contain" />
            </div>
            {medicine.images && medicine.images.length > 1 && (
              <div className="flex gap-2">
                {medicine.images.map((img, idx) => (
                  <button
                    key={idx}
                    onClick={() => setActiveImage(img)}
                    className={`w-20 h-20 rounded-xl bg-white border overflow-hidden p-2 flex items-center justify-center transition ${
                      activeImage === img ? 'border-teal-500 ring-2 ring-teal-500/20' : 'border-slate-200'
                    }`}
                  >
                    <img src={getImageUrl(img)} alt="" className="max-h-full max-w-full object-contain" />
                  </button>
                ))}
              </div>
            )}
          </div>

          {/* Details Content */}
          <div className="space-y-6">
            <div>
              <div className="flex flex-wrap items-center gap-2">
                <span className="text-xs font-extrabold uppercase bg-teal-500/10 text-teal-650 px-3 py-1 rounded-full">
                  {medicine.brand?.name}
                </span>
                {medicine.packSize && (
                  <span className="text-xs font-extrabold uppercase bg-slate-150 dark:bg-slate-800 text-slate-600 dark:text-slate-350 px-3 py-1 rounded-full">
                    {medicine.packSize}
                  </span>
                )}
                {medicine.category && (
                  <span className="text-xs font-extrabold uppercase bg-indigo-500/10 text-indigo-650 px-3 py-1 rounded-full">
                    {medicine.category.name}
                  </span>
                )}
              </div>
              <h1 className="text-3xl font-extrabold tracking-tight mt-3">{medicine.name}</h1>
              <p className="text-sm text-slate-400 mt-1 italic">Cuisine: {medicine.genericName}</p>
            </div>

            {/* Ratings and RX */}
            <div className="flex items-center gap-4">
              <div className="flex items-center gap-1 text-amber-500 font-bold text-sm">
                <FiStar className="fill-current" /> {medicine.averageRating} ({medicine.numReviews} Reviews)
              </div>
              {medicine.prescriptionRequired ? (
                <div className="flex items-center gap-1.5 text-red-500 font-bold text-xs bg-red-500/10 px-3 py-1 rounded-full">
                  🔴 Non-Veg
                </div>
              ) : (
                <div className="flex items-center gap-1.5 text-emerald-600 font-bold text-xs bg-emerald-500/10 px-3 py-1 rounded-full">
                  🟢 Veg
                </div>
              )}
            </div>

            <hr className="border-slate-200 dark:border-slate-800" />

            {/* Pricing Section */}
            <div className="space-y-1">
              <div className="flex items-baseline gap-2">
                <span className="text-3xl font-extrabold text-teal-650 dark:text-teal-400">₹{medicine.sellingPrice}</span>
                {medicine.discount > 0 && (
                  <>
                    <span className="text-sm text-slate-400 line-through">₹{medicine.MRP}</span>
                    <span className="text-xs text-rose-500 font-bold">({medicine.discount}% OFF)</span>
                  </>
                )}
              </div>
              <p className="text-xs text-slate-400">Inclusive of all taxes (GST applied at checkout)</p>
            </div>

            {/* Actions: quantity adjustments, add to cart, wishlist */}
            <div className="flex flex-wrap items-center gap-4">
              <div className="flex items-center border border-slate-250 dark:border-slate-800 rounded-xl overflow-hidden bg-white dark:bg-slate-900">
                <button
                  disabled={quantity === 1}
                  onClick={() => setQuantity(q => q - 1)}
                  className="px-4 py-2 font-bold hover:bg-slate-100 dark:hover:bg-slate-800 disabled:opacity-50"
                >
                  -
                </button>
                <span className="px-4 font-bold text-sm">{quantity}</span>
                <button
                  disabled={quantity >= medicine.stock}
                  onClick={() => setQuantity(q => q + 1)}
                  className="px-4 py-2 font-bold hover:bg-slate-100 dark:hover:bg-slate-800"
                >
                  +
                </button>
              </div>

              <button
                onClick={handleAddToCart}
                disabled={medicine.stock <= 0}
                className="btn-primary py-2.5 px-6 flex items-center gap-2 text-sm disabled:opacity-50"
              >
                <FiShoppingCart /> Add to Cart
              </button>

              <button
                onClick={handleToggleWishlist}
                className={`p-3 border rounded-xl transition ${
                  inWishlist
                    ? 'border-rose-500 text-rose-500 bg-rose-500/10'
                    : 'border-slate-200 hover:border-slate-400 text-slate-400 hover:text-slate-650'
                }`}
              >
                <FiHeart className={inWishlist ? 'fill-current' : ''} />
              </button>
            </div>

            {/* Stock alerts */}
            <div>
              {medicine.stock > 0 ? (
                <p className="text-xs font-semibold text-emerald-600">In Stock (Only {medicine.stock} left)</p>
              ) : (
                <p className="text-xs font-semibold text-red-500">Out of Stock</p>
              )}
            </div>

            {/* General descriptions */}
            <div className="space-y-4 pt-4 border-t border-slate-205/30">
              <div className="grid grid-cols-2 gap-4 text-sm mb-4">
                <div>
                  <span className="font-bold text-xs text-slate-400 block uppercase">Kitchen</span>
                  <span>{medicine.manufacturer || 'Partner Kitchen'}</span>
                </div>
                <div>
                  <span className="font-bold text-xs text-slate-400 block uppercase">Best Enjoyed Before</span>
                  <span>{new Date(medicine.expiryDate).toLocaleDateString()}</span>
                </div>
              </div>

              {/* Accordion Layout */}
              <div className="space-y-2">
                {/* Accordion: Uses */}
                <div className="border border-slate-200 dark:border-slate-800 rounded-xl overflow-hidden">
                  <button
                    type="button"
                    onClick={() => toggleSection('uses')}
                    className="w-full flex items-center justify-between p-3.5 bg-slate-50 dark:bg-slate-900/50 hover:bg-slate-100 dark:hover:bg-slate-900 font-bold text-xs uppercase tracking-wider text-slate-500 text-left transition"
                  >
                    <span>Ingredients & Recipe</span>
                    <span className="text-sm">{openSections.uses ? '−' : '+'}</span>
                  </button>
                  {openSections.uses && (
                    <div className="p-4 bg-white dark:bg-slate-950 text-sm leading-relaxed border-t border-slate-100 dark:border-slate-900">
                      <p>{medicine.uses || medicine.description}</p>
                    </div>
                  )}
                </div>

                {/* Accordion: Dosage */}
                <div className="border border-slate-200 dark:border-slate-800 rounded-xl overflow-hidden">
                  <button
                    type="button"
                    onClick={() => toggleSection('dosage')}
                    className="w-full flex items-center justify-between p-3.5 bg-slate-50 dark:bg-slate-900/50 hover:bg-slate-100 dark:hover:bg-slate-900 font-bold text-xs uppercase tracking-wider text-slate-500 text-left transition"
                  >
                    <span>Portion Size & Servings</span>
                    <span className="text-sm">{openSections.dosage ? '−' : '+'}</span>
                  </button>
                  {openSections.dosage && (
                    <div className="p-4 bg-white dark:bg-slate-950 text-sm leading-relaxed border-t border-slate-100 dark:border-slate-900">
                      <p>{medicine.dosage || 'As directed by physician.'}</p>
                    </div>
                  )}
                </div>

                {/* Accordion: Side Effects */}
                <div className="border border-slate-200 dark:border-slate-800 rounded-xl overflow-hidden">
                  <button
                    type="button"
                    onClick={() => toggleSection('sideEffects')}
                    className="w-full flex items-center justify-between p-3.5 bg-slate-50 dark:bg-slate-900/50 hover:bg-slate-100 dark:hover:bg-slate-900 font-bold text-xs uppercase tracking-wider text-slate-500 text-left transition"
                  >
                    <span>Allergen Advisories</span>
                    <span className="text-sm">{openSections.sideEffects ? '−' : '+'}</span>
                  </button>
                  {openSections.sideEffects && (
                    <div className="p-4 bg-white dark:bg-slate-950 text-sm leading-relaxed border-t border-slate-100 dark:border-slate-900">
                      {Array.isArray(medicine.sideEffects) && medicine.sideEffects.length > 0 ? (
                        <ul className="list-disc list-inside space-y-1">
                          {medicine.sideEffects.map((item, idx) => (
                            <li key={idx}>{item}</li>
                          ))}
                        </ul>
                      ) : (
                        <p>{medicine.sideEffects || 'None reported.'}</p>
                      )}
                    </div>
                  )}
                </div>

                {/* Accordion: Precautions */}
                <div className="border border-slate-200 dark:border-slate-800 rounded-xl overflow-hidden">
                  <button
                    type="button"
                    onClick={() => toggleSection('precautions')}
                    className="w-full flex items-center justify-between p-3.5 bg-slate-50 dark:bg-slate-900/50 hover:bg-slate-100 dark:hover:bg-slate-900 font-bold text-xs uppercase tracking-wider text-slate-500 text-left transition"
                  >
                    <span>Chef's Customization Notes</span>
                    <span className="text-sm">{openSections.precautions ? '−' : '+'}</span>
                  </button>
                  {openSections.precautions && (
                    <div className="p-4 bg-white dark:bg-slate-950 text-sm leading-relaxed border-t border-slate-100 dark:border-slate-900">
                      {Array.isArray(medicine.precautions) && medicine.precautions.length > 0 ? (
                        <ul className="list-disc list-inside space-y-1">
                          {medicine.precautions.map((item, idx) => (
                            <li key={idx}>{item}</li>
                          ))}
                        </ul>
                      ) : (
                        <p>No precautions reported.</p>
                      )}
                    </div>
                  )}
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Reviews Section */}
        <section className="space-y-6 border-t border-slate-205/30 pt-8">
          <h2 className="text-2xl font-extrabold tracking-tight">Customer Reviews</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {/* Review form */}
            <div className="glassmorphism-card p-6 border border-slate-200/50 h-fit space-y-4">
              <h3 className="font-bold text-lg">Write a Review</h3>
              {reviewError && <p className="text-xs text-red-500">{reviewError}</p>}
              <form onSubmit={handleReviewSubmit} className="space-y-4">
                <div>
                  <label className="block text-xs font-bold text-slate-400 uppercase mb-1">Rating</label>
                  <select
                    value={ratingInput}
                    onChange={(e) => setRatingInput(e.target.value)}
                    className="input-field py-2 text-sm"
                  >
                    <option value={5}>5 Stars (Excellent)</option>
                    <option value={4}>4 Stars (Good)</option>
                    <option value={3}>3 Stars (Average)</option>
                    <option value={2}>2 Stars (Poor)</option>
                    <option value={1}>1 Star (Very Poor)</option>
                  </select>
                </div>
                <div>
                  <label className="block text-xs font-bold text-slate-400 uppercase mb-1">Review Comments</label>
                  <textarea
                    rows={4}
                    required
                    value={reviewTextInput}
                    onChange={(e) => setReviewTextInput(e.target.value)}
                    placeholder="Share your dining experience with this dish..."
                    className="input-field text-sm"
                  />
                </div>
                <button
                  type="submit"
                  disabled={submittingReview || !user}
                  className="w-full btn-primary py-2.5 text-sm"
                >
                  {submittingReview ? 'Submitting...' : user ? 'Submit Review' : 'Log In to Review'}
                </button>
              </form>
            </div>

            {/* Reviews display list */}
            <div className="md:col-span-2 space-y-4">
              {reviews.length === 0 ? (
                <div className="text-center py-10 text-slate-400">
                  <p>No reviews written for this product yet.</p>
                </div>
              ) : (
                reviews.map((rev) => (
                  <div key={rev._id} className="bg-white dark:bg-slate-900 border border-slate-105 p-5 rounded-2xl space-y-2">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-3">
                        {rev.user?.profilePicture ? (
                          <img
                            src={getImageUrl(rev.user.profilePicture)}
                            alt=""
                            className="w-10 h-10 rounded-full object-cover"
                          />
                        ) : (
                          <span className="flex h-10 w-10 items-center justify-center rounded-full bg-slate-105 dark:bg-slate-850 text-slate-500">
                            <FiUser size={20} />
                          </span>
                        )}
                        <div>
                          <div className="font-bold text-sm">{rev.user?.name || 'Customer'}</div>
                          <div className="text-xs text-slate-400">{new Date(rev.createdAt).toLocaleDateString()}</div>
                        </div>
                      </div>
                      <div className="flex items-center text-amber-500 text-sm font-bold gap-0.5">
                        <FiStar className="fill-current" /> {rev.rating}
                      </div>
                    </div>
                    <p className="text-sm pl-1">{rev.reviewText}</p>
                  </div>
                ))
              )}
            </div>
          </div>
        </section>

        {/* Similar recommendations */}
        {similarMedicines.length > 0 && (
          <section className="space-y-6 border-t border-slate-205/30 pt-8">
            <h2 className="text-2xl font-extrabold tracking-tight">Similar Medicines</h2>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
              {similarMedicines.map((med) => (
                <Link
                  href={`/medicines/${med._id}`}
                  key={med._id}
                  className="flex flex-col bg-white dark:bg-slate-900 border border-slate-105/50 p-4 rounded-2xl shadow-sm hover:shadow-xl transition"
                >
                  <img
                    src={med.images?.[0] || 'https://images.unsplash.com/photo-1584308666744-24d5c474f2ae?w=150&auto=format&fit=crop&q=60'}
                    alt={med.name}
                    className="h-36 w-full object-contain mb-4 rounded-xl"
                  />
                  <h3 className="font-bold text-sm truncate">{med.name}</h3>
                  <span className="font-bold text-xs text-teal-650 mt-1 block">₹{med.sellingPrice}</span>
                </Link>
              ))}
            </div>
          </section>
        )}
      </div>
    </Layout>
  );
}
