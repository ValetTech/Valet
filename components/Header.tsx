
import React from 'react';
import { UserRole } from '../types';
import { CarIcon, HomeIcon, CalendarIcon } from './Icons';

interface HeaderProps {
  userRole: UserRole;
  setUserRole: (role: UserRole) => void;
}

const Header: React.FC<HeaderProps> = ({ userRole, setUserRole }) => {
  return (
    <header className="bg-slate-800 border-b border-slate-700 sticky top-0 z-10">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          <div className="flex items-center">
            <CarIcon className="h-8 w-8 text-purple-400" />
            <h1 className="ml-2 text-2xl font-bold text-white">Valet</h1>
          </div>
          <div className="flex items-center bg-slate-700 rounded-full p-1">
            <button
              onClick={() => setUserRole(UserRole.DRIVER)}
              className={`flex items-center justify-center w-28 px-3 py-1.5 text-sm font-medium rounded-full transition-all ${
                userRole === UserRole.DRIVER ? 'bg-gradient-to-r from-purple-600 to-blue-600 text-white shadow-lg' : 'text-gray-300 hover:bg-slate-600'
              }`}
            >
              <CarIcon className="h-4 w-4 mr-1.5" />
              Driver
            </button>
            <button
              onClick={() => setUserRole(UserRole.EVENT_PLANNER)}
              className={`flex items-center justify-center w-28 px-3 py-1.5 text-sm font-medium rounded-full transition-all ${
                userRole === UserRole.EVENT_PLANNER ? 'bg-gradient-to-r from-purple-600 to-blue-600 text-white shadow-lg' : 'text-gray-300 hover:bg-slate-600'
              }`}
            >
              <CalendarIcon className="h-4 w-4 mr-1.5" />
              Events
            </button>
            <button
              onClick={() => setUserRole(UserRole.HOST)}
              className={`flex items-center justify-center w-28 px-3 py-1.5 text-sm font-medium rounded-full transition-all ${
                userRole === UserRole.HOST ? 'bg-gradient-to-r from-purple-600 to-blue-600 text-white shadow-lg' : 'text-gray-300 hover:bg-slate-600'
              }`}
            >
              <HomeIcon className="h-4 w-4 mr-1.5" />
              Host
            </button>
          </div>
        </div>
      </div>
    </header>
  );
};

export default Header;