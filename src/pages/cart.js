import React, { useState } from 'react';
import Link from 'next/link';
import Layout from '../components/Layout';
import { useCart } from '../context/CartContext';
import { FiTrash2, FiTag, FiShoppingCart, FiArrowRight } from 'react-icons/fi';
import { getImageUrl } from '../utils/imageHelper';

export default function CartPage() {
  const {
    cart,
    coupon,
    couponError,
    updateQty,
    removeFromCart,
    applyCoupon,
    removeCoupon,
    getTotals
  } = useCart();

  const [couponCodeInput, setCouponCodeInput] = useState('');
  const [couponSubmitting, setCouponSubmitting] = useState(false);

  const {
    mrpTotal,
    subtotal,
    itemDiscount,
    couponDiscount,
    gst,
    shipping,
    grandTotal,
    totalItems
  } = getTotals();

  const handleApplyCouponSubmit = async (e) => {
    e.preventDefault();
    if (!couponCodeInput.trim()) return;

    setCouponSubmitting(true);
    await applyCoupon(couponCodeInput);
    setCouponSubmitting(false);
  };

  if (cart.items.length === 0) {
    return (
      <Layout title="Your Basket - BiteDash">
        <div className="flex flex-col items-center justify-center py-20 text-center space-y-4">
          <span className="flex h-16 w-16 items-center justify-center rounded-2xl bg-teal-500/10 text-teal-605">
            <FiShoppingCart size={32} />
          </span>
          <h2 className="text-2xl font-extrabold">Your Cart is Empty</h2>
          <p className="text-sm text-slate-400 max-w-sm">
            Add delicious pizzas, burgers, appetizers, or desserts to your basket to complete checkout.
          </p>
          <Link href="/medicines" className="btn-primary py-2.5 px-6 text-sm">
            Browse Menu
          </Link>
        </div>
      </Layout>
    );
  }

  return (
    <Layout title="Your Basket - BiteDash">
      <h1 className="text-3xl font-extrabold tracking-tight mb-8">Your Basket</h1>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Left Side: Items List */}
        <div className="lg:col-span-2 space-y-4">
          {cart.items.map((item) => (
            <div
              key={item.medicine._id}
              className="flex items-center gap-4 bg-white dark:bg-slate-900 border border-slate-105 p-4 rounded-2xl"
            >
              <img
                src={getImageUrl(item.medicine.images?.[0])}
                alt={item.medicine.name}
                className="w-16 h-16 rounded-xl object-contain bg-slate-50 border p-2 shrink-0"
              />

              <div className="flex-1 min-w-0">
                <h3 className="font-bold text-sm truncate">{item.medicine.name}</h3>
                <p className="text-xs text-slate-400 truncate mb-2">{item.medicine.genericName}</p>

                <div className="flex items-center gap-3">
                  {/* Quantity adjustments */}
                  <div className="flex items-center border border-slate-200 dark:border-slate-800 rounded-lg overflow-hidden bg-slate-50 dark:bg-slate-950">
                    <button
                      disabled={item.quantity <= 1}
                      onClick={() => updateQty(item.medicine._id, item.quantity - 1)}
                      className="px-2.5 py-1 text-sm font-bold hover:bg-slate-150 disabled:opacity-50"
                    >
                      -
                    </button>
                    <span className="px-3 text-xs font-bold">{item.quantity}</span>
                    <button
                      disabled={item.quantity >= item.medicine.stock}
                      onClick={() => updateQty(item.medicine._id, item.quantity + 1)}
                      className="px-2.5 py-1 text-sm font-bold hover:bg-slate-150"
                    >
                      +
                    </button>
                  </div>

                  <button
                    onClick={() => removeFromCart(item.medicine._id)}
                    className="p-2 text-slate-400 hover:text-red-500 rounded-lg hover:bg-red-50 dark:hover:bg-red-950/20 transition"
                  >
                    <FiTrash2 size={16} />
                  </button>
                </div>
              </div>

              {/* Price Details */}
              <div className="text-right shrink-0">
                <div className="font-bold text-sm">₹{item.medicine.sellingPrice * item.quantity}</div>
                {item.medicine.discount > 0 && (
                  <div className="text-xs text-slate-400 line-through">₹{item.medicine.MRP * item.quantity}</div>
                )}
              </div>
            </div>
          ))}
        </div>

        {/* Right Side: Order Summary */}
        <div className="space-y-6">
          <div className="glassmorphism-card p-6 border border-slate-200/50 space-y-4">
            <h3 className="font-extrabold text-lg">Order Summary</h3>

            <div className="space-y-2.5 text-sm border-b border-slate-105 pb-4">
              <div className="flex justify-between">
                <span className="text-slate-450">MRP Total</span>
                <span>₹{mrpTotal}</span>
              </div>
              <div className="flex justify-between text-emerald-600">
                <span>Product Discounts</span>
                <span>-₹{itemDiscount}</span>
              </div>
              {couponDiscount > 0 && (
                <div className="flex justify-between text-teal-650 font-semibold">
                  <span>Coupon ({coupon.code})</span>
                  <span>-₹{couponDiscount}</span>
                </div>
              )}
              <div className="flex justify-between">
                <span className="text-slate-450">GST & Restaurant Tax (5%)</span>
                <span>₹{gst}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-450">Delivery Charges</span>
                <span>{shipping > 0 ? `₹${shipping}` : 'FREE'}</span>
              </div>
            </div>

            <div className="flex justify-between font-extrabold text-lg pt-2">
              <span>Grand Total</span>
              <span className="text-indigo-650 dark:text-teal-400">₹{grandTotal}</span>
            </div>

            <Link href="/checkout" className="w-full btn-primary py-3 rounded-xl flex justify-center items-center gap-2 text-sm mt-4">
              Checkout <FiArrowRight />
            </Link>
          </div>

          {/* Coupon Entry widget */}
          <div className="glassmorphism-card p-6 border border-slate-200/50 space-y-3">
            <h4 className="font-bold text-sm flex items-center gap-1.5"><FiTag /> Apply Promo Code</h4>
            {coupon ? (
              <div className="flex items-center justify-between bg-teal-500/10 border border-teal-500/20 p-3 rounded-xl">
                <div>
                  <span className="font-extrabold text-teal-700 text-sm">{coupon.code}</span>
                  <p className="text-[10px] text-teal-600">Promo applied successfully!</p>
                </div>
                <button onClick={removeCoupon} className="text-xs text-red-505 font-bold hover:underline">
                  Remove
                </button>
              </div>
            ) : (
              <form onSubmit={handleApplyCouponSubmit} className="flex gap-2">
                <input
                  type="text"
                  placeholder="COUPON15"
                  value={couponCodeInput}
                  onChange={(e) => setCouponCodeInput(e.target.value)}
                  className="input-field py-2 text-xs uppercase"
                />
                <button
                  type="submit"
                  disabled={couponSubmitting}
                  className="bg-slate-800 hover:bg-slate-900 text-white font-bold px-4 py-2 rounded-xl text-xs transition"
                >
                  Apply
                </button>
              </form>
            )}
            {couponError && <p className="text-xs text-red-500 font-semibold">{couponError}</p>}
          </div>
        </div>
      </div>
    </Layout>
  );
}
