import React, { useEffect, useState } from 'react';
import api from '../../services/api';
import toast from 'react-hot-toast';
import { useDispatch } from 'react-redux';
import { fetchProducts as fetchGlobalProducts } from '../../store/productSlice';
import type { AppDispatch } from '../../store';

const AdminProducts: React.FC = () => {
  const dispatch = useDispatch<AppDispatch>();
  const [products, setProducts] = useState<any[]>([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingProduct, setEditingProduct] = useState<any>(null);
  const [formData, setFormData] = useState({
    title: '', artist: '', price: '', imgUrl: '', category: 'dogs', stock: '', description: ''
  });
  const [isUploading, setIsUploading] = useState(false);

  useEffect(() => {
    fetchProducts();
  }, []);

  const fetchProducts = async () => {
    try {
      const data: any = await api.get('/products');
      setProducts(data);
    } catch (error) {
      toast.error('Error loading products');
    }
  };

  const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    if (!e.target.files || e.target.files.length === 0) return;
    const file = e.target.files[0];
    const uploadData = new FormData();
    uploadData.append('image', file);
    
    setIsUploading(true);
    try {
      const res: any = await api.post('/upload', uploadData, {
        headers: { 'Content-Type': 'multipart/form-data' }
      });
      setFormData(prev => ({ ...prev, imgUrl: res.imgUrl }));
      toast.success('Image uploaded successfully');
    } catch (err) {
      toast.error('Error uploading image');
    } finally {
      setIsUploading(false);
    }
  };

  const handleDelete = async (id: number) => {
    if (window.confirm('Are you sure you want to delete this product?')) {
      try {
        await api.delete(`/products/${id}`);
        toast.success('Deleted successfully');
        fetchProducts();
        dispatch(fetchGlobalProducts());
      } catch (error: any) {
        toast.error(error.response?.data?.message || 'Error deleting product');
      }
    }
  };

  const handleOpenModal = (product: any = null) => {
    if (product) {
      setEditingProduct(product);
      setFormData({
        title: product.title,
        artist: product.artist,
        price: product.price.toString(),
        imgUrl: product.imgUrl,
        category: product.category,
        stock: product.stock.toString(),
        description: product.description || ''
      });
    } else {
      setEditingProduct(null);
      setFormData({ title: '', artist: '', price: '', imgUrl: '', category: 'dogs', stock: '', description: '' });
    }
    setIsModalOpen(true);
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
    setEditingProduct(null);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      if (editingProduct) {
        await api.put(`/products/${editingProduct.id}`, formData);
        toast.success('Updated successfully');
      } else {
        await api.post('/products', formData);
        toast.success('Created successfully');
      }
      fetchProducts();
      dispatch(fetchGlobalProducts());
      handleCloseModal();
    } catch (error: any) {
      toast.error(error.response?.data?.message || 'An error occurred');
    }
  };

  const filteredProducts = products.filter(p => {
    const q = searchQuery.toLowerCase();
    return (
      p.title.toLowerCase().includes(q) ||
      (p.artist && p.artist.toLowerCase().includes(q)) ||
      p.category.toLowerCase().includes(q)
    );
  });

  return (
    <div className="space-y-12 bg-[#fff8f0]">
      {/* Header Section */}
      <div className="flex flex-col lg:flex-row justify-between items-start lg:items-end gap-6 mb-12">
        <div className="relative">
          <div className="absolute -inset-4 bg-[#daeb8d] blob-frame-2 opacity-50 -z-10 pointer-events-none"></div>
          <h2 className="font-sans text-3xl font-black text-[#1e1b14] relative z-10 uppercase tracking-tight">
            The Weird Collection
            <span className="inline-block jiggle text-[#ab3500] ml-2">✨</span>
          </h2>
          <p className="font-sans text-sm text-[#594139] mt-2 max-w-lg font-bold">
            Manage your inventory of oddities, strange artifacts, and totally normal products that just look weird.
          </p>
        </div>
        <div className="flex flex-col sm:flex-row gap-4 w-full lg:w-auto">
          <div className="relative flex-grow sm:w-64 md:w-80">
            <input 
              className="w-full bg-white border-4 border-[#1e1b14] px-4 py-3 font-mono text-xs focus:outline-none focus:border-[#ab3500] focus:bg-white transition-all hard-shadow h-14 text-[#1e1b14]" 
              placeholder="Find a specific weirdness..." 
              style={{ borderRadius: '8px 12px 10px 8px' }} 
              type="text"
              value={searchQuery}
              onChange={e => setSearchQuery(e.target.value)}
            />
            <span className="material-symbols-outlined absolute right-4 top-4 text-[#594139] pointer-events-none">search</span>
          </div>
          <button 
            onClick={() => handleOpenModal()}
            className="bg-[#ab3500] hover:bg-[#ff6b35] text-white hover:text-white font-mono text-xs font-bold px-6 py-3 border-2 border-[#1e1b14] hard-shadow hover:shadow-[6px_6px_0px_0px_#1e1b14] hover:scale-102 transition-all flex items-center justify-center gap-2 jiggle h-14 cursor-pointer uppercase tracking-wider" 
            style={{ borderRadius: '12px 8px 16px 10px' }}
          >
            <span className="material-symbols-outlined text-sm font-bold">add_circle</span>
            Add New Weirdo
          </button>
        </div>
      </div>

      {/* Inventory List Container */}
      <div className="bg-white border-4 border-[#1e1b14] p-4 sm:p-6 lg:p-8 hard-shadow relative" style={{ borderRadius: '16px 24px 12px 32px' }}>
        {/* Table Header (Desktop) */}
        <div className="hidden lg:grid grid-cols-12 gap-4 pb-4 border-b-4 border-[#1e1b14] mb-6 font-mono text-xs text-[#594139] font-black uppercase tracking-wider">
          <div className="col-span-1 pl-2">ID</div>
          <div className="col-span-3">Product</div>
          <div className="col-span-1">Category</div>
          <div className="col-span-1">Price</div>
          <div className="col-span-2">Stock Level</div>
          <div className="col-span-2 text-center">Status</div>
          <div className="col-span-2 text-right pr-4">Actions</div>
        </div>

        {/* List Items */}
        <div className="flex flex-col gap-6 lg:gap-0">
          {filteredProducts.map((item) => (
            <div 
              key={item.id} 
              className="flex flex-col lg:grid lg:grid-cols-12 gap-4 items-start lg:items-center py-4 border-b-2 border-dashed border-[#e1bfb5] hover:bg-[#fbf3e6] transition-colors -mx-4 px-4 sm:mx-0 sm:px-0"
            >
              <div className="hidden lg:block col-span-1 pl-2 font-mono text-xs font-bold text-[#594139]">
                #{item.id}
              </div>

              {/* Product Info */}
              <div className="col-span-12 lg:col-span-3 flex items-center gap-4 w-full">
                <div className="w-16 h-16 shrink-0 bg-[#daeb8d] blob-frame border-2 border-[#1e1b14] overflow-hidden hard-shadow bg-white flex items-center justify-center">
                  <img alt={item.title} className="w-full h-full object-cover" src={item.imgUrl} />
                </div>
                <div>
                  <h3 className="font-sans text-sm font-black text-[#1e1b14] leading-tight mb-1 uppercase tracking-wide">
                    {item.title}
                  </h3>
                  <p className="font-mono text-[10px] text-[#594139] font-bold uppercase tracking-widest">
                    {item.artist}
                  </p>
                  <p className="font-mono text-[10px] text-[#594139] lg:hidden mt-1">
                    Category: <span className="font-bold">{item.category}</span>
                  </p>
                  <p className="font-mono text-[10px] text-[#594139] lg:hidden">
                    Price: <span className="font-bold">${item.price.toFixed(2)}</span>
                  </p>
                </div>
              </div>

              {/* Desktop Columns */}
              <div className="hidden lg:block col-span-1 font-mono text-xs font-bold">
                <span className="inline-block px-3 py-1 bg-[#daeb8d] border border-[#1e1b14] rounded-full text-[#181e00] font-black uppercase text-[10px] tracking-wider">
                  {item.category}
                </span>
              </div>
              <div className="hidden lg:block col-span-1 font-mono text-xs font-bold text-[#1e1b14]">
                ${item.price.toFixed(2)}
              </div>

              {/* Stock Level */}
              <div className="col-span-12 lg:col-span-2 w-full flex flex-col gap-1">
                <div className="flex justify-between font-mono text-[10px] text-[#594139] font-black lg:hidden">
                  <span>Stock Level</span>
                  <span>{item.stock} / 100</span>
                </div>
                <div className="h-4 w-full bg-[#e9e2d5] border-2 border-[#1e1b14] rounded-full overflow-hidden relative">
                  <div 
                    className={`absolute top-0 left-0 h-full border-r-2 border-[#1e1b14] ${item.stock <= 5 ? 'bg-red-500' : 'bg-[#576415]'}`} 
                    style={{ width: `${Math.min((item.stock / 100) * 100, 100)}%` }}
                  ></div>
                </div>
                <span className={`font-mono text-[10px] font-black hidden lg:block mt-1 ${item.stock <= 5 ? 'text-red-600' : 'text-[#594139]'}`}>
                  {item.stock <= 5 ? `Low Stock (${item.stock})` : `${item.stock} in stock`}
                </span>
              </div>

              {/* Status */}
              <div className="col-span-12 lg:col-span-2 w-full lg:w-auto mt-2 lg:mt-0 flex lg:justify-center">
                <span className={`inline-block px-3 py-1 border-2 border-[#1e1b14] rounded-full font-mono text-[9px] font-black uppercase flex items-center gap-1 w-fit ${
                  item.stock === 0 ? 'bg-[#ffdad6] text-[#93000a]' : 'bg-[#daeb8d] text-[#181e00]'
                }`}>
                  <span className={`w-1.5 h-1.5 rounded-full inline-block ${item.stock === 0 ? 'bg-[#93000a]' : 'bg-[#181e00]'}`}></span>
                  {item.stock === 0 ? 'Out of Stock' : 'Active'}
                </span>
              </div>

              {/* Actions */}
              <div className="col-span-12 lg:col-span-2 flex justify-end gap-3 w-full lg:w-auto mt-4 lg:mt-0 lg:pr-2">
                <button 
                  onClick={() => handleOpenModal(item)}
                  className="w-9 h-9 border-2 border-[#1e1b14] rounded-lg bg-white hover:bg-[#ffdbd0] text-[#1e1b14] hard-shadow-sm transition-all hover:-translate-y-0.5 cursor-pointer flex items-center justify-center shrink-0"
                >
                  <span className="material-symbols-outlined font-bold" style={{ fontSize: '16px' }}>edit</span>
                </button>
                <button 
                  onClick={() => handleDelete(item.id)}
                  className="w-9 h-9 border-2 border-[#1e1b14] rounded-lg bg-[#ffdad6] hover:bg-[#ba1a1a] hover:text-white text-[#1e1b14] hard-shadow-sm transition-all hover:-translate-y-0.5 cursor-pointer flex items-center justify-center shrink-0"
                >
                  <span className="material-symbols-outlined font-bold" style={{ fontSize: '16px' }}>delete</span>
                </button>
              </div>
            </div>
          ))}

          {filteredProducts.length === 0 && (
            <div className="py-12 text-center">
              <span className="material-symbols-outlined text-6xl text-[#594139]/40 mb-2">sentiment_dissatisfied</span>
              <p className="font-mono text-sm text-[#594139] font-bold">No weirdos match your search query.</p>
            </div>
          )}
        </div>
      </div>

      {/* Product Modal */}
      {isModalOpen && (
        <div className="fixed top-0 bottom-0 right-0 left-0 md:left-64 bg-[#fff8f0] z-50 overflow-y-auto pb-36" style={{ fontFamily: "'Work Sans', sans-serif" }}>
          {/* Header */}
          <header className="sticky top-0 z-40 bg-[#fff8f0]/95 backdrop-blur-md px-8 py-5 border-b-4 border-[#1e1b14] flex justify-between items-center flex-shrink-0">
            <div>
              <h1 className="font-sans text-xl font-black text-[#1e1b14] uppercase tracking-wide">
                {editingProduct ? 'Modify Weirdness' : 'Define a New Weirdness'}
              </h1>
              <p className="font-mono text-[10px] text-[#594139] uppercase font-bold mt-0.5">
                {editingProduct ? 'Tweak an existing anomaly.' : 'Unleash another anomaly into the wild.'}
              </p>
            </div>
            <button 
              type="button" 
              onClick={handleCloseModal}
              className="w-10 h-10 flex items-center justify-center bg-white border-2 border-[#1e1b14] rounded-full hard-shadow-sm organic-brutal-btn relative z-10 hover:bg-[#daeb8d] hover:text-[#576415] cursor-pointer"
            >
              <span className="material-symbols-outlined text-lg leading-none">close</span>
            </button>
          </header>

          {/* Form Content */}
          <form onSubmit={handleSubmit} className="p-8 pt-16 pb-36 max-w-5xl mx-auto w-full grid grid-cols-1 lg:grid-cols-12 gap-8">
            {/* Left Column: Primary Details (7/12 cols) */}
            <div className="lg:col-span-7 space-y-8">
              {/* Basic Info Card */}
              <div className="bg-white p-6 md:p-8 wobbly-border hard-shadow relative">
                <div className="absolute -top-6 -right-6 w-16 h-16 bg-[#daeb8d] rounded-full border-2 border-[#1e1b14] flex items-center justify-center rotate-12 z-10 hidden sm:flex shadow-sm">
                  <span className="material-symbols-outlined text-[#1e1b14] text-3xl font-bold">edit</span>
                </div>
                
                <div className="space-y-6">
                  {/* Title / Name */}
                  <div>
                    <label className="block font-mono text-[11px] font-black text-[#1e1b14] uppercase tracking-wider mb-2" htmlFor="weirdo_name">
                      Weirdo Name
                    </label>
                    <input 
                      type="text" 
                      id="weirdo_name"
                      required
                      placeholder="e.g. Scrambles the Death Dealer"
                      className="w-full bg-[#fbf3e6] wobbly-input px-4 py-3 font-mono text-xs text-[#1e1b14]"
                      value={formData.title} 
                      onChange={e => setFormData({...formData, title: e.target.value})} 
                    />
                  </div>

                  {/* Artist / Brand */}
                  <div>
                    <label className="block font-mono text-[11px] font-black text-[#1e1b14] uppercase tracking-wider mb-2" htmlFor="artist">
                      Artist / Brand
                    </label>
                    <input 
                      type="text" 
                      id="artist"
                      required
                      placeholder="e.g. Weird Wear"
                      className="w-full bg-[#fbf3e6] wobbly-input px-4 py-3 font-mono text-xs text-[#1e1b14]"
                      value={formData.artist} 
                      onChange={e => setFormData({...formData, artist: e.target.value})} 
                    />
                  </div>

                  {/* Description */}
                  <div>
                    <label className="block font-mono text-[11px] font-black text-[#1e1b14] uppercase tracking-wider mb-2" htmlFor="description">
                      Description
                    </label>
                    <textarea 
                      id="description"
                      placeholder="What is wrong with this creature?"
                      className="w-full bg-[#fbf3e6] wobbly-input px-4 py-3 font-mono text-xs text-[#1e1b14] resize-none h-28"
                      value={formData.description} 
                      onChange={e => setFormData({...formData, description: e.target.value})} 
                    />
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                    {/* Price */}
                    <div>
                      <label className="block font-mono text-[11px] font-black text-[#1e1b14] uppercase tracking-wider mb-2" htmlFor="price">
                        Price ($)
                      </label>
                      <div className="relative">
                        <span className="absolute left-4 top-3 text-[#594139] font-mono text-xs font-bold">$</span>
                        <input 
                          type="number" 
                          id="price"
                          step="0.01" 
                          required
                          placeholder="0.00"
                          className="w-full bg-[#fbf3e6] wobbly-input pl-8 pr-4 py-3 font-mono text-xs text-[#1e1b14]"
                          value={formData.price} 
                          onChange={e => setFormData({...formData, price: e.target.value})} 
                        />
                      </div>
                    </div>

                    {/* Category */}
                    <div>
                      <label className="block font-mono text-[11px] font-black text-[#1e1b14] uppercase tracking-wider mb-2" htmlFor="category">
                        Category
                      </label>
                      <select 
                        id="category"
                        className="w-full bg-[#fbf3e6] wobbly-input px-4 py-3 font-mono text-xs text-[#1e1b14] uppercase tracking-widest font-bold"
                        value={formData.category} 
                        onChange={e => setFormData({...formData, category: e.target.value})}
                      >
                        <option value="dogs">Dogs (Adopt)</option>
                        <option value="food">Dog Food</option>
                        <option value="toys">Dog Toys</option>
                        <option value="clothes">Dog Clothes</option>
                      </select>
                    </div>
                  </div>
                </div>
              </div>

              {/* Vibe Check Card */}
              <div className="bg-[#f5ede0] p-6 md:p-8 border-2 border-[#1e1b14] blob-border-2 hard-shadow-olive">
                <h3 className="font-sans text-sm font-black text-[#1e1b14] uppercase tracking-wide mb-3">Vibe Check</h3>
                <p className="font-mono text-[10px] text-[#594139] font-bold uppercase mb-4">Aura descriptors (decorative check)</p>
                <div className="flex flex-wrap gap-3">
                  {['Cursed', 'Sentient', 'Crunchy', 'Squishy', 'Screams Constantly'].map((vibe, idx) => (
                    <label key={idx} className="cursor-pointer">
                      <input className="peer sr-only" type="checkbox" defaultChecked={idx === 1 || idx === 3} />
                      <div className="px-4 py-2 bg-white border-2 border-[#1e1b14] font-mono text-[10px] uppercase font-bold rounded-full peer-checked:bg-[#576415] peer-checked:text-white hover:bg-[#e9e2d5] transition-colors">
                        {vibe}
                      </div>
                    </label>
                  ))}
                </div>
              </div>
            </div>

            {/* Right Column: Media & Meta (5/12 cols) */}
            <div className="lg:col-span-5 space-y-8">
              {/* Mugshot Upload */}
              <div className="bg-white p-6 md:p-8 wobbly-border hard-shadow flex flex-col items-center text-center">
                <h3 className="font-sans text-sm font-black text-[#1e1b14] uppercase tracking-wide mb-6 self-start w-full text-left">
                  Mugshot
                </h3>
                
                <div 
                  className="w-48 h-48 sm:w-56 sm:h-56 bg-[#f5ede0] border-2 border-dashed border-[#e1bfb5] blob-border flex flex-col items-center justify-center cursor-pointer hover:bg-[#e9e2d5] transition-colors group mb-6 relative overflow-hidden"
                  onClick={() => document.getElementById('mugshot_file_input')?.click()}
                >
                  {/* Image Preview or Placeholder */}
                  {formData.imgUrl ? (
                    <img src={formData.imgUrl} alt="Weirdo Illustration" className="absolute inset-0 w-full h-full object-cover" />
                  ) : (
                    <>
                      <div className="absolute inset-0 opacity-20 pointer-events-none" style={{ backgroundImage: 'radial-gradient(#1e1b14 1px, transparent 1px)', backgroundSize: '16px 16px' }}></div>
                      <span className="material-symbols-outlined text-4xl text-[#594139] group-hover:scale-110 transition-transform mb-2">add_a_photo</span>
                      <span className="font-mono text-[10px] uppercase font-bold text-[#594139]">Upload Illustration</span>
                    </>
                  )}
                  <input 
                    type="file" 
                    id="mugshot_file_input"
                    accept="image/*" 
                    onChange={handleFileUpload} 
                    className="hidden" 
                    disabled={isUploading}
                  />
                </div>
                
                {isUploading && (
                  <p className="font-mono text-[10px] text-[#ab3500] font-black uppercase mb-4 animate-pulse">Uploading illustration...</p>
                )}

                <div className="w-full text-left space-y-2">
                  <label className="block font-mono text-[9px] font-black text-[#594139] uppercase tracking-wider">
                    Or direct Image URL
                  </label>
                  <input 
                    type="text" 
                    placeholder="Enter image URL" 
                    required 
                    className="w-full bg-[#fbf3e6] wobbly-input p-3 font-mono text-xs text-[#1e1b14]" 
                    value={formData.imgUrl} 
                    onChange={e => setFormData({...formData, imgUrl: e.target.value})} 
                  />
                </div>
              </div>

              {/* Meta Card */}
              <div className="bg-white p-6 md:p-8 border-2 border-[#1e1b14] rounded-xl hard-shadow">
                <div className="space-y-6">
                  {/* Stock Count */}
                  <div>
                    <label className="block font-mono text-[11px] font-black text-[#1e1b14] uppercase tracking-wider mb-2" htmlFor="stock">
                      Stock Count
                    </label>
                    <input 
                      type="number" 
                      id="stock"
                      required
                      placeholder="0"
                      className="w-full bg-[#fbf3e6] wobbly-input px-4 py-3 font-mono text-xs text-[#1e1b14]"
                      value={formData.stock} 
                      onChange={e => setFormData({...formData, stock: e.target.value})} 
                    />
                  </div>

                  {/* Divider wavy */}
                  <div className="h-4 w-full flex items-center justify-center overflow-hidden my-4 opacity-50">
                    <svg height="8" preserveAspectRatio="none" viewBox="0 0 100 8" width="100%" xmlns="http://www.w3.org/2000/svg">
                      <path className="text-[#1e1b14]" d="M0,4 C10,0 15,8 25,4 C35,0 40,8 50,4 C60,0 65,8 75,4 C85,0 90,8 100,4" fill="none" stroke="currentColor" stroke-width="2"></path>
                    </svg>
                  </div>

                  {/* Visibility Toggle */}
                  <div className="flex items-center justify-between">
                    <div>
                      <label className="block font-mono text-[11px] font-black text-[#1e1b14] uppercase tracking-wider">Visibility</label>
                      <p className="font-mono text-[9px] text-[#594139] font-bold">Make available in store.</p>
                    </div>
                    
                    <div className="relative inline-block w-12 mr-2 align-middle select-none transition duration-200 ease-in">
                      <input defaultChecked className="toggle-checkbox absolute block w-6 h-6 rounded-full bg-white border-4 border-on-surface appearance-none cursor-pointer z-10" id="visibility_toggle" name="toggle" type="checkbox"/>
                      <label className="toggle-label block overflow-hidden h-6 rounded-full bg-surface-variant border-2 border-on-surface cursor-pointer" htmlFor="visibility_toggle"></label>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Sticky Footer Action Bar */}
            <div className="fixed bottom-0 left-0 md:left-64 right-0 bg-[#fff8f0]/90 backdrop-blur-md border-t-4 border-[#1e1b14] p-4 flex justify-end gap-4 z-40">
              <button 
                type="button"
                onClick={handleCloseModal}
                className="px-6 py-3 bg-white border-2 border-[#1e1b14] font-mono text-xs font-bold text-[#1e1b14] hover:bg-[#e9e2d5] transition-colors wobbly-border cursor-pointer uppercase tracking-wider"
              >
                Discard
              </button>
              <button 
                type="submit"
                className="px-6 py-3 bg-[#ff6b35] text-white border-2 border-[#1e1b14] font-mono text-xs font-bold hover:bg-[#ab3500] hard-shadow hover:shadow-[5px_5px_0px_0px_#1e1b14] hover:scale-102 transition-all wobbly-border flex items-center gap-2 cursor-pointer uppercase tracking-wider"
              >
                <span className="material-symbols-outlined text-sm font-bold">save</span>
                Save Weirdness
              </button>
            </div>
          </form>
        </div>
      )}
    </div>
  );
};

export default AdminProducts;
