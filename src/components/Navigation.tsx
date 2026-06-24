import React from 'react';
import { useAppContext } from './AppContext';
import { MobileNavigation } from './MobileNavigation';
import { LayoutDashboard, MessageCircle, Smile, LineChart, Settings, User, Heart, Wind, Users } from 'lucide-react';

export function Navigation() {
  const { state, dispatch } = useAppContext();

  const handleNavigation = (view: any) => {
    dispatch({ type: 'SET_VIEW', payload: view });
  };

  const isActive = (view: string) => state.currentView === view;

  return (
    <>
      {/* Floating Pill Sidebar */}
      <div className="hidden lg:flex flex-col absolute top-10 left-10 z-50 gap-4">
        
        <aside className="w-[220px] bg-white/40 backdrop-blur-xl border border-white/60 rounded-[40px] shadow-[0_8px_32px_rgba(15,23,42,0.05)] flex flex-col py-6 px-4 max-h-[calc(100vh-160px)] overflow-y-auto hide-scrollbar">
          <nav className="flex flex-col gap-2">
            <button
              onClick={() => handleNavigation('dashboard')}
              className={`flex items-center w-full px-5 py-3.5 rounded-full transition-all duration-300 ${
                isActive('dashboard') || !state.currentView
                  ? 'bg-gradient-to-r from-[#D8CCFF]/80 to-[#E6E0FF]/80 text-[#4F2E9F] shadow-sm font-semibold'
                  : 'text-slate-600 hover:bg-white/50 font-medium'
              }`}
            >
              <LayoutDashboard className={`w-5 h-5 mr-3 ${isActive('dashboard') || !state.currentView ? 'text-[#4F2E9F]' : 'text-slate-400'}`} />
              Dashboard
            </button>
            
            <button
              onClick={() => handleNavigation('chatbot')}
              className={`flex items-center w-full px-5 py-3.5 rounded-full transition-all duration-300 ${
                isActive('chatbot')
                  ? 'bg-gradient-to-r from-[#D8CCFF]/80 to-[#E6E0FF]/80 text-[#4F2E9F] shadow-sm font-semibold'
                  : 'text-slate-600 hover:bg-white/50 font-medium'
              }`}
            >
              <MessageCircle className={`w-5 h-5 mr-3 ${isActive('chatbot') ? 'text-[#4F2E9F]' : 'text-slate-400'}`} />
              Chat
            </button>

            <button
              onClick={() => handleNavigation('mood')}
              className={`flex items-center w-full px-5 py-3.5 rounded-full transition-all duration-300 ${
                isActive('mood')
                  ? 'bg-gradient-to-r from-[#D8CCFF]/80 to-[#E6E0FF]/80 text-[#4F2E9F] shadow-sm font-semibold'
                  : 'text-slate-600 hover:bg-white/50 font-medium'
              }`}
            >
              <Heart className={`w-5 h-5 mr-3 ${isActive('mood') ? 'text-[#4F2E9F]' : 'text-slate-400'}`} />
              Track Mood
            </button>

            <button
              onClick={() => handleNavigation('exercises')}
              className={`flex items-center w-full px-5 py-3.5 rounded-full transition-all duration-300 ${
                isActive('exercises')
                  ? 'bg-gradient-to-r from-[#D8CCFF]/80 to-[#E6E0FF]/80 text-[#4F2E9F] shadow-sm font-semibold'
                  : 'text-slate-600 hover:bg-white/50 font-medium'
              }`}
            >
              <Smile className={`w-5 h-5 mr-3 ${isActive('exercises') ? 'text-[#4F2E9F]' : 'text-slate-400'}`} />
              CBT Exercises
            </button>

            <button
              onClick={() => handleNavigation('meditation')}
              className={`flex items-center w-full px-5 py-3.5 rounded-full transition-all duration-300 ${
                isActive('meditation')
                  ? 'bg-gradient-to-r from-[#D8CCFF]/80 to-[#E6E0FF]/80 text-[#4F2E9F] shadow-sm font-semibold'
                  : 'text-slate-600 hover:bg-white/50 font-medium'
              }`}
            >
              <Wind className={`w-5 h-5 mr-3 ${isActive('meditation') ? 'text-[#4F2E9F]' : 'text-slate-400'}`} />
              Meditation
            </button>

            <button
              onClick={() => handleNavigation('community')}
              className={`flex items-center w-full px-5 py-3.5 rounded-full transition-all duration-300 ${
                isActive('community')
                  ? 'bg-gradient-to-r from-[#D8CCFF]/80 to-[#E6E0FF]/80 text-[#4F2E9F] shadow-sm font-semibold'
                  : 'text-slate-600 hover:bg-white/50 font-medium'
              }`}
            >
              <Users className={`w-5 h-5 mr-3 ${isActive('community') ? 'text-[#4F2E9F]' : 'text-slate-400'}`} />
              Support Groups
            </button>

            <button
              onClick={() => handleNavigation('insights')}
              className={`flex items-center w-full px-5 py-3.5 rounded-full transition-all duration-300 ${
                isActive('insights')
                  ? 'bg-gradient-to-r from-[#D8CCFF]/80 to-[#E6E0FF]/80 text-[#4F2E9F] shadow-sm font-semibold'
                  : 'text-slate-600 hover:bg-white/50 font-medium'
              }`}
            >
              <LineChart className={`w-5 h-5 mr-3 ${isActive('insights') ? 'text-[#4F2E9F]' : 'text-slate-400'}`} />
              Insights
            </button>

            <button
              onClick={() => handleNavigation('settings')}
              className={`flex items-center w-full px-5 py-3.5 rounded-full transition-all duration-300 ${
                isActive('settings')
                  ? 'bg-gradient-to-r from-[#D8CCFF]/80 to-[#E6E0FF]/80 text-[#4F2E9F] shadow-sm font-semibold'
                  : 'text-slate-600 hover:bg-white/50 font-medium'
              }`}
            >
              <Settings className={`w-5 h-5 mr-3 ${isActive('settings') ? 'text-[#4F2E9F]' : 'text-slate-400'}`} />
              Settings
            </button>
          </nav>
        </aside>

        {/* User Profile Pill */}
        <div className="w-[200px] bg-white/40 backdrop-blur-xl border border-white/60 rounded-[40px] shadow-[0_8px_32px_rgba(15,23,42,0.05)] flex items-center justify-center py-4">
           <div className="w-10 h-10 rounded-full bg-[#E2E8F0] overflow-hidden flex items-center justify-center border-2 border-white shadow-sm">
             <span className="text-xl">🧑</span>
           </div>
        </div>

      </div>

      <MobileNavigation />
    </>
  );
}
