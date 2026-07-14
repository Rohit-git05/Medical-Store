import React, { createContext, useContext, useState, useEffect } from 'react';
import { useAuth } from './AuthContext';
import api from '../services/api';

const CartContext = createContext();

export function CartProvider({ children }) {
  const [cart, setCart] = useState({ items: [] });
  const [coupon, setCoupon] = useState(null);
  const [couponError, setCouponError] = useState('');
  const { user } = useAuth();

  // Load cart when user logs in/out
  useEffect(() => {
    if (user) {
      fetchDBCart();
    } else {
      const localCart = localStorage.getItem('cart');
      if (localCart) {
        setCart(JSON.parse(localCart));
      } else {
        setCart({ items: [] });
      }
    }
    setCoupon(null);
    setCouponError('');
  }, [user]);

  const fetchDBCart = async () => {
    try {
      const { data } = await api.get('/cart');
      if (data.success) {
        setCart(data.cart);
      }
    } catch (error) {
      console.error('Error fetching database cart:', error);
    }
  };

  const syncLocalToStorage = (updatedCart) => {
    setCart(updatedCart);
    localStorage.setItem('cart', JSON.stringify(updatedCart));
  };

  const addToCart = async (medicine, quantity = 1) => {
    if (user) {
      try {
        const { data } = await api.post('/cart/add', { medicineId: medicine._id, quantity });
        if (data.success) setCart(data.cart);
        return { success: true };
      } catch (error) {
        return { success: false, message: error.response?.data?.message || 'Error adding to cart' };
      }
    } else {
      // Local cart logic
      const items = [...cart.items];
      const itemIndex = items.findIndex((item) => item.medicine._id === medicine._id);

      if (itemIndex > -1) {
        items[itemIndex].quantity += Number(quantity);
      } else {
        items.push({ medicine, quantity: Number(quantity) });
      }

      const updatedCart = { items, updatedAt: new Date() };
      syncLocalToStorage(updatedCart);
      return { success: true };
    }
  };

  const updateQty = async (medicineId, quantity) => {
    if (user) {
      try {
        const { data } = await api.put('/cart/update', { medicineId, quantity });
        if (data.success) setCart(data.cart);
        return { success: true };
      } catch (error) {
        return { success: false, message: error.response?.data?.message || 'Error updating quantity' };
      }
    } else {
      const items = cart.items.map((item) =>
        item.medicine._id === medicineId ? { ...item, quantity: Number(quantity) } : item
      );
      const updatedCart = { items, updatedAt: new Date() };
      syncLocalToStorage(updatedCart);
      return { success: true };
    }
  };

  const removeFromCart = async (medicineId) => {
    if (user) {
      try {
        const { data } = await api.delete(`/cart/remove/${medicineId}`);
        if (data.success) setCart(data.cart);
        return { success: true };
      } catch (error) {
        return { success: false, message: 'Error removing item' };
      }
    } else {
      const items = cart.items.filter((item) => item.medicine._id !== medicineId);
      const updatedCart = { items, updatedAt: new Date() };
      syncLocalToStorage(updatedCart);
      return { success: true };
    }
  };

  const clearCart = async () => {
    if (user) {
      try {
        await api.delete('/cart/clear');
        setCart({ items: [] });
      } catch (error) {
        console.error('Error clearing cart:', error);
      }
    } else {
      const updatedCart = { items: [] };
      syncLocalToStorage(updatedCart);
    }
    setCoupon(null);
  };

  const applyCoupon = async (code) => {
    if (!user) {
      return { success: false, message: 'Please log in to apply coupons' };
    }

    const { subtotal } = getTotals();
    try {
      const { data } = await api.get(`/coupons/validate?code=${code}&subtotal=${subtotal}`);
      if (data.success) {
        setCoupon(data);
        setCouponError('');
        return { success: true };
      }
    } catch (error) {
      const errMsg = error.response?.data?.message || 'Invalid coupon code';
      setCouponError(errMsg);
      setCoupon(null);
      return { success: false, message: errMsg };
    }
  };

  const removeCoupon = () => {
    setCoupon(null);
    setCouponError('');
  };

  const getTotals = () => {
    let subtotal = 0;
    let mrpTotal = 0;

    cart.items.forEach((item) => {
      const price = item.medicine.sellingPrice || 0;
      const mrp = item.medicine.MRP || price;
      const qty = item.quantity || 0;
      subtotal += price * qty;
      mrpTotal += mrp * qty;
    });

    let discount = mrpTotal - subtotal; // Stock discount from MRP
    let couponDiscount = 0;

    if (coupon) {
      if (coupon.discountType === 'percentage') {
        couponDiscount = subtotal * (coupon.discountAmount / 100);
      } else {
        couponDiscount = coupon.discountAmount;
      }
    }

    const gst = Math.round(subtotal * 0.05 * 100) / 100; // 5% GST food delivery rate
    const shipping = subtotal > 200 || subtotal === 0 ? 0 : 40; // Free delivery above ₹200, otherwise ₹40
    const grandTotal = Math.round((subtotal - couponDiscount + gst + shipping) * 100) / 100;

    return {
      mrpTotal,
      subtotal,
      itemDiscount: discount,
      couponDiscount,
      gst,
      shipping,
      grandTotal,
      totalItems: cart.items.reduce((count, item) => count + item.quantity, 0)
    };
  };

  return (
    <CartContext.Provider
      value={{
        cart,
        coupon,
        couponError,
        addToCart,
        updateQty,
        removeFromCart,
        clearCart,
        applyCoupon,
        removeCoupon,
        getTotals
      }}
    >
      {children}
    </CartContext.Provider>
  );
}

export const useCart = () => useContext(CartContext);
