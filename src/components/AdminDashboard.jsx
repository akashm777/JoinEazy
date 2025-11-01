import { useState } from 'react';
import { Plus, Users, BookOpen, TrendingUp, Calendar, ExternalLink, CheckCircle, Clock } from 'lucide-react';
import { useApp } from '../context/AppContext';
import CreateAssignmentModal from './CreateAssignmentModal';

export default function AdminDashboard() {
  const { currentUser, getAssignmentsForCurrentUser, users, getStudentSubmissions } = useApp();
  const [showCreateModal, setShowCreateModal] = useState(false);
  
  const myAssignments = getAssignmentsForCurrentUser();
  const students = users.filter(user => user.role === 'student');

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    });
  };

  // Calculate submission statistics for a specific assignment
  // This could be optimized with useMemo if we had more data
  const getAssignmentStats = (assignmentId) => {
    const submissions = getStudentSubmissions(assignmentId);
    const submittedCount = submissions.filter(sub => sub.status === 'submitted').length;
    const totalStudents = students.length;
    const percentage = totalStudents > 0 ? (submittedCount / totalStudents) * 100 : 0;
    
    return {
      submitted: submittedCount,
      total: totalStudents,
      percentage: Math.round(percentage)
    };
  };

  const getOverallStats = () => {
    const totalAssignments = myAssignments.length;
    const totalPossibleSubmissions = totalAssignments * students.length;
    let totalSubmissions = 0;
    
    myAssignments.forEach(assignment => {
      const submissions = getStudentSubmissions(assignment.id);
      totalSubmissions += submissions.filter(sub => sub.status === 'submitted').length;
    });
    
    const overallPercentage = totalPossibleSubmissions > 0 ? (totalSubmissions / totalPossibleSubmissions) * 100 : 0;
    
    return {
      totalAssignments,
      totalSubmissions,
      totalPossibleSubmissions,
      overallPercentage: Math.round(overallPercentage)
    };
  };

  const overallStats = getOverallStats();

  return (
    <div className="max-w-7xl mx-auto px-6 py-8">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between mb-8">
        <div>
          <h2 className="text-3xl font-bold text-gray-900 mb-2">
            Professor Dashboard 📚
          </h2>
          <p className="text-gray-600">
            Manage assignments and track student progress.
          </p>
        </div>
        <button
          onClick={() => setShowCreateModal(true)}
          className="btn-primary flex items-center space-x-2 mt-4 sm:mt-0"
        >
          <Plus className="w-5 h-5" />
          <span>Create Assignment</span>
        </button>
      </div>

      {/* Stats Overview */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
        <div className="card">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-lg font-semibold text-gray-900">Total Assignments</h3>
            <BookOpen className="w-8 h-8 text-primary-600" />
          </div>
          <div className="text-3xl font-bold text-gray-900 mb-2">
            {overallStats.totalAssignments}
          </div>
          <p className="text-sm text-gray-600">Active assignments</p>
        </div>

        <div className="card">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-lg font-semibold text-gray-900">Students</h3>
            <Users className="w-8 h-8 text-blue-600" />
          </div>
          <div className="text-3xl font-bold text-gray-900 mb-2">
            {students.length}
          </div>
          <p className="text-sm text-gray-600">Enrolled students</p>
        </div>

        <div className="card">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-lg font-semibold text-gray-900">Submissions</h3>
            <CheckCircle className="w-8 h-8 text-success-600" />
          </div>
          <div className="text-3xl font-bold text-gray-900 mb-2">
            {overallStats.totalSubmissions}
          </div>
          <p className="text-sm text-gray-600">
            of {overallStats.totalPossibleSubmissions} total
          </p>
        </div>

        <div className="card">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-lg font-semibold text-gray-900">Completion Rate</h3>
            <TrendingUp className="w-8 h-8 text-green-600" />
          </div>
          <div className="text-3xl font-bold text-gray-900 mb-2">
            {overallStats.overallPercentage}%
          </div>
          <div className="progress-bar">
            <div 
              className="progress-fill" 
              style={{ width: `${overallStats.overallPercentage}%` }}
            ></div>
          </div>
        </div>
      </div>

      {/* Assignments List */}
      <div className="space-y-6">
        <h3 className="text-xl font-semibold text-gray-900">Your Assignments</h3>
        
        {myAssignments.length === 0 ? (
          <div className="card text-center py-12">
            <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <BookOpen className="w-8 h-8 text-gray-400" />
            </div>
            <h4 className="text-lg font-medium text-gray-900 mb-2">No assignments created yet</h4>
            <p className="text-gray-600 mb-6">Create your first assignment to start tracking student progress.</p>
            <button
              onClick={() => setShowCreateModal(true)}
              className="btn-primary"
            >
              Create Assignment
            </button>
          </div>
        ) : (
          <div className="space-y-6">
            {myAssignments.map((assignment) => {
              const stats = getAssignmentStats(assignment.id);
              const submissions = getStudentSubmissions(assignment.id);
              
              return (
                <div key={assignment.id} className="card">
                  <div className="flex flex-col lg:flex-row lg:items-start lg:justify-between mb-6">
                    <div className="flex-1 mb-4 lg:mb-0 lg:pr-6">
                      <div className="flex items-start justify-between mb-3">
                        <div>
                          <h4 className="text-lg font-semibold text-gray-900 mb-1">
                            {assignment.title}
                          </h4>
                          <p className="text-gray-600 text-sm leading-relaxed mb-3">
                            {assignment.description}
                          </p>
                        </div>
                      </div>
                      
                      <div className="flex flex-wrap items-center gap-4 text-sm text-gray-500 mb-4">
                        <div className="flex items-center space-x-1">
                          <Calendar className="w-4 h-4" />
                          <span>Due: {formatDate(assignment.dueDate)}</span>
                        </div>
                        <div className="flex items-center space-x-1">
                          <span className="w-2 h-2 bg-primary-500 rounded-full"></span>
                          <span>Max Score: {assignment.maxScore} points</span>
                        </div>
                        <div className="flex items-center space-x-1">
                          <Clock className="w-4 h-4" />
                          <span>Created: {formatDate(assignment.createdAt)}</span>
                        </div>
                      </div>

                      <a
                        href={assignment.driveLink}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="inline-flex items-center space-x-2 text-primary-600 hover:text-primary-700 text-sm font-medium"
                      >
                        <ExternalLink className="w-4 h-4" />
                        <span>View Drive Folder</span>
                      </a>
                    </div>

                    {/* Progress Summary */}
                    <div className="bg-gray-50 rounded-lg p-4 lg:w-80">
                      <div className="flex items-center justify-between mb-3">
                        <h5 className="font-medium text-gray-900">Submission Progress</h5>
                        <span className="text-2xl font-bold text-primary-600">
                          {stats.percentage}%
                        </span>
                      </div>
                      <div className="progress-bar mb-3">
                        <div 
                          className="progress-fill" 
                          style={{ width: `${stats.percentage}%` }}
                        ></div>
                      </div>
                      <p className="text-sm text-gray-600 mb-4">
                        {stats.submitted} of {stats.total} students submitted
                      </p>
                    </div>
                  </div>

                  {/* Student Progress Details */}
                  <div className="border-t border-gray-200 pt-6">
                    <h5 className="font-medium text-gray-900 mb-4">Individual Student Progress</h5>
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                      {students.map((student) => {
                        const studentSubmission = submissions.find(sub => sub.studentId === student.id);
                        const isSubmitted = studentSubmission && studentSubmission.status === 'submitted';
                        
                        return (
                          <div 
                            key={student.id}
                            className={`flex items-center space-x-3 p-3 rounded-lg border ${
                              isSubmitted 
                                ? 'bg-success-50 border-success-200' 
                                : 'bg-gray-50 border-gray-200'
                            }`}
                          >
                            <div className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-medium ${
                              isSubmitted
                                ? 'bg-success-200 text-success-800'
                                : 'bg-gray-200 text-gray-600'
                            }`}>
                              {student.avatar}
                            </div>
                            <div className="flex-1 min-w-0">
                              <p className="text-sm font-medium text-gray-900 truncate">
                                {student.name}
                              </p>
                              <div className="flex items-center space-x-1">
                                {isSubmitted ? (
                                  <>
                                    <CheckCircle className="w-3 h-3 text-success-600" />
                                    <span className="text-xs text-success-600 font-medium">Submitted</span>
                                  </>
                                ) : (
                                  <>
                                    <Clock className="w-3 h-3 text-gray-400" />
                                    <span className="text-xs text-gray-500">Pending</span>
                                  </>
                                )}
                              </div>
                            </div>
                          </div>
                        );
                      })}
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>

      {/* Create Assignment Modal */}
      {showCreateModal && (
        <CreateAssignmentModal
          onClose={() => setShowCreateModal(false)}
        />
      )}
    </div>
  );
}