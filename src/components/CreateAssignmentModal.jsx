import { useState } from 'react';
import { X, Calendar, ExternalLink, BookOpen } from 'lucide-react';
import { useApp } from '../context/AppContext';

export default function CreateAssignmentModal({ onClose }) {
  const { currentUser, dispatch } = useApp();
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    dueDate: '',
    driveLink: '',
    maxScore: 100
  });
  const [validationErrors, setValidationErrors] = useState({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  
  // Could add debounced validation here for better UX

  const validateForm = () => {
    const newErrors = {};
    
    if (!formData.title.trim()) {
      newErrors.title = 'Assignment title is required';
    }
    
    if (!formData.description.trim()) {
      newErrors.description = 'Description is required';
    }
    
    if (!formData.dueDate) {
      newErrors.dueDate = 'Due date is required';
    } else {
      const selectedDate = new Date(formData.dueDate);
      const today = new Date();
      today.setHours(0, 0, 0, 0);
      
      if (selectedDate < today) {
        newErrors.dueDate = 'Due date cannot be in the past';
      }
    }
    
    if (!formData.driveLink.trim()) {
      newErrors.driveLink = 'Drive link is required';
    } else if (!isValidUrl(formData.driveLink)) {
      newErrors.driveLink = 'Please enter a valid URL';
    }
    
    if (!formData.maxScore || formData.maxScore < 1) {
      newErrors.maxScore = 'Max score must be at least 1';
    }
    
    setValidationErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const isValidUrl = (string) => {
    try {
      new URL(string);
      return true;
    } catch (_) {
      return false;
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!validateForm()) {
      return;
    }
    
    setIsSubmitting(true);
    
    // Simulate API call delay
    await new Promise(resolve => setTimeout(resolve, 1000));
    
    const newAssignment = {
      id: `assign_${Date.now()}`,
      title: formData.title.trim(),
      description: formData.description.trim(),
      dueDate: formData.dueDate,
      driveLink: formData.driveLink.trim(),
      maxScore: parseInt(formData.maxScore),
      createdBy: currentUser.id,
      createdAt: new Date().toISOString().split('T')[0]
    };
    
    dispatch({ type: 'ADD_ASSIGNMENT', payload: newAssignment });
    onClose();
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
    
    // Clear validation error when user starts typing
    if (validationErrors[name]) {
      setValidationErrors(prev => ({ ...prev, [name]: '' }));
    }
  };

  const getTomorrowDate = () => {
    const tomorrow = new Date();
    tomorrow.setDate(tomorrow.getDate() + 1);
    return tomorrow.toISOString().split('T')[0];
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
      <div className="bg-white rounded-2xl shadow-2xl max-w-2xl w-full max-h-[90vh] overflow-y-auto">
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b border-gray-200 sticky top-0 bg-white rounded-t-2xl">
          <div className="flex items-center space-x-3">
            <div className="w-10 h-10 bg-primary-100 rounded-lg flex items-center justify-center">
              <BookOpen className="w-5 h-5 text-primary-600" />
            </div>
            <div>
              <h3 className="text-lg font-semibold text-gray-900">Create New Assignment</h3>
              <p className="text-sm text-gray-500">Add a new assignment for your students</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
          >
            <X className="w-5 h-5 text-gray-400" />
          </button>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="p-6 space-y-6">
          {/* Title */}
          <div>
            <label htmlFor="title" className="block text-sm font-medium text-gray-700 mb-2">
              Assignment Title *
            </label>
            <input
              type="text"
              id="title"
              name="title"
              value={formData.title}
              onChange={handleChange}
              placeholder="e.g., React Components Project"
              className={`w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500 transition-colors ${
                validationErrors.title ? 'border-red-300 bg-red-50' : 'border-gray-300'
              }`}
            />
            {validationErrors.title && (
              <p className="mt-1 text-sm text-red-600">{validationErrors.title}</p>
            )}
          </div>

          {/* Description */}
          <div>
            <label htmlFor="description" className="block text-sm font-medium text-gray-700 mb-2">
              Description *
            </label>
            <textarea
              id="description"
              name="description"
              rows={4}
              value={formData.description}
              onChange={handleChange}
              placeholder="Provide detailed instructions for the assignment..."
              className={`w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500 transition-colors resize-none ${
                validationErrors.description ? 'border-red-300 bg-red-50' : 'border-gray-300'
              }`}
            />
            {validationErrors.description && (
              <p className="mt-1 text-sm text-red-600">{validationErrors.description}</p>
            )}
          </div>

          {/* Due Date and Max Score */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
            <div>
              <label htmlFor="dueDate" className="block text-sm font-medium text-gray-700 mb-2">
                Due Date *
              </label>
              <div className="relative">
                <input
                  type="date"
                  id="dueDate"
                  name="dueDate"
                  value={formData.dueDate}
                  onChange={handleChange}
                  min={getTomorrowDate()}
                  className={`w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500 transition-colors ${
                    validationErrors.dueDate ? 'border-red-300 bg-red-50' : 'border-gray-300'
                  }`}
                />
                <Calendar className="absolute right-3 top-3 w-5 h-5 text-gray-400 pointer-events-none" />
              </div>
              {validationErrors.dueDate && (
                <p className="mt-1 text-sm text-red-600">{validationErrors.dueDate}</p>
              )}
            </div>

            <div>
              <label htmlFor="maxScore" className="block text-sm font-medium text-gray-700 mb-2">
                Maximum Score *
              </label>
              <input
                type="number"
                id="maxScore"
                name="maxScore"
                value={formData.maxScore}
                onChange={handleChange}
                min="1"
                max="1000"
                placeholder="100"
                className={`w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500 transition-colors ${
                  validationErrors.maxScore ? 'border-red-300 bg-red-50' : 'border-gray-300'
                }`}
              />
              {validationErrors.maxScore && (
                <p className="mt-1 text-sm text-red-600">{validationErrors.maxScore}</p>
              )}
            </div>
          </div>

          {/* Drive Link */}
          <div>
            <label htmlFor="driveLink" className="block text-sm font-medium text-gray-700 mb-2">
              Google Drive Submission Folder *
            </label>
            <div className="relative">
              <input
                type="url"
                id="driveLink"
                name="driveLink"
                value={formData.driveLink}
                onChange={handleChange}
                placeholder="https://drive.google.com/drive/folders/..."
                className={`w-full px-4 py-3 pr-12 border rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500 transition-colors ${
                  validationErrors.driveLink ? 'border-red-300 bg-red-50' : 'border-gray-300'
                }`}
              />
              <ExternalLink className="absolute right-3 top-3 w-5 h-5 text-gray-400 pointer-events-none" />
            </div>
            {validationErrors.driveLink && (
              <p className="mt-1 text-sm text-red-600">{validationErrors.driveLink}</p>
            )}
            <p className="mt-1 text-sm text-gray-500">
              Students will submit their work to this Google Drive folder
            </p>
          </div>

          {/* Info Box */}
          <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
            <div className="flex items-start space-x-3">
              <div className="w-5 h-5 bg-blue-500 rounded-full flex items-center justify-center flex-shrink-0 mt-0.5">
                <span className="text-white text-xs font-bold">i</span>
              </div>
              <div className="text-sm text-blue-800">
                <p className="font-medium mb-1">Assignment Guidelines:</p>
                <ul className="space-y-1 text-blue-700">
                  <li>• Make sure the Drive folder has proper sharing permissions</li>
                  <li>• Students will mark assignments as submitted through this dashboard</li>
                  <li>• You can track submission progress in real-time</li>
                </ul>
              </div>
            </div>
          </div>
        </form>

        {/* Actions */}
        <div className="flex space-x-3 p-6 bg-gray-50 rounded-b-2xl border-t border-gray-200">
          <button
            type="button"
            onClick={onClose}
            className="flex-1 btn-secondary"
            disabled={isSubmitting}
          >
            Cancel
          </button>
          <button
            onClick={handleSubmit}
            disabled={isSubmitting}
            className="flex-1 btn-primary disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {isSubmitting ? (
              <div className="flex items-center justify-center space-x-2">
                <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                <span>Creating...</span>
              </div>
            ) : (
              'Create Assignment'
            )}
          </button>
        </div>
      </div>
    </div>
  );
}