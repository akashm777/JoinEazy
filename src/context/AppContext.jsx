import { createContext, useContext, useReducer, useEffect } from 'react';

const AppContext = createContext();

// TODO: Replace with actual API calls in production
// For now, using mock data to simulate backend responses
const initialAssignments = [
  {
    id: 'assign_001',
    title: 'React Fundamentals Project',
    description: 'Build a complete React application demonstrating component lifecycle, state management, and hooks.',
    dueDate: '2024-12-15',
    driveLink: 'https://drive.google.com/drive/folders/example1',
    createdBy: 'prof_001',
    createdAt: '2024-11-01',
    maxScore: 100,
  },
  {
    id: 'assign_002', 
    title: 'Database Design Assignment',
    description: 'Design and implement a normalized database schema for an e-commerce platform.',
    dueDate: '2024-12-20',
    driveLink: 'https://drive.google.com/drive/folders/example2',
    createdBy: 'prof_001',
    createdAt: '2024-11-02',
    maxScore: 80,
  },
  {
    id: 'assign_003',
    title: 'API Integration Challenge',
    description: 'Create a web application that integrates with multiple REST APIs and handles error scenarios.',
    dueDate: '2024-12-25',
    driveLink: 'https://drive.google.com/drive/folders/example3',
    createdBy: 'prof_002',
    createdAt: '2024-11-03',
    maxScore: 90,
  }
];

const initialUsers = [
  {
    id: 'student_001',
    name: 'Alex Johnson',
    email: 'alex.johnson@university.edu',
    role: 'student',
    avatar: 'AJ'
  },
  {
    id: 'student_002',
    name: 'Sarah Chen',
    email: 'sarah.chen@university.edu', 
    role: 'student',
    avatar: 'SC'
  },
  {
    id: 'student_003',
    name: 'Michael Rodriguez',
    email: 'michael.rodriguez@university.edu',
    role: 'student',
    avatar: 'MR'
  },
  {
    id: 'prof_001',
    name: 'Dr. Emily Watson',
    email: 'emily.watson@university.edu',
    role: 'admin',
    avatar: 'EW'
  },
  {
    id: 'prof_002',
    name: 'Prof. David Kim',
    email: 'david.kim@university.edu',
    role: 'admin', 
    avatar: 'DK'
  }
];

const initialSubmissions = [
  {
    id: 'sub_001',
    assignmentId: 'assign_001',
    studentId: 'student_001',
    status: 'submitted',
    submittedAt: '2024-11-10T14:30:00Z',
    isConfirmed: true
  },
  {
    id: 'sub_002',
    assignmentId: 'assign_001',
    studentId: 'student_002',
    status: 'pending',
    submittedAt: null,
    isConfirmed: false
  },
  {
    id: 'sub_003',
    assignmentId: 'assign_002',
    studentId: 'student_001',
    status: 'pending',
    submittedAt: null,
    isConfirmed: false
  }
];

const initialState = {
  currentUser: initialUsers[0], // Default to first student
  assignments: initialAssignments,
  users: initialUsers,
  submissions: initialSubmissions,
  isLoading: false,
  error: null
};

function appReducer(state, action) {
  switch (action.type) {
    case 'SET_CURRENT_USER':
      return { ...state, currentUser: action.payload };
    
    case 'ADD_ASSIGNMENT':
      return {
        ...state,
        assignments: [...state.assignments, action.payload]
      };
    
    case 'UPDATE_ASSIGNMENT':
      return {
        ...state,
        assignments: state.assignments.map(assignment =>
          assignment.id === action.payload.id ? action.payload : assignment
        )
      };
    
    case 'DELETE_ASSIGNMENT':
      return {
        ...state,
        assignments: state.assignments.filter(assignment => assignment.id !== action.payload)
      };
    
    case 'SUBMIT_ASSIGNMENT':
      const existingSubmission = state.submissions.find(
        sub => sub.assignmentId === action.payload.assignmentId && 
               sub.studentId === action.payload.studentId
      );
      
      if (existingSubmission) {
        return {
          ...state,
          submissions: state.submissions.map(sub =>
            sub.id === existingSubmission.id 
              ? { ...sub, status: 'submitted', submittedAt: new Date().toISOString(), isConfirmed: true }
              : sub
          )
        };
      } else {
        return {
          ...state,
          submissions: [...state.submissions, {
            id: `sub_${Date.now()}`,
            assignmentId: action.payload.assignmentId,
            studentId: action.payload.studentId,
            status: 'submitted',
            submittedAt: new Date().toISOString(),
            isConfirmed: true
          }]
        };
      }
    
    case 'SET_LOADING':
      return { ...state, isLoading: action.payload };
    
    case 'SET_ERROR':
      return { ...state, error: action.payload };
    
    default:
      return state;
  }
}

export function AppProvider({ children }) {
  const [state, dispatch] = useReducer(appReducer, initialState);

  // Load saved user preference from localStorage
  // This helps maintain user session across page refreshes
  useEffect(() => {
    const savedUser = localStorage.getItem('currentUser');
    if (savedUser) {
      try {
        dispatch({ type: 'SET_CURRENT_USER', payload: JSON.parse(savedUser) });
      } catch (error) {
        console.warn('Failed to parse saved user data:', error);
        // Fallback to default user if parsing fails
      }
    }
  }, []);

  // Persist current user selection
  useEffect(() => {
    localStorage.setItem('currentUser', JSON.stringify(state.currentUser));
  }, [state.currentUser]);

  const value = {
    ...state,
    dispatch,
    // Helper functions
    switchUser: (userId) => {
      const user = state.users.find(u => u.id === userId);
      if (user) {
        dispatch({ type: 'SET_CURRENT_USER', payload: user });
      }
    },
    getAssignmentsForCurrentUser: () => {
      if (state.currentUser.role === 'admin') {
        return state.assignments.filter(assignment => assignment.createdBy === state.currentUser.id);
      } else {
        return state.assignments;
      }
    },
    getSubmissionStatus: (assignmentId, studentId = state.currentUser.id) => {
      return state.submissions.find(
        sub => sub.assignmentId === assignmentId && sub.studentId === studentId
      );
    },
    getStudentSubmissions: (assignmentId) => {
      return state.submissions.filter(sub => sub.assignmentId === assignmentId);
    }
  };

  return (
    <AppContext.Provider value={value}>
      {children}
    </AppContext.Provider>
  );
}

export function useApp() {
  const context = useContext(AppContext);
  if (!context) {
    throw new Error('useApp must be used within an AppProvider');
  }
  return context;
}