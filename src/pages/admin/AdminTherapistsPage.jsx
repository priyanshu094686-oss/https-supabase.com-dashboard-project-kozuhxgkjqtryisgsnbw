import React, { useState } from 'react';
import {
  UserCheck,
  Plus,
  Edit2,
  Trash2,
  Star,
  Clock,
  Award,
  Globe,
  X,
  Phone,
  MessageCircle
} from 'lucide-react';
import AdminLayout from '../../components/admin/AdminLayout';
import { useBooking } from '../../context/BookingContext';
import { useSettings } from '../../context/SettingsContext';
import { dbService } from '../../lib/supabase';

export default function AdminTherapistsPage() {
  const { therapists, addTherapist, editTherapist, removeTherapist } = useBooking();
  const { formatPrice } = useSettings();

  const [categoryFilter, setCategoryFilter] = useState('all');
  const [modalOpen, setModalOpen] = useState(false);
  const [editingTherapist, setEditingTherapist] = useState(null);

  // Form State
  const [formData, setFormData] = useState({
    name: '',
    category: 'Russian Therapists',
    specialization: 'Slavic Banya & Venik Thermal Therapy',
    experienceYears: '8 Years Experience',
    startingPrice: 3499,
    sessionDuration: '60 - 90 Mins',
    languages: 'English, Russian',
    certifications: 'Moscow Academy of Balneology',
    bio: '',
    image: 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?auto=format&fit=crop&w=700&q=80',
    specialties: 'Russian Banya, Hot Stone Therapy, Deep Tissue',
    is_active: true
  });

  const openAddModal = () => {
    setEditingTherapist(null);
    setFormData({
      name: '',
      category: 'Russian Therapists',
      specialization: 'Slavic Banya & Venik Thermal Therapy',
      experienceYears: '8 Years Experience',
      startingPrice: 3499,
      sessionDuration: '60 - 90 Mins',
      languages: 'English, Russian',
      certifications: 'Moscow Academy of Balneology',
      bio: '',
      image: 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?auto=format&fit=crop&w=700&q=80',
      specialties: 'Russian Banya, Hot Stone Therapy, Deep Tissue',
      is_active: true
    });
    setModalOpen(true);
  };

  const openEditModal = (t) => {
    setEditingTherapist(t);
    setFormData({
      name: t.name,
      category: t.category,
      specialization: t.specialization,
      experienceYears: t.experienceYears || t.experience_years || '7 Years',
      startingPrice: t.startingPrice || t.starting_price || 2999,
      sessionDuration: t.sessionDuration || t.session_duration || '60 - 90 Mins',
      languages: Array.isArray(t.languages) ? t.languages.join(', ') : t.languages || 'English',
      certifications: t.certifications || '',
      bio: t.bio || '',
      image: t.image,
      specialties: Array.isArray(t.specialties) ? t.specialties.join(', ') : t.specialties || '',
      is_active: t.is_active !== false
    });
    setModalOpen(true);
  };

  const handlePhotoUpload = async (e) => {
    const file = e.target.files?.[0];
    if (file) {
      try {
        const publicUrl = await dbService.uploadStorageAsset('therapist-photos', file);
        setFormData((prev) => ({ ...prev, image: publicUrl }));
      } catch (err) {
        alert('Photo upload failed: ' + err.message);
      }
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const payload = {
      ...formData,
      startingPrice: Number(formData.startingPrice),
      languages: formData.languages.split(',').map((l) => l.trim()).filter(Boolean),
      specialties: formData.specialties.split(',').map((s) => s.trim()).filter(Boolean)
    };

    if (editingTherapist) {
      await editTherapist(editingTherapist.id, payload);
    } else {
      await addTherapist(payload);
    }
    setModalOpen(false);
  };

  const handleDelete = async (id, name) => {
    if (window.confirm(`Are you sure you want to remove therapist "${name}" from the active roster?`)) {
      await removeTherapist(id);
    }
  };

  const handleToggleActive = async (t) => {
    await editTherapist(t.id, { is_active: !t.is_active });
  };

  const filtered = therapists.filter((t) => {
    if (categoryFilter === 'all') return true;
    return t.category === categoryFilter;
  });

  return (
    <AdminLayout
      title="Therapist Staff & Specialist Roster"
      subtitle="Manage certified Russian and Indian therapists, accreditations, specialties, and active availability."
    >
      <div className="space-y-6">
        {/* Top Controls */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 p-5 rounded-2xl bg-[#0e121c] border border-stone-800">
          <div className="flex items-center gap-2">
            {['all', 'Russian Therapists', 'Indian Therapists'].map((cat) => (
              <button
                key={cat}
                onClick={() => setCategoryFilter(cat)}
                className={`px-3.5 py-1.5 rounded-lg text-xs font-semibold transition-all ${
                  categoryFilter === cat
                    ? 'bg-gold-500 text-stone-950 shadow-gold-sm'
                    : 'bg-stone-900 text-stone-400 hover:text-stone-200 border border-stone-800'
                }`}
              >
                {cat === 'all' ? 'All Specialists' : cat}
              </button>
            ))}
          </div>

          <button
            onClick={openAddModal}
            className="px-5 py-2.5 rounded-xl bg-gradient-to-r from-gold-500 to-gold-600 text-stone-950 font-semibold text-xs sm:text-sm shadow-gold hover:brightness-105 transition-all flex items-center justify-center gap-2"
          >
            <Plus className="w-4 h-4" />
            <span>Add New Therapist</span>
          </button>
        </div>

        {/* Therapists Cards Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {filtered.map((therapist) => (
            <div
              key={therapist.id}
              className={`rounded-2xl bg-[#0e121c] border overflow-hidden shadow-xl flex flex-col justify-between transition-all duration-300 ${
                therapist.is_active === false
                  ? 'border-stone-800 opacity-60'
                  : 'border-stone-800 hover:border-gold-500/40'
              }`}
            >
              <div>
                <div className="relative h-60 w-full overflow-hidden">
                  <img
                    src={therapist.image}
                    alt={therapist.name}
                    className="w-full h-full object-cover object-top"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-[#0e121c] via-transparent to-transparent" />

                  <div className="absolute top-3 left-3">
                    <span className="px-2.5 py-0.5 rounded-full text-[10px] font-bold uppercase tracking-wider bg-gold-500 text-stone-950">
                      {therapist.category}
                    </span>
                  </div>

                  <div className="absolute top-3 right-3">
                    <button
                      onClick={() => handleToggleActive(therapist)}
                      className={`px-2.5 py-0.5 rounded-full text-[10px] font-bold uppercase tracking-wider ${
                        therapist.is_active !== false
                          ? 'bg-emerald-950 text-emerald-400 border border-emerald-500/40'
                          : 'bg-red-950 text-red-400 border border-red-500/40'
                      }`}
                    >
                      {therapist.is_active !== false ? 'Available' : 'Inactive'}
                    </button>
                  </div>

                  <div className="absolute bottom-3 left-3">
                    <span className="text-[11px] font-semibold text-stone-300 bg-stone-950/80 px-2 py-0.5 rounded-full backdrop-blur-sm border border-stone-700">
                      {therapist.experienceYears || therapist.experience_years}
                    </span>
                  </div>
                </div>

                <div className="p-5 space-y-3">
                  <div>
                    <h4 className="text-lg font-serif font-bold text-stone-100">
                      {therapist.name}
                    </h4>
                    <p className="text-xs text-gold-400 font-medium">
                      {therapist.specialization}
                    </p>
                    <p className="text-xs text-stone-400 font-light mt-2 line-clamp-2">
                      {therapist.bio}
                    </p>
                  </div>

                  <div className="pt-2 border-t border-stone-800 text-xs text-stone-300 flex items-center justify-between">
                    <span className="text-stone-400">Session from</span>
                    <span className="font-bold text-stone-100 font-serif">
                      {formatPrice(therapist.startingPrice || therapist.starting_price)}
                    </span>
                  </div>
                </div>
              </div>

              {/* Action Buttons */}
              <div className="p-4 pt-0 flex items-center justify-between border-t border-stone-800/80 mt-2">
                <button
                  onClick={() => openEditModal(therapist)}
                  className="px-3 py-1.5 rounded-lg text-xs font-semibold bg-stone-900 text-stone-300 hover:text-gold-300 border border-stone-700 hover:border-gold-500/40 flex items-center gap-1.5 transition-colors"
                >
                  <Edit2 className="w-3.5 h-3.5" />
                  <span>Edit</span>
                </button>

                <button
                  onClick={() => handleDelete(therapist.id, therapist.name)}
                  className="px-3 py-1.5 rounded-lg text-xs font-semibold text-red-400 hover:bg-red-500/10 flex items-center gap-1.5 transition-colors"
                >
                  <Trash2 className="w-3.5 h-3.5" />
                  <span>Remove</span>
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Add / Edit Therapist Modal */}
      {modalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/85 backdrop-blur-md overflow-y-auto">
          <div className="w-full max-w-xl bg-[#0e121c] border border-gold-500/40 rounded-3xl shadow-2xl overflow-hidden my-8">
            <div className="p-6 bg-stone-900/90 border-b border-stone-800 flex items-center justify-between">
              <h3 className="text-lg font-serif font-bold text-stone-100">
                {editingTherapist ? `Edit Profile: ${editingTherapist.name}` : 'Add New Certified Specialist'}
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
                    Therapist Name *
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
                    <option value="Russian Therapists">Russian Therapists</option>
                    <option value="Indian Therapists">Indian Therapists</option>
                    <option value="International Specialists">International Specialists</option>
                  </select>
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs uppercase tracking-wider text-stone-300 font-semibold mb-1">
                    Specialization *
                  </label>
                  <input
                    type="text"
                    required
                    value={formData.specialization}
                    onChange={(e) => setFormData({ ...formData, specialization: e.target.value })}
                    placeholder="e.g. Slavic Banya & Venik Therapy"
                    className="w-full bg-[#131722] border border-stone-700 rounded-xl px-3 py-2 text-xs sm:text-sm text-stone-100 focus:outline-none focus:border-gold-400"
                  />
                </div>

                <div>
                  <label className="block text-xs uppercase tracking-wider text-stone-300 font-semibold mb-1">
                    Experience *
                  </label>
                  <input
                    type="text"
                    required
                    value={formData.experienceYears}
                    onChange={(e) => setFormData({ ...formData, experienceYears: e.target.value })}
                    placeholder="e.g. 8 Years Experience"
                    className="w-full bg-[#131722] border border-stone-700 rounded-xl px-3 py-2 text-xs sm:text-sm text-stone-100 focus:outline-none focus:border-gold-400"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs uppercase tracking-wider text-stone-300 font-semibold mb-1">
                    Starting Price ({formatPrice(0).split(' ')[0]}) *
                  </label>
                  <input
                    type="number"
                    required
                    value={formData.startingPrice}
                    onChange={(e) => setFormData({ ...formData, startingPrice: e.target.value })}
                    className="w-full bg-[#131722] border border-stone-700 rounded-xl px-3 py-2 text-xs sm:text-sm text-stone-100 focus:outline-none focus:border-gold-400"
                  />
                </div>

                <div>
                  <label className="block text-xs uppercase tracking-wider text-stone-300 font-semibold mb-1">
                    Session Duration *
                  </label>
                  <input
                    type="text"
                    required
                    value={formData.sessionDuration}
                    onChange={(e) => setFormData({ ...formData, sessionDuration: e.target.value })}
                    placeholder="e.g. 60 - 90 Mins"
                    className="w-full bg-[#131722] border border-stone-700 rounded-xl px-3 py-2 text-xs sm:text-sm text-stone-100 focus:outline-none focus:border-gold-400"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs uppercase tracking-wider text-stone-300 font-semibold mb-1">
                  Upload Photo or Enter Photo URL *
                </label>
                <div className="space-y-2">
                  <input
                    type="file"
                    accept="image/*"
                    onChange={handlePhotoUpload}
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
                  <div className="mt-2 h-20 w-20 rounded-xl overflow-hidden border border-stone-800 relative">
                    <img src={formData.image} alt="Preview" className="w-full h-full object-cover object-top" />
                  </div>
                )}
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs uppercase tracking-wider text-stone-300 font-semibold mb-1">
                    Languages (comma separated)
                  </label>
                  <input
                    type="text"
                    value={formData.languages}
                    onChange={(e) => setFormData({ ...formData, languages: e.target.value })}
                    placeholder="English, Russian"
                    className="w-full bg-[#131722] border border-stone-700 rounded-xl px-3 py-2 text-xs sm:text-sm text-stone-100 focus:outline-none focus:border-gold-400"
                  />
                </div>

                <div>
                  <label className="block text-xs uppercase tracking-wider text-stone-300 font-semibold mb-1">
                    Certifications / Academy
                  </label>
                  <input
                    type="text"
                    value={formData.certifications}
                    onChange={(e) => setFormData({ ...formData, certifications: e.target.value })}
                    placeholder="Moscow Academy of Balneology"
                    className="w-full bg-[#131722] border border-stone-700 rounded-xl px-3 py-2 text-xs sm:text-sm text-stone-100 focus:outline-none focus:border-gold-400"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs uppercase tracking-wider text-stone-300 font-semibold mb-1">
                  Specialties (comma separated)
                </label>
                <input
                  type="text"
                  value={formData.specialties}
                  onChange={(e) => setFormData({ ...formData, specialties: e.target.value })}
                  placeholder="Russian Banya, Hot Stone, Swedish"
                  className="w-full bg-[#131722] border border-stone-700 rounded-xl px-3 py-2 text-xs sm:text-sm text-stone-100 focus:outline-none focus:border-gold-400"
                />
              </div>

              <div>
                <label className="block text-xs uppercase tracking-wider text-stone-300 font-semibold mb-1">
                  Bio / Profile Story *
                </label>
                <textarea
                  rows="3"
                  required
                  value={formData.bio}
                  onChange={(e) => setFormData({ ...formData, bio: e.target.value })}
                  className="w-full bg-[#131722] border border-stone-700 rounded-xl p-3 text-xs sm:text-sm text-stone-100 focus:outline-none focus:border-gold-400 resize-none"
                />
              </div>

              <div className="flex items-center gap-3 pt-2">
                <input
                  type="checkbox"
                  id="therapist_active"
                  checked={formData.is_active}
                  onChange={(e) => setFormData({ ...formData, is_active: e.target.checked })}
                  className="w-4 h-4 rounded text-gold-500 focus:ring-gold-400 bg-stone-900 border-stone-700"
                />
                <label htmlFor="therapist_active" className="text-xs text-stone-300 font-semibold">
                  Mark this specialist as currently available for customer appointments
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
                  {editingTherapist ? 'Save Changes' : 'Add Therapist'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </AdminLayout>
  );
}

