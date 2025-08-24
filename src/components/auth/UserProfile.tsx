import React, { useState } from 'react';
import { User, LogOut, Settings, ChevronDown, Shield, Building } from 'lucide-react';
import { useAuth } from '../../contexts/AuthContext';

export const UserProfile: React.FC = () => {
  const { user, logout, isAuthenticated } = useAuth();
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);

  if (!isAuthenticated || !user) {
    return null;
  }

  return (
    <div className="relative">
      <button
        onClick={() => setIsDropdownOpen(!isDropdownOpen)}
        className="flex items-center space-x-3 px-3 py-2 rounded-lg bg-secondary-700/50 hover:bg-secondary-700 transition-colors duration-200 border border-secondary-600 hover:border-secondary-500"
      >
        <div className="w-8 h-8 bg-accent-600 rounded-full flex items-center justify-center">
          <User className="w-4 h-4 text-white" />
        </div>
        <div className="text-left">
          <div className="text-sm font-medium text-white">
            {user.name || user.email}
          </div>
          <div className="text-xs text-secondary-400">
            {user.tenant}
          </div>
        </div>
        <ChevronDown className={`w-4 h-4 text-secondary-400 transition-transform duration-200 ${isDropdownOpen ? 'rotate-180' : ''}`} />
      </button>

      {isDropdownOpen && (
        <div className="absolute right-0 top-full mt-2 w-80 bg-secondary-800 border border-secondary-600 rounded-xl shadow-xl z-50">
          {/* User Info Section */}
          <div className="p-4 border-b border-secondary-600">
            <div className="flex items-center space-x-3 mb-3">
              <div className="w-12 h-12 bg-accent-600 rounded-full flex items-center justify-center">
                <User className="w-6 h-6 text-white" />
              </div>
              <div>
                <div className="text-white font-semibold">{user.name || user.email}</div>
                <div className="text-secondary-400 text-sm">{user.email}</div>
              </div>
            </div>
            
            <div className="grid grid-cols-1 gap-2 text-xs">
              <div className="flex items-center space-x-2">
                <Building className="w-3 h-3 text-secondary-400" />
                <span className="text-secondary-300">Tenant:</span>
                <span className="text-white font-medium">{user.tenant}</span>
              </div>
              <div className="flex items-center space-x-2">
                <Shield className="w-3 h-3 text-secondary-400" />
                <span className="text-secondary-300">Roles:</span>
                <span className="text-white font-medium">
                  {user.roles?.length ? user.roles.join(', ') : 'None'}
                </span>
              </div>
            </div>
          </div>

          {/* Roles and Permissions */}
          {(user.roles?.length || user.permissions?.length) && (
            <div className="p-4 border-b border-secondary-600">
              {user.roles && user.roles.length > 0 && (
                <div className="mb-3">
                  <div className="text-xs font-semibold text-secondary-300 mb-2">ROLES</div>
                  <div className="flex flex-wrap gap-1">
                    {user.roles.map((role: string) => (
                      <span
                        key={role}
                        className="px-2 py-1 bg-accent-900/50 text-accent-300 text-xs rounded-md border border-accent-700"
                      >
                        {role}
                      </span>
                    ))}
                  </div>
                </div>
              )}

              {user.permissions && user.permissions.length > 0 && (
                <div>
                  <div className="text-xs font-semibold text-secondary-300 mb-2">PERMISSIONS</div>
                  <div className="flex flex-wrap gap-1 max-h-24 overflow-y-auto">
                    {user.permissions.map((permission: string) => (
                      <span
                        key={permission}
                        className="px-2 py-1 bg-secondary-700 text-secondary-300 text-xs rounded-md border border-secondary-600"
                      >
                        {permission}
                      </span>
                    ))}
                  </div>
                </div>
              )}
            </div>
          )}

          {/* Actions */}
          <div className="p-2">
            <button
              onClick={() => {
                setIsDropdownOpen(false);
                // Add settings modal or navigation here
              }}
              className="w-full flex items-center space-x-3 px-3 py-2 rounded-lg hover:bg-secondary-700 transition-colors duration-200 text-left"
            >
              <Settings className="w-4 h-4 text-secondary-400" />
              <span className="text-secondary-300">Settings</span>
            </button>
            
            <button
              onClick={() => {
                setIsDropdownOpen(false);
                logout();
              }}
              className="w-full flex items-center space-x-3 px-3 py-2 rounded-lg hover:bg-red-900/20 hover:text-red-300 transition-colors duration-200 text-left text-secondary-300"
            >
              <LogOut className="w-4 h-4" />
              <span>Sign Out</span>
            </button>
          </div>
        </div>
      )}

      {/* Backdrop to close dropdown */}
      {isDropdownOpen && (
        <div
          className="fixed inset-0 z-40"
          onClick={() => setIsDropdownOpen(false)}
        />
      )}
    </div>
  );
};