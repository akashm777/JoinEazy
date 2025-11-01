import { useState } from 'react';
import { Calendar, ExternalLink, CheckCircle, Clock, AlertCircle } from 'lucide-react';
import { useApp } from '../context/AppContext';
import SubmissionModal from './SubmissionModal';

export default function StudentDashboard() {
  const { currentUser, assignments, getSubmissionStatus, dispatch } = useApp();
  const [selectedAssignment, setSelectedAssignment] = useState(null);
  const [showSubmissionModal, setShowSubmissionModal] = useState(false);

  // Helper function to format dates in a user-friendly way
  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    });
  };

  // Calculate how many days are left until assignment due date
  // Returns negative number if overdue
  const getDaysUntilDue = (dueDate) => {
    const today = new Date();
    const due = new Date(dueDate);
    const diffTime = due - today;
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    return diffDays;
  };

  const getStatusInfo = (assignment) => {
    const submission = getSubmissionStatus(assignment.id);
    const daysLeft = getDaysUntilDue(assignment.dueDate);
    
    if (submission && submission.status === 'submitted') {
      return {
        status: 'submitted',
        color: 'success',
        icon: CheckCircle,
        text: 'Submitted',
        bgColor: 'bg-success-50',
        textColor: 'text-success-700',
        borderColor: 'border-success-200'
      };
    } else if (daysLeft < 0) {
      return {
        status: 'overdue',
        color: 'danger',
        icon: AlertCircle,
        text: 'Overdue',
        bgColor: 'bg-red-50',
        textColor: 'text-red-700',
        borderColor: 'border-red-200'
      };
    } else if (daysLeft <= 3) {
      return {
        status: 'urgent',
        color: 'warning',
        icon: Clock,
        text: `${daysLeft} day${daysLeft !== 1 ? 's' : ''} left`,
        bgColor: 'bg-yellow-50',
        textColor: 'text-yellow-700',
        borderColor: 'border-yellow-200'
      };
    } else {
      return {
        status: 'pending',
        color: 'secondary',
        icon: Clock,
        text: `${daysLeft} days left`,
        bgColor: 'bg-gray-50',
        textColor: 'text-gray-700',
        borderColor: 'border-gray-200'
      };
    }
  };

  const handleSubmit = (assignmentId) => {
    setSelectedAssignment(assignmentId);
    setShowSubmissionModal(true);
  };

  const confirmSubmission = () => {
    dispatch({
      type: 'SUBMIT_ASSIGNMENT',
      payload: {
        assignmentId: selectedAssignment,
        studentId: currentUser.id
      }
    });
    setShowSubmissionModal(false);
    setSelectedAssignment(null);
  };

  // Calculate progress
  const totalAssignments = assignments.length;
  const submittedCount = assignments.filter(assignment => {
    const submission = getSubmissionStatus(assignment.id);
    return submission && submission.status === 'submitted';
  }).length;
  const progressPercentage = totalAssignments > 0 ? (submittedCount / totalAssignments) * 100 : 0;

  return (
    <div className="max-w-7xl mx-auto px-6 py-8">
      {/* Welcome Section */}
      <div className="mb-8">
        <h2 className="text-3xl font-bold text-gray-900 mb-2">
          Welcome back, {currentUser.name.split(' ')[0]}! 👋
        </h2>
        <p className="text-gray-600">
          Here's your assignment progress and upcoming deadlines.
        </p>
      </div>

      {/* Progress Overview */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
        <div className="card">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-lg font-semibold text-gray-900">Overall Progress</h3>
            <div className="text-2xl font-bold text-primary-600">
              {Math.round(progressPercentage)}%
            </div>
          </div>
          <div className="progress-bar mb-2">
            <div 
              className="progress-fill" 
              style={{ width: `${progressPercentage}%` }}
            ></div>
          </div>
          <p className="text-sm text-gray-600">
            {submittedCount} of {totalAssignments} assignments completed
          </p>
        </div>

        <div className="card">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-lg font-semibold text-gray-900">Submitted</h3>
            <div className="text-2xl font-bold text-success-600">
              {submittedCount}
            </div>
          </div>
          <div className="flex items-center text-success-600">
            <CheckCircle className="w-5 h-5 mr-2" />
            <span className="text-sm font-medium">Assignments completed</span>
          </div>
        </div>

        <div className="card">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-lg font-semibold text-gray-900">Pending</h3>
            <div className="text-2xl font-bold text-orange-600">
              {totalAssignments - submittedCount}
            </div>
          </div>
          <div className="flex items-center text-orange-600">
            <Clock className="w-5 h-5 mr-2" />
            <span className="text-sm font-medium">Awaiting submission</span>
          </div>
        </div>
      </div>

      {/* Assignments List */}
      <div className="space-y-6">
        <h3 className="text-xl font-semibold text-gray-900">Your Assignments</h3>
        
        {assignments.length === 0 ? (
          <div className="card text-center py-12">
            <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <Calendar className="w-8 h-8 text-gray-400" />
            </div>
            <h4 className="text-lg font-medium text-gray-900 mb-2">No assignments yet</h4>
            <p className="text-gray-600">Check back later for new assignments from your professors.</p>
          </div>
        ) : (
          <div className="grid gap-6">
            {assignments.map((assignment) => {
              const statusInfo = getStatusInfo(assignment);
              const StatusIcon = statusInfo.icon;
              
              return (
                <div 
                  key={assignment.id} 
                  className={`card hover:shadow-md transition-all duration-200 border-l-4 ${statusInfo.borderColor}`}
                >
                  <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between">
                    <div className="flex-1 mb-4 lg:mb-0">
                      <div className="flex items-start justify-between mb-3">
                        <div>
                          <h4 className="text-lg font-semibold text-gray-900 mb-1">
                            {assignment.title}
                          </h4>
                          <p className="text-gray-600 text-sm leading-relaxed">
                            {assignment.description}
                          </p>
                        </div>
                        <div className={`px-3 py-1 rounded-full ${statusInfo.bgColor} ${statusInfo.textColor} flex items-center space-x-1 ml-4`}>
                          <StatusIcon className="w-4 h-4" />
                          <span className="text-sm font-medium">{statusInfo.text}</span>
                        </div>
                      </div>
                      
                      <div className="flex flex-wrap items-center gap-4 text-sm text-gray-500">
                        <div className="flex items-center space-x-1">
                          <Calendar className="w-4 h-4" />
                          <span>Due: {formatDate(assignment.dueDate)}</span>
                        </div>
                        <div className="flex items-center space-x-1">
                          <span className="w-2 h-2 bg-primary-500 rounded-full"></span>
                          <span>Max Score: {assignment.maxScore} points</span>
                        </div>
                      </div>
                    </div>

                    <div className="flex flex-col sm:flex-row gap-3 lg:ml-6">
                      <a
                        href={assignment.driveLink}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="btn-secondary flex items-center justify-center space-x-2"
                      >
                        <ExternalLink className="w-4 h-4" />
                        <span>View Details</span>
                      </a>
                      
                      {statusInfo.status !== 'submitted' && (
                        <button
                          onClick={() => handleSubmit(assignment.id)}
                          className="btn-primary flex items-center justify-center space-x-2"
                        >
                          <CheckCircle className="w-4 h-4" />
                          <span>Mark as Submitted</span>
                        </button>
                      )}
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>

      {/* Submission Modal */}
      {showSubmissionModal && (
        <SubmissionModal
          assignment={assignments.find(a => a.id === selectedAssignment)}
          onConfirm={confirmSubmission}
          onCancel={() => setShowSubmissionModal(false)}
        />
      )}
    </div>
  );
}