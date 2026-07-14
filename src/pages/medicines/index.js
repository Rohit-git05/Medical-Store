import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/router';
import Layout from '../../components/Layout';
import api from '../../services/api';
import { ProductGridSkeleton } from '../../components/LoadingSkeleton';
import Link from 'next/link';
import { getImageUrl } from '../../utils/imageHelper';

export default function MedicinesList() {
  const router = useRouter();
  const { search: searchParam, categoryName } = router.query;

  // Search & Filters State
  const [search, setSearch] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('');
  const [selectedBrand, setSelectedBrand] = useState('');
  const [minPrice, setMinPrice] = useState('');
  const [maxPrice, setMaxPrice] = useState('');
  const [rating, setRating] = useState('');
  const [prescriptionRequired, setPrescriptionRequired] = useState('');
  const [availability, setAvailability] = useState('');
  const [sort, setSort] = useState('latest');
  const [page, setPage] = useState(1);

  // Data State
  const [medicines, setMedicines] = useState([]);
  const [categories, setCategories] = useState([]);
  const [brands, setBrands] = useState([]);
  const [totalPages, setTotalPages] = useState(1);
  const [totalItems, setTotalItems] = useState(0);
  const [loading, setLoading] = useState(true);

  // Initial Sync from Router Query
  useEffect(() => {
    if (searchParam) setSearch(searchParam);
  }, [searchParam]);

  // Load Categories & Brands
  useEffect(() => {
    async function loadMeta() {
      try {
        const catRes = await api.get('/admin/categories');
        if (catRes.data.success) {
          setCategories(catRes.data.categories);
          // If category name was passed as a query param, find its ID and select it
          if (categoryName) {
            const found = catRes.data.categories.find(c => c.name.toLowerCase() === categoryName.toString().toLowerCase());
            if (found) setSelectedCategory(found._id);
          }
        }

        const brandRes = await api.get('/admin/brands');
        if (brandRes.data.success) setBrands(brandRes.data.brands);
      } catch (err) {
        console.error('Error fetching filter metadata:', err);
      }
    }
    loadMeta();
  }, [categoryName]);

  // Fetch medicines based on state changes
  useEffect(() => {
    async function fetchMedicines() {
      setLoading(true);
      try {
        const queryParams = new URLSearchParams();
        if (search) queryParams.append('search', search);
        if (selectedCategory) queryParams.append('category', selectedCategory);
        if (selectedBrand) queryParams.append('brand', selectedBrand);
        if (minPrice) queryParams.append('minPrice', minPrice);
        if (maxPrice) queryParams.append('maxPrice', maxPrice);
        if (rating) queryParams.append('rating', rating);
        if (prescriptionRequired) queryParams.append('prescriptionRequired', prescriptionRequired);
        if (availability) queryParams.append('availability', availability);
        if (sort) queryParams.append('sort', sort);
        queryParams.append('page', page);
        queryParams.append('limit', 8);

        const { data } = await api.get(`/medicines?${queryParams.toString()}`);
        if (data.success) {
          setMedicines(data.medicines);
          setTotalPages(data.pages);
          setTotalItems(data.total);
        }
      } catch (err) {
        console.error('Error fetching medicines:', err);
      } finally {
        setLoading(false);
      }
    }

    const delayDebounce = setTimeout(() => {
      fetchMedicines();
    }, search !== searchParam ? 300 : 0);

    return () => clearTimeout(delayDebounce);
  }, [search, selectedCategory, selectedBrand, minPrice, maxPrice, rating, prescriptionRequired, availability, sort, page]);

  const resetFilters = () => {
    setSearch('');
    setSelectedCategory('');
    setSelectedBrand('');
    setMinPrice('');
    setMaxPrice('');
    setRating('');
    setPrescriptionRequired('');
    setAvailability('');
    setSort('latest');
    setPage(1);
    router.replace('/medicines', undefined, { shallow: true });
  };

  return (
    <Layout title="Browse Menu - BiteDash">
      <div className="flex flex-col lg:flex-row gap-8">
        {/* Left Filter Sidebar */}
        <aside className="w-full lg:w-64 shrink-0 glassmorphism-card p-5 border border-slate-205/30 h-fit space-y-6">
          <div className="flex justify-between items-center pb-2 border-b border-slate-100 dark:border-slate-805">
            <h3 className="font-extrabold text-lg">Filters</h3>
            <button onClick={resetFilters} className="text-xs font-semibold text-teal-500 hover:underline">
              Clear All
            </button>
          </div>

          {/* Category Filter */}
          <div className="space-y-2">
            <label className="text-xs font-bold uppercase tracking-wider text-slate-450">Category</label>
            <select
              value={selectedCategory}
              onChange={(e) => { setSelectedCategory(e.target.value); setPage(1); }}
              className="input-field py-2 text-sm"
            >
              <option value="">All Categories</option>
              {categories.map((c) => (
                <option key={c._id} value={c._id}>{c.name}</option>
              ))}
            </select>
          </div>

          {/* Cuisine Filter */}
          <div className="space-y-2">
            <label className="text-xs font-bold uppercase tracking-wider text-slate-450">Cuisine</label>
            <select
              value={selectedBrand}
              onChange={(e) => { setSelectedBrand(e.target.value); setPage(1); }}
              className="input-field py-2 text-sm"
            >
              <option value="">All Cuisines</option>
              {brands.map((b) => (
                <option key={b._id} value={b._id}>{b.name}</option>
              ))}
            </select>
          </div>

          {/* Price Range */}
          <div className="space-y-2">
            <label className="text-xs font-bold uppercase tracking-wider text-slate-450">Price Range (₹)</label>
            <div className="flex gap-2">
              <input
                type="number"
                placeholder="Min"
                value={minPrice}
                onChange={(e) => { setMinPrice(e.target.value); setPage(1); }}
                className="input-field py-1.5 text-xs text-center"
              />
              <input
                type="number"
                placeholder="Max"
                value={maxPrice}
                onChange={(e) => { setMaxPrice(e.target.value); setPage(1); }}
                className="input-field py-1.5 text-xs text-center"
              />
            </div>
          </div>

          {/* Prescription filter removed */}

          {/* Availability */}
          <div className="space-y-2">
            <label className="text-xs font-bold uppercase tracking-wider text-slate-450">Availability</label>
            <div className="flex items-center gap-2 text-sm">
              <input
                type="checkbox"
                id="instock"
                checked={availability === 'inStock'}
                onChange={(e) => { setAvailability(e.target.checked ? 'inStock' : ''); setPage(1); }}
                className="rounded border-slate-300 text-teal-600 focus:ring-teal-500 h-4 w-4"
              />
              <label htmlFor="instock" className="cursor-pointer font-medium">In Stock Only</label>
            </div>
          </div>
        </aside>

        {/* Right Content Area */}
        <section className="flex-1 space-y-6">
          {/* Top Actions: Search input sync, sorting, count indicator */}
          <div className="flex flex-col sm:flex-row items-center justify-between gap-4 glassmorphism rounded-2xl p-4">
            <div className="text-sm font-semibold text-slate-500">
              Showing {totalItems} results for "{search || 'All menu items'}"
            </div>
            <div className="flex items-center gap-2 self-end">
              <label className="text-xs font-bold uppercase text-slate-400">Sort By</label>
              <select
                value={sort}
                onChange={(e) => setSort(e.target.value)}
                className="bg-transparent text-sm border-none font-bold focus:ring-0 cursor-pointer"
              >
                <option value="latest">Latest</option>
                <option value="bestSelling">Best Selling</option>
                <option value="priceAsc">Price: Low to High</option>
                <option value="priceDesc">Price: High to Low</option>
                <option value="rating">Highest Rated</option>
              </select>
            </div>
          </div>

          {/* Medicines Grid */}
          {loading ? (
            <ProductGridSkeleton count={8} />
          ) : medicines.length === 0 ? (
            <div className="glassmorphism-card text-center py-20">
              <span className="text-5xl">🔍</span>
              <h3 className="font-extrabold text-xl mt-4">No Dishes Found</h3>
              <p className="text-sm text-slate-400 mt-2">Try adjusting your filters or search query.</p>
              <button onClick={resetFilters} className="btn-primary py-2 px-6 mt-6 text-sm">
                Reset Filters
              </button>
            </div>
          ) : (
            <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
              {medicines.map((med) => (
                <div
                  key={med._id}
                  className="flex flex-col bg-white dark:bg-slate-900 border border-slate-105/50 dark:border-slate-800 rounded-2xl p-4 shadow-sm hover:shadow-xl transition duration-300"
                >
                  <div className="relative h-40 w-full mb-4 rounded-xl overflow-hidden bg-slate-50 flex items-center justify-center">
                    <img
                      src={getImageUrl(med.images?.[0])}
                      alt={med.name}
                      className="max-h-full max-w-full object-contain"
                    />
                    {med.discount > 0 && (
                      <span className="absolute top-2 left-2 bg-rose-500 text-white text-[10px] font-bold px-2 py-0.5 rounded-full">
                        -{med.discount}%
                      </span>
                    )}
                  </div>

                  <div className="flex-1 flex flex-col justify-between">
                    <div>
                      <div className="flex items-center gap-1.5 flex-wrap">
                        <span className="text-[9px] font-bold uppercase tracking-wider text-slate-400">
                          {med.brand?.name || 'CUISINE'}
                        </span>
                        {med.category && (
                          <span className="text-[9px] font-bold uppercase tracking-wider bg-teal-500/10 text-teal-650 px-2 py-0.5 rounded-full">
                            {med.category.name}
                          </span>
                        )}
                      </div>
                      <h3 className="font-bold text-sm mt-1 truncate">{med.name}</h3>
                      <p className="text-xs text-slate-400 truncate mb-4">{med.genericName}</p>
                    </div>

                    <div className="flex justify-between items-center mt-auto">
                      <div>
                        <span className="font-extrabold text-teal-605 dark:text-teal-400 text-sm">₹{med.sellingPrice}</span>
                        {med.discount > 0 && (
                          <span className="text-[10px] text-slate-405 line-through ml-1.5">₹{med.MRP}</span>
                        )}
                      </div>
                      <Link
                        href={`/medicines/${med._id}`}
                        className="border border-teal-500/20 hover:bg-teal-500 hover:text-white text-teal-500 font-bold px-3 py-1 rounded-xl text-[11px] transition"
                      >
                        Buy
                      </Link>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}

          {/* Pagination buttons */}
          {totalPages > 1 && (
            <div className="flex justify-center gap-2 pt-6">
              <button
                disabled={page === 1}
                onClick={() => setPage(p => Math.max(p - 1, 1))}
                className="btn-secondary py-1.5 px-4 text-xs font-semibold disabled:opacity-50"
              >
                Previous
              </button>
              <span className="flex items-center text-sm px-4 font-bold">
                Page {page} of {totalPages}
              </span>
              <button
                disabled={page === totalPages}
                onClick={() => setPage(p => Math.min(p + 1, totalPages))}
                className="btn-secondary py-1.5 px-4 text-xs font-semibold disabled:opacity-50"
              >
                Next
              </button>
            </div>
          )}
        </section>
      </div>
    </Layout>
  );
}
