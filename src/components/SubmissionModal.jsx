import { useState } from 'react';
import { CheckCircle, AlertTriangle, X } from 'lucide-react';

export default function SubmissionModal({ assignment, onConfirm, onCancel }) {
  const [currentStep, setCurrentStep] = useState(1);
  const [isAnimating, setIsAnimating] = useState(false);
  
  // Animation timing - could be moved to a config file
  const ANIMATION_DURATION = 300;

  const handleFirstConfirm = () => {
    setIsAnimating(true);
    setTimeout(() => {
      setCurrentStep(2);
      setIsAnimating(false);
    }, ANIMATION_DURATION);
  };

  const handleFinalConfirm = () => {
    setIsAnimating(true);
    setTimeout(() => {
      onConfirm();
    }, ANIMATION_DURATION);
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
      <div className={`bg-white rounded-2xl shadow-2xl max-w-md w-full transform transition-all duration-300 ${
        isAnimating ? 'scale-95 opacity-50' : 'scale-100 opacity-100'
      }`}>
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b border-gray-200">
          <h3 className="text-lg font-semibold text-gray-900">
            {currentStep === 1 ? 'Confirm Submission' : 'Final Confirmation'}
          </h3>
          <button
            onClick={onCancel}
            className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
          >
            <X className="w-5 h-5 text-gray-400" />
          </button>
        </div>

        {/* Content */}
        <div className="p-6">
          {currentStep === 1 ? (
            <div className="text-center">
              <div className="w-16 h-16 bg-primary-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <CheckCircle className="w-8 h-8 text-primary-600" />
              </div>
              <h4 className="text-lg font-medium text-gray-900 mb-2">
                Ready to submit?
              </h4>
              <p className="text-gray-600 mb-6">
                You're about to mark "<strong>{assignment?.title}</strong>" as submitted. 
                Make sure you've uploaded all required files to the Drive folder.
              </p>
              <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 mb-6">
                <div className="flex items-start space-x-3">
                  <div className="w-5 h-5 bg-blue-500 rounded-full flex items-center justify-center flex-shrink-0 mt-0.5">
                    <span className="text-white text-xs font-bold">i</span>
                  </div>
                  <div className="text-sm text-blue-800">
                    <p className="font-medium mb-1">Before submitting:</p>
                    <ul className="space-y-1 text-blue-700">
                      <li>• Check that all files are uploaded</li>
                      <li>• Verify file names are correct</li>
                      <li>• Ensure submission meets requirements</li>
                    </ul>
                  </div>
                </div>
              </div>
            </div>
          ) : (
            <div className="text-center">
              <div className="w-16 h-16 bg-yellow-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <AlertTriangle className="w-8 h-8 text-yellow-600" />
              </div>
              <h4 className="text-lg font-medium text-gray-900 mb-2">
                Are you absolutely sure?
              </h4>
              <p className="text-gray-600 mb-6">
                This action will mark your assignment as submitted. You won't be able to 
                change this status once confirmed.
              </p>
              <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4 mb-6">
                <p className="text-sm text-yellow-800">
                  <strong>Final check:</strong> I have completed and uploaded my assignment 
                  for "<strong>{assignment?.title}</strong>" and I'm ready to submit.
                </p>
              </div>
            </div>
          )}
        </div>

        {/* Actions */}
        <div className="flex space-x-3 p-6 bg-gray-50 rounded-b-2xl">
          <button
            onClick={onCancel}
            className="flex-1 btn-secondary"
          >
            Cancel
          </button>
          {currentStep === 1 ? (
            <button
              onClick={handleFirstConfirm}
              className="flex-1 btn-primary"
            >
              Yes, I'm Ready
            </button>
          ) : (
            <button
              onClick={handleFinalConfirm}
              className="flex-1 bg-green-600 hover:bg-green-700 text-white font-medium py-2 px-4 rounded-lg transition-colors duration-200 focus:outline-none focus:ring-2 focus:ring-green-500 focus:ring-offset-2"
            >
              Confirm Submission
            </button>
          )}
        </div>
      </div>
    </div>
  );
}