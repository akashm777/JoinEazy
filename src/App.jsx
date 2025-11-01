import { AppProvider, useApp } from './context/AppContext';
import Header from './components/Header';
import StudentDashboard from './components/StudentDashboard';
import AdminDashboard from './components/AdminDashboard';

function AppContent() {
  const { currentUser } = useApp();

  return (
    <div className="min-h-screen bg-gray-50">
      <Header />
      <main className="animate-fade-in">
        {/* Render different dashboards based on user role */}
        {currentUser.role === 'student' ? (
          <StudentDashboard />
        ) : (
          <AdminDashboard />
        )}
      </main>
    </div>
  );
}

function App() {
  return (
    <AppProvider>
      <AppContent />
    </AppProvider>
  );
}

export default App;
