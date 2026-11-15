import React, { useState } from 'react';
import {
  Image as ImageIcon,
  Plus,
  Trash2,
  X,
  Sparkles,
  Edit2,
  ArrowUp,
  ArrowDown,
  Upload
} from 'lucide-react';
import AdminLayout from '../../components/admin/AdminLayout';
import { useBooking } from '../../context/BookingContext';
import { dbService } from '../../lib/supabase';

export default function AdminGalleryPage() {
  const { gallery, addGalleryImage, removeGalleryImage, setGallery } = useBooking();
  const [modalOpen, setModalOpen] = useState(false);
  const [editingImage, setEditingImage] = useState(null);
  const [categoryFilter, setCategoryFilter] = useState('All');

  const [formData, setFormData] = useState({
    title: '',
    category: 'Interiors & Suites',
    caption: '',
    image: 'https://images.unsplash.com/photo-1540555700478-4be289fbecef?auto=format&fit=crop&w=1200&q=85'
  });

  const categories = [
    'All',
    'Interiors & Suites',
    'Russian Banya & Steam',
    'Treatment Rooms',
    'Relaxation & Hydrotherapy'
  ];

  const openAddModal = () => {
    setEditingImage(null);
    setFormData({
      title: '',
      category: 'Interiors & Suites',
      caption: '',
      image: 'https://images.unsplash.com/photo-1540555700478-4be289fbecef?auto=format&fit=crop&w=1200&q=85'
    });
    setModalOpen(true);
  };

  const openEditModal = (img) => {
    setEditingImage(img);
    setFormData({
      title: img.title || '',
      category: img.category || 'Interiors & Suites',
      caption: img.caption || '',
      image: img.image || img.image_url || ''
    });
    setModalOpen(true);
  };

  const handleFileUpload = async (e) => {
    const file = e.target.files?.[0];
    if (file) {
      try {
        const publicUrl = await dbService.uploadStorageAsset('gallery-images', file);
        setFormData((prev) => ({ ...prev, image: publicUrl }));
      } catch (err) {
        alert('Image upload failed: ' + err.message);
      }
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (editingImage) {
      // Edit existing
      const updated = gallery.map((item) =>
        item.id === editingImage.id ? { ...item, ...formData } : item
      );
      if (typeof setGallery === 'function') {
        setGallery(updated);
      }
    } else {
      await addGalleryImage(formData);
    }
    setModalOpen(false);
  };

  const handleDelete = async (id, title) => {
    if (window.confirm(`Delete "${title}" from the visual gallery?`)) {
      await removeGalleryImage(id);
    }
  };

  // Reorder: Move Up / Move Down
  const handleMove = (index, direction) => {
    const newIdx = direction === 'up' ? index - 1 : index + 1;
    if (newIdx < 0 || newIdx >= gallery.length) return;
    const reordered = [...gallery];
    const [moved] = reordered.splice(index, 1);
    reordered.splice(newIdx, 0, moved);
    if (typeof setGallery === 'function') {
      setGallery(reordered);
    }
  };

  const filtered = gallery.filter((img) => {
    if (categoryFilter === 'All') return true;
    return img.category === categoryFilter;
  });

  return (
    <AdminLayout
      title="Visual Gallery Management"
      subtitle="Upload, curate, reorder, and edit descriptions for high-definition luxury spa photography."
    >
      <div className="space-y-6">
        {/* Top Controls */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 p-5 rounded-2xl bg-[#0e121c] border border-stone-800">
          <div className="flex flex-wrap items-center gap-2">
            {categories.map((cat) => (
              <button
                key={cat}
                onClick={() => setCategoryFilter(cat)}
                className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-all ${
                  categoryFilter === cat
                    ? 'bg-gold-500 text-stone-950 shadow-gold-sm'
                    : 'bg-stone-900 text-stone-400 hover:text-stone-200 border border-stone-800'
                }`}
              >
                {cat}
              </button>
            ))}
          </div>

          <button
            onClick={openAddModal}
            className="px-5 py-2.5 rounded-xl bg-gradient-to-r from-gold-500 to-gold-600 text-stone-950 font-semibold text-xs sm:text-sm shadow-gold hover:brightness-105 transition-all flex items-center justify-center gap-2"
          >
            <Plus className="w-4 h-4" />
            <span>Upload New Photo</span>
          </button>
        </div>

        {/* Image Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {filtered.map((item, idx) => (
            <div
              key={item.id}
              className="group relative rounded-2xl overflow-hidden bg-[#0e121c] border border-stone-800 hover:border-gold-500/40 transition-all shadow-xl flex flex-col justify-between"
            >
              <div className="relative h-60 w-full overflow-hidden">
                <img
                  src={item.image || item.image_url}
                  alt={item.title}
                  className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent" />

                <div className="absolute top-3 left-3">
                  <span className="px-2.5 py-0.5 rounded-full text-[10px] font-bold uppercase tracking-wider bg-stone-950/80 text-gold-400 border border-gold-500/30 backdrop-blur-md">
                    {item.category}
                  </span>
                </div>

                {/* Card Action Buttons */}
                <div className="absolute top-3 right-3 flex items-center gap-1.5">
                  <button
                    onClick={() => openEditModal(item)}
                    className="w-8 h-8 rounded-full bg-stone-900/90 text-stone-300 hover:text-white border border-stone-700 flex items-center justify-center transition-colors"
                    title="Edit Description"
                  >
                    <Edit2 className="w-3.5 h-3.5" />
                  </button>
                  <button
                    onClick={() => handleDelete(item.id, item.title)}
                    className="w-8 h-8 rounded-full bg-red-950/90 text-red-400 hover:bg-red-900 border border-red-500/30 flex items-center justify-center transition-colors"
                    title="Delete Image"
                  >
                    <Trash2 className="w-3.5 h-3.5" />
                  </button>
                </div>

                {/* Reorder Controls */}
                <div className="absolute bottom-3 right-3 flex items-center gap-1 bg-black/70 p-1 rounded-lg border border-stone-800 backdrop-blur-md">
                  <button
                    disabled={idx === 0}
                    onClick={() => handleMove(idx, 'up')}
                    className="p-1 rounded text-stone-400 hover:text-gold-400 disabled:opacity-30 disabled:hover:text-stone-400"
                    title="Move Up in Order"
                  >
                    <ArrowUp className="w-3.5 h-3.5" />
                  </button>
                  <button
                    disabled={idx === filtered.length - 1}
                    onClick={() => handleMove(idx, 'down')}
                    className="p-1 rounded text-stone-400 hover:text-gold-400 disabled:opacity-30 disabled:hover:text-stone-400"
                    title="Move Down in Order"
                  >
                    <ArrowDown className="w-3.5 h-3.5" />
                  </button>
                </div>
              </div>

              <div className="p-4">
                <h4 className="text-sm font-serif font-bold text-stone-100">
                  {item.title}
                </h4>
                <p className="text-xs text-stone-400 mt-1 line-clamp-2 font-light">
                  {item.caption || 'No description provided.'}
                </p>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Add / Edit Image Modal */}
      {modalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/85 backdrop-blur-md">
          <div className="w-full max-w-md bg-[#0e121c] border border-gold-500/40 rounded-3xl p-6 sm:p-8 shadow-2xl space-y-4">
            <div className="flex items-center justify-between pb-3 border-b border-stone-800">
              <h3 className="text-base font-serif font-bold text-stone-100">
                {editingImage ? 'Edit Gallery Photo' : 'Upload Image to Gallery'}
              </h3>
              <button
                onClick={() => setModalOpen(false)}
                className="w-8 h-8 rounded-full bg-stone-800 text-stone-400 hover:text-stone-100 flex items-center justify-center"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label className="block text-xs uppercase tracking-wider text-stone-300 font-semibold mb-1">
                  Image Title *
                </label>
                <input
                  type="text"
                  required
                  value={formData.title}
                  onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                  placeholder="e.g. Presidential Couples Jacuzzi Chamber"
                  className="w-full bg-[#131722] border border-stone-700 rounded-xl px-3 py-2 text-xs sm:text-sm text-stone-100 focus:outline-none focus:border-gold-400"
                />
              </div>

              <div>
                <label className="block text-xs uppercase tracking-wider text-stone-300 font-semibold mb-1">
                  Category *
                </label>
                <select
                  value={formData.category}
                  onChange={(e) => setFormData({ ...formData, category: e.target.value })}
                  className="w-full bg-[#131722] border border-stone-700 rounded-xl px-3 py-2 text-xs sm:text-sm text-stone-100 focus:outline-none focus:border-gold-400"
                >
                  <option value="Interiors & Suites">Interiors & Suites</option>
                  <option value="Russian Banya & Steam">Russian Banya & Steam</option>
                  <option value="Treatment Rooms">Treatment Rooms</option>
                  <option value="Relaxation & Hydrotherapy">Relaxation & Hydrotherapy</option>
                </select>
              </div>

              {/* Photo Upload & Preview */}
              <div>
                <label className="block text-xs uppercase tracking-wider text-stone-300 font-semibold mb-1">
                  Upload Photo or Enter Image URL *
                </label>
                <div className="space-y-2">
                  <input
                    type="file"
                    accept="image/*"
                    onChange={handleFileUpload}
                    className="w-full text-xs text-stone-400 file:mr-3 file:py-1.5 file:px-3 file:rounded-lg file:border-0 file:text-xs file:font-semibold file:bg-gold-500/20 file:text-gold-300 hover:file:bg-gold-500/30"
                  />
                  <input
                    type="url"
                    required
                    value={formData.image}
                    onChange={(e) => setFormData({ ...formData, image: e.target.value })}
                    placeholder="https://images.unsplash.com/..."
                    className="w-full bg-[#131722] border border-stone-700 rounded-xl px-3 py-2 text-xs sm:text-sm text-stone-100 focus:outline-none focus:border-gold-400"
                  />
                </div>
                {formData.image && (
                  <div className="mt-2 h-24 w-full rounded-xl overflow-hidden border border-stone-800 relative">
                    <img src={formData.image} alt="Preview" className="w-full h-full object-cover" />
                  </div>
                )}
              </div>

              <div>
                <label className="block text-xs uppercase tracking-wider text-stone-300 font-semibold mb-1">
                  Description / Caption
                </label>
                <textarea
                  rows="2"
                  value={formData.caption}
                  onChange={(e) => setFormData({ ...formData, caption: e.target.value })}
                  placeholder="Describe the aesthetic, amenities, or lighting..."
                  className="w-full bg-[#131722] border border-stone-700 rounded-xl p-3 text-xs sm:text-sm text-stone-100 focus:outline-none focus:border-gold-400 resize-none"
                />
              </div>

              <div className="pt-2 flex items-center justify-end gap-3 border-t border-stone-800">
                <button
                  type="button"
                  onClick={() => setModalOpen(false)}
                  className="px-4 py-2 rounded-xl text-xs font-semibold text-stone-400 hover:text-stone-100"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-5 py-2.5 rounded-xl bg-gradient-to-r from-gold-500 to-gold-600 text-stone-950 font-semibold text-xs sm:text-sm shadow-gold"
                >
                  {editingImage ? 'Save Changes' : 'Add to Gallery'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </AdminLayout>
  );
}
