import { useState } from 'react';
import { ChevronDown, User, LogOut, Settings, Bell } from 'lucide-react';
import { useApp } from '../context/AppContext';

export default function Header() {
  const { currentUser, users, switchUser } = useApp();
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  
  // Close dropdown when clicking outside (could add this later)
  // const dropdownRef = useRef(null);

  const handleUserSwitch = (userId) => {
    switchUser(userId);
    setIsDropdownOpen(false);
  };

  return (
    <header className="bg-white border-b border-gray-200 px-6 py-4 sticky top-0 z-50">
      <div className="flex items-center justify-between max-w-7xl mx-auto">
        {/* Logo and Title */}
        <div className="flex items-center space-x-4">
          <div className="flex items-center space-x-3">
            <div className="w-10 h-10 bg-gradient-to-br from-primary-500 to-primary-600 rounded-xl flex items-center justify-center">
              <span className="text-white font-bold text-lg">E</span>
            </div>
            <div>
              <h1 className="text-xl font-bold text-gray-900">EduTrack</h1>
              <p className="text-sm text-gray-500">Assignment Dashboard</p>
            </div>
          </div>
        </div>

        {/* User Actions */}
        <div className="flex items-center space-x-4">
          {/* Notifications */}
          <button className="relative p-2 text-gray-400 hover:text-gray-600 transition-colors">
            <Bell className="w-5 h-5" />
            <span className="absolute -top-1 -right-1 w-3 h-3 bg-red-500 rounded-full"></span>
          </button>

          {/* User Dropdown */}
          <div className="relative">
            <button
              onClick={() => setIsDropdownOpen(!isDropdownOpen)}
              className="flex items-center space-x-3 p-2 rounded-lg hover:bg-gray-50 transition-colors"
            >
              <div className="w-8 h-8 bg-gradient-to-br from-primary-400 to-primary-600 rounded-full flex items-center justify-center">
                <span className="text-white text-sm font-medium">
                  {currentUser.avatar}
                </span>
              </div>
              <div className="text-left hidden sm:block">
                <p className="text-sm font-medium text-gray-900">{currentUser.name}</p>
                <p className="text-xs text-gray-500 capitalize">{currentUser.role}</p>
              </div>
              <ChevronDown className={`w-4 h-4 text-gray-400 transition-transform ${isDropdownOpen ? 'rotate-180' : ''}`} />
            </button>

            {/* Dropdown Menu */}
            {isDropdownOpen && (
              <div className="absolute right-0 mt-2 w-64 bg-white rounded-xl shadow-lg border border-gray-200 py-2 z-50">
                <div className="px-4 py-2 border-b border-gray-100">
                  <p className="text-sm font-medium text-gray-900">{currentUser.name}</p>
                  <p className="text-xs text-gray-500">{currentUser.email}</p>
                </div>
                
                {/* Switch User Section */}
                <div className="px-4 py-2">
                  <p className="text-xs font-medium text-gray-500 uppercase tracking-wide mb-2">
                    Switch User (Demo)
                  </p>
                  <div className="space-y-1">
                    {users.map((user) => (
                      <button
                        key={user.id}
                        onClick={() => handleUserSwitch(user.id)}
                        className={`w-full flex items-center space-x-3 p-2 rounded-lg text-left transition-colors ${
                          currentUser.id === user.id 
                            ? 'bg-primary-50 text-primary-700' 
                            : 'hover:bg-gray-50 text-gray-700'
                        }`}
                      >
                        <div className={`w-6 h-6 rounded-full flex items-center justify-center text-xs font-medium ${
                          currentUser.id === user.id
                            ? 'bg-primary-200 text-primary-800'
                            : 'bg-gray-200 text-gray-600'
                        }`}>
                          {user.avatar}
                        </div>
                        <div className="flex-1 min-w-0">
                          <p className="text-sm font-medium truncate">{user.name}</p>
                          <p className="text-xs text-gray-500 capitalize">{user.role}</p>
                        </div>
                      </button>
                    ))}
                  </div>
                </div>

                <div className="border-t border-gray-100 mt-2 pt-2">
                  <button className="w-full flex items-center space-x-3 px-4 py-2 text-sm text-gray-700 hover:bg-gray-50 transition-colors">
                    <Settings className="w-4 h-4" />
                    <span>Settings</span>
                  </button>
                  <button className="w-full flex items-center space-x-3 px-4 py-2 text-sm text-red-600 hover:bg-red-50 transition-colors">
                    <LogOut className="w-4 h-4" />
                    <span>Sign Out</span>
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </header>
  );
}