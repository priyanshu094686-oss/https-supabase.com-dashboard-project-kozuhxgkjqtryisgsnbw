import React, { useState } from 'react';
import {
  Sparkles,
  Plus,
  Edit2,
  Trash2,
  Clock,
  CheckCircle,
  XCircle,
  X,
  Image,
  DollarSign
} from 'lucide-react';
import AdminLayout from '../../components/admin/AdminLayout';
import { useBooking } from '../../context/BookingContext';
import { useSettings } from '../../context/SettingsContext';
import { dbService } from '../../lib/supabase';

export default function AdminServicesPage() {
  const { services, addService, editService, removeService } = useBooking();
  const { formatPrice } = useSettings();

  const [search, setSearch] = useState('');
  const [modalOpen, setModalOpen] = useState(false);
  const [editingService, setEditingService] = useState(null);

  // Form State
  const [formData, setFormData] = useState({
    name: '',
    category: 'Signature European',
    tagline: '',
    description: '',
    price: 2999,
    original_price: 3699,
    duration: '60 Mins',
    image: 'https://images.unsplash.com/photo-1540555700478-4be289fbecef?auto=format&fit=crop&w=800&q=80',
    badge: 'Popular',
    benefits: 'Deep Detoxification, Muscular Relief, Enhanced Vitality',
    is_active: true
  });

  const openAddModal = () => {
    setEditingService(null);
    setFormData({
      name: '',
      category: 'Signature European',
      tagline: '',
      description: '',
      price: 2999,
      original_price: 3699,
      duration: '60 Mins',
      image: 'https://images.unsplash.com/photo-1540555700478-4be289fbecef?auto=format&fit=crop&w=800&q=80',
      badge: 'Signature',
      benefits: 'Deep Detoxification, Muscular Relief, Enhanced Vitality',
      is_active: true
    });
    setModalOpen(true);
  };

  const openEditModal = (service) => {
    setEditingService(service);
    setFormData({
      name: service.name,
      category: service.category,
      tagline: service.tagline || '',
      description: service.description || '',
      price: service.price,
      original_price: service.originalPrice || service.original_price || '',
      duration: service.duration,
      image: service.image,
      badge: service.badge || '',
      benefits: Array.isArray(service.benefits) ? service.benefits.join(', ') : service.benefits || '',
      is_active: service.is_active !== false
    });
    setModalOpen(true);
  };

  const handleImageUpload = async (e) => {
    const file = e.target.files?.[0];
    if (file) {
      try {
        const publicUrl = await dbService.uploadStorageAsset('service-images', file);
        setFormData((prev) => ({ ...prev, image: publicUrl }));
      } catch (err) {
        alert('Image upload failed: ' + err.message);
      }
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const payload = {
      ...formData,
      price: Number(formData.price),
      original_price: formData.original_price ? Number(formData.original_price) : null,
      benefits: formData.benefits.split(',').map((b) => b.trim()).filter(Boolean)
    };

    if (editingService) {
      await editService(editingService.id, payload);
    } else {
      await addService(payload);
    }
    setModalOpen(false);
  };

  const handleDelete = async (id, name) => {
    if (window.confirm(`Are you sure you want to permanently delete "${name}"?`)) {
      await removeService(id);
    }
  };

  const handleToggleActive = async (service) => {
    await editService(service.id, { is_active: !service.is_active });
  };

  const filtered = services.filter((s) =>
    s.name.toLowerCase().includes(search.toLowerCase()) ||
    s.category.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <AdminLayout
      title="Spa Services & Treatment Management"
      subtitle="Add, modify, set pricing, update imagery, and toggle active status for all spa modalities."
    >
      <div className="space-y-6">
        {/* Top Header Controls */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 p-5 rounded-2xl bg-[#0e121c] border border-stone-800">
          <input
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search treatments by name or category..."
            className="w-full sm:w-80 bg-[#131722] border border-stone-700 rounded-xl px-4 py-2 text-xs sm:text-sm text-stone-100 placeholder-stone-500 focus:outline-none focus:border-gold-400"
          />

          <button
            onClick={openAddModal}
            className="px-5 py-2.5 rounded-xl bg-gradient-to-r from-gold-500 to-gold-600 text-stone-950 font-semibold text-xs sm:text-sm shadow-gold hover:brightness-105 transition-all flex items-center justify-center gap-2"
          >
            <Plus className="w-4 h-4" />
            <span>Add New Service</span>
          </button>
        </div>

        {/* Services Cards Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filtered.map((service) => (
            <div
              key={service.id}
              className={`rounded-2xl bg-[#0e121c] border overflow-hidden shadow-xl flex flex-col justify-between transition-all duration-300 ${
                service.is_active === false
                  ? 'border-stone-800 opacity-60'
                  : 'border-stone-800 hover:border-gold-500/40'
              }`}
            >
              <div>
                <div className="relative h-48 w-full overflow-hidden">
                  <img
                    src={service.image}
                    alt={service.name}
                    className="w-full h-full object-cover"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-[#0e121c] via-transparent to-transparent" />

                  <div className="absolute top-3 left-3 flex items-center gap-2">
                    <span className="px-2.5 py-0.5 rounded-full text-[10px] font-bold uppercase tracking-wider bg-gold-500 text-stone-950">
                      {service.badge || service.category}
                    </span>
                  </div>

                  <div className="absolute top-3 right-3">
                    <button
                      onClick={() => handleToggleActive(service)}
                      className={`px-2.5 py-0.5 rounded-full text-[10px] font-bold uppercase tracking-wider ${
                        service.is_active !== false
                          ? 'bg-emerald-950 text-emerald-400 border border-emerald-500/40'
                          : 'bg-red-950 text-red-400 border border-red-500/40'
                      }`}
                    >
                      {service.is_active !== false ? 'Active' : 'Disabled'}
                    </button>
                  </div>

                  <div className="absolute bottom-3 left-3">
                    <span className="inline-flex items-center gap-1 text-xs text-stone-200 font-semibold bg-stone-950/80 px-2.5 py-0.5 rounded-full backdrop-blur-sm border border-stone-700">
                      <Clock className="w-3 h-3 text-gold-400" />
                      {service.duration}
                    </span>
                  </div>
                </div>

                <div className="p-5 space-y-3">
                  <div>
                    <span className="text-[10px] uppercase tracking-wider text-gold-400 font-semibold block">
                      {service.category}
                    </span>
                    <h4 className="text-lg font-serif font-bold text-stone-100">
                      {service.name}
                    </h4>
                    <p className="text-xs text-stone-400 font-light mt-1 line-clamp-2">
                      {service.description}
                    </p>
                  </div>

                  <div className="pt-2 border-t border-stone-800 flex items-baseline gap-2">
                    <span className="text-xl font-serif font-bold text-stone-100">
                      {formatPrice(service.price)}
                    </span>
                    {service.originalPrice && (
                      <span className="text-xs text-stone-500 line-through">
                        {formatPrice(service.originalPrice)}
                      </span>
                    )}
                  </div>
                </div>
              </div>

              {/* Action Buttons */}
              <div className="p-4 pt-0 flex items-center justify-between border-t border-stone-800/80 mt-2">
                <button
                  onClick={() => openEditModal(service)}
                  className="px-3 py-1.5 rounded-lg text-xs font-semibold bg-stone-900 text-stone-300 hover:text-gold-300 border border-stone-700 hover:border-gold-500/40 flex items-center gap-1.5 transition-colors"
                >
                  <Edit2 className="w-3.5 h-3.5" />
                  <span>Edit</span>
                </button>

                <button
                  onClick={() => handleDelete(service.id, service.name)}
                  className="px-3 py-1.5 rounded-lg text-xs font-semibold text-red-400 hover:bg-red-500/10 flex items-center gap-1.5 transition-colors"
                >
                  <Trash2 className="w-3.5 h-3.5" />
                  <span>Delete</span>
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Add / Edit Service Modal */}
      {modalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/85 backdrop-blur-md overflow-y-auto">
          <div className="w-full max-w-xl bg-[#0e121c] border border-gold-500/40 rounded-3xl shadow-2xl overflow-hidden my-8">
            <div className="p-6 bg-stone-900/90 border-b border-stone-800 flex items-center justify-between">
              <h3 className="text-lg font-serif font-bold text-stone-100">
                {editingService ? `Edit Service: ${editingService.name}` : 'Add New Spa Service'}
              </h3>
              <button
                onClick={() => setModalOpen(false)}
                className="w-8 h-8 rounded-full bg-stone-800 text-stone-400 hover:text-stone-100 flex items-center justify-center"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <form onSubmit={handleSubmit} className="p-6 space-y-4 max-h-[75vh] overflow-y-auto">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs uppercase tracking-wider text-stone-300 font-semibold mb-1">
                    Service Name *
                  </label>
                  <input
                    type="text"
                    required
                    value={formData.name}
                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
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
                    <option value="Signature European">Signature European</option>
                    <option value="European Classic">European Classic</option>
                    <option value="Therapeutic & Recovery">Therapeutic & Recovery</option>
                    <option value="Holistic Wellness">Holistic Wellness</option>
                    <option value="Asian & Holistic">Asian & Holistic</option>
                    <option value="VIP Romance & Packages">VIP Romance & Packages</option>
                  </select>
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                <div>
                  <label className="block text-xs uppercase tracking-wider text-stone-300 font-semibold mb-1">
                    Price ({formatPrice(0).split(' ')[0]}) *
                  </label>
                  <input
                    type="number"
                    required
                    value={formData.price}
                    onChange={(e) => setFormData({ ...formData, price: e.target.value })}
                    className="w-full bg-[#131722] border border-stone-700 rounded-xl px-3 py-2 text-xs sm:text-sm text-stone-100 focus:outline-none focus:border-gold-400"
                  />
                </div>

                <div>
                  <label className="block text-xs uppercase tracking-wider text-stone-300 font-semibold mb-1">
                    Original Strike Price
                  </label>
                  <input
                    type="number"
                    value={formData.original_price}
                    onChange={(e) => setFormData({ ...formData, original_price: e.target.value })}
                    className="w-full bg-[#131722] border border-stone-700 rounded-xl px-3 py-2 text-xs sm:text-sm text-stone-100 focus:outline-none focus:border-gold-400"
                  />
                </div>

                <div>
                  <label className="block text-xs uppercase tracking-wider text-stone-300 font-semibold mb-1">
                    Duration *
                  </label>
                  <input
                    type="text"
                    required
                    value={formData.duration}
                    onChange={(e) => setFormData({ ...formData, duration: e.target.value })}
                    placeholder="e.g. 60 Mins"
                    className="w-full bg-[#131722] border border-stone-700 rounded-xl px-3 py-2 text-xs sm:text-sm text-stone-100 focus:outline-none focus:border-gold-400"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs uppercase tracking-wider text-stone-300 font-semibold mb-1">
                  Tagline / Catchphrase
                </label>
                <input
                  type="text"
                  value={formData.tagline}
                  onChange={(e) => setFormData({ ...formData, tagline: e.target.value })}
                  placeholder="e.g. Slavic Thermal Heat & Birch Therapy"
                  className="w-full bg-[#131722] border border-stone-700 rounded-xl px-3 py-2 text-xs sm:text-sm text-stone-100 focus:outline-none focus:border-gold-400"
                />
              </div>

              <div>
                <label className="block text-xs uppercase tracking-wider text-stone-300 font-semibold mb-1">
                  Upload Photo or Enter Image URL *
                </label>
                <div className="space-y-2">
                  <input
                    type="file"
                    accept="image/*"
                    onChange={handleImageUpload}
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
                  Key Benefits (comma separated)
                </label>
                <input
                  type="text"
                  value={formData.benefits}
                  onChange={(e) => setFormData({ ...formData, benefits: e.target.value })}
                  placeholder="Deep Detoxification, Posture Realignment, Lymphatic Drain"
                  className="w-full bg-[#131722] border border-stone-700 rounded-xl px-3 py-2 text-xs sm:text-sm text-stone-100 focus:outline-none focus:border-gold-400"
                />
              </div>

              <div>
                <label className="block text-xs uppercase tracking-wider text-stone-300 font-semibold mb-1">
                  Description *
                </label>
                <textarea
                  rows="3"
                  required
                  value={formData.description}
                  onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                  className="w-full bg-[#131722] border border-stone-700 rounded-xl p-3 text-xs sm:text-sm text-stone-100 focus:outline-none focus:border-gold-400 resize-none"
                />
              </div>

              <div className="flex items-center gap-3 pt-2">
                <input
                  type="checkbox"
                  id="service_active"
                  checked={formData.is_active}
                  onChange={(e) => setFormData({ ...formData, is_active: e.target.checked })}
                  className="w-4 h-4 rounded text-gold-500 focus:ring-gold-400 bg-stone-900 border-stone-700"
                />
                <label htmlFor="service_active" className="text-xs text-stone-300 font-semibold">
                  Enable this service on the live public menu
                </label>
              </div>

              <div className="pt-4 border-t border-stone-800 flex items-center justify-end gap-3">
                <button
                  type="button"
                  onClick={() => setModalOpen(false)}
                  className="px-4 py-2 rounded-xl text-xs font-semibold text-stone-400 hover:text-stone-100"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-5 py-2.5 rounded-xl bg-gradient-to-r from-gold-500 to-gold-600 text-stone-950 font-semibold text-xs sm:text-sm shadow-gold hover:brightness-105"
                >
                  {editingService ? 'Save Changes' : 'Create Service'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </AdminLayout>
  );
}

