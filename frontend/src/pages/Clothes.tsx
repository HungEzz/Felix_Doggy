import React, { useMemo, useState } from 'react';
import { useSelector } from 'react-redux';
import { Link } from 'react-router-dom';
import type { RootState } from '../store';
import ProductCard from '../components/ProductCard';
import NoResultsState from '../components/NoResultsState';

export const Clothes: React.FC = () => {
  const [sortOrder, setSortOrder] = useState('featured');
  const [selectedBrands, setSelectedBrands] = useState<Set<string>>(new Set());
  const [searchQuery, setSearchQuery] = useState('');
  const [priceLimit, setPriceLimit] = useState<number | null>(null);

  const [currentPage, setCurrentPage] = useState(1);

  // Reset to page 1 when filters change
  React.useEffect(() => {
    setCurrentPage(1);
  }, [sortOrder, selectedBrands, searchQuery, priceLimit]);

  // Scroll to top when page changes
  React.useEffect(() => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }, [currentPage]);

  const brands = ['PawsWear', 'PupFashion', 'DoggyCouture', 'CozyCanine'];
  const allProducts = useSelector((state: RootState) => state.products.items);

  const maxPrice = useMemo(() => {
    const categoryProducts = allProducts.filter(p => p.category === 'clothes');
    if (categoryProducts.length === 0) return 100;
    return Math.ceil(Math.max(...categoryProducts.map(p => p.price)));
  }, [allProducts]);

  const filteredProducts = useMemo(() => {
    let result = allProducts.filter(p => p.category === 'clothes');
    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase();
      result = result.filter(p => p.title.toLowerCase().includes(q) || p.artist.toLowerCase().includes(q));
    }
    if (selectedBrands.size > 0) {
      result = result.filter(p => selectedBrands.has(p.artist));
    }
    result = result.filter(p => p.price <= (priceLimit ?? maxPrice));
    
    if (sortOrder === 'price-low') result.sort((a, b) => a.price - b.price);
    else if (sortOrder === 'price-high') result.sort((a, b) => b.price - a.price);
    else if (sortOrder === 'az') result.sort((a, b) => a.title.localeCompare(b.title));
    
    return result;
  }, [allProducts, sortOrder, selectedBrands, searchQuery, priceLimit, maxPrice]);

  const ITEMS_PER_PAGE = 6;
  const totalPages = Math.ceil(filteredProducts.length / ITEMS_PER_PAGE);

  const paginatedProducts = useMemo(() => {
    const startIndex = (currentPage - 1) * ITEMS_PER_PAGE;
    return filteredProducts.slice(startIndex, startIndex + ITEMS_PER_PAGE);
  }, [filteredProducts, currentPage]);

  const toggleBrand = (brand: string) => {
    const next = new Set(selectedBrands);
    if (next.has(brand)) next.delete(brand);
    else next.add(brand);
    setSelectedBrands(next);
  };

  const clearAllFilters = () => {
    setSelectedBrands(new Set());
    setPriceLimit(null);
    setSearchQuery('');
  };

  return (
    <div style={{ background: 'var(--bg-primary)', minHeight: '100vh' }}>
      
      {/* Local Styles for Catalog Page */}
      <style>{`
        .blob-shape-1 { border-radius: 40% 60% 70% 30% / 40% 50% 60% 50%; }
        .blob-shape-2 { border-radius: 50% 50% 30% 70% / 60% 40% 70% 40%; }
        .blob-shape-3 { border-radius: 60% 40% 50% 50% / 40% 60% 50% 60%; }
        
        .brutal-shadow { box-shadow: 4px 4px 0px 0px var(--text-primary); }
        .brutal-shadow-dark { box-shadow: 4px 4px 0px 0px rgba(30,27,20,1); }
        .brutal-border { border: 3px solid var(--text-primary); }
        
        /* Custom Checkbox */
        .wobbly-checkbox {
            appearance: none;
            background-color: transparent;
            margin: 0;
            width: 22px;
            height: 22px;
            border: 3px solid var(--text-primary);
            border-radius: 30% 70% 50% 50% / 50% 50% 70% 50%;
            display: grid;
            place-content: center;
            cursor: pointer;
            transition: all 0.15s ease;
        }
        .wobbly-checkbox::before {
            content: "";
            width: 10px;
            height: 10px;
            transform: scale(0);
            transition: 120ms transform ease-in-out;
            box-shadow: inset 1em 1em var(--accent);
            background-color: var(--accent);
            border-radius: 50%;
        }
        .wobbly-checkbox:checked::before {
            transform: scale(1);
        }
        .wobbly-checkbox:checked {
            background-color: var(--accent-soft);
        }
        
        /* Custom Range Slider */
        .brutal-range {
            -webkit-appearance: none;
            appearance: none;
            background: transparent;
            cursor: pointer;
            width: 100%;
        }
        .brutal-range::-webkit-slider-runnable-track {
            background: var(--bg-secondary);
            height: 10px;
            border-radius: 4px;
            border: 3px solid var(--text-primary);
        }
        .brutal-range::-webkit-slider-thumb {
            -webkit-appearance: none;
            appearance: none;
            margin-top: -8px;
            background-color: var(--accent-secondary);
            height: 22px;
            width: 22px;
            border-radius: 50% 40% 60% 50%;
            border: 3px solid var(--text-primary);
            box-shadow: 2px 2px 0 0 var(--text-primary);
        }
      `}</style>

      <main className="max-w-[1440px] mx-auto px-6 pt-2 pb-8 md:pt-4 md:pb-12">
        {/* Breadcrumb */}
        <nav aria-label="Breadcrumb" className="mb-6">
          <ol className="flex items-center space-x-2 text-text-secondary font-mono text-xs list-none p-0 m-0">
            <li><Link className="hover:underline text-text-primary text-decoration-none" to="/">Home</Link></li>
            <li><span className="material-symbols-outlined text-[14px]">chevron_right</span></li>
            <li aria-current="page" className="font-black text-accent uppercase">Dog Clothes</li>
          </ol>
        </nav>

        {/* Header Title & Subtitle */}
        <div className="mb-10 flex flex-col md:flex-row md:items-end justify-between gap-6">
          <div>
            <h1 className="font-display text-4xl md:text-5xl text-accent mb-2 transform -rotate-1 origin-bottom-left uppercase font-black">Dog Clothes</h1>
            <p className="font-sans text-base text-text-secondary font-bold">
              Showing <span className="bg-accent-soft text-text-primary px-3 py-1 rounded-md transform rotate-2 inline-block border-2 border-text-primary font-black uppercase font-mono text-xs">{filteredProducts.length} items</span> of pure weirdness
            </p>
          </div>

          {/* Search bar & Sorting */}
          <div className="flex flex-wrap items-center gap-4 mt-4 md:mt-0">
            <div className="relative">
              <input 
                className="bg-card font-sans text-sm text-text-primary brutal-border blob-shape-1 py-3 px-6 pr-12 w-full md:w-64 focus:outline-none focus:border-accent transition-colors brutal-shadow font-semibold" 
                placeholder="Search the weird..." 
                type="text"
                value={searchQuery}
                onChange={e => setSearchQuery(e.target.value)}
              />
              <span className="material-symbols-outlined absolute right-4 top-1/2 -translate-y-1/2 text-text-secondary">search</span>
            </div>

            <div className="relative">
              <select 
                value={sortOrder}
                onChange={e => setSortOrder(e.target.value)}
                className="appearance-none bg-accent text-text-primary font-mono text-xs font-black uppercase brutal-border blob-shape-2 py-3.5 pl-6 pr-10 cursor-pointer hover:bg-accent-dim transition-colors brutal-shadow-dark focus:outline-none"
              >
                <option value="featured">Newest</option>
                <option value="price-low">Price Low-High</option>
                <option value="price-high">Price High-Low</option>
                <option value="az">Best Selling</option>
              </select>
              <span className="material-symbols-outlined absolute right-3 top-1/2 -translate-y-1/2 text-text-primary pointer-events-none">expand_more</span>
            </div>
          </div>
        </div>

        {/* Sidebar & Products grid columns layout */}
        <div className="flex flex-col lg:flex-row gap-6">
          
          {/* Filter Sidebar */}
          <aside className="w-full lg:w-64 shrink-0 space-y-6 bg-card p-6 pb-12 brutal-border blob-shape-3 brutal-shadow h-max">
            <div className="flex justify-between items-center mb-4">
              <h2 className="font-display text-lg font-black text-text-primary uppercase">Filters</h2>
              <button 
                onClick={clearAllFilters}
                className="text-accent font-mono text-xs font-black hover:underline border-0 bg-transparent cursor-pointer"
              >
                Clear all
              </button>
            </div>

            {/* Brands */}
            <div className="space-y-3">
              <h3 className="font-mono text-[10px] font-black text-text-secondary uppercase tracking-widest">Brand</h3>
              <ul className="space-y-2 list-none p-0 m-0">
                {brands.map(brand => (
                  <li key={brand}>
                    <label className="flex items-center gap-3 cursor-pointer group">
                      <input 
                        type="checkbox"
                        checked={selectedBrands.has(brand)}
                        onChange={() => toggleBrand(brand)}
                        className="wobbly-checkbox"
                      />
                      <span className="font-sans text-sm text-text-primary group-hover:text-accent transition-colors font-bold">{brand}</span>
                    </label>
                  </li>
                ))}
              </ul>
            </div>

            {/* Divider */}
            <div className="w-full h-1 bg-text-secondary/15 rounded-full relative overflow-hidden"></div>

            {/* Price Limit slider */}
            <div className="space-y-4 px-4">
              <h3 className="font-mono text-[10px] font-black text-text-secondary uppercase tracking-widest">Price Limit</h3>
              <input 
                className="brutal-range" 
                max={maxPrice} 
                min="0" 
                type="range" 
                value={priceLimit ?? maxPrice}
                onChange={e => setPriceLimit(Number(e.target.value))}
              />
              <div className="flex justify-between font-mono text-xs text-text-secondary font-black">
                <span>$0</span>
                <span>${priceLimit ?? maxPrice} max</span>
              </div>
            </div>
          </aside>

          {/* Product Grid */}
          <div className="flex-grow">
            {paginatedProducts.length > 0 ? (
              <>
                <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-6">
                  {paginatedProducts.map(product => (
                    <ProductCard key={product.id} product={product} />
                  ))}
                </div>

                {totalPages > 1 && (
                  <div className="flex flex-wrap justify-center items-center gap-6 mt-12 pb-12">
                    <button
                      onClick={() => {
                        setCurrentPage(prev => Math.max(prev - 1, 1));
                      }}
                      disabled={currentPage === 1}
                      style={{ borderRadius: '50% 50% 50% 50% / 70% 70% 30% 30%' }}
                      className="px-8 py-3 bg-[#daeb8d] text-[#1e1b14] border-4 border-[#1e1b14] shadow-[4px_4px_0px_0px_#1e1b14] hover:-translate-y-0.5 hover:shadow-[6px_6px_0px_0px_#1e1b14] hover:rotate-1 active:translate-y-0.5 active:shadow-[2px_2px_0px_0px_#1e1b14] disabled:opacity-50 disabled:cursor-not-allowed font-sans text-base font-black transition-all cursor-pointer"
                    >
                      Show Less
                    </button>

                    <span className="font-mono text-xs font-black bg-white border-3 border-[#1e1b14] px-4 py-2 rounded-full shadow-[3px_3px_0px_0px_#1e1b14] uppercase">
                      Page {currentPage} of {totalPages}
                    </span>

                    <button
                      onClick={() => {
                        setCurrentPage(prev => Math.min(prev + 1, totalPages));
                      }}
                      disabled={currentPage === totalPages}
                      style={{ borderRadius: '50% 50% 50% 50% / 70% 70% 30% 30%' }}
                      className="px-8 py-3 bg-[#ff6b35] text-white border-4 border-[#1e1b14] shadow-[4px_4px_0px_0px_#1e1b14] hover:-translate-y-0.5 hover:shadow-[6px_6px_0px_0px_#1e1b14] hover:-rotate-1 active:translate-y-0.5 active:shadow-[2px_2px_0px_0px_#1e1b14] disabled:opacity-50 disabled:cursor-not-allowed font-sans text-base font-black transition-all cursor-pointer"
                    >
                      Show More
                    </button>
                  </div>
                )}
              </>
            ) : (
              <NoResultsState 
                searchQuery={searchQuery}
                onClearFilters={clearAllFilters}
                onSelectSuggestion={(val) => setSearchQuery(val)}
              />
            )}
          </div>

        </div>
      </main>
    </div>
  );
};

export default Clothes;
