import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Sparkles, PlusCircle } from 'lucide-react';
import api from '../api/axios';
import { useNotification } from '../context/NotificationContext';
import FormField from '../components/common/FormField';
import ImageUploader from '../components/common/ImageUploader';
import { CATEGORIES } from '../components/common/SearchFilters';

export const ReportFoundPage = () => {
  const navigate = useNavigate();
  const { showToast } = useNotification();

  const [formData, setFormData] = useState({
    title: '',
    category: 'Electronics',
    description: '',
    location: '',
    dateLostOrFound: new Date().toISOString().split('T')[0],
    approximateTime: '',
    distinguishingFeatures: '',
    safeStorageNotes: ''
  });

  const [selectedFile, setSelectedFile] = useState(null);
  const [submitting, setSubmitting] = useState(false);
  const [errors, setErrors] = useState({});

  const validate = () => {
    const errs = {};
    if (!formData.title.trim()) errs.title = 'Item title is required.';
    if (!formData.category) errs.category = 'Please select a category.';
    if (!formData.description.trim()) errs.description = 'Please describe the found item.';
    if (!formData.location.trim()) errs.location = 'Found location is required.';
    if (!formData.dateLostOrFound) errs.dateLostOrFound = 'Date found is required.';
    setErrors(errs);
    return Object.keys(errs).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validate()) return;

    try {
      setSubmitting(true);
      const data = new FormData();
      data.append('itemType', 'FOUND');
      data.append('title', formData.title);
      data.append('category', formData.category);
      data.append('description', formData.description);
      data.append('location', formData.location);
      data.append('dateLostOrFound', formData.dateLostOrFound);
      data.append('approximateTime', formData.approximateTime);
      data.append('distinguishingFeatures', formData.distinguishingFeatures);
      data.append('safeStorageNotes', formData.safeStorageNotes);

      if (selectedFile) {
        data.append('image', selectedFile);
      }

      const res = await api.post('/items/found', data, {
        headers: { 'Content-Type': 'multipart/form-data' }
      });

      showToast('Found item reported successfully! AI matching initiated.', 'success');
      const createdId = res.data.id || res.data;
      navigate(`/items/${createdId}`);
    } catch (err) {
      showToast(err.response?.data?.message || 'Failed to submit found report.', 'error');
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
      <motion.div
        initial={{ opacity: 0, y: 15 }}
        animate={{ opacity: 1, y: 0 }}
        className="bg-brand-cream border border-brand-caramel/20 rounded-3xl p-6 sm:p-10 shadow-xl space-y-8"
      >
        <div className="border-b border-brand-caramel/15 pb-6">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-emerald-100 text-emerald-800 text-xs font-bold mb-2">
            <PlusCircle className="w-3.5 h-3.5" /> Found Item Report Form
          </div>
          <h1 className="text-3xl font-extrabold text-brand-dark">Report a Found Belonging</h1>
          <p className="text-xs text-brand-muted mt-1 leading-relaxed">
            Help return a lost item to its owner. Please avoid publishing sensitive security credentials publicly.
          </p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-6">
          <FormField
            label="Found Item Title"
            id="title"
            required
            placeholder="e.g. Set of 3 Silver Keys with Leather Keychain"
            value={formData.title}
            onChange={(e) => setFormData({ ...formData, title: e.target.value })}
            error={errors.title}
          />

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
            <FormField label="Category" id="category" required error={errors.category}>
              <select
                id="category"
                value={formData.category}
                onChange={(e) => setFormData({ ...formData, category: e.target.value })}
                className="w-full px-4 py-2.5 rounded-xl border border-brand-caramel/25 bg-brand-cream text-brand-dark text-sm focus:outline-hidden focus:border-brand-caramel"
              >
                {CATEGORIES.map((c) => (
                  <option key={c} value={c}>
                    {c}
                  </option>
                ))}
              </select>
            </FormField>

            <FormField
              label="Date Found"
              id="dateLostOrFound"
              type="date"
              required
              value={formData.dateLostOrFound}
              onChange={(e) => setFormData({ ...formData, dateLostOrFound: e.target.value })}
              error={errors.dateLostOrFound}
            />
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
            <FormField
              label="Found Location"
              id="location"
              required
              placeholder="e.g. Student Center Cafeteria Table 4"
              value={formData.location}
              onChange={(e) => setFormData({ ...formData, location: e.target.value })}
              error={errors.location}
            />

            <FormField
              label="Approximate Time Found"
              id="approximateTime"
              placeholder="e.g. Around 11:30 AM"
              value={formData.approximateTime}
              onChange={(e) => setFormData({ ...formData, approximateTime: e.target.value })}
            />
          </div>

          <FormField
            label="Item Description"
            id="description"
            type="textarea"
            required
            placeholder="Describe overall appearance, color, brand..."
            value={formData.description}
            onChange={(e) => setFormData({ ...formData, description: e.target.value })}
            error={errors.description}
          />

          <FormField
            label="Safe Storage & Handover Instructions"
            id="safeStorageNotes"
            placeholder="e.g. Deposited at Campus Security Desk B or kept safely with finder"
            value={formData.safeStorageNotes}
            onChange={(e) => setFormData({ ...formData, safeStorageNotes: e.target.value })}
          />

          <div className="space-y-2">
            <label className="block text-xs font-bold text-brand-dark uppercase tracking-wider">
              Upload Found Item Photograph (Recommended)
            </label>
            <ImageUploader onFileSelect={(file) => setSelectedFile(file)} />
          </div>

          <div className="pt-4 border-t border-brand-caramel/15 flex items-center justify-between">
            <button
              type="button"
              onClick={() => navigate(-1)}
              className="px-5 py-2.5 rounded-xl border border-brand-caramel/30 text-brand-dark text-xs font-semibold hover:bg-brand-beige"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={submitting}
              className="px-6 py-3 rounded-xl bg-emerald-600 text-white font-bold text-xs shadow-md hover:bg-emerald-700 transform active:scale-95 transition-all"
            >
              {submitting ? 'Submitting Report...' : 'Publish Found Report'}
            </button>
          </div>
        </form>
      </motion.div>
    </div>
  );
};

export default ReportFoundPage;
