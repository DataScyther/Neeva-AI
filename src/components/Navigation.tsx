import React from 'react';
import { useAppContext } from './AppContext';
import { MobileNavigation } from './MobileNavigation';

export function Navigation() {
  const { state, dispatch } = useAppContext();

  const handleNavigation = (view: any) => {
    dispatch({ type: 'SET_VIEW', payload: view });
  };

  const handleLogout = () => {
    dispatch({ type: 'LOGOUT' });
  };

  // Helper to determine if a link is active
  const isActive = (view: string) => state.currentView === view;

  return (
    <>
      <aside className="w-64 glass-card border-r border-white/40 flex flex-col hidden lg:flex relative z-10">
        {/* Logo area */}
        <div className="h-20 flex items-center px-8 border-b border-white/40 mb-6">
          <div className="neeva-orb w-8 h-8 mr-3"></div>
          <span className="text-xl font-bold text-slate-800 tracking-tight">Neeva AI</span>
        </div>

        {/* Navigation Links */}
        <nav className="flex-1 px-4 space-y-1 overflow-y-auto pb-4">
          <div className="mb-8">
            <p className="px-4 text-xs font-semibold text-slate-400 uppercase tracking-wider mb-2">Main</p>
            <a
              href="#"
              onClick={(e) => { e.preventDefault(); handleNavigation('dashboard'); }}
              className={`flex items-center px-4 py-3 text-slate-700 rounded-2xl group mb-1 transition-all ${
                isActive('dashboard') ? 'active-nav' : 'hover:bg-white/40'
              }`}
            >
              <svg className="w-5 h-5 mr-3 text-indigo-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6"></path>
              </svg>
              <span className="font-medium">Dashboard</span>
            </a>
            <a
              href="#"
              onClick={(e) => { e.preventDefault(); handleNavigation('chatbot'); }}
              className={`flex items-center px-4 py-3 text-slate-600 rounded-2xl group mb-1 transition-all ${
                isActive('chatbot') ? 'active-nav' : 'hover:bg-white/40'
              }`}
            >
              <svg className="w-5 h-5 mr-3 text-slate-400 group-hover:text-indigo-500 transition-colors" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M8 10h.01M12 10h.01M16 10h.01M9 16H5a2 2 0 01-2-2V6a2 2 0 012-2h14a2 2 0 012 2v8a2 2 0 01-2 2h-5l-5 5v-5z"></path>
              </svg>
              <span className="font-medium">Neeva Chat</span>
            </a>
          </div>

          <div className="mb-8">
            <p className="px-4 text-xs font-semibold text-slate-400 uppercase tracking-wider mb-2">Tools</p>
            <a
              href="#"
              onClick={(e) => { e.preventDefault(); handleNavigation('mood'); }}
              className={`flex items-center px-4 py-3 text-slate-600 rounded-2xl group mb-1 transition-all ${
                isActive('mood') ? 'active-nav' : 'hover:bg-white/40'
              }`}
            >
              <svg className="w-5 h-5 mr-3 text-slate-400 group-hover:text-pink-500 transition-colors" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M14.828 14.828a4 4 0 01-5.656 0M9 10h.01M15 10h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"></path>
              </svg>
              <span className="font-medium">Mood Tracker</span>
            </a>
            <a
              href="#"
              onClick={(e) => { e.preventDefault(); handleNavigation('exercises'); }}
              className={`flex items-center px-4 py-3 text-slate-600 rounded-2xl group mb-1 transition-all ${
                isActive('exercises') ? 'active-nav' : 'hover:bg-white/40'
              }`}
            >
              <svg className="w-5 h-5 mr-3 text-slate-400 group-hover:text-emerald-500 transition-colors" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-6 9l2 2 4-4"></path>
              </svg>
              <span className="font-medium">CBT Exercises</span>
            </a>
            <a
              href="#"
              onClick={(e) => { e.preventDefault(); handleNavigation('meditation'); }}
              className={`flex items-center px-4 py-3 text-slate-600 rounded-2xl group mb-1 transition-all ${
                isActive('meditation') ? 'active-nav' : 'hover:bg-white/40'
              }`}
            >
              <svg className="w-5 h-5 mr-3 text-slate-400 group-hover:text-blue-500 transition-colors" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z"></path>
              </svg>
              <span className="font-medium">Guided Meditation</span>
            </a>
          </div>

          <div className="mb-8">
            <p className="px-4 text-xs font-semibold text-slate-400 uppercase tracking-wider mb-2">Support</p>
            <a
              href="#"
              onClick={(e) => { e.preventDefault(); handleNavigation('analytics'); }}
              className={`flex items-center px-4 py-3 text-slate-600 rounded-2xl group mb-1 transition-all ${
                isActive('analytics') ? 'active-nav' : 'hover:bg-white/40'
              }`}
            >
              <svg className="w-5 h-5 mr-3 text-slate-400 group-hover:text-purple-500 transition-colors" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z"></path>
              </svg>
              <span className="font-medium">Insights</span>
            </a>
            <a
              href="#"
              onClick={(e) => { e.preventDefault(); handleNavigation('community'); }}
              className={`flex items-center px-4 py-3 text-slate-600 rounded-2xl group mb-1 transition-all ${
                isActive('community') ? 'active-nav' : 'hover:bg-white/40'
              }`}
            >
              <svg className="w-5 h-5 mr-3 text-slate-400 group-hover:text-orange-500 transition-colors" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z"></path>
              </svg>
              <span className="font-medium">Support Groups</span>
            </a>
          </div>
        </nav>

        {/* Bottom Actions */}
        <div className="p-4 border-t border-white/40">
          <a
            href="#"
            onClick={(e) => { e.preventDefault(); handleNavigation('settings'); }}
            className={`flex items-center px-4 py-3 text-slate-600 rounded-2xl group mb-1 transition-all ${
              isActive('settings') ? 'active-nav' : 'hover:bg-white/40'
            }`}
          >
            <svg className="w-5 h-5 mr-3 text-slate-400 group-hover:text-slate-600 transition-colors" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z"></path>
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"></path>
            </svg>
            <span className="font-medium">Settings</span>
          </a>
          <a
            href="#"
            onClick={(e) => { e.preventDefault(); handleLogout(); }}
            className="flex items-center px-4 py-3 text-red-500 rounded-2xl group hover:bg-red-50/50 transition-colors"
          >
            <svg className="w-5 h-5 mr-3 text-red-400 group-hover:text-red-500 transition-colors" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1"></path>
            </svg>
            <span className="font-medium">Sign Out</span>
          </a>
        </div>
      </aside>

      {/* Mobile Bottom Navigation - Include it so mobile layout works! */}
      <MobileNavigation />
    </>
  );
}
